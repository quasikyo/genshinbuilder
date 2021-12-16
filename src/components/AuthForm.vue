<script setup lang="ts">
import { ref } from 'vue';
import { NCard, NForm, NFormItem, NInput, NButton, NSpace, NDivider } from 'naive-ui';
import { supabase } from '../supabase';
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

function checkEnterPress(event: KeyboardEvent) {
	event.key === 'Enter' && submitOnValid();
} // checkEnterPress

function submitOnValid() {
	// @ts-ignore
	form.value.validate((errors) => {
		!errors && handleSubmit(inputs.value.email, inputs.value.password);
	});
} // submitOnValid
</script>

<template>
	<n-card :title="title" style="max-width: 60%; margin: auto;">
		<n-form :rules="rules" :model="inputs" ref="form" size="large" @keydown="checkEnterPress">
			<n-form-item path="email" label="Email">
				<n-input v-model:value="inputs.email" type="text"></n-input>
			</n-form-item>
			<n-form-item path="password" label="Password">
				<n-input v-model:value="inputs.password" type="password"></n-input>
			</n-form-item>
			<n-form-item>
				<n-space justify="end" style="width: 100%;">
					<n-button @click="submitOnValid" type="primary">Submit</n-button>
				</n-space>
			</n-form-item>
		</n-form>
		<n-divider></n-divider>
		<n-button type="info" @click="supabase.auth.signIn({ provider: 'discord' })">Discord</n-button>
	</n-card>
</template>
