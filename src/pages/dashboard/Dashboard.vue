<script setup lang="ts">
import { ref, reactive } from 'vue';
import { NCard } from 'naive-ui';
import { initStore } from '../../store';
import { subscribe } from '../../store/subscribers';
import { Store } from '../../types';

const data = ref('');
function configureDashboard(store: Store) {
	data.value = store;
} // configureDashboard
subscribe('ready', configureDashboard);

initStore();
</script>

<template>
	<n-card>
		<pre>{{ JSON.stringify(data, 0, 2) }}</pre>
	</n-card>
</template>

<style>
</style>
