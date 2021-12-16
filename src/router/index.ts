import {
	RouteRecordRaw,
	RouterOptions,
	Router,
	createWebHistory,
	createRouter,
} from 'vue-router';

const routes: RouteRecordRaw[] = [];

const routerOptions: RouterOptions = {
	history: createWebHistory(),
	routes: routes,
};

export const router: Router = createRouter(routerOptions);
