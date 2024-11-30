<script setup>
import Modal from '@/components/Modal.vue';
import { ref, watch } from 'vue';
import Button from '@/components/Button.vue';

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
      <div class="flex justify-between items-center border-b px-6 py-3">
        <h2 class="text-lg font-semibold text-gray-800">Upload</h2>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Body -->
      <div class="px-6 py-4">
        <!-- File Input -->
        <form @submit.prevent="handleUpload" class="space-y-4 ">
          <div>
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
            <input
            type="text"
            id="owner"
            placeholder="Uploaded By "
            class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
          </div>
          <div>
            <input
            type="date"
            id="owner"
            placeholder=""
            class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
          </div>
        </form>
      </div>

      <!-- Footer -->
      <div class="">
        <div class="flex justify-end space-x-2 px-6 py-3">
          <Button
            type="submit"
            @click="handleUpload"
            bg="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Upload
          </Button>
          <Button
            @click="closeModal"
            bg="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
