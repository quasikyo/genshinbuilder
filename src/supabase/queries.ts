const CHARACTER_SELECT = `
	id, name, rarity, element, weapon_type,
	base_hp (
		value,
		stat (abbreviation)
	),
	hp_ascension_value (values),
	base_atk (
		value,
		stat (abbreviation)
	),
	atk_ascension_value (values),
	base_def (
		value,
		stat (abbreviation)
	),
	def_ascension_value (values),
	level_multiplier (regression_factors),
	ascension_base (
		value,
		stat (abbreviation)
	)
`;

export const QUERIES = [
	{
		table: 'Characters',
		select: CHARACTER_SELECT,
	},
	{
		table: 'CharacterCopies',
		select: `
			ascension, level, constellations,
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
];
