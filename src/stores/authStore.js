import { defineStore } from 'pinia';
import api from '@/api/axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
  }),

  actions: {
    async register(userData) {
      try {
        const response = await api.post('/register', userData);
        
        // Store both token and user data
        this.setAuthData(response.data.token, response.data.user);
        
        return response;
      } catch (error) {
        throw error.response.data;
      }
    },

    async login(credentials) {
      try {
        const response = await api.post('/login', credentials);
        this.setAuthData(response.data.token, response.data.user);
        return response;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },    

    async logout() {
      try {
        if (!this.token) {
          throw new Error("No token found! You are already logged out.");
        }
    
        await api.post('/logout', {}, {
          headers: { Authorization: `Bearer ${this.token}` }
        });
    
        this.clearAuthData();
      } catch (error) {
        console.error("Logout Error:", error.response?.data || error.message);
      }
    },    

    setAuthData(token, user) {
      this.token = token;
      this.user = user;
      
      // Store token and user in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    
      // Set token in API headers
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    },

    clearAuthData() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user'); // Fix: Also remove user data
      delete api.defaults.headers.common['Authorization'];
    }
    
  }
});
