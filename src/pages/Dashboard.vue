<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { NSpace, NSpin, NTabs, NTabPane } from 'naive-ui';
import { initStore, store } from '../store';

import { DashboardComponents } from '../components/dashboard';

const isStoreLoaded = ref(false); // DEGBUG (set to false when done)
watchEffect(() => {
	isStoreLoaded.value = 'Characters' in store; // DEBUG
});

initStore();
</script>

<template>
	<n-space v-if="!isStoreLoaded" justify="center">
		<n-spin :size="300"></n-spin>
	</n-space>

	<n-tabs v-else type="line" justify-content="space-evenly" size="large">
		<n-tab-pane v-for="component in DashboardComponents" :name="component.name">
			<n-space justify="center">
				<component :is="component"></component>
			</n-space>
		</n-tab-pane>
	</n-tabs>
</template>
