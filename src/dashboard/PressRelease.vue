<script setup>
import Card from "@/components/Card.vue";
import { ref } from "vue";

// Sample press release data
const pressReleases = ref([
  {
    id: 1,
    title: "New Tech Innovation Announced",
    date: "March 18, 2025",
    content: "The latest breakthrough in AI technology has been unveiled...",
    bg: "bg-blue-600",
  },
  {
    id: 2,
    title: "Company Expands Global Presence",
    date: "March 12, 2025",
    content: "A major milestone as the company opens new offices worldwide...",
    bg: "bg-green-600",
  },
  {
    id: 3,
    title: "Sustainability Efforts Strengthened",
    date: "March 5, 2025",
    content: "Our commitment to green energy and sustainability grows...",
    bg: "bg-indigo-600",
  },
]);
</script>

<template>
  <div class="w-full mx-auto p-6">
    <h2 class="text-3xl font-bold text-gray-800 mb-6 text-center">Press Releases</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card v-for="release in pressReleases" :key="release.id" :bg="release.bg">
        <h3 class="text-xl font-semibold">{{ release.title }}</h3>
        <p class="text-sm text-gray-200">{{ release.date }}</p>
        <p class="mt-2 text-gray-100">{{ release.content }}</p>
      </Card>
    </div>
  </div>
</template>
