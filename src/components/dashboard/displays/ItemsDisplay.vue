<script setup lang="ts">
import { NGrid, NGi, NButton, NIcon } from 'naive-ui';
import { Plus } from '@vicons/fa';

import CharacterCopyDisplay from './CharacterCopyDisplay.vue';

defineProps<{ data: any[], onAddClicked: () => void }>();
</script>

<template>
	<n-grid responsive="screen" cols="xs:1 s:1 m:2 l:3 xl:4" :x-gap="12" :y-gap="12">
		<n-gi v-for="entry in data">
			<!-- Dynamically determine which display to use -->
			<character-copy-display :copy="entry"></character-copy-display>
		</n-gi>

		<n-gi suffix>
			<n-button
				size="large" type="primary" icon-placement="right" ghost
				@click="onAddClicked" style="width: 100%; height: 100%;"
			>
				Add New
				<template #icon>
					<n-icon>
						<plus></plus>
					</n-icon>
				</template>
			</n-button>
		</n-gi>
	</n-grid>
</template>
