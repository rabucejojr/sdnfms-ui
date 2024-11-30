<script setup>

import { ref } from 'vue';
const isMenuOpen = ref(false);
</script>

<template>
    <nav class="bg-blue-500 text-white p-4">
      <div class="container mx-auto flex justify-between items-center">
        <!-- Brand -->
        <div class="text-xl font-bold">
          <router-link to="/">DOST-SDN FMS</router-link>
        </div>
  
        <!-- Hamburger Menu (for smaller screens) -->
        <button
          class="lg:hidden text-white focus:outline-none"
          @click="isMenuOpen = !isMenuOpen"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
  
        <!-- Navigation Links -->
        <div
          class="hidden lg:flex space-x-6"
          :class="{ 'block': isMenuOpen, 'hidden': !isMenuOpen }"
        >
          <router-link
            to="/login"
            class="hover:underline"
            @click="isMenuOpen = false"
          >
            Login
          </router-link>
          <router-link
            to="/register"
            class="hover:underline"
            @click="isMenuOpen = false"
          >
            Register
          </router-link>
          <router-link
            to="/dashboard"
            class="hover:underline"
            @click="isMenuOpen = false"
          >
            Dashboard
          </router-link>
        </div>
      </div>
    </nav>
  </template>
  
