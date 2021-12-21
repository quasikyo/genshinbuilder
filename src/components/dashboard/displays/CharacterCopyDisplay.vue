<script setup lang=ts>
import { CharacterCopy } from '../../../types';
import { characterManager } from '../../../store/managers';
import { calculateCharacterCopyStats } from '../../../store/calculators';

import ItemDisplay from './ItemDisplay.vue';
import CharacterCopyInputs from '../inputs/CharacterCopyInputs.vue';

defineProps<{ copy: CharacterCopy }>();
</script>

<template>
	<item-display :title="copy.copy_of.name" :item="copy" :manager="characterManager">
		<template #item-edit>
			<character-copy-inputs :copy="copy"></character-copy-inputs>
		</template>
		<template #item-values>
			<pre>{{ JSON.stringify(calculateCharacterCopyStats(copy), null, 2) }}</pre>
		</template>
	</item-display>
</template>
