import { createMemoryHistory, createRouter } from 'vue-router'
import Login from '../Auth/Login.vue';
import Register from '../Auth/Register.vue';
import Home from '../Pages/Home.vue';

const routes = [
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/home', component: Home }, 
  { path: "/", redirect: "/login" }, 
]

const router = createRouter({
  history: createMemoryHistory(import.meta.env.BASE_URL),
  routes,
})

export default router;