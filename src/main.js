import './assets/main.css'
import router from './fms/Router/router.js'

import { createApp } from 'vue'
import App from './App.vue'

createApp(App).use(router).mount('#app')
