<script setup>
import Modal from '@/components/Modal.vue';
import { ref, watch } from 'vue';

// Props to control modal visibility and pass initial data
const props = defineProps({
  isOpen: { type: Boolean, required: true },
});

// Emit events to notify parent component
const emit = defineEmits(['close', 'upload']);

// Close modal
const closeModal = () => {
  emit('close');
};

// Reactive variable to handle file data
const file = ref(null);

// Handle file selection
const onFileChange = (event) => {
  file.value = event.target.files[0] || null; // Get the selected file
};

// Handle upload logic
const handleUpload = () => {
  if (!file.value) {
    alert('Please select a file before uploading.');
    return;
  }

  // Emit file data to the parent component
  emit('upload', file.value);

  alert(`File "${file.value.name}" uploaded successfully.`);
  file.value = null; // Reset file after upload
  closeModal(); // Automatically close modal after upload
};
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50"
  >
    <div class="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 sm:mx-auto">
      <!-- Header -->
      <div class="flex justify-between items-center border-b px-4 py-3">
        <h2 class="text-lg font-semibold text-gray-800">Upload a File</h2>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Body -->
      <div class="px-6 py-4">
        <!-- File Input -->
        <form @submit.prevent="handleUpload" class="space-y-4">
          <div>
            <label for="file" class="block text-gray-700 font-medium mb-2">Choose a file:</label>
            <input
              type="file"
              id="file"
              @change="onFileChange"
              class="block w-full text-sm text-gray-700 border border-gray-300 rounded p-2"
            />
          </div>

          <!-- File Preview -->
          <div v-if="file" class="border rounded p-4 bg-gray-50">
            <p><strong>File Name:</strong> {{ file.name }}</p>
            <p><strong>File Size:</strong> {{ (file.size / 1024).toFixed(2) }} KB</p>
            <p><strong>File Type:</strong> {{ file.type }}</p>
          </div>
          <div>
            <h4 class="text-gray-700 font-medium">Owner:</h4>
            <p class="text-gray-800"></p>
          </div>
          <div>
            <h4 class="text-gray-700 font-medium">Date Uploaded:</h4>
            <p class="text-gray-800"></p>
          </div>
        </form>
      </div>

      <!-- Footer -->
      <div class="flex justify-end border-t px-4 py-3">
        <button
          @click="closeModal"
          class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Close
        </button>
        <button
          type="submit"
          @click="handleUpload"
          class="bg-blue-500 text-white px-4 py-2 ml-2 rounded hover:bg-blue-600 transition"
        >
          Upload
        </button>
      </div>
    </div>
  </div>
</template>
