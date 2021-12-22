const STAT_SELECT = `
	value, stat (abbreviation)
`;

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

export const QUERIES = [
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
		userSpecific: true,
	},
	{
		table: 'AscensionValueFactors',
		select: 'ascension, factor'
	},
	{
		table: 'AscensionMultipliers',
		select: 'ascension, multiplier'
	},
	{
		table: 'Weapons',
		select: WEAPON_SELECT
	},
	{
		table: 'WeaponCopies',
		select: `
			id, level, ascension, refinement,
			copy_of (${WEAPON_SELECT})
		`,
		userSpecific: true,
	},
];
