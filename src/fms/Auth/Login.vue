<script setup>
import { ref } from "vue";
import {useRouter} from 'vue-router';
import axios from 'axios';


const email = ref("");
const password = ref("");
const router = useRouter();

const handleSubmit = async () => {
  if (!email.value || !password.value) {
    alert("Please fill in all fields!");
}else{
  // // API registration
  // const payload = {
  //       email: email.value,
  //       password: password.value,
  //   };
  // try {
  //   // API call for Login
  //   const response = await axios.post('http://127.0.0.1:8000/api/login', payload);
  //   alert("Login successful: " + response.data.message);
  //   router.push('/home');
  // } catch (error) {
  //   if (error.response) {
  //           // APi response for failed login
  //           alert("Error: " + (error.response.data.message || "Login failed"));
  //       }
  // }
  if (email.value === 'dostsdn@gmail.com' && password.value === 'dost123'){
    // alert("Login successful: ");
    router.push('/home');
  }
}
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4 sm:p-8 ">
    <div class="w-full max-w-md p-6 bg-white rounded-lg shadow-md border">
      <h2 class="text-2xl font-bold text-center mb-2">PSTO-SDN FMS</h2>
      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label for="email" class="block text-gray-700 font-medium mb-2">Email</label>
          <input
            v-model="email"
            type="email"
            id="email"
            placeholder="Enter your email"
            class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>
        <div class="mb-4">
          <label for="password" class="block text-gray-700 font-medium mb-2">Password</label>
          <input
            v-model="password"
            type="password"
            id="password"
            placeholder="Enter your password"
            class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>
        <div class="flex flex-col sm:flex-row items-center mt-6 space-y-3 sm:space-y-0 sm:space-x-2">
          <button
              type="submit"
              class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 flex-1 sm:w-40 w-2/3 flex justify-center items-center"
          >
              Login
          </button>
          <router-link
              to="/register"
              class="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 focus:outline-none focus:ring focus:ring-blue-300 flex-1 sm:w-40 text-center w-2/3 flex justify-center items-center"
          >
              Register
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>