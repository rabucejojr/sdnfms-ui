import { createMemoryHistory, createRouter } from 'vue-router'
import Login from '../Auth/Login.vue';
import Register from '../Auth/Register.vue';
import Dashboard from '../Pages/Dashboard.vue';

const routes = [
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/dashboard', component: Dashboard, props:{padding: 'mt-2'} }, 
  { path: "/", redirect: "/login" }, 
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router;