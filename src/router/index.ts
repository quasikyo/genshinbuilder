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
		component: () => import('../components/Index.vue'),
	},
	{
		path: '/register',
		name: 'register',
		component: () => import('../components/auth/Register.vue'),
		meta: {
			forwardAuth: true,
		},
	},
	{
		path: '/login',
		name: 'login',
		component: () => import('../components/auth/Login.vue'),
		meta: {
			forwardAuth: true,
		},
	},
	{
		path: '/logout',
		name: 'logout',
		component: () => import('../components/auth/Logout.vue'),
		meta: {
			requiresAuth: true,
		}
	},
	{
		path: '/dashboard',
		name: 'dashboard',
		component: () => import('../components/dashboard/Dashboard.vue'),
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
		next({ name: 'login', query: { redirect: to.fullPath } });
	} else if (forwardAuth && currentUser) {
		next({ name: 'dashboard' })
	} else {
		next();
	} // if
});

export { router };
