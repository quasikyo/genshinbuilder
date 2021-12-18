<script setup lang="ts">
import { useRouter } from 'vue-router';
import {
	NConfigProvider, darkTheme,
	NMessageProvider,
	NLayout,
	NLayoutHeader,
	NLayoutContent,
	NSpace,
} from 'naive-ui';
import NavigationBar from './components/NavigationBar.vue';

const router = useRouter();
</script>

<template>
	<n-config-provider :theme="darkTheme">
		<n-message-provider>

			<n-layout>
				<n-layout-header>
					<n-space justify="space-around" align="center">
						<header style="display: inline-block;">
							<h1 style="display: inherit;">Genshin Builder</h1>
						</header>
						<h3>{{ router.currentRoute.value.name }}</h3>
						<navigation-bar></navigation-bar>
					</n-space>
				</n-layout-header>

				<n-layout-content>
					<router-view></router-view>
				</n-layout-content>
			</n-layout>

		</n-message-provider>
	</n-config-provider>
</template>

<style>
html,
body,
#app,
.n-config-provider,
.n-layout {
	height: 100%;
}

.center {
	/* Yes, I know this is the bad way. Bite me. */
	left: 50%;
	position: absolute;
	top: 50%;
	transform: translate(-50% , -50%)
}
</style>
