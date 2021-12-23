<script setup lang="ts">
import { ref, reactive } from 'vue';
import { NSpace, NButton, NCard, NForm, NFormItem } from 'naive-ui';

import { Character, CharacterCopy } from '../../types';

import { store } from '../../store';
import { characterManager } from '../../store/managers';
import { calculateCharacterAll } from '../../store/calculators';

import DashboardComponent from './DashboardComponent.vue';
import ItemsDisplay from './displays/ItemsDisplay.vue';
import CharacterCopyInputs from './inputs/CharacterCopyInputs.vue';

import AsyncButton from '../AsyncButton.vue';
import CharacterCopyDisplay from './displays/CharacterCopyDisplay.vue';

function displayDetails(character: Character, uiFunction: Function) {
	uiFunction(calculateCharacterAll(character));
} // displayDetails

const copyInputs = reactive<CharacterCopy>({
	// id is assigned by manager
	level: 1,
	ascension: 0,
	constellations: 0,
	// @ts-ignore dynamically ensured
	copy_of: undefined,
});
function resetInputs(character: Character, uiControlFunction: Function) {
	Object.assign(copyInputs, {
		level: 1, ascension: 0, constellations: 0, copy_of: character,
	});
	uiControlFunction();
} // resetInputs

const isAddingCopy = ref(false);
async function addCopyAndCloseModal(uiFunction: Function) {
	const error = await characterManager.add(copyInputs);

	if (!error) {
		uiFunction();
	} // if

	return error;
} // addCopyAndCloseModal
</script>

<script lang="ts">
export default { name: 'Characters' };
</script>

<template>
	<dashboard-component title="Characters">
		<template #drawer-content="{ uiControls: { statsModal, creationModal } }">
			<n-card
				v-for="character in store.Characters"
				:title="character.name"
				style="margin-top: 1rem;"
				class="no-content"
				:class="character.rarity === 4 ? 'border-purple' : 'border-gold'"
			>
				<template #header-extra>
					<n-space justify="end" style="width: 100%;">
						<n-button @click="displayDetails(character, statsModal.setAndShow.bind(statsModal))">Base Stats</n-button>
						<n-button
							type="primary"
							@click="resetInputs(character, creationModal.show)"
							:disabled="characterManager.doesCopyExist(character)"
						>Add</n-button>
					</n-space>
				</template>
			</n-card>
		</template>

		<template #creation="{ uiControls: { creationModal: { hide } } }">
			<n-form :model="copyInputs" size="large">
				<character-copy-inputs :copy="copyInputs"></character-copy-inputs>
				<n-form-item>
					<n-space justify="end" style="width: 100%;">
						<async-button
							type="primary"
							:operation="() => addCopyAndCloseModal(hide)"
							operationName="Create"
							v-model:status="isAddingCopy"
						></async-button>
					</n-space>
				</n-form-item>
			</n-form>
		</template>

		<!-- <template #items-display> says where to put it -->
		<!-- <items-display> denotes data to use and how to reacte to button click -->
		<!-- <template #item-display> is a slot provided by <items-display> that exposes a data entry -->
		<!-- <character-copy-display> takes that exposed data entry and, well, displays it -->
		<template #items-display="{ uiControls: { drawer: { show } } }">
			<items-display :data="store.CharacterCopies" :onAddClicked="show">
				<template #item-display="{ entry }">
					<character-copy-display :copy="entry"></character-copy-display>
				</template>
			</items-display>
		</template>
	</dashboard-component>
</template>
