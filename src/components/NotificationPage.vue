<template>
	<div>
		<button @click="handleSuccess">Show Success Notification</button>
		<button @click="handleError">Show Error Notification</button>
		<button @click="handleAsyncNotification">Show Async Notification</button>
	</div>

	<NotificationList />
	<!-- Компонент для вывода уведомлений -->
</template>

<script lang="ts" setup>
import NotificationList from "src/components/common/NotificationList.vue";
import notificationStore from "src/stores/notification";

// Показ уведомления об успехе
const handleSuccess = () => {
	notificationStore.notifySuccess("Operation completed successfully", 3000);
};

// Показ уведомления об ошибке
const handleError = () => {
	notificationStore.notifyError("Something went wrong!", 5000);
};

// Асинхронное уведомление
const handleAsyncNotification = async () => {
	const notificationId = notificationStore.notifyInfo("Operation in progress...", 10000); // Оповещение на 10 секунд

	// Имитируем долгую асинхронную операцию
	await new Promise((resolve) => setTimeout(resolve, 5000));

	// Закрываем уведомление вручную, если оно еще не закрылось
	notificationStore.notifySuccess("Operation completed after 5 seconds", 3000);
};
</script>
