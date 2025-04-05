<script setup lang="ts">
	import { ref } from 'vue'

	const message = ref('')
	const emit = defineEmits(['send'])
	const sendMessage = () => {
		if(!message.value.trim()) return
		
		emit('send', message.value)
		
		message.value = ''
	}
</script>

<template>
	<div class="p-4 bg-gray-800 flex">
		<input
			type="text"
			v-model="message"
			@keyup.enter="sendMessage"
			placeholder="Type your message..."
			class="flex-1 p-2 border border-gray-600 rounded bg-gray-700 text-white"
		/>
		<button
			@click="sendMessage"
			class="ml-2 p-2 bg-blue-600 rounded hover:bg-blue-700 text-white"
		>
			Send
		</button>
	</div>
</template>