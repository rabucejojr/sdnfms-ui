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
  <nav class="bg-slate-200 text-black p-3 fixed top-0 w-full z-40">
    <div class="ml-3 mx-auto flex justify-between items-center">
      <!-- Logo -->
      <div class="text-xl font-bold">
        <a href="https://www.gov.ph/" target="_blank" rel="noopener noreferrer">
          GOV.PH
        </a>
      </div>

      <!-- Hamburger Menu (Mobile) -->
      <button
        class="block lg:hidden text-black focus:outline-none"
        @click="toggleMenu"
        aria-label="Toggle navigation menu"
        :aria-expanded="isMenuOpen.toString()"
        type="button"
      >
        <RiMenuFill />
      </button>

      <!-- Navigation Links -->
      <div
        :class="[
          'absolute lg:static top-16 left-0 w-full lg:w-auto bg-stone-400 lg:bg-transparent lg:flex lg:items-center space-y-4 lg:space-y-0 lg:space-x-6 transition-all duration-300',
          isMenuOpen ? 'block' : 'hidden',
        ]"
        @click.self="isMenuOpen = false"
      >
        <router-link
          to="/"
          class="block lg:inline hover:underline px-4 lg:px-0"
          exact
        >
          Home
        </router-link>
        <router-link
          to="/transparency"
          class="block lg:inline hover:underline px-4 lg:px-0"
          exact
        >
          Transparency
        </router-link>
        <router-link
          to="/about"
          class="block lg:inline hover:underline px-4 lg:px-0"
          exact
        >
          About Us
        </router-link>
        <router-link
          to="/contact"
          class="block lg:inline hover:underline px-4 lg:px-0"
          exact
        >
          Contact Us
        </router-link>
        <router-link
          to="/login"
          class="block lg:inline hover:underline px-4 lg:px-0"
        >
          Login
        </router-link>
      </div>
    </div>
  </nav>
</template>
