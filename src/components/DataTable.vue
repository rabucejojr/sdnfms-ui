<script setup>
import { computed } from "vue";
import Button from "./Button.vue";
const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
  goToPage: {
    type: Function,
    required: true,
  },
  pageSize: {
    type: Number,
    default: 10, // Default items per page
  },
});

// Ensure items is always an array to prevent errors
const paginatedItems = computed(() => {
  if (!Array.isArray(props.items)) return []; // Handle undefined/null cases
  const start = (props.currentPage - 1) * props.pageSize;
  return props.items.slice(start, start + props.pageSize);
});
</script>

<template>
  <div class="overflow-x-auto">
    <table class="w-full border-collapse">
      <thead>
        <tr class="bg-gray-200 text-gray-700 text-sm sm:text-base">
          <slot name="header"></slot>
          <!-- Custom Header Slot -->
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in paginatedItems"
          :key="item.id"
          class="odd:bg-white even:bg-gray-50 text-sm sm:text-base"
        >
          <slot name="row" :item="item"></slot>
        </tr>
      </tbody>
    </table>

    <!-- Pagination Controls -->
    <div class="flex flex-wrap justify-center items-center space-x-2 mt-4">
      <Button
        class="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 disabled:bg-gray-200"
        :disabled="currentPage === 1"
        @click="goToPage(currentPage - 1)"
      >
        Previous
      </Button>

      <Button
        v-for="page in totalPages"
        :key="page"
        @click="goToPage(page)"
        class="px-4 py-2 rounded"
        :class="{
          'bg-blue-500 text-white': page === currentPage,
          'bg-gray-300 hover:bg-gray-400': page !== currentPage,
        }"
      >
        {{ page }}
      </Button>

      <Button
        class="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 disabled:bg-gray-200"
        :disabled="currentPage === totalPages"
        @click="goToPage(currentPage + 1)"
      >
        Next
      </Button>
    </div>
  </div>
</template>
