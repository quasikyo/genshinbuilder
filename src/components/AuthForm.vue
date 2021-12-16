<script setup lang="ts">
import { ref } from 'vue';
import { NCard, NForm, NFormItem, NInput, NButton } from 'naive-ui';
import { AuthFunction } from '../types';

const { handleSubmit } = defineProps<{
	handleSubmit: AuthFunction,
	title: string,
}>();

const form = ref(null);
const inputs = ref({
	email: '',
	password: '',
});
const rules = ref({
	email: [
		{
			required: true,
			message: 'Missing valid email.',
			trigger: 'blur',
		},
	],
	password: [
		{
			required: true,
			min: 6,
			message: 'Password must be at least six characters.',
			trigger: 'blur',
		},
	],
});

function submitOnValid() {
	// @ts-ignore
	form.value.validate((errors) => {
		!errors && handleSubmit(inputs.value.email, inputs.value.password);
	});
} // function
</script>

<template>
	<n-card :title="title" style="max-width: 600px; margin: auto;">
		<n-form :rules="rules" :model="inputs" ref="form" size="large">
			<n-form-item path="email" label="Email">
				<n-input v-model:value="inputs.email" type="text"></n-input>
			</n-form-item>
			<n-form-item path="password" label="Password">
				<n-input v-model:value="inputs.password" type="password"></n-input>
			</n-form-item>
			<n-form-item>
				<n-button @click="submitOnValid" type="primary" style="position: absolute; right: 0;">Submit</n-button>
			</n-form-item>
		</n-form>
	</n-card>
</template>
