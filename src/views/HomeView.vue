<script setup lang="ts">
	import { ref } from 'vue';
	import axios from 'axios'
	import robotImage from '../assets/robot.png';
	import {useUserStore} from '../stores/user'
	import {useRouter} from 'vue-router'

	const name = ref('');
	const email = ref('');
	const loading = ref(false);
	const error = ref<string | null>(null);

	const userStore = useUserStore()
	const router = useRouter()
	const createUser = async () => {
		if (!name.value || !email.value) {
			error.value = 'Please fill in all fields.';
			return;
		}

		loading.value = true;
		error.value = null;

		try{
			const {data} = await axios({
				method:'post',
				url: `${import.meta.env.VITE_API_URL}/register-user`,
				data: {
					name: name.value,
					email: email.value
				}
			})

			userStore.setUser({
				userId: data.userId,
				name: data.name,
			})
			router.push('/chat')
		}catch(err){
			error.value = `something went wrong: ${err}, please try again.`
		}finally{
			loading.value = false;
		}
}
</script>

<template>
	<div class="h-screen flex items-center justify-center bg-gray-900 text-white">
		<div class="p-8 bg-gray-800 rounded-lg shadow-lg w-full max-w-md">
			<img 
				:src="robotImage" 
				alt=""
				class="mx-auto mb-4 w-24 h-24"
			/>
			<h1 class="text-2xl font-semibold mb-4 text-center">
				Welcome To Chat AI
			</h1>

			<input 
				type="text"
				class="w-full p-2 mb-4 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400"
				placeholder="Name"
				v-model="name"
			/>

			<input 
				type="email"
				class="w-full p-2 mb-4 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400"
				placeholder="Email"
				v-model="email"
			/>

			<button
				class="w-full p-2 bg-blue-600 rounded hover:bg-blue-700 transition duration-200"
				@click="createUser"
				:disabled="loading"
			>
				{{ loading ? 'Loading...' : 'Start Chat' }}
			</button>

			<p 
				v-if="error"
				class="mt-4 text-red-500 text-center"
			>
				{{ error }}
			</p>
		</div>
	</div>
</template>