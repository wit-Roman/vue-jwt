<template>
	<div id="app">
		<header>
			<nav>
				<router-link to="/">Home</router-link>
				<router-link to="/dashboard" v-if="isAuthenticated">Dashboard</router-link>
				<router-link to="/login" v-else>Login</router-link>
				<button v-if="isAuthenticated" @click="handleLogout">Logout</button>
			</nav>
		</header>
		<router-view />
	</div>
</template>

<script lang="ts" setup>
import { onMounted, computed } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const isAuthenticated = computed(() => {
	return authStore.isAuthenticated;
});

onMounted(() => {
	authStore.validate().catch(() => router.push("/"));
});

// Метод для выхода
const handleLogout = () => {
	authStore.logout();
	router.push("/");
};
</script>

<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	text-align: center;
	color: #2c3e50;
	margin-top: 60px;
}

nav a {
	margin: 0 15px;
	text-decoration: none;
	color: #42b983;
}

nav a.router-link-exact-active {
	font-weight: bold;
	color: #42b983;
}
</style>
