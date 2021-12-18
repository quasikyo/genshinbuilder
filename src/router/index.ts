import {
	RouteRecordRaw,
	RouterOptions,
	Router,
	createWebHistory,
	createRouter,
} from 'vue-router';

import { supabase } from '../supabase';

const routes: RouteRecordRaw[] = [
	{
		path: '/',
		name: 'Home',
		component: () => import('../pages/Index.vue'),
		meta: {},
	},
	{
		path: '/register',
		name: 'Register',
		component: () => import('../pages/auth/Register.vue'),
		meta: {
			forwardAuth: true,
		},
	},
	{
		path: '/login',
		name: 'Login',
		component: () => import('../pages/auth/Login.vue'),
		meta: {
			forwardAuth: true,
		},
	},
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: () => import('../pages/dashboard/Dashboard.vue'),
		meta: {
			requiresAuth: true,
		},
	},
	{
		path: '/logout',
		name: 'Logout',
		component: () => import('../pages/auth/Logout.vue'),
		meta: {
			requiresAuth: true,
		},
	},
];

const routerOptions: RouterOptions = {
	history: createWebHistory(),
	routes: routes,
};

const router: Router = createRouter(routerOptions);

router.beforeEach((to, from, next) => {
	const requiresAuth = to.matched.some((route) => route.meta.requiresAuth);
	const forwardAuth = to.matched.some((route) => route.meta.forwardAuth);
	const currentUser = supabase.auth.user();

	if (requiresAuth && !currentUser) {
		next({ name: 'Login', query: { redirect: to.name as string } });
	} else if (forwardAuth && currentUser) {
		next({ name: 'Dashboard' })
	} else {
		next();
	} // if
});

export { router };
