import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import router from "./router";
import "vuetify/styles"; // CSS của Vuetify
createApp(App).use(vuetify).use(router).mount("#app");
