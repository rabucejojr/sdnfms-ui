import axios from 'axios';
const API = import.meta.env.VITE_API;
const api = axios.create({
  // baseURL: 'http://127.0.0.1:8000/api/users', // Adjust to match Laravel API
  baseURL: `${API}/users`, // Adjust to match Laravel API
  headers: {
    'Accept': 'application/json',
  },
});

export default api;