import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import VueSelect from 'vue-select'
import router from './Router/router'

const pinia = createPinia(); // ✅ Create a Pinia instance
const app = createApp(App);

app.use(pinia); // ✅ Register Pinia before using stores
app.use(router);
app.component("v-select", VueSelect); 
app.mount('#app'); // ✅ Make sure this is the last call