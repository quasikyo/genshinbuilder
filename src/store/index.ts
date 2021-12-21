import { reactive } from 'vue';
import { PostgrestError } from '@supabase/supabase-js';
import { supabase } from '../supabase';
import {
	Store,
	Character,
	CharacterCopy,
} from '../types';
import { notify } from './subscribers';
import { QUERIES } from '../supabase/queries';
import { definitions } from '../supabase/types';

let isStoreInitialized = false;
// @ts-ignore the properties are loaded dynamically
export const store = reactive<Store>({});

/**
 * Updates the global `store` instance
 * to contain data fetched from the DB
 * and then calls all `'ready'` subscribers.
 */
export function initStore() {
	if (!supabase.auth.user()) {
		// Added layer
		throw new Error('Unathenticated request to DB.');
	} else if (isStoreInitialized) {
		// Only init the store once
		notify('ready', store);
		return;
	} // if

	// Select all relevant data
	Promise.all(QUERIES.map(async (query) => {
		const { table, select, userSpecific } = query;

		let queryBuilder = supabase.from(table).select(select);
		if (userSpecific) {
			// TODO: ideally this should be handled by reading properties
			queryBuilder = queryBuilder.eq('owner', supabase.auth.user()?.id);
		} // if
		const { data, error } = await queryBuilder;

		error ? console.error(error) : Object.assign(store, { [table]: data });
	}));

	isStoreInitialized = true;
	notify('ready', store);
} // initStore

// Ideas to make this generic
// Create a function base that takes in the copy, toDbConverter, table
export async function addCharacterCopy(copy: CharacterCopy): Promise<PostgrestError | null> {
	const copyAsDbEntry: definitions['CharacterCopies'] = {
		// @ts-ignore
		owner: supabase.auth.user()?.id,
		ascension: copy.ascension,
		level: copy.level,
		constellations: copy.constellations,
		copy_of: copy.copy_of.id,
	};

	const { error } = await supabase
		.from<definitions['CharacterCopies']>('CharacterCopies')
		.insert([copyAsDbEntry]);

	if (!error) {
		store.CharacterCopies.push(copy);
	} // if

	return error;
} // createCharacterCopy

export function doesCopyExist(character: Character): boolean {
	return !!store.CharacterCopies.find(copy => copy.copy_of.name === character.name);
} // doesCopyExist
