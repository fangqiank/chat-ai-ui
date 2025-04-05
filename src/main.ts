import {createApp} from "vue";
import {createPinia} from "pinia";
import {router} from "./router";
import "./style.css";
import App from "./App.vue";
import piniaPluginPersistedState from "pinia-plugin-persistedstate";

const pinia = createPinia();
pinia.use(piniaPluginPersistedState);

const app = createApp(App);
app.use(router);
app.use(pinia);
app.mount("#app");
