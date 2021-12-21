<script setup lang="ts">
import { NGrid, NGi, NButton, NIcon } from 'naive-ui';
import { MaybeArray } from 'naive-ui/lib/_utils';
import { Plus } from '@vicons/fa';

import CharacterCopyDisplay from './CharacterCopyDisplay.vue';

defineProps<{
	data: any[],
	calculator: Function,
	onAddClicked: MaybeArray<(e: MouseEvent) => void> | undefined,
}>();
</script>

<template>
	<n-grid responsive="screen" cols="xs:1 s:2 m:3 l:4 xl:5" :x-gap="12" :y-gap="12">
		<n-gi v-for="entry in data">
			<!-- Dynamically determine which display to use -->
			<character-copy-display :copy="entry" :calculator="calculator"></character-copy-display>
		</n-gi>

		<n-gi suffix>
			<n-button
				size="large"
				ghost
				type="primary"
				@click="onAddClicked"
				style="width: 100%; height: 100%;"
			>
				<n-icon>
					<plus></plus>
				</n-icon>
			</n-button>
		</n-gi>
	</n-grid>
</template>