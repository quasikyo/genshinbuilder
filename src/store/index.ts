import { reactive } from "vue";
import { definitions, supabase } from "../supabase";
import { Store } from "../types";
import { notify } from "./subscribers";
import { QUERIES } from "./queries";

let isStoreInitialized = false;
export const store: Store = reactive({});

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

/**
 * Maps multiple `StatValue`s into entries of:
 * ```
 * [
 *   { level: string, sv1: number, sv2: number, ... },
 *   { level: string, sv1: number, sv2: number, ... },
 *   ...
 * ]
 * ```
 *
 * The ascension stat must be passed via `ascensionStat`.
 */
export function statValuesToEntries(
		statValues: definitions['StatValue'][],
		ascensionStat: definitions['StatValue']
	) {
		// Combine levels and ascensions
		// @ts-ignore level was made nullable for ascension stats
		const levelLables = statValues[0].level.map((level, i) => {
			const ascensions = statValues[0].ascension;
			// @ts-ignore only undefined for `ascensionStat`
			const isAscended = ascensions[i] > ascensions[i - 1];

			return `${level}${ isAscended ? 'A' : '' }`;
		});

		// Get stat abbreviations
		const allStatValues = [...statValues, ascensionStat];
		const statLabels = allStatValues.map((value) => {
			return store.Stat.find(
				(stat: definitions['Stat']) => stat.id === value?.stat
			)?.abbreviation;
		});

		// Double ascenstion stat values due to how it's stored
		if (ascensionStat.value.length !== statValues[0].value.length) {
			ascensionStat.value = ascensionStat.value.flatMap((value) => [value, value]);
		} // if

		// Because each `StatValue.value` are parallel arrays,
		// loop on one of them and use the index to acces the rest.
		// @ts-ignore level was made nullable for ascension stats
		const entries: any[] = statValues[0].level.map((_, i) => {
			// New entry for this level
			const entry = { Level: levelLables[i] };
			statLabels.forEach((label, k) => {
				// Get all stat values for this level
				Object.assign(entry, { [label]: allStatValues[k].value[i] });
			});

			return entry;
		});

		return entries;
} // statValuesToEntries

/**
 * Retrieves `StatValue` by foreign key.
 */
export function idToStatValue(
		data: definitions['Character'] | definitions['Weapon'],
		field: string,
	): definitions['StatValue'] {
		if (!(field in data)) {
			throw new Error(`${field} not in provided data.`)
		};

		// not ideal though StatValue isn't /that/ large of a table (at least for now)
		return store.StatValue.find(
			// @ts-ignore cause i still need to type the store
			(value: definitions['StatValue']) => value.id === data[field]
		);
} // idToStat

export function characterStatEntries(character: definitions['Character']) {
	const baseHP = idToStatValue(character, 'base_hp');
	const baseATK = idToStatValue(character, 'base_atk');
	const baseDEF = idToStatValue(character, 'base_def');
	const ascensionStat = idToStatValue(character, 'ascension_stat');

	return statValuesToEntries([baseHP, baseATK, baseDEF], ascensionStat);
} // characterStatEntries
