import { store } from '.';
import {
	Ascension,
	AscensionValue,
	Character,
	LevelMultiplier,
	StatValue
} from '../types';

/**
 * 2D array that splits levels by what ascension they belong to.
 */
const LEVELS_BY_ASCENSION: readonly number[][] = Object.freeze([
	[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
	[20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40],
	[40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50],
	[50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60],
	[60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70],
	[70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80],
	[80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90],
]);

/**
 * @param x The independent variable.
 * @param factors The different terms of the equation.
 * @returns the sum of `factors[i] * x^i`.
 */
function regress(x: number, factors: number[]): number {
	let value: number = 0;
	factors.forEach((factor, i) => {
		value += factor * Math.pow(x, i)
	});
	return value;
} // regress

/**
 * Calculates the values of a character's stats
 * given their base value, level, and ascension.
 *
 * These values are returned as an object with the numbers rounded.
 *
 * @param baseStats The base stats to calculate for.
 * @param level The level at which to calculate.
 * @param levelMultiplier The character's level multiplier.
 * @param ascension The ascension at which to calculate.
 * @param ascensionValues Parallel array to `baseStats` for calculating ascended stats.
 * @returns `{ Level: number, [statAbbreviation]: string, ... }`
 */
export function calculateCharacterStats(
		baseStats: StatValue[],
		level: number,
		levelMultiplier: LevelMultiplier,
		ascension: Ascension,
		ascensionValues: AscensionValue[],
	): {} {
		const calculatedStats = { Level: level };
		baseStats.forEach((stat, i) => {
			Object.assign(calculatedStats, {
				[stat.stat.abbreviation]: (stat.value
					* regress(level, levelMultiplier.regression_factors)
					+ ascensionValues[i].values[0]
					* store.AscensionValueFactors[ascension].factor).toFixed(2)
			});
		});
		return calculatedStats;
} // calculateCharacterStat

/**
 *
 * @param baseStat Ascension stat to calculate.
 * @param ascension The ascension at which to calculate
 * @returns `{ [statAbbreviation]: number }`
 */
export function calculateCharacterAscensionStat(baseStat: StatValue, ascension: number): {} {
	return {
		[baseStat.stat.abbreviation]: baseStat.value
			* store.AscensionMultipliers[ascension].multiplier
	};
} // calculateCharacterAscensionStat

/**
 * Enumerates all possible base stats for a given character.
 * @param character The character to calculate stats for.
 */
export function calculateCharacterAll(character: Character) {
	const entries: any[] = [];

	const [characterBaseStats, characterAscensionValues] = [
		[character.base_hp, character.base_atk, character.base_def,],
		[
			character.hp_ascension_value,
			character.atk_ascension_value,
			character.def_ascension_value,
		],
	];

	// @ts-ignore shut up
	LEVELS_BY_ASCENSION.forEach((levels, ascension: Ascension) => {
		levels.forEach((level) => {
			entries.push({
				...calculateCharacterStats(
					characterBaseStats, level, character.level_multiplier,
					ascension, characterAscensionValues
				),
				...calculateCharacterAscensionStat(
					character.ascension_base, ascension
				),
			});
		});
	});

	return entries;
} // calculateCharacterAll
