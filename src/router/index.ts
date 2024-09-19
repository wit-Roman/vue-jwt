import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "src/stores/auth";
import AuthPage from "src/components/AuthPage.vue";
import HelloWord from "src/components/HelloWord.vue";

const routes = [
	{
		path: "/login",
		component: AuthPage,
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
