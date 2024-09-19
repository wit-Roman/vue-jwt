import axios from "axios";

const instance = axios.create({
	headers: { "Content-type": "application/json; charset=UTF-8" },
	baseURL: import.meta.env.VITE_API_BASE_URL,
});

/** @desc Функция для установки токена в заголовки */
function setToken(token: string) {
	instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

/** @desc Функция для удаления токена из заголовков */
function clearToken() {
	delete instance.defaults.headers.common["Authorization"];
}

/** @desc Репозиторий для управления запросами авторизации */
const auth = {
	login: (login: string, password: string) => {
		return instance.post<{ refreshToken: string; accessToken: string }>("/User/Login", { login, password });
	},

	validateToken: (accessToken: string) => {
		return instance.post<{ userId: string; isValid: boolean }>("Token/ValidateToken", { accessToken }, {});
	},
};

export const api = {
	auth,
	setToken,
	clearToken,
};
