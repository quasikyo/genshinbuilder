<!--
	This component is all about controlling when to show
	common UI elements via slots. Slot props are used to
	expose the functions that control when to show the UI
	elements and should be decorated when additional
	funcionality is desired.

	Also, contrary to its name, this is
	actually used as a child component.
-->

<script setup lang="ts">
import { Ref, ref, reactive } from 'vue';
import { NSpace, NDrawer, NDrawerContent, NModal, NDataTable } from 'naive-ui';

defineProps<{ title: string, }>();

function createControl(status: Ref<boolean>) {
	return {
		/** Shows this control. */
		show: () => status.value = true,
		/** Hides this control. */
		hide: () => status.value = false,
	};
} // createControl

const isDrawerOpen = ref(false);
const doShowStatsModal = ref(false);
const doShowCreationModal = ref(false);

const stats = reactive<{
	columns?: any[],
	rows?: any[],
}>({
	columns: undefined,
	rows: undefined,
});

const uiControls = {
	drawer: createControl(isDrawerOpen),
	statsModal: {
		...createControl(doShowStatsModal),
		setStats(newStats: any[]) {
			stats.rows = newStats;
			stats.columns = Object.keys(newStats[0]).map((key) => {
				console.log(key)
				return { key, title: key, };
			});
		}, // setStats
		/**
		 * Call using `bind`.
		 */
		setAndShow(newStats: any[]) {
			this.setStats(newStats);
			this.show();
		}, // setAndShow
	},
	creationModal: createControl(doShowCreationModal),
};
</script>

<template>
	<!-- Drawer is actually only created once -->
	<!-- NDrawer acts as a reference to global instance -->
	<!-- Selection -->
	<n-drawer v-model:show="isDrawerOpen" placement="left" width="33%" style="min-width: 375px;">
		<n-drawer-content :closable="true" :title="title">
			search and filter controls here
			<slot name="drawer-content" :uiControls="uiControls"></slot>
		</n-drawer-content>
	</n-drawer>

	<!-- Allowed override just in case -->
	<!-- Stats display modal -->
	<slot name="stats-display">
		<n-modal v-model:show="doShowStatsModal" preset="card" style="width: 45%; min-width: 450px;">
			<n-data-table
				striped
				:columns="stats.columns"
				:data="stats.rows"
				:pagination="{ pageSize: 10 }"
			></n-data-table>
		</n-modal>
	</slot>

	<!-- Creation modal -->
	<n-modal v-model:show="doShowCreationModal" preset="card" style="width: fit-content;">
		<n-space justify="center">
			<slot name="creation" :uiControls="uiControls"></slot>
		</n-space>
	</n-modal>

	<n-space justify="center">
		<slot name="items-display" :uiControls="uiControls"></slot>
	</n-space>
</template>
