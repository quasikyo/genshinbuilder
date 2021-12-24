<script setup lang="ts">
import { ref, reactive } from 'vue';
import { NCard, NSpace, NButton, NForm, NFormItem } from 'naive-ui';

import { Weapon, WeaponCopy } from '../../types';

import { store } from '../../store';
import { weaponManager } from '../../store/managers';
import { calculateWeaponAll } from '../../store/calculators';

import DashboardComponent from './DashboardComponent.vue';
import ItemsDisplay from './displays/ItemsDisplay.vue';
import WeaponCopyDisplay from './displays/WeaponCopyDisplay.vue';
import WeaponCopyInputs from './inputs/WeaponCopyInputs.vue';

import AsyncButton from '../AsyncButton.vue';

function displayDetails(weapon: Weapon, uiFunction: Function) {
	uiFunction(calculateWeaponAll(weapon));
} // displayDetails

const copyDefaults: WeaponCopy = {
	level: 1,
	ascension: 0,
	refinement: 1,
	// @ts-ignore dynamically ensured
	copy_of: undefined,
};
const copyInputs = reactive<WeaponCopy>({ ...copyDefaults });
function resetInputs(weapon: Weapon, uiFunction: Function) {
	Object.assign(copyInputs, copyDefaults, { copy_of: weapon });
	uiFunction();
} // resetInputs

const isAddingCopy = ref(false);
async function addCopyAndCloseModal(uiFunction: Function) {
	const error = await weaponManager.add(copyInputs);
	!error && uiFunction();
	return error;
} // addCopyAndCloseModal
</script>

<script lang="ts">export default { name: 'Weapons' };</script>

<template>
	<dashboard-component title="Weapons">
		<template #drawer-content="{ uiControls: { statsModal, creationModal } }">
			<n-card
				v-for="weapon in store.Weapons"
				:title="weapon.name"
				style="margin-top: 1rem;"
				:class="weapon.rarity === 4 ? 'border-purple' : 'border-gold'"
			>
				{{ weapon.description }}
				<template #header-extra>
					<n-space justify="end" style="width: 100%;">
						<n-button @click="displayDetails(weapon, statsModal.setAndShow.bind(statsModal))">Base Stats</n-button>
						<n-button type="primary" @click="resetInputs(weapon, creationModal.show)">Add</n-button>
					</n-space>
				</template>
			</n-card>
		</template>

		<template #creation="{ uiControls: { creationModal: { hide } } }">
			<n-form :model="copyInputs" size="large">
				<weapon-copy-inputs :copy="copyInputs"></weapon-copy-inputs>
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

		<template #items-display="{ uiControls: { drawer: { show } } }">
			<items-display :data="store.WeaponCopies" :onAddClicked="show">
				<template #item-display="{ entry }">
					<weapon-copy-display :copy="entry"></weapon-copy-display>
				</template>
			</items-display>
		</template>
	</dashboard-component>
</template>
