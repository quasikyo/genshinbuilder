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
import { definitions } from '../../supabase';

const isDrawerActive = ref(false);
const doShowModal = ref(false);

const modalDetails = reactive<{
	title: string;
	data: definitions['Character'] | undefined | null,
}>({
	title: '',
	data: null,
});

let baseHP: definitions['StatValue'] = ref({})
let baseATK: definitions['StatValue'] = ref({});
let baseDEF: definitions['StatValue'] = ref({});

function openDrawer() {
	isDrawerActive.value = true;
} // openDrawer

function displayDetails(character: definitions['Character']) {
	modalDetails.title = character.name;
	modalDetails.data = character;

	baseHP.value = store.StatValue.filter(
		(value: definitions['StatValue']) => modalDetails.data?.base_hp === value.id
	)[0];
	baseATK.value = store.StatValue.filter(
		(value: definitions['StatValue']) => modalDetails.data?.base_atk === value.id
	)[0];
	baseDEF.value = store.StatValue.filter(
		(value: definitions['StatValue']) => modalDetails.data?.base_def === value.id
	)[0];

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
		<template #icon><n-icon><plus></plus></n-icon></template>
		<strong>Add New</strong>
	</n-button>

	<n-modal v-model:show="doShowModal" preset="card" :title="modalDetails.title + '\'s Base Stats'" style="width: 33%;">
		<n-table>
			<thead>
				<th>Level</th>
				<th>Ascension</th>
				<th>HP</th>
				<th>ATK</th>
				<th>DEF</th>
			</thead>
			<tbody>
				<tr v-for="(level, i) in baseATK.level">
					<td>{{ level }}</td>
					<td>{{ baseATK.ascension[i] }}</td>
					<td>{{ baseHP.value[i] }}</td>
					<td>{{ baseATK.value[i] }}</td>
					<td>{{ baseDEF.value[i] }}</td>
				</tr>
			</tbody>
		</n-table>
	</n-modal>

	<n-drawer v-model:show="isDrawerActive" placement="left" width="33%">
		<n-drawer-content :closable="true" title="Characters">
			search and filter controls here

			<n-card v-for="character in store.Character" :title="character.name" style="margin-top: 1rem;">
				each card is just character image, name, and color background according to rarity
				<template #action>
					<n-space justify="end" style="width: 100%;">
						<n-button @click="displayDetails(character)">Base Stats</n-button>
						<n-button type="primary">Add</n-button>
					</n-space>
				</template>
			</n-card>

		</n-drawer-content>
	</n-drawer>

	<n-empty v-if="!store.CharacterCopy || store.CharacterCopy.length === 0" description="No characters yet." size="huge" class="center">
	</n-empty>
</template>
