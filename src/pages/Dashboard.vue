<script setup lang="ts">
import { ref } from 'vue';
import { NSpace, NSpin, NTabs, NTabPane } from 'naive-ui';

import { initStore } from '../store';

import { DashboardComponents } from '../components/dashboard';

const isStoreLoaded = ref(false);
initStore(() => isStoreLoaded.value = true);
</script>

<template>
	<n-space v-if="!isStoreLoaded" justify="center">
		<n-spin :size="300"></n-spin>
	</n-space>

	<n-tabs v-else type="line" justify-content="space-evenly" size="large">
		<n-tab-pane v-for="component in DashboardComponents" :name="component.name">
			<n-space justify="center">
				<keep-alive>
					<component :is="component"></component>
				</keep-alive>
			</n-space>
		</n-tab-pane>
	</n-tabs>
</template>
