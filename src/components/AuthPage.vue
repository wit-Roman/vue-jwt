<template>
	<div>
		<h2>Авторизация</h2>

		<a-alert if="error">{{ error }}</a-alert>

		<a-form
			:model="formState"
			name="authForm"
			:label-col="{ span: 8 }"
			:wrapper-col="{ span: 16 }"
			autocomplete="off"
			@finish="handleLogin"
			@finishFailed="setError"
		>
			<a-form-item
				label="Username"
				name="username"
				:rules="[{ required: true, message: 'Please input your username!' }]"
			>
				<a-input v-model:value="formState.username" />
			</a-form-item>

			<a-form-item
				label="Password"
				name="password"
				:rules="[{ required: true, message: 'Please input your password!' }]"
			>
				<a-input-password v-model:value="formState.password" />
			</a-form-item>

			<a-form-item :wrapper-col="{ offset: 8, span: 16 }">
				<a-button type="primary" html-type="submit">Submit</a-button>
			</a-form-item>
		</a-form>
	</div>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";

import { useAuthStore } from "src/stores/auth";

const error = ref("");
const formState = reactive({
	username: "",
	password: "",
});

const authStore = useAuthStore();
const router = useRouter();

const handleLogin = () => {
	authStore
		.login(formState.username, formState.password)
		.then(() => {
			router.push("/dashboard");
		})
		.catch(() => {
			error.value = "Invalid credentials";
		});
};

const setError = (errs: { errorFields: [] }) => {
	if (errs.errorFields.length) {
		error.value = "Bad value";
	}
};
</script>
