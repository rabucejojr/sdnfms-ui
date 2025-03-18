<script setup>
defineProps({
  bg: {
    type: String,
    default: "bg-blue-500",
    required: false,
  },
  image: {
    type: String,
    default: "https://placehold.co/300x200", // Placeholder image
    required: false,
  },
});
</script>

<template>
  <div :class="`${bg} text-white p-4 rounded shadow`">
    <!-- Image Placeholder -->
    <img :src="image" alt="Image" class="w-full h-40 object-cover rounded-md mb-4" />

    <slot></slot>
  </div>
</template>
