import { supabase } from '.';
import { Query } from '../types';

const STAT_SELECT = `value, stat (abbreviation)`;

const CHARACTER_SELECT = `
	id, name, rarity, element, weapon_type,
	base_hp (${STAT_SELECT}),
	hp_ascension_value (values),
	base_atk (${STAT_SELECT}),
	atk_ascension_value (values),
	base_def (${STAT_SELECT}),
	def_ascension_value (values),
	level_multiplier (regression_factors),
	ascension_base (${STAT_SELECT})
`;

const WEAPON_SELECT = `
	id, name, description, rarity, type,
	base_atk (${STAT_SELECT}),
	atk_multiplier (regression_factors),
	atk_ascension (values),
	ascension_base (${STAT_SELECT}),
	ascension_level_multiplier (regression_factors)
`;

const userSpecific = (): [string, string?] => ['owner', supabase.auth.user()?.id];

/**
 * Data to select pull from the database.
 */
// TODO: manually map copies to their base instead of pulling in duplicates
// TODO: manually map distributions to increases instead of pulling in duplicates
export const QUERIES: Query[] = [
	{
		table: 'Characters',
		select: CHARACTER_SELECT,
	},
	{
		table: 'CharacterCopies',
		select: `
			id, ascension, level, constellations,
			default_build (name, description),
			copy_of (${CHARACTER_SELECT})
		`,
		builders: { eq: userSpecific, },
	},
	{
		table: 'AscensionValueFactors',
		select: 'ascension, factor',
	},
	{
		table: 'AscensionMultipliers',
		select: 'ascension, multiplier',
	},
	{
		table: 'Weapons',
		select: WEAPON_SELECT,
	},
	{
		table: 'WeaponCopies',
		select: `
			id, level, ascension, refinement,
			copy_of (${WEAPON_SELECT})
		`,
		builders: { eq: userSpecific, },
	},
	{
		table: 'ArtifactSets',
		select: `
			id, name, one_piece_bonus (description),
			two_piece_bonus (description), four_piece_bonus (description),
			rarities, limited_pieces
		`,
	},
	{
		table: 'ArtifactCopies',
		select: `
			id, main_stat (${STAT_SELECT}), type,
		`,
		builders: { eq: userSpecific, },
	},
	// {
	// 	table: 'ArtifactSubstatDistributions',
	// 	select: ``,
	// },
	// {
	// 	table: 'ArtifactStatMultipliers',
	// 	select: `rarity, stat (abbreviation), multiplier`,
	// },
	// {
	// 	table: 'ArtifactSubstatIncreases',
	// 	select: `rarity, ${STAT_SELECT}`,
	// },
];
