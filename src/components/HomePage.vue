<template>
	<div class="home-page">
		<!-- Баннер с призывом к действию -->
		<section class="hero-banner">
			<h1>Welcome to Our Platform</h1>
			<p>Unlock the potential of your business with our advanced tools</p>
			<a-button type="primary" size="large" @click="handleStart"> Get Started </a-button>
		</section>

		<!-- Секция с карточками о функциях продукта -->
		<section class="features-section">
			<h2>Our Key Features</h2>
			<div class="feature-cards">
				<a-card title="Feature 1" hoverable>
					<p>Discover powerful analytics tools.</p>
				</a-card>
				<a-card title="Feature 2" hoverable>
					<p>Collaborate with your team in real time.</p>
				</a-card>
				<a-card title="Feature 3" hoverable>
					<p>Automate repetitive tasks and save time.</p>
				</a-card>
			</div>
		</section>

		<!-- Интерактивная таблица -->
		<section class="data-table">
			<h2>User Data Overview</h2>
			<a-table :columns="columns" :dataSource="data" bordered />
		</section>
	</div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";

// Инициализация данных для таблицы
const columns = [
	{
		title: "Name",
		dataIndex: "name",
		key: "name",
	},
	{
		title: "Email",
		dataIndex: "email",
		key: "email",
	},
	{
		title: "Role",
		dataIndex: "role",
		key: "role",
	},
	{
		title: "Status",
		dataIndex: "status",
		key: "status",
	},
];

const data = [
	{
		key: "1",
		name: "John Doe",
		email: "john@example.com",
		role: "Administrator",
		status: "Active",
	},
	{
		key: "2",
		name: "Jane Smith",
		email: "jane@example.com",
		role: "User",
		status: "Inactive",
	},
	{
		key: "3",
		name: "Mark Wilson",
		email: "mark@example.com",
		role: "Moderator",
		status: "Active",
	},
];

const router = useRouter();

// Функция для обработки кнопки "Get Started"
const handleStart = () => {
	router.push("/login");
};
</script>

<style scoped>
/* Стили для домашней страницы */
.home-page {
	font-family: Arial, sans-serif;
}

/* Шапка сайта */
.site-header {
	padding: 20px;
	background-color: #001529;
}

.site-header a {
	color: white;
	font-size: 16px;
}

/* Секция с баннером */
.hero-banner {
	text-align: center;
	padding: 100px 0;
	background-color: #f0f2f5;
}

.hero-banner h1 {
	font-size: 48px;
	margin-bottom: 20px;
}

.hero-banner p {
	font-size: 20px;
	margin-bottom: 40px;
}

/* Карточки функций */
.features-section {
	padding: 50px 20px;
	text-align: center;
}

.feature-cards {
	display: flex;
	justify-content: space-around;
}

.a-card {
	width: 300px;
	margin: 20px;
}

/* Таблица с данными */
.data-table {
	padding: 50px 20px;
}
</style>
