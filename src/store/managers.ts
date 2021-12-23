import { supabase } from '../supabase';
import { definitions } from '../supabase/types';
import { PostgrestError } from '@supabase/supabase-js';

import { store } from '.';
import { Character, CharacterCopy, WeaponCopy } from '../types';
import { SupabaseQueryBuilder } from '@supabase/supabase-js/dist/main/lib/SupabaseQueryBuilder';

/**
 * Class to streamline synchonization between DB and local store.
 *
 * @template StoreType The query type to synchronize changes with.
 * @template DBType The DB type to syncrhonize changes to.
 */
export class Manager<StoreType, DBType> {
	/** The corresponding DB table/store key. */
	table: string;
	/** Convert what's in the store to DB format. */
	converter: (data: StoreType) => DBType;
	/** Match criteria for update and delete operations. */
	produceMatchCriteria: (data: StoreType) => {};

	constructor(
		table: string,
		converter: (data: StoreType) => DBType,
		produceMatchCriteria: (data: StoreType) => {},
	) {
		this.table = table;
		this.converter = converter;
		this.produceMatchCriteria = produceMatchCriteria;
	} // constructor

	/** The base query to send to superbase. */
	get baseQuery(): SupabaseQueryBuilder<DBType> {
		// Have to return a new one each time since it'll
		// otherwise just keep appending to the same URL
		return supabase.from<DBType>(this.table);
	} // baseQuery

	/**
	 * Adds the given data to the DB and local store.
	 * @param data
	 */
	async add(inputs: StoreType): Promise<PostgrestError | null> {
		const { data, error } = await this.baseQuery
			.insert([this.converter(inputs)]);

		if (!error && data) {
			// @ts-ignore
			// Versions created on the frontend aren't given an index,
			// so give it the index insertion into the store.
			store[this.table].push({ id: data[0].id, ...inputs });
		} // if

		return error;
	} // add

	/**
	 * Updates the DB with the provided data.
	 * @param data
	 */
	async save(data: StoreType): Promise<PostgrestError | null> {
		const { error } = await this.baseQuery
			.update(this.converter(data))
			.match(this.produceMatchCriteria(data));
		return error;
	} // save

	/**
	 * Deletes the given data from the DB and local store.
	 * @param dataForStore
	 */
	async delete(data: StoreType): Promise<PostgrestError | null> {
		const { error } = await this.baseQuery
			.delete().match(this.produceMatchCriteria(data));

		if (!error) {
			// @ts-ignore
			const deletionIndex = store[this.table].indexOf(data);
			// @ts-ignore
			store[this.table].splice(deletionIndex, 1);
		} // if

		return error;
	} // delete
} // Manager<T>

class CharacterManager extends Manager<CharacterCopy, definitions['CharacterCopies']> {
	/**
	 * Checks if a copy of a given character already exists.
	 * @param base
	 */
	doesCopyExist(base: Character): boolean {
		return !!store.CharacterCopies.find(copy => copy.copy_of.name === base.name);
	} // doesCopyExist
} // CharacterManager

export const characterManager = new CharacterManager(
	'CharacterCopies',
	// @ts-ignore owner: only reachable by authenticated users
	function toDB(data) {
		return {
			// don't put id here since add is where it gets its id
			owner: supabase.auth.user()?.id,
			level: data.level,
			ascension: data.ascension,
			constellations: data.constellations,
			copy_of: data.copy_of.id,
		};
	},
	function criteria(data) {
		// Composite key to ensure only one
		// copy of a certain character
		return {
			owner: supabase.auth.user()?.id,
			copy_of: data.copy_of.id,
		};
	},
);

export const weaponManager = new Manager<WeaponCopy, definitions['WeaponCopies']>(
	'WeaponCopies',
	// @ts-ignore owner: only reachable by authenticated users
	function toDB(data) {
		return {
			// don't put id here since add is where it gets its id
			owner: supabase.auth.user()?.id,
			level: data.level,
			ascension: data.ascension,
			refinement: data.refinement,
			copy_of: data.copy_of.id,
		};
	},
	function criteria(data) {
		return {
			id: data.id,
			owner: supabase.auth.user()?.id,
			copy_of: data.copy_of.id,
		};
	},
);
