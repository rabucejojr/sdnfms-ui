import {createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import Login from '@/Auth/Login.vue';
import Register from '@/Auth/Register.vue';
import dmsDashboard from '@/dms/Pages/Dashboard.vue';
import Home from '@/fms/Pages/Home.vue';
import Main from '@/MainDashboard.vue';


const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  {
    path: '/main',
    component: Main, meta:{requiresAuth: true},
  },
  {
    path: '/home',
    component: Home, meta:{requiresAuth: true},
  },
  {path: '/dms', component: dmsDashboard, meta:{requiresAuth: true}},
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation Guard to Protect Routes
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.token) {
    next("/login");
  } else {
    next();
  }
});

export default router;