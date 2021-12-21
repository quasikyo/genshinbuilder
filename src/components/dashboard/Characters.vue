<script setup lang="ts">
import { ref, reactive } from 'vue';
import {
	useMessage,
	NSpace,
	NButton,
	NIcon,
	NDrawer,
	NDrawerContent,
	NCard,
	NModal,
	NDataTable,
	NForm, NFormItem, NInputNumber,
	NGrid, NGi
} from 'naive-ui';
import { Plus } from '@vicons/fa';
import { store, addCharacterCopy, doesCopyExist } from '../../store';
import { calculateCharacterAll, calculateCharacterCopyStats } from '../../store/calculators';
import { Character, CharacterCopy } from '../../types';

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
	const error = await addCharacterCopy({ ...copyInputs.value }); // cause fuck you
	isAddingCopy.value = false;
	doShowCopyCreationModal.value = false;
	if (error) { message.error(error.message); } // if
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
							:disabled="doesCopyExist(character)"
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

	<!-- Copy creation form -->
	<n-modal
		v-model:show="doShowCopyCreationModal"
		preset="card"
		:title="copyInputs?.copy_of?.name"
		style="width: fit-content;"
	>
		<n-space justify="center">
			<n-form :model="copyInputs" size="large">
				<n-form-item label="Level" path="level">
					<n-input-number v-model:value="copyInputs.level" :min="1" :max="90"></n-input-number>
				</n-form-item>
				<n-form-item label="Ascension" path="ascension">
					<n-input-number v-model:value="copyInputs.ascension" :min="0" :max="6"></n-input-number>
				</n-form-item>
				<n-form-item label="Constellations" path="constellations">
					<n-input-number v-model:value="copyInputs.constellations" :min="0" :max="6"></n-input-number>
				</n-form-item>
				<n-form-item>
					<n-space justify="end" style="width: 100%;">
						<n-button @click="addCopyAndCloseModal" :loading="isAddingCopy" type="primary">Create</n-button>
					</n-space>
				</n-form-item>
			</n-form>
		</n-space>
	</n-modal>

	<!-- Owned copies -->
	<n-grid responsive="screen" cols="xs:1 s:2 m:3 l:4 xl:5" :x-gap="12" :y-gap="12">
		<n-gi v-for="copy in store.CharacterCopies">
			<n-card :title="copy.copy_of.name">
				<n-form-item label="Level" path="level">
					<n-input-number v-model:value="copy.level" :min="1" :max="90"></n-input-number>
				</n-form-item>
				<n-form-item label="Ascension" path="ascension">
					<n-input-number v-model:value="copy.ascension" :min="0" :max="6"></n-input-number>
				</n-form-item>
				<n-form-item label="Constellations" path="constellations">
					<n-input-number v-model:value="copy.constellations" :min="0" :max="6"></n-input-number>
				</n-form-item>
				<pre>{{ JSON.stringify(calculateCharacterCopyStats(copy), null, 2) }}</pre>
			</n-card>
		</n-gi>

		<n-gi suffix>
			<n-button
				size="large"
				ghost
				type="primary"
				@click="openDrawer"
				style="width: 100%; height: 100%;"
			>
				<n-icon>
					<plus></plus>
				</n-icon>
			</n-button>
		</n-gi>
	</n-grid>
</template>
