<script setup>
import { ref } from "vue";
import Modal from "@/components/Modal.vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";

const router = useRouter();
const authStore = useAuthStore();

// Reactive state
const name = ref("");
const email = ref("");
const password = ref("");
const conf_password = ref("");
const errorMessage = ref("");
const isLoading = ref(false);

// Modal states
const isModalOpen = ref(false);
const modalTitle = ref("");
const modalMessage = ref("");

// Form submission handler
const registerUser = async () => {
  isLoading.value = true;
  errorMessage.value = "";

  try {
    await authStore.register({
      name: name.value,
      email: email.value,
      password: password.value,
    });

    alert("User registered successfully!");
    router.push("/login"); // Redirect to login page after success
  } catch (error) {
    errorMessage.value = error.message || "Registration failed.";
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-6">
    <div class="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg border border-gray-200">
      <h2 class="text-3xl font-bold text-center text-gray-900 mb-6">Create an Account</h2>

      <form @submit.prevent="registerUser">
        <div class="mb-4">
          <label for="name" class="block text-gray-700 font-medium mb-2">Full Name</label>
          <input
            v-model="name"
            type="text"
            id="name"
            placeholder="Enter your full name"
            class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
            required
          />
        </div>

        <div class="mb-4">
          <label for="email" class="block text-gray-700 font-medium mb-2">Email Address</label>
          <input
            v-model="email"
            type="email"
            id="email"
            placeholder="Enter your email"
            class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
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
            class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
            required
          />
        </div>

        <div class="mb-4">
          <label for="conf_password" class="block text-gray-700 font-medium mb-2">Confirm Password</label>
          <input
            v-model="conf_password"
            type="password"
            id="conf_password"
            placeholder="Retype your password"
            class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
            required
          />
        </div>

        <div class="mt-6 flex flex-col sm:flex-row items-center gap-3">
          <button
            type="submit"
            class="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition duration-200 w-full sm:w-auto flex-1 text-center"
          >
            {{ isLoading ? "Registering..." : "Register" }}
          </button>
          
          <router-link
            to="/login"
            class="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition duration-200 w-full sm:w-auto flex-1 text-center"
          >
            Login
          </router-link>
        </div>
      </form>

      <!-- Modal -->
      <Modal :isOpen="isModalOpen" :title="modalTitle" @close="isModalOpen = false">
        <template #body>
          <p class="text-gray-700">{{ modalMessage }}</p>
        </template>
        <template #footer>
          <button
            @click="isModalOpen = false"
            class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Close
          </button>
        </template>
      </Modal>
    </div>
  </div>
</template>
