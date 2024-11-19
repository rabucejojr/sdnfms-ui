<script setup>
import DOSTLogo from '@/components/icons/DOSTLogo.vue'
import PrimaryButton from '@/components/PrimaryButton.vue'
</script>

<template>
  <div>
    <DOSTLogo/>
    <input type="text" name="username" id="username">
    <input type="password" name="password" id="password">
    <PrimaryButton class="bg-sky-500 rounded-lg px-4 py-2 w-full text">Login</PrimaryButton>

  </div>
</template>