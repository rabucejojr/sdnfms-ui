<script setup>
import Button from "@/components/Button.vue";
import Card from "@/components/Card.vue";
import { ref } from "vue";

// Sample press release data
const pressReleases = ref([
  {
    id: 1,
    title: "New Tech Innovation Announced",
    date: "March 18, 2025",
    content: "The latest breakthrough in AI technology has been unveiled...",
    // bg: "bg-[#5ee9ff]",
    img_placeholder: "https://placehold.co/300x200",
  },
  {
    id: 2,
    title: "Company Expands Global Presence",
    date: "March 12, 2025",
    content: "A major milestone as the company opens new offices worldwide...",
    // bg: "bg-[#5ee9ff]",
    img_placeholder: "https://placehold.co/300x200",
  },
  {
    id: 3,
    title: "Sustainability Efforts Strengthened",
    date: "March 5, 2025",
    content: "Our commitment to green energy and sustainability grows...",
    // bg: "bg-green-200",
    img_placeholder: "https://placehold.co/300x200",
  },
]);

const readMore = () => {
  console.log("Read more clicked");
};
</script>

<template>
  <div class="w-full mx-auto p-6">
    <h2 class="text-3xl font-bold text-gray-800 mb-6 text-center">Press Releases</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card
        v-for="release in pressReleases"
        :key="release.id"
        class="shadow-md p-6 rounded-lg bg-[#54c8f8]"
      >
        <!-- Image Placeholder -->
        <img
          :src="release.img_placeholder"
          alt="Image"
          class="w-full h-40 object-cover rounded-md mb-4"
        />
        <h3 class="text-xl font-semibold text-gray-900">{{ release.title }}</h3>
        <p class="text-sm text-gray-600 mb-2">{{ release.date }}</p>
        <p class="text-gray-800 mb-4">{{ release.content }}</p>
        <Button
          @click="readMore"
          bg="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded flex items-center justify-center"
        >
          <span>Read More</span>
        </Button>
      </Card>
    </div>
  </div>
</template>
