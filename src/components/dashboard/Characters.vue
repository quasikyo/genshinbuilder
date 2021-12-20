<script setup lang="ts">
import { ref, reactive } from 'vue';
import {
	NEmpty,
	NSpace,
	NButton,
	NIcon,
	NDrawer,
	NDrawerContent,
	NCard,
	NModal,
	NTable,
} from 'naive-ui';
import { Plus } from '@vicons/fa';
import { store } from '../../store';
import { calculateCharacterAll } from '../../store/calculators';
import { Character } from '../../types';

const isDrawerActive = ref(false);
const doShowModal = ref(false);

const modalDetails = reactive<{
	title: string;
	data: any,
}>({
	title: '',
	data: null,
});

function openDrawer() {
	isDrawerActive.value = true;
} // openDrawer

function displayDetails(character: Character) {
	modalDetails.title = character.name;
	modalDetails.data = calculateCharacterAll(character);
	doShowModal.value = true;
} // displayDetails
</script>

<script lang="ts">
export default {
	name: 'Characters'
}
</script>

<template>
	<n-button type="primary" size="large" round icon-placement="right" @click="openDrawer">
		<template #icon>
			<n-icon>
				<plus></plus>
			</n-icon>
		</template>
		<strong>Add New</strong>
	</n-button>

	<n-modal
		v-model:show="doShowModal"
		preset="card"
		:title="modalDetails.title + '\'s Base Stats'"
		style="width: 33%;"
	>
		<n-table>
			<thead>
				<th v-for="column in Object.keys(modalDetails.data[0])">{{ column }}</th>
			</thead>
			<tbody>
				<!-- `entry` is a dictionary with { column: value, ... } -->
				<tr v-for="row in modalDetails.data">
					<td v-for="value in row">{{ value }}</td>
				</tr>
			</tbody>
		</n-table>
	</n-modal>

	<n-drawer v-model:show="isDrawerActive" placement="left" width="33%">
		<n-drawer-content :closable="true" title="Characters">
			search and filter controls here
			<n-card
				v-for="character in store.Characters"
				:title="character.name"
				style="margin-top: 1rem;"
				class="no-content"
				:class="character.rarity === 4 ? 'border-purple' : 'border-gold'"
			>
				<template #header-extra>
					<n-space justify="end" style="width: 100%;">
						<n-button @click="displayDetails(character)">Base Stats</n-button>
						<n-button type="primary">Add</n-button>
					</n-space>
				</template>
			</n-card>
		</n-drawer-content>
	</n-drawer>

	<!-- <n-empty
		v-if="!store.CharacterCopy || store.CharacterCopy.length === 0"
		description="No characters yet."
		size="huge"
		class="center"
	></n-empty> -->
</template>
