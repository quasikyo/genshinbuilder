<script setup lang="ts">
import { NConfigProvider, NMessageProvider, NPageHeader, darkTheme } from 'naive-ui';

</script>

<template>
	<n-config-provider :theme="darkTheme">
		<n-message-provider>
			<n-page-header></n-page-header>
			<router-view></router-view>
		</n-message-provider>
	</n-config-provider>
</template>

<style>
html,
body {
	color: rgba(255, 255, 255, 0.82);
	background-color: #101014;
}
</style>
