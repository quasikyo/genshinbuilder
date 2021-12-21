<script setup lang="ts">
import { NFormItem, NInputNumber } from 'naive-ui';
import { CharacterCopy } from '../../../types';

defineProps<{
	copy: CharacterCopy
}>();
</script>

<template>
	<n-form-item label="Level" path="level">
		<n-input-number v-model:value="copy.level" :min="1" :max="90"></n-input-number>
	</n-form-item>
	<n-form-item label="Ascension" path="ascension">
		<n-input-number v-model:value="copy.ascension" :min="0" :max="6"></n-input-number>
	</n-form-item>
</template>
