<script setup lang="ts">
import { NGrid, NGi, NButton, NIcon } from 'naive-ui';
import { Plus } from '@vicons/fa';

defineProps<{ data: any[], onAddClicked: () => void }>();
</script>

<template>
	<n-grid responsive="screen" cols="xs:1 s:1 m:2 l:3 xl:4" :x-gap="12" :y-gap="12">
		<n-gi>
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

		<n-gi v-for="entry in data">
			<slot name="item-display" :entry="entry"></slot>
		</n-gi>
	</n-grid>
</template>
