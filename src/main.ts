import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

// Import Global Components i.e frequently used components
import IsBusy from "./components/IsBusy.vue";

// Import Styles
import "./tailwind.css";
import { createPinia } from "pinia";

const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(pinia);

// Register Global Components
app.component("IsBusy", IsBusy);

app.mount("#app");
