<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { NCard, NSpin } from 'naive-ui';
import { initStore } from '../../store';
import { subscribe } from '../../store/subscribers';
import { Store } from '../../types';

const data = ref({});
const isStoreLoaded = ref(false);

function configureDashboard(store: Store) {
	isStoreLoaded.value = true;
	data.value = store;
} // configureDashboard
subscribe('ready', configureDashboard);
onMounted(initStore);
</script>

<template>
	<n-card>
		<pre v-if="isStoreLoaded">{{ JSON.stringify(data, 0, 2) }}</pre>
		<n-spin v-else :size="50">Loading...</n-spin>
	</n-card>
</template>

<style>
</style>
