import { defineStore } from "pinia";
import { api } from "@/api/login";

interface AuthState {
	token: string | null;
	status: string;
}

export const useAuthStore = defineStore("auth", {
	state: (): AuthState => ({
		token: localStorage.getItem("token"),
		status: "",
	}),
	actions: {
		async login(login: string, password: string) {
			this.status = "loading";
			try {
				const response = await api.auth.login(login, password);

				const { accessToken } = response.data;
				if (!accessToken) return;

				this.token = accessToken;
				localStorage.setItem("token", accessToken);
				api.setToken(accessToken);

				this.status = "success";
			} catch (error) {
				this.status = "error";
				localStorage.removeItem("token");
				throw error;
			}
		},

		async validate() {
			const token = localStorage.getItem("token");

			if (!token) return;

			try {
				const response = await api.auth.validateToken(token);

				const { isValid } = response.data;

				if (isValid) {
					this.token = token;
					api.setToken(token);
				} else {
					throw new Error();
				}
			} catch (error) {
				this.logout();

				throw error;
			}
		},

		logout() {
			this.token = null;
			localStorage.removeItem("token");
			api.clearToken();
		},
	},
	getters: {
		isAuthenticated: (state) => !!state.token,
		authStatus: (state) => state.status,
	},
});
