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
		name: 'index',
		component: () => import('../pages/Index.vue'),
	},
	{
		path: '/register',
		name: 'register',
		component: () => import('../pages/auth/Register.vue'),
		meta: {
			forwardAuth: true,
		},
	},
	{
		path: '/login',
		name: 'login',
		component: () => import('../pages/auth/Login.vue'),
		meta: {
			forwardAuth: true,
		},
	},
	{
		path: '/logout',
		name: 'logout',
		component: () => import('../pages/auth/Logout.vue'),
		meta: {
			requiresAuth: true,
		}
	},
	{
		path: '/dashboard',
		name: 'dashboard',
		component: () => import('../pages/dashboard/Dashboard.vue'),
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
		next({ name: 'login', query: { redirect: to.name as string } });
	} else if (forwardAuth && currentUser) {
		next({ name: 'dashboard' })
	} else {
		next();
	} // if
});

export { router };
