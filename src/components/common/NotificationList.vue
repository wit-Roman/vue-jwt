<template>
	<div class="notification-list">
		<TransitionGroup tag="div" name="slide-fade">
			<div v-for="notification in notifications" :class="['notification', notification.type]">
				<p>{{ notification.message }}</p>
				<button @click="closeNotification(notification.id)">Close</button>
			</div>
		</TransitionGroup>
	</div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import notificationStore from "src/stores/notification";

// Получаем уведомления из глобального хранилища
const notifications = computed(() => notificationStore.state.notifications);

// Закрытие уведомления
const closeNotification = (id: number) => {
	notificationStore.removeNotification(id);
};
</script>

<style scoped>
.slide-fade-enter-active {
	transition: all 0.2s ease-out;
}

.slide-fade-leave-active {
	transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-leave-active {
	position: absolute;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
	transform: translateX(20px);
	opacity: 0;
}

.notification-list {
	position: relative;
	position: fixed;
	top: 10px;
	right: 10px;
	width: 300px;
}
.notification {
	padding: 10px;
	margin-bottom: 10px;
	border-radius: 4px;
}
.notification.success {
	background-color: #d4edda;
	color: #155724;
}
.notification.error {
	background-color: #f8d7da;
	color: #721c24;
}
.notification.warning {
	background-color: #fff3cd;
	color: #856404;
}
.notification.info {
	background-color: #d1ecf1;
	color: #0c5460;
}
</style>
