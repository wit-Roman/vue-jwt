<template>
	<div id="app">
		<header>
			<nav>
				<router-link to="/">Home</router-link>
				<router-link v-if="isAuthenticated" to="/notification">Notification</router-link>
				<router-link v-if="isAuthenticated" to="/dashboard">Dashboard</router-link>
				<router-link v-else to="/login">Login</router-link>
				<button v-if="isAuthenticated" @click="handleLogout">Logout</button>
			</nav>
		</header>
		<router-view />
	</div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";

import { useAuthStore } from "src/stores/auth";
import "./style.css";

const authStore = useAuthStore();
const router = useRouter();

const { isAuthenticated } = storeToRefs(authStore);

onMounted(() => {
	authStore.validate().catch(() => router.push("/"));
});

const handleLogout = () => {
	authStore.logout();
	router.push("/");
};
</script>
