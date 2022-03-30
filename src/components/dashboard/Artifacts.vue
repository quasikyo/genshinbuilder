<script setup lang="ts">
import { NSpace, NButton, NCard, NForm, NFormItem } from 'naive-ui';

import { store } from '../../store';

import DashboardComponent from './DashboardComponent.vue';
import ItemsDisplay from './displays/ItemsDisplay.vue';
</script>

<script lang="ts">
export default { name: 'Artifacts' };
</script>

<template>
	<dashboard-component title="Characters">
		<template #drawer-content="{ uiControls: { statsModal, creationModal } }">
			<n-card
				v-for="artifact in store.ArtifactSets"
				:title="artifact.name"
				style="margin-top: 1rem;"
				class="no-content"
			>
			</n-card>
		</template>

		<template #items-display="{ uiControls: { drawer: { show } } }">
			<items-display :data="store.ArtifactSets" :onAddClicked="show">
				<!-- <template #item-display="{ entry }">
					<character-copy-display :copy="entry"></character-copy-display>
				</template> -->
			</items-display>
		</template>
	</dashboard-component>
</template>
