<script setup lang="ts">
	import Header from '../components/Header.vue'
	import ChatInput from '../components/ChatInput.vue'
	import {useUserStore} from '../stores/user'
	import {useChatStore} from '../stores/chat'
	import {useRouter} from 'vue-router'
	import { nextTick, onMounted } from 'vue'

	const userStore = useUserStore()
	const chatStore = useChatStore()
	const router = useRouter()

	if(!userStore.userId){
		router.push('/')
	}

	const formatMessage = (text: string) => {
		if (!text) return '';

		return text
			.replace(/\n/g, '<br>') // Preserve line breaks
			.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') // Bold text
			.replace(/\*(.*?)\*/g, '<i>$1</i>') // Italic text
			.replace(/`(.*?)`/g, '<code>$1</code>') // Inline code
			.replace(/(?:^|\n)- (.*?)(?:\n|$)/g, '<li>$1</li>') // Bullet points
			.replace(/(?:^|\n)(\d+)\. (.*?)(?:\n|$)/g, '<li>$1. $2</li>') // Numbered lists
			.replace(/<\/li>\n<li>/g, '</li><li>') // Ensure list continuity
			.replace(/<li>/, '<ul><li>') // Wrap in `<ul>`
			.replace(/<\/li>$/, '</li></ul>'); // Close the `<ul>`
		}

		const scrollToBottom = () => {
			nextTick(() => {
				const chatContainer = document.getElementById('chat-container');
				if (chatContainer) {
					chatContainer.scrollTop = chatContainer.scrollHeight;
				}
			});
		};

		onMounted(() => {
			chatStore.loadChatHistory()	
				.then(() => {
					scrollToBottom();
				})
				.catch((error) => {
					console.error('Error loading chat history:', error);
				});
		});
</script>

<template>
	<div class="flex flex-col h-screen bg-gray-900 text=white">
		<Header />

		<div
			class="flex-1 overflow-y-auto p-4 space-y-4"
			id="chat-container"
		>
			<div
				v-for="(msg, idx) in chatStore.messages"
				:key="idx"
				class="flex items-start space-x-2"
				:class="msg.role === 'user' ? 'justify-end' : 'justify-start'"
			>
				<div
					v-html="formatMessage(msg.content)"
					class="max-w-xs px-4 py-2 rounded-lg md:max-w-md"
					:class="msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-white'"	
				/>
			</div>

			<div
				v-if="chatStore.isLoading"
				class="flex justify-start"
			>
				<div class="bg-gray-700 text-white px-4 py-2 rounded-lg">
					<span class="animate-pulse">Ai is thinking...</span>
				</div>
			</div>
		</div>

		<ChatInput @send="chatStore.sendMessage" />
	</div>
</template>

