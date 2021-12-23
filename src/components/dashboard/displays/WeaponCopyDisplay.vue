<script setup lang=ts>
import { ref, watchEffect } from 'vue';
import { NDataTable } from 'naive-ui';

import { WeaponCopy } from '../../../types';
import { weaponManager } from '../../../store/managers';
import { calculateWeaponCopyStats } from '../../../store/calculators';

import ItemDisplay from './ItemDisplay.vue';
import WeaponCopyInputs from '../inputs/WeaponCopyInputs.vue';

const props = defineProps<{ copy: WeaponCopy }>();

const columns = ref<any[]>();
const rows = ref<any[]>();
watchEffect(() => {
	const data = calculateWeaponCopyStats(props.copy);
	columns.value = Object.keys(data).map((key) => {
		return { title: key, key: key, };
	});
	rows.value = [data];
});
</script>

<template>
	<item-display :title="copy.copy_of.name" :item="copy" :manager="weaponManager">
		{{ copy.copy_of.description }}
		<template #item-edit>
			<weapon-copy-inputs :copy="copy"></weapon-copy-inputs>
		</template>
		<template #item-values>
			<n-data-table :columns="columns" :data="rows"></n-data-table>
		</template>
	</item-display>
</template>
