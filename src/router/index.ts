import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import Login from "@/components/Login.vue";
import HelloWord from "@/components/HelloWord.vue";

const routes = [
	{
		path: "/login",
		component: Login,
	},
	{
		path: "/dashboard",
		component: HelloWord,
		meta: { requiresAuth: true },
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

router.beforeEach((to, from, next) => {
	const authStore = useAuthStore();
	if (to.meta.requiresAuth && !authStore.isAuthenticated) {
		next("/login");
	} else {
		next();
	}
});

export default router;
