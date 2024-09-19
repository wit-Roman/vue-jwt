<template>
	<div>
		<h2>Авторизация</h2>
		<form @submit.prevent="handleLogin">
			<div>
				<label for="login">Login:</label>
				<input id="login" v-model="login" type="text" required />
			</div>
			<div>
				<label for="password">Passw:</label>
				<input id="password" v-model="password" type="password" required />
			</div>
			<button type="submit">Enter</button>
			<p v-if="error">{{ error }}</p>
		</form>
	</div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "src/stores/auth";

const authStore = useAuthStore();
const router = useRouter();
const login = ref("");
const password = ref("");
const error = ref("");

const handleLogin = () => {
	authStore
		.login(login.value, password.value)
		.then(() => {
			router.push("/dashboard");
		})
		.catch(() => {
			error.value = "Invalid credentials";
		});
};
</script>
