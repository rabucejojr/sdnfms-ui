<script setup>
import { ref } from "vue";
import {RiMenuFill} from '@remixicon/vue';

// State for toggling the mobile menu
const isMenuOpen = ref(false);

// Toggle function
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};
</script>

<style scoped>
/* Optional styles for transitions */
nav div {
  transition: all 0.3s ease-in-out;
}
</style>

<template>
  <nav class="bg-blue-500 text-white p-4 fixed top-0 w-full z-10">
    <div class="container mx-auto flex justify-between items-center">
      <!-- Logo -->
      <div class="text-xl font-bold">
        <router-link to="/" class="hover:underline">DOST SDN FMS</router-link>
      </div>

      <!-- Hamburger Menu (Mobile) -->
      <button
        class="block lg:hidden text-white focus:outline-none"
        @click="toggleMenu"
      >
      <RiMenuFill/>
      </button>

      <!-- Navigation Links -->
      <div
        :class="[
          'absolute lg:static top-16 left-0 w-full lg:w-auto bg-gray-300 lg:bg-transparent lg:flex lg:items-center space-y-4 lg:space-y-0 lg:space-x-6',
          isMenuOpen ? 'block' : 'hidden',
        ]"
      >
        <router-link
          to="/register"
          class="block lg:inline hover:underline px-4 lg:px-0"
          exact
        >
          Register
        </router-link>
        <router-link
          to="/login"
          class="block lg:inline hover:underline px-4 lg:px-0"
        >
          Login
        </router-link>
        <router-link
          to="/dashboard"
          class="block lg:inline hover:underline px-4 lg:px-0"
        >
          Dashboard
        </router-link>
      </div>
    </div>
  </nav>
</template>
