<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '../../supabase';

const router = useRouter();
const email = ref("");
const password = ref("");

async function registerUser(event: Event) {
	event.preventDefault();

	const { user, error } = await supabase.auth.signUp({
		email: email.value,
		password: password.value,
	});

	!!error ? alert(error.message) : router.push({ name: 'index' });
} // registerUser
</script>

<template>
	<h1>Register</h1>
	<form @submit="registerUser">
		<input type="text" v-model="email">
		<input type="text" v-model="password">
		<input type="submit" value="Register">
	</form>
</template>

<style>
</style>
