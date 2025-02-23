import { createMemoryHistory, createRouter, createWebHistory } from 'vue-router';
import Home from '../Pages/Home.vue';
import { useAuthStore } from '@/stores/authStore';
import Login from '@/Auth/Login.vue';
import Register from '@/Auth/Register.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  {
    path: '/home',
    component: Home,
    beforeEnter: (to, from, next) => {
      const authStore = useAuthStore();
      if (!authStore.token) {
        next('/login'); // Redirect to login if no token exists
      } else {
        next();
      }
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;