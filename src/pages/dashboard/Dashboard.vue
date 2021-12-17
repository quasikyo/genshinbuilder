<script setup lang="ts">
import { ref, reactive, watchEffect } from 'vue';
import { NSpace, NSpin, NList, NListItem, NThing } from 'naive-ui';
import { initStore, store } from '../../store';

const isStoreLoaded = ref(true); // DEGBUG (set to false when done)
const listItems = reactive([
	{
		title: 'Manage Weapons',
		description: 'Browse, create, and edit weapons for builds.'
	},
	{
		title: 'Manage Artifacts',
		description: '',
	},
	{
		title: 'Manage Characters',
		description: '',
	},
	{
		title: 'Manage Builds',
		description: 'Create and edit builds for characters.',
	},
	{
		title: 'Manage Teams',
		description: '',
	},
	{
		title: 'Team Pairs',
		description: 'Manage',
	},
]);

watchEffect(() => {
	// Simple check to see if loaded
	// isStoreLoaded.value = 'Character' in store; // DEBUG
});

// initStore(); // DEBUG
</script>

<template>
	<n-space justify="center">
		<n-spin v-if="!isStoreLoaded" :size="300"></n-spin>

		<n-list v-else bordered>
			<n-list-item v-for="item in listItems">
				<n-thing :title="item.title" :description="item.description">

				</n-thing>
			</n-list-item>
		</n-list>
	</n-space>
</template>

<style>
</style>
