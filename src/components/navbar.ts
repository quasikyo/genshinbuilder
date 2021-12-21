import { h } from 'vue';
import { RouterLink, RouteRecordRaw } from 'vue-router';
import { User } from '@supabase/supabase-js';

export function generateMenuItems(
	allRoutes: RouteRecordRaw[],
	user: User | null | undefined): any[] { // really MenuMixedOption[] but ugly errors
		// logged in: all routes that don't forward authed users
		// logged out: all routes that don't require auth
		const excludeProperty = user ? 'forwardAuth': 'requiresAuth';
		const availableRoutes = allRoutes.filter(({ meta }) => {
			// RouteRecordRaw isn't guaranteed to have meta
			return meta && !(excludeProperty in meta);
		});

		return availableRoutes.map((route) => {
			const menuItem = {
				label:() => h(
					RouterLink,
					{ to: { name: route.name } },
					{ default: () => route.name },
				),
				key: route.path,
			};

			if (route.children) {
				Object.assign(menuItem, {
					children: generateMenuItems(route.children, user)
				});
			} // if

			return menuItem;
		});
} // generateMenuItems
