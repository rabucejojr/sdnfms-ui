<script setup>
import { ref } from "vue";

// Reactive state
const name = ref("");
const email = ref("");
const password = ref("");

// Form submission handler
const handleSubmit = () => {
if (!name.value || !email.value || !password.value) {
    alert("Please fill in all fields!");
    return;
}

console.log("Name:", name.value);
console.log("Email:", email.value);
console.log("Password:", password.value);
alert("Registration submitted!");
};
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="w-full max-w-md p-6 bg-white rounded shadow-md">
        <h2 class="text-2xl font-bold text-center mb-6">Account Registration</h2>
        <form @submit.prevent="handleSubmit">
          <div class="mb-4">
            <label for="name" class="block text-gray-700 font-medium mb-2">Name</label>
            <input
              v-model="name"
              type="text"
              id="name"
              placeholder="Enter your name"
              class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>
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
                    class="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 focus:outline-none focus:ring focus:ring-blue-300 flex-1 sm:w-40 text-center w-2/3 flex justify-center items-center"
                    >
                    Register
                </button>
                <router-link
                    to="/login"
                    class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 flex-1 sm:w-40 w-2/3 flex justify-center items-center"
                    >
                    Login
                </router-link>
            </div>
        </form>
      </div>
    </div>
</template>
  