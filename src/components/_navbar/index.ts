import { h } from 'vue';
import { RouterLink, RouteRecordNormalized } from 'vue-router';
import { User } from '@supabase/supabase-js';

export function generateMenuItems(
	allRoutes: RouteRecordNormalized[],
	user: User | null | undefined): any[] { // really MenuMixedOption[] but ugly errors
		// logged in: all routes that don't forward authed users
		// logged out: all routes that don't require auth
		const excludeProperty = user ? 'forwardAuth': 'requiresAuth';
		const availableRoutes = allRoutes.filter(({ meta }) => {
			return !(excludeProperty in meta);
		});

		return availableRoutes.map((route) => {
			return {
				label:() => h(
					RouterLink,
					{ to: { name: route.name } },
					{ default: () => route.name },
				),
				key: route.path,
			};
		});
} // generateMenuItems
