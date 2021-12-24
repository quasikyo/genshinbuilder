<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { NFormItem, NInputNumber } from 'naive-ui';
import { LEVELS_BY_ASCENSION } from '../../../store/calculators';
import { WeaponCopy } from '../../../types';

const props = defineProps<{ copy: WeaponCopy }>();

const minLevel = ref(1);
const maxLevel = ref(90);
watchEffect(() => {
	const ascensionLevels = LEVELS_BY_ASCENSION[props.copy.ascension || 0];
	minLevel.value = ascensionLevels[0];
	maxLevel.value = ascensionLevels[ascensionLevels.length - 1];
});

const maxAscension = props.copy.copy_of.rarity < 3 ? 4 : 6;
</script>

<template>
	<n-form-item label="Level" path="level">
		<n-input-number style="width: 100%;" v-model:value="copy.level" :min="minLevel" :max="maxLevel"></n-input-number>
	</n-form-item>
	<n-form-item label="Ascension" path="ascension">
		<n-input-number style="width: 100%;" v-model:value="copy.ascension" :min="0" :max="maxAscension"></n-input-number>
	</n-form-item>
	<n-form-item label="Refinement" path="refinement">
		<n-input-number style="width: 100%;" v-model:value="copy.refinement" :min="1" :max="5"></n-input-number>
	</n-form-item>
</template>
