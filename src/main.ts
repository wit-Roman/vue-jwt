import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";

import router from "@/router";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
//app.use(instance); если здесь подключать axios то max call stack

app.mount("#app");
