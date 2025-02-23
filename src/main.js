import './assets/main.css'
import router from './fms/Router/router.js'

import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'

const pinia = createPinia(); // ✅ Create a Pinia instance
const app = createApp(App);

app.use(pinia); // ✅ Register Pinia before using stores
app.use(router);

app.mount('#app'); // ✅ Make sure this is the last call