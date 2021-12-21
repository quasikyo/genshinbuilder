<script setup lang=ts>
import { ref } from 'vue';
import { NCard, NButton, NSpace, NIcon, useMessage } from 'naive-ui';
import { TrashAlt } from '@vicons/fa';
import { characterManager } from '../../../store/managers';
import { CharacterCopy } from '../../../types';
import EditCharacterCopy from './EditCharacterCopy.vue';

defineProps<{
	copy: CharacterCopy
	calculator: Function,
}>();

const message = useMessage();
const isAttemptingDelete = ref(false);
async function deleteCharacterCopy(copy: CharacterCopy) {
	isAttemptingDelete.value = true;
	const error = await characterManager.delete(copy);
	isAttemptingDelete.value = true;

	if (error) { message.error(error.message); } // if
} // deleteCharacterCopy
</script>

<template>
	<n-card :title="copy.copy_of.name">
		<edit-character-copy :copy="copy"></edit-character-copy>
		<pre>{{ JSON.stringify(calculator(copy), null, 2) }}</pre>
		<template #action>
			<n-space justify="end" style="width: 100%;">
				<n-button type="error" @click="deleteCharacterCopy(copy)" :loading="isAttemptingDelete">
					<n-icon><trash-alt></trash-alt></n-icon>
				</n-button>
			</n-space>
		</template>
	</n-card>
</template>
