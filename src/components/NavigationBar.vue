<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { NMenu } from 'naive-ui';
import { supabase } from '../supabase';
import { generateMenuItems } from './navbar';

const router = useRouter();
const allRoutes = router.options.routes;

let menuItems = ref(generateMenuItems(allRoutes, supabase.auth.user()));
onMounted(
	() => supabase.auth.onAuthStateChange((_, session) => {
		menuItems.value = generateMenuItems(allRoutes, session?.user);
	})
);
</script>

<template>
	<n-menu :options="menuItems" mode="horizontal"></n-menu>
</template>
