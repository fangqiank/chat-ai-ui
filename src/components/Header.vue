<script setup lang="ts">
	import { useUserStore } from '../stores/user'
	import { useRouter } from 'vue-router'
	import robotImage from '../assets/robot.png'

	const userStore = useUserStore()
	const router = useRouter()

	const logout = () => {
		userStore.logout()
		router.push('/')
	}
</script>

<template>
	<div class="py-4 px-6 bg-gray-800 text-white flex justify-between items-center">
		<img 
			:src="robotImage" 
			alt="Logo" 
			class="h-10 w-10 rounded-full" />
		<h1 class="text-xl font-bold">Chat AI</h1>
		<button
			class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
			@click="logout"
		>
			Logout
		</button>
	</div>
</template>