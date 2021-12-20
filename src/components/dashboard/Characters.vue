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
	NDataTable,
	NForm, NFormItem, NInputNumber,
	NGrid, NGi
} from 'naive-ui';
import { Plus } from '@vicons/fa';
import { store, createCharacterCopy, doesCopyExist } from '../../store';
import { calculateCharacterAll } from '../../store/calculators';
import { Character, CharacterCopy, Ascension, Constellations } from '../../types';

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
const modalInputs = ref<{
	ascension: Ascension,
	level: number,
	constellations: Constellations,
	copy_of: Character,
// @ts-ignore copy_of dynamically set
}>({
	ascension: 0,
	level: 1,
	constellations: 0,
});
function promptCopyFields(character: Character) {
	modalInputs.value.copy_of = character;
	doShowCopyCreationModal.value = true;
} // promptCopyFields
</script>

<script lang="ts">
export default {
	name: 'Characters'
}
</script>

<template>
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
							:disabled="doesCopyExist(character)">Add</n-button>
					</n-space>
				</template>
			</n-card>
		</n-drawer-content>
	</n-drawer>

	<n-modal
		v-model:show="doShowStatsModal"
		preset="card"
		:title="modalDetails.title + '\'s Base Stats'"
		style="width: 45%;"
	>
		<n-data-table
			:columns="modalDetails.tableColumns"
			:data="modalDetails.tableRows"
			:pagination="{ pageSize: 10 }"></n-data-table>
	</n-modal>

	<n-modal
		v-model:show="doShowCopyCreationModal"
		preset="card" :title="`${modalInputs?.copy_of?.name}`"
		style="width: fit-content;"
	>
		<n-space justify="center">
			<n-form :model="modalInputs" size="large">
				<n-form-item label="Level" path="level">
					<n-input-number v-model:value="modalInputs.level"></n-input-number>
				</n-form-item>
				<n-form-item label="Ascension" path="ascension">
					<n-input-number v-model:value="modalInputs.ascension"></n-input-number>
				</n-form-item>
				<n-form-item label="Constellations" path="constellations">
					<n-input-number v-model:value="modalInputs.constellations"></n-input-number>
				</n-form-item>
				<n-form-item>
					<n-space justify="end" style="width: 100%;">
						<n-button @click="(doShowCopyCreationModal = false) || createCharacterCopy(modalInputs.copy_of, modalInputs)" type="primary">Create</n-button>
					</n-space>
				</n-form-item>
			</n-form>
		</n-space>
	</n-modal>

	<n-button type="primary" size="large" round icon-placement="right" @click="openDrawer">
		<template #icon>
			<n-icon>
				<plus></plus>
			</n-icon>
		</template>
		<strong>Add New</strong>
	</n-button>

	<n-empty
		v-if="!store.CharacterCopies || store.CharacterCopies.length === 0"
		description="No characters yet."
		size="huge"
		class="center"
	></n-empty>

	<n-grid v-else  responsive="screen" cols="1 m:2 l:3 xl:5">
		<n-gi v-for="copy in store.CharacterCopies">
			<n-card>
				<pre>{{ JSON.stringify(copy, null, 2) }}</pre>
			</n-card>
		</n-gi>
	</n-grid>
</template>
