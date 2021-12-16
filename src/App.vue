<script setup lang="ts">
import {
	NConfigProvider, darkTheme,
	NMessageProvider,
	NLayout,
	NLayoutHeader,
	NLayoutContent,
	NSpace,
} from 'naive-ui';
import NavigationBar from './components/NavigationBar.vue';
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
						<navigation-bar></navigation-bar>
					</n-space>
				</n-layout-header>

				<n-layout-content style="padding-top: 15vh;">
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
</style>
