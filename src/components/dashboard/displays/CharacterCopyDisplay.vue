<script setup lang=ts>
import { ref, watchEffect } from 'vue';
import { NDataTable } from 'naive-ui';

import { CharacterCopy } from '../../../types';
import { characterManager } from '../../../store/managers';
import { calculateCharacterCopyStats } from '../../../store/calculators';

import ItemDisplay from './ItemDisplay.vue';
import CharacterCopyInputs from '../inputs/CharacterCopyInputs.vue';

const props = defineProps<{ copy: CharacterCopy }>();

const columns = ref<any[]>();
const rows = ref<any[]>();
watchEffect(() => {
	const data = calculateCharacterCopyStats(props.copy);
	columns.value = Object.keys(data).map((key) => {
		return { title: key, key: key, };
	});
	rows.value = [data];
});
</script>

<template>
	<item-display :title="copy.copy_of.name" :item="copy" :manager="characterManager">
		<template #item-edit>
			<character-copy-inputs :copy="copy"></character-copy-inputs>
		</template>
		<template #item-values>
			<n-data-table :columns="columns" :data="rows"></n-data-table>
		</template>
	</item-display>
</template>
