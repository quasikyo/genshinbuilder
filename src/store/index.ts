import { reactive } from "vue";
import { supabase } from "../supabase";
import { Store } from "../types";
import { notify } from "./subscribers";
import { QUERIES } from "./queries";

export let store: Store = {};

let intervalId: any;
let isStoreInitialized = false;
const pollingSeconds = 1.5;

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
	QUERIES.forEach(async (query) => {
		const { table, query: queryString } = query;
		const { data, error } = await supabase.from(table).select(queryString);
		error ? console.error(error) : Object.assign(store, { [table]: data });
		query.isLoaded = true;
	});

	// Make the store reactive and set polling
	// to avoid accessing the data to early.
	// async/await doesn't play nice with Vue3's setup.
	store = reactive(store);
	isStoreInitialized = true;
	intervalId = setInterval(noitfyIfReady, pollingSeconds * 1000);
} // initStore

function noitfyIfReady() {
	if (QUERIES.every(({ isLoaded }) => isLoaded)) {
		notify('ready', store);
		clearInterval(intervalId);
	} // if
} // noitfyIfReady
