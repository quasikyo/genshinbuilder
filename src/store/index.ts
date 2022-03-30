import { reactive } from 'vue';
import { supabase } from '../supabase';
import { Store } from '../types';
import { QUERIES } from '../supabase/queries';

let isStoreInitialized = false;
// @ts-ignore the properties are loaded dynamically
export const store = reactive<Store>({});

/**
 * Updates the global `store` instance
 * to contain data fetched from the DB
 * and then calls all `'ready'` subscribers.
 *
 * @param onInit callback for when the store is initialized
 */
export async function initStore(onInit?: Function) {
	if (!supabase.auth.user()) {
		// Added layer
		throw new Error('Unathenticated request to DB.');
	} else if (isStoreInitialized) {
		// Only init the store once
		onInit && onInit();
		return;
	} // if

	// Select all relevant data
	await Promise.all(QUERIES.map(async (query) => {
		const { table, select, isUserSpecific } = query;

		let queryBuilder = supabase.from(table).select(select);
		if (isUserSpecific) {
			// TODO: ideally this should be handled by reading properties
			queryBuilder = queryBuilder.eq('owner', supabase.auth.user()?.id);
		} // if
		const { data, error } = await queryBuilder;

		error ? console.error(error) : Object.assign(store, { [table]: data });
	}));

	isStoreInitialized = true;
	console.log(store)
	onInit && onInit();
} // initStore
