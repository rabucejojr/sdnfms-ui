<script setup>
import Login from './fms/Auth/Login.vue';
import Register from './fms/Auth/Register.vue';
import Dashboard from './fms/Pages/Dashboard.vue';
import Update from './fms/Pages/Update.vue';
import Navbar from '@/components/Navbar.vue'
import './assets/base.css'
import Header from './components/Header.vue';

</script>

<template>
   <!-- <Navbar/>  
   <Header pos="mt-12 "/> -->
  <router-view/>
</template>

