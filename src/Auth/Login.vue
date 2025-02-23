<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router";
import Modal from "@/components/Modal.vue";

// Modal state
const authStore = useAuthStore();
const router = useRouter();
const email = ref("");
const password = ref("");
const errorMessage = ref("");
const isModalOpen = ref(false);
const modalTitle = ref("");
const modalMessage = ref("");

const login = async () => {
  try {
    await authStore.login({ email: email.value, password: password.value });
    router.push("/home");
  } catch (error) {
    errorMessage.value = error.message || "Login failed!";
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-6">
    <div class="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg border border-gray-200">
      <h2 class="text-3xl font-bold text-center text-gray-900 mb-6">PSTO-SDN FMS</h2>
      
      <form @submit.prevent="login">
        <div class="mb-4">
          <label for="email" class="block text-gray-700 font-medium mb-2">Email</label>
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

        <div class="mt-6 flex flex-col sm:flex-row items-center gap-3">
          <button
            type="submit"
            class="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-200 w-full sm:w-auto flex-1 text-center"
          >
            Login
          </button>
          
          <router-link
            to="/register"
            class="bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition duration-200 w-full sm:w-auto flex-1 text-center"
          >
            Register
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
