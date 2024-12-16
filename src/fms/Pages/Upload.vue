<script setup>
import Modal from '@/components/Modal.vue';
import { ref, watch } from 'vue';
import Button from '@/components/Button.vue';
import axios from 'axios';

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
// const file = ref([]);
const file = ref(null);
const uploader = ref('');
const category = ref('');
const date = ref('');
const isUploadModalOpen = ref(false);

// Handle file selection
const onFileChange = (event) => {
  file.value = event.target.files[0]; // Get the selected file
};


// File Upload using API
const handleUpload = async () => {
  if (!file.value) {
    alert('Please select a file before uploading.');
    return;
  }

  // Create FormData instance to send data
  const formData = new FormData();

  // For single file upload
  formData.append('file', file.value);
  formData.append('uploader', uploader.value);
  formData.append('category', category.value);
  formData.append('date', date.value);
  
  try {
    // Make POST request to the API endpoint
    const response = await axios.post('http://127.0.0.1:8000/api/files', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
      },
    });
    if (response.status === 201) {
      // Handle successful upload
      alert('Files uploaded successfully!');
      // Reset the form fields
      file.value = null;
      uploader.value = '';
      category.value = '';
      date.value = '';
    }
  } catch (error) {
    // Handle error
    alert('Failed to upload files.');
    console.error(error);
  }
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
              ref="fileInput"
              @change="onFileChange"
              class="block w-full text-sm text-gray-700 border border-gray-300 rounded p-2"
            />
          </div>
          <div>
            <input
            type="text"
            v-model="uploader"
            id="uploader"
            placeholder="Uploader"
            class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
          </div>
          <div>
            <select
              id="category"
              v-model="category"
              class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
              required
            >
              <option value="" disabled>Category</option>
              <option value="setup">SETUP</option>
              <option value="gia">GIA</option>
              <option value="others">Others</option>
            </select>
          </div>
          <div>
            <input
            type="date"
            v-model="date"
            id="date"
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
    <Upload
        :isOpen="isUploadModalOpen"
        @close="isUploadModalOpen = true"
      />
  </div>
</template>
