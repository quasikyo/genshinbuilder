import { reactive } from 'vue';
import { supabase } from '../supabase';
import { Store } from '../types';
import { notify } from './subscribers';
import { QUERIES } from '../supabase/queries';

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
