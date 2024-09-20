import { reactive } from "vue";

interface Notification {
	id: number;
	type: "success" | "error" | "warning" | "info";
	message: string;
	timeout?: number;
	isClosing?: boolean;
}

const state = reactive({
	notifications: [] as Notification[],
});

let nextId = 1;

const addNotification = (type: Notification["type"], message: string, timeout?: number) => {
	const id = nextId++;
	const notification: Notification = { id, type, message, timeout };

	state.notifications.push(notification);

	if (timeout) {
		setTimeout(() => removeNotification(id), timeout);
	}
};

const removeNotification = (id: number) => {
	const notification = state.notifications.find((n) => n.id === id);
	if (notification) {
		notification.isClosing = true;
		setTimeout(() => {
			state.notifications = state.notifications.filter((n) => n.id !== id);
		}, 300); // Таймер для анимации удаления
	}
};

const notifySuccess = (message: string, timeout?: number) => {
	addNotification("success", message, timeout);
};

const notifyError = (message: string, timeout?: number) => {
	addNotification("error", message, timeout);
};

const notifyWarning = (message: string, timeout?: number) => {
	addNotification("warning", message, timeout);
};

const notifyInfo = (message: string, timeout?: number) => {
	addNotification("info", message, timeout);
};

export default {
	state,
	addNotification,
	removeNotification,
	notifySuccess,
	notifyError,
	notifyWarning,
	notifyInfo,
};
