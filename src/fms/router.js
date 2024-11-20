import { createMemoryHistory, createRouter } from 'vue-router'

import Login from '../fms/Auth/Login.vue'
import Register from '../fms/Auth/Register.vue'

const routes = [
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: "/", redirect: "/login" }, 
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router;