<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '../../supabase';

const router = useRouter();

onMounted(async () => {
	await supabase.auth.signOut();
	router.replace({ name: 'Login' });
});
</script>

<template>
	<h1>Logging out...</h1>
</template>
