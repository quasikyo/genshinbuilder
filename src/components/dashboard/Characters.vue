<script setup lang="ts">
import { ref, reactive } from 'vue';
import {
	NEmpty,
	NButton,
	NIcon,
	NDrawer,
	NDrawerContent,
	NCard,
	NModal,
} from 'naive-ui';
import { Plus } from '@vicons/fa';
import { store } from '../../store';
import { definitions } from '../../supabase';

const isDrawerActive = ref(false);
const doShowModal = ref(false);
const modalDetails = reactive({
	title: '',
	data: null,
});

function openDrawer() {
	isDrawerActive.value = true;
} // openDrawer

function displayDetails(character: definitions['Character']) {
	modalDetails.title = character.name;
	modalDetails.data = character;
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

	<n-modal v-model:show="doShowModal" preset="card" :title="modalDetails.title" style="width: 33%;">
		<pre>{{ JSON.stringify(modalDetails.data, null, 2) }}</pre>
	</n-modal>

	<n-drawer v-model:show="isDrawerActive" placement="left" width="33%">
		<n-drawer-content :closable="true" title="Characters">

			search and filter controls here

			<n-card
				v-for="character in store.Character"
				:title="character.name"
				hoverable
				@click="displayDetails(character)"
			>
				each card is just character image, name, and color background according to rarity
			</n-card>
		</n-drawer-content>
	</n-drawer>

	<n-empty v-if="!store.CharacterCopy || store.CharacterCopy.length === 0" description="No characters yet." size="huge" class="center">
	</n-empty>
</template>
