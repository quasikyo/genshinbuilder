<script setup lang="ts">
import { ref, reactive } from 'vue';
import { NDrawer, NDrawerContent, NCard, NSpace, NButton, NModal, NDataTable } from 'naive-ui';

import { store } from '../../store';
import { Weapon } from '../../types';
import { calculateWeaponAll } from '../../store/calculators';

import ItemsDisplay from './displays/ItemsDisplay.vue';

const isDrawerOpen = ref(false);
function openDrawer() {
	isDrawerOpen.value = true;
} // openDrawer

const doShowStatsModal = ref(false);
const modalDetails = reactive<{
	title: string;
	tableColumns?: any[],
	tableRows?: any[],
}>({
	title: '',
	tableColumns: undefined,
	tableRows: undefined,
});
function displayDetails(weapon: Weapon) {
	modalDetails.title = weapon.name;

	const weaponStats = calculateWeaponAll(weapon);
	modalDetails.tableRows = weaponStats;
	modalDetails.tableColumns = Object.keys(weaponStats[0]).map((key) => {
		return { title: key, key: key, };
	});

	doShowStatsModal.value = true;
} // displayDetails
</script>

<script lang="ts">
export default {
	name: 'Weapons'
}
</script>

<template>
	<!-- Weapons to choose from -->
	<n-drawer v-model:show="isDrawerOpen" placement="left" width="33%" style="min-width: 375px;">
		<n-drawer-content :closable="true" title="Weapons">
			search and filter controls here
			<n-card
				v-for="weapon in store.Weapons"
				:title="weapon.name"
				style="margin-top: 1rem;"
				:class="weapon.rarity === 4 ? 'border-purple' : 'border-gold'"
			>
				{{ weapon.description }}
				<template #header-extra>
					<n-space justify="end" style="width: 100%;">
						<n-button @click="displayDetails(weapon)">Base Stats</n-button>
						<n-button
							type="primary"
						>Add</n-button>
					</n-space>
				</template>
			</n-card>
		</n-drawer-content>
	</n-drawer>

	<!-- Stats for a specific weapon -->
	<n-modal
		v-model:show="doShowStatsModal"
		preset="card"
		:title="modalDetails.title + '\'s Base Stats'"
		style="width: 45%; min-width: 450px;"
	>
		<n-data-table
			striped
			:columns="modalDetails.tableColumns"
			:data="modalDetails.tableRows"
			:pagination="{ pageSize: 10 }"
		></n-data-table>
	</n-modal>

	<items-display :data="store.WeaponCopies" :onAddClicked="openDrawer"></items-display>
</template>
