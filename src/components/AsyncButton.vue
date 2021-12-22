<script setup lang="ts">
import { NButton, useMessage } from 'naive-ui';
import { Type } from 'naive-ui/lib/button/src/interface';

import { alertUser } from './util';

const props = defineProps<{
	type: Type,
	status: boolean,
	operationName: string,
	operation: Function,
}>();

const emit = defineEmits(['update:status']);

const message = useMessage();
async function handleOperation() {
	emit('update:status', true);
	const error = await props.operation();
	alertUser(message, error, props.operationName);
	emit('update:status', false);
} // handleOperation
</script>

<template>
	<n-button :type="type" @click="handleOperation" :loading="status" :disabled="status">
		<slot>{{ operationName }}</slot>
	</n-button>
</template>
