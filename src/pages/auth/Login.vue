<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { useMessage } from 'naive-ui';

import { supabase } from '../../supabase';
import AuthForm from '../../components/AuthForm.vue';

const route = useRoute();
const router = useRouter();
const message = useMessage();

async function loginUser(email: string, password: string) {
	const { error } = await supabase.auth.signIn({
		email, password,
	});

	const redirectTo = route.query.redirect as string || 'Dashboard';
	!!error ? message.error(error.message) : router.push({ name: redirectTo });
} // loginUser
</script>

<template>
	<auth-form title="Login to Genshin Builder" :handleSubmit="loginUser"></auth-form>
</template>

<style>
</style>
