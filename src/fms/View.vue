<script setup>
// Props
const props = defineProps({
  isOpen: { type: Boolean, required: true },
  file: {
    type: Object,
    required: true,
    default: () => ({
      name: '',
      owner: '',
      date: '',
    }),
  },
});

// Emit event to close the modal
const emit = defineEmits(['close']);
const closeModal = () => emit('close');
</script>

<template>
    <div v-if="isOpen" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
        <div class="bg-white rounded-lg shadow-lg w-1/3 max-w-lg">
        <!-- Modal Header -->
            <div class="flex justify-between items-center border-b px-6 py-4">
                <h2 class="text-lg font-semibold text-gray-800">File Details</h2>
                <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                </button>
            </div>

            <!-- Modal Body -->
            <div class="px-6 py-4 space-y-4">
                <div>
                <h4 class="text-gray-700 font-medium">File Name:</h4>
                <p class="text-gray-800">{{ file.name }}</p>
                </div>
                <div>
                <h4 class="text-gray-700 font-medium">Owner:</h4>
                <p class="text-gray-800">{{ file.owner }}</p>
                </div>
                <div>
                <h4 class="text-gray-700 font-medium">Date Uploaded:</h4>
                <p class="text-gray-800">{{ file.date }}</p>
                </div>
            </div>

            <!-- Modal Footer -->
            <div class="flex justify-end border-t px-6 py-4">
                <button
                @click="closeModal"
                class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                >
                Close
                </button>
            </div>
        </div>
    </div>
</template>
  