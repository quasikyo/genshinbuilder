<script setup lang="ts">
import { ref } from 'vue';
import { NCard, NButton, NSpace, NIcon, useMessage } from 'naive-ui';
import { TrashAlt, Save } from '@vicons/fa';
import { Manager } from '../../../store/managers';
import { alertUser } from '../../util';

const props = defineProps<{
	title: string,
	item: any,
	manager: Manager<any>
}>();

const message = useMessage();
const isUpdating = ref(false);
async function handleDelete(data: any) {
	isUpdating.value = true;
	const error = await props.manager.delete(data);
	isUpdating.value = true;

	alertUser(message, error, 'Deletion');
} // deleteCharacterCopy

async function handleSave(data: any) {
	isUpdating.value = true;
	const error = await props.manager.save(data);
	isUpdating.value = false;

	alertUser(message, error, 'Save');
} // handleDelete
</script>

<template>
	<n-card :title="title">
		<slot name="item-edit"></slot>
		<slot name="item-values"></slot>
		<template #action>
			<n-space justify="end" style="width: 100%;">
				<n-button type="error" @click="handleDelete(item)" :loading="isUpdating" :disabled="isUpdating">
					<n-icon><trash-alt></trash-alt></n-icon>
				</n-button>
				<n-button type="info" @click="handleSave(item)" :loading="isUpdating" :disabled="isUpdating">
					<n-icon><save></save></n-icon>
				</n-button>
			</n-space>
		</template>
	</n-card>
</template>
