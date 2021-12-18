<script setup lang="ts">
import { ref, reactive, watchEffect } from 'vue';
import { NSpace, NTabs, NTabPane } from 'naive-ui';
import { initStore, store } from '../../store';

import { DashboardComponents } from '../../components/dashboard';

const isStoreLoaded = ref(true); // DEGBUG (set to false when done)
watchEffect(() => {
	// Simple check to see if loaded
	// isStoreLoaded.value = 'Character' in store; // DEBUG
});

// initStore(); // DEBUG
</script>

<template>
	<!-- <n-spin v-if="!isStoreLoaded" :size="300"></n-spin> -->

	<n-tabs type="line" justify-content="space-evenly" size="large">
		<n-tab-pane v-for="component in DashboardComponents" :name="component.name">
			<n-space justify="center">
				<component :is="component"></component>
			</n-space>
		</n-tab-pane>
	</n-tabs>
</template>

<style>
</style>
