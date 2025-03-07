<script setup>
import { RiSearchLine } from "@remixicon/vue";
import { ref } from "vue";

const props = defineProps({
  searchQuery: {
    type: Function,
    required: true,
  },
  placeholder: {
    type: String,
    required: false,
    default: "Search...",
  },
  api: {
    type: String,
    required: false,
});

// Local state for search input
const query = ref("");


// Emit search query changes
const handleInput = () => {
  props.searchQuery(query.value); // Call the function prop with the input value
};
</script>
<template>
  <!-- Search Input with Icon -->
  <div class="relative">
    <input
      searchQuery="searchQuery"
      v-model="query"
      @input="handleInput"
      type="text"
      :placeholder="placeholder"
      class="px-4 py-2 pl-10 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none w-full"
    />
    <RiSearchLine
      class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
      size="20"
    />
  </div>
</template>
