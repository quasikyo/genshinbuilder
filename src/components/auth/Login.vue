<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { supabase } from '../../supabase';

const router = useRouter();
const route = useRoute();
const email = ref('');
const password = ref('');

async function loginUser(event: Event) {
	event.preventDefault();

	const { user, error } = await supabase.auth.signIn({
		email: email.value,
		password: password.value,
	});

	const redirectTo = route.query.redirect as string || '/dashboard';
	!!error ? alert(error.message) : router.push(redirectTo);
} // loginUser
</script>

<template>
	<h1>Login</h1>
	<form @submit="loginUser">
		<input type="text" v-model="email">
		<input type="text" v-model="password">
		<input type="submit" value="Login">
	</form>
</template>

<style>
</style>
