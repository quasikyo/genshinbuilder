import { reactive } from "vue";
import { definitions, supabase } from "../supabase";
import { Store } from "../types";
import { notify } from "./subscribers";
import { QUERIES } from "./queries";

let isStoreInitialized = false;
export let store: Store = reactive({});

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
		const { table, query: queryString } = query;
		const { data, error } = await supabase.from(table).select(queryString);
		error ? console.error(error) : Object.assign(store, { [table]: data });
		query.isLoaded = true;
	}));

	isStoreInitialized = true;
	notify('ready', store);
} // initStore

export function characterStats(character: definitions['Character']) {
	// not ideal though StatValue isn't /that/ large of a table (at least for now)
	let baseHP: definitions['StatValue'] = store.StatValue.find(
		(value: definitions['StatValue']) => character.base_hp === value.id
	);
	let baseATK: definitions['StatValue'] = store.StatValue.find(
		(value: definitions['StatValue']) => character.base_atk === value.id
	);
	let baseDEF: definitions['StatValue'] = store.StatValue.find(
		(value: definitions['StatValue']) => character.base_def === value.id
	);

	const entries: {
		level: number,
		ascension: number,
		hp: number,
		atk: number,
		def: number,
	}[] = baseHP.level?.map((level, i) => {
		return {
			level,
			ascension: baseHP.ascension[i],
			hp: baseHP.value[i],
			atk: baseATK.value[i],
			def: baseDEF.value[i],
		};
	});

	return entries;
} // characterStats
