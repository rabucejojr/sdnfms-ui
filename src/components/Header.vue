<script setup>
import { ref, onMounted } from 'vue';

const currentDateTime = ref('');

defineProps({
    pos:{type:String,default:'mt-4'},
})

const updateDateTime = () => {
  currentDateTime.value = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Manila',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

// Initialize and keep updating the time every second
onMounted(() => {
  updateDateTime();
  setInterval(updateDateTime, 1000);
});
</script>

<template>
    <header :class="`${pos} bg-white-800 text-black p-4`">
      <div class="container mx-auto flex justify-between items-center">
        <!-- Logo and Text -->
        <div class="flex items-center space-x-4">
          <img
            src="@/assets/dostlogo.png"
            alt="DOST Logo"
              style="width: 100px; height: 100px;"
  class="rounded"
          />
          <div>
            <h1 class="font-bold uppercase text-sm">Republic of the Philippines</h1>
            <h2 class="text-lg font-bold">Department of Science and Technology</h2>
            <h3 class="text-blue-500 text-xl font-semibold">PSTO - Surigao del Norte</h3>
          </div>
        </div>
  
        <!-- Date and Time -->
        <div class="text-right text-sm">
          <p>Philippine Standard Time:</p>
          <p>{{ currentDateTime }}</p>
        </div>
      </div>
    </header>
  </template>
  

  