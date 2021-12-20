import { reactive } from 'vue';
import { supabase } from '../supabase';
import { Store } from '../types';
import { notify } from './subscribers';
import { QUERIES } from './queries';
import { Character } from '../types';

let isStoreInitialized = false;
// @ts-ignore the properties are loaded dynamically
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
		const { table, select } = query;
		const { data, error } = await supabase.from(table).select(select);
		error ? console.error(error) : Object.assign(store, { [table]: data });
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
// export function statValuesToEntries(
// 		statValues: definitions['StatValues'][],
// 		ascensionStat: definitions['StatValues']
// 	) {
// 		// Combine levels and ascensions
// 		// @ts-ignore level was made nullable for ascension stats
// 		const levelLables = statValues[0].level.map((level, i) => {
// 			const ascensions = statValues[0].ascension;
// 			// @ts-ignore only undefined for `ascensionStat`
// 			const isAscended = ascensions[i] > ascensions[i - 1];

// 			return `${level}${ isAscended ? 'A' : '' }`;
// 		});

// 		// Get stat abbreviations
// 		const allStatValues = [...statValues, ascensionStat];
// 		const statLabels = allStatValues.map((value) => {
// 			return store.Stat.find(
// 				(stat: definitions['StatTypes']) => stat.id === value?.stat
// 			)?.abbreviation;
// 		});

// 		// Double ascenstion stat values due to how it's stored
// 		if (ascensionStat.value.length !== statValues[0].value.length) {
// 			ascensionStat.value = ascensionStat.value.flatMap((value) => [value, value]);
// 		} // if

// 		// Because each `StatValue.value` are parallel arrays,
// 		// loop on one of them and use the index to acces the rest.
// 		// @ts-ignore level was made nullable for ascension stats
// 		const entries: any[] = statValues[0].level.map((_, i) => {
// 			// New entry for this level
// 			const entry = { Level: levelLables[i] };
// 			statLabels.forEach((label, k) => {
// 				// Get all stat values for this level
// 				Object.assign(entry, { [label]: allStatValues[k].value[i] });
// 			});

// 			return entry;
// 		});

// 		return entries;
// } // statValuesToEntries

/**
 * Retrieves `StatValue` by foreign key.
 */
// export function idToStatValue(
// 		data: definitions['Characters'] | definitions['Weapons'],
// 		field: string,
// 	): definitions['StatValues'] {
// 		if (!(field in data)) {
// 			throw new Error(`${field} not in provided data.`)
// 		};

// 		// not ideal though StatValue isn't /that/ large of a table (at least for now)
// 		return store.StatValue.find(
// 			// @ts-ignore cause i still need to type the store
// 			(value: definitions['StatValue']) => value.id === data[field]
// 		);
// } // idToStat

function regress(x: number, factors: number[]) {
	let value: number = 0;
	factors.forEach((factor, i) => {
		value += factor * Math.pow(x, i)
	});
	return value;
}

// Should really have a function that generates the values based on input,
// and then this function just calls it for all possible inputs
export function characterStatEntries(character: Character) {
	const entries = [];
	const ascensionLevelSplits = [20, 40, 50, 60, 70, 80];

	for (let i = 1; i <= 90; ++i) {
		let hp: number = (character.base_hp.value * regress(i, character.level_multiplier.regression_factors));
		let atk: number = (character.base_atk.value * regress(i, character.level_multiplier.regression_factors));
		let def: number = (character.base_def.value * regress(i, character.level_multiplier.regression_factors));

		entries.push({
			Level: i,
			[character.base_hp.stat.abbreviation]: hp.toFixed(2),
			[character.base_atk.stat.abbreviation]: atk.toFixed(2),
			[character.base_def.stat.abbreviation]: def.toFixed(2),
		});

		let ascension = ascensionLevelSplits.indexOf(i) + 1;
		if (ascensionLevelSplits.includes(i)) {
			console.log(hp + character.hp_ascension_value.values[0] * store.AscensionValueFactors[ascension].factor);

			hp += character.hp_ascension_value.values[0] * store.AscensionValueFactors[ascension].factor;
			atk += character.atk_ascension_value.values[0] * store.AscensionValueFactors[ascension].factor;
			def += character.def_ascension_value.values[0] * store.AscensionValueFactors[ascension].factor;
			entries.push({
				Level: i + 'A',
				[character.base_hp.stat.abbreviation]: hp.toFixed(2),
				[character.base_atk.stat.abbreviation]: atk.toFixed(2),
				[character.base_def.stat.abbreviation]: def.toFixed(2),
			})
		}
	} // for

	return entries;
} // characterStatEntries
