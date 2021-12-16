<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useMessage } from 'naive-ui';

import { supabase } from '../../supabase';
import AuthForm from '../../components/AuthForm.vue';

const router = useRouter();
const message = useMessage();

async function registerUser(email: string, password: string) {
	const { error } = await supabase.auth.signUp({
		email, password,
	});

	!!error ? message.error(error.message) : router.push({ name: 'login' });
} // registerUser
</script>

<template>
	<auth-form title="Register for Genshin Builder" :handleSubmit="registerUser"></auth-form>
</template>

<style>
</style>
