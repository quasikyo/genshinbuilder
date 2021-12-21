<script setup lang="ts">
import { ref, reactive } from 'vue';
import {
	useMessage,
	NSpace,
	NButton,
	NDrawer,
	NDrawerContent,
	NCard,
	NModal,
	NDataTable,
	NForm, NFormItem,
} from 'naive-ui';

import { Character, CharacterCopy } from '../../types';

import { store } from '../../store';
import { characterManager } from '../../store/managers';
import { calculateCharacterAll } from '../../store/calculators';

import ItemsDisplay from './displays/ItemsDisplay.vue';
import CharacterCopyInputs from './inputs/CharacterCopyInputs.vue';

import { alertUser } from '../util';

const isDrawerActive = ref(false);
function openDrawer() {
	isDrawerActive.value = true;
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
function displayDetails(character: Character) {
	modalDetails.title = character.name;

	const characterStats = calculateCharacterAll(character);
	modalDetails.tableRows = characterStats;
	modalDetails.tableColumns = Object.keys(characterStats[0]).map((key) => {
		return { title: key, key: key, };
	});

	doShowStatsModal.value = true;
} // displayDetails

const doShowCopyCreationModal = ref(false);
const copyInputs = ref<CharacterCopy>({
	level: 1,
	ascension: 0,
	constellations: 0,
	// @ts-ignore dynamically ensured
	copy_of: undefined,
});
function promptCopyFields(character: Character) {
	// Reset to defaults
	Object.assign(copyInputs.value, <CharacterCopy>{
		level: 1, ascension: 0, constellations: 0, copy_of: character,
	});
	doShowCopyCreationModal.value = true;
} // promptCopyFields

const isAddingCopy = ref(false);
const message = useMessage();
async function addCopyAndCloseModal() {
	isAddingCopy.value = true;
	const error = await characterManager.add({ ...copyInputs.value });
	isAddingCopy.value = false;

	doShowCopyCreationModal.value = false;
	alertUser(message, error, 'Add');
} // addCopyAndCloseModal
</script>

<script lang="ts">
export default {
	name: 'Characters'
}
</script>

<template>
	<!-- Characters to choose from -->
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
						<n-button
							type="primary"
							@click="promptCopyFields(character)"
							:disabled="characterManager.doesCopyExist(character)"
						>Add</n-button>
					</n-space>
				</template>
			</n-card>
		</n-drawer-content>
	</n-drawer>

	<!-- Specific stats for a character -->
	<n-modal
		v-model:show="doShowStatsModal"
		preset="card"
		:title="modalDetails.title + '\'s Base Stats'"
		style="width: 45%;"
	>
		<n-data-table
			:columns="modalDetails.tableColumns"
			:data="modalDetails.tableRows"
			:pagination="{ pageSize: 10 }"
		></n-data-table>
	</n-modal>

	<!-- Copy creation -->
	<n-modal
		v-model:show="doShowCopyCreationModal"
		preset="card"
		:title="copyInputs?.copy_of?.name"
		style="width: fit-content;"
	>
		<n-space justify="center">
			<n-form :model="copyInputs" size="large">
				<character-copy-inputs :copy="copyInputs"></character-copy-inputs>
				<n-form-item>
					<n-space justify="end" style="width: 100%;">
						<n-button @click="addCopyAndCloseModal" :loading="isAddingCopy" type="primary">Create</n-button>
					</n-space>
				</n-form-item>
			</n-form>
		</n-space>
	</n-modal>

	<!-- Owned copies -->
	<items-display :data="store.CharacterCopies" :onAddClicked="openDrawer"></items-display>
</template>
