<script setup lang="ts">
import { ref } from 'vue';
import { NCard, NSpace, NIcon, useMessage } from 'naive-ui';
import { TrashAlt, Save } from '@vicons/fa';
import { Manager } from '../../../store/managers';
import AsyncButton from '../../AsyncButton.vue';

defineProps<{ title: string, item: any, manager: Manager<any, any> }>();
const isUpdating = ref(false);
</script>

<template>
	<n-card :title="title">
		<slot name="item-edit"></slot>
		<slot name="item-values"></slot>
		<template #action>
			<n-space justify="end" style="width: 100%;">
				<async-button type="error" :operation="() => manager.delete(item)" operation-name="Deletion" v-model:status="isUpdating">
					<n-icon><trash-alt></trash-alt></n-icon>
				</async-button>
				<async-button type="info" :operation="() => manager.save(item)" operation-name="Save" v-model:status="isUpdating">
					<n-icon><save></save></n-icon>
				</async-button>
			</n-space>
		</template>
	</n-card>
</template>
