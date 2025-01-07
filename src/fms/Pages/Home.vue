<script setup>
import Header from '@/components/Header.vue';
import Navbar from '@/components/Navbar.vue';
import Dashboard from './Dashboard.vue';
</script>

<template>
    <!-- <Navbar/>  
    <Header pos="mt-12 "/>
    <Dashboard/> -->
    <Dashboard/>
    <router-view/>
</template>