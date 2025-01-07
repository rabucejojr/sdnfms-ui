<script setup>
// Import required components and libraries
import Modal from '@/components/Modal.vue';
import Button from '@/components/Button.vue';
import { ref } from 'vue';
import axios from 'axios';

// Define props for modal visibility control
const props = defineProps({
  isOpen: { 
    type: Boolean, 
    required: true 
  },
  fetchRecentFiles: {
    type: Function,
    required: true,
  },
});

// Define emitted events for parent component communication
const emit = defineEmits(['close', 'upload', 'upload-complete']);

// Handler to close the modal and notify parent
const closeModal = () => {
  emit('close');
};

// Initialize reactive form data variables
const file = ref(null);
const uploader = ref('');
const category = ref('');
const date = ref('');
const showSuccessModal = ref(false);
const showErrorModal = ref(false);

// Handle file input change event
const onFileChange = (event) => {
  file.value = event.target.files[0];
};

// Main file upload handler
const handleUpload = async () => {
  // Validate file selection
  if (!file.value) {
    alert('Please select a file before uploading.');
    return;
  }

  // Check if file already exists
  try {
    const checkResponse = await axios.get('http://127.0.0.1:8000/api/files');
    const existingFiles = checkResponse.data.files;
    
    const fileExists = existingFiles.some(existingFile => 
      existingFile.filename === file.value.name
    );

    if (fileExists) {
      showErrorModal.value = true;
      setTimeout(() => {
        showErrorModal.value = false;
      }, 1500);
      return;
    }
  } catch (error) {
    console.error('Error checking existing files:', error);
  }

  // Prepare form data for API request
  const formData = new FormData();
  formData.append('file', file.value);
  formData.append('uploader', uploader.value);
  formData.append('category', category.value);
  formData.append('date', date.value);
  
  try {
    // Send POST request to API endpoint
    const response = await axios.post('http://192.168.1.13:8000/api/files', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
      },
    });

    if (response.status === 200) {
      // Reset form fields after successful upload
      file.value = null;
      uploader.value = '';
      category.value = '';
      date.value = '';

      closeModal();
      showSuccessModal.value = true;

      // Notify parent of success and auto-hide success modal
      emit('upload-complete', true);
      setTimeout(() => {
        props.fetchRecentFiles();
        showSuccessModal.value = false;
      }, 1500);
    }
  } catch (error) {
    // Handle upload failure with custom modal
    showErrorModal.value = true;
    setTimeout(() => {
      showErrorModal.value = false;
    }, 1500);
    console.error(error);
    emit('upload-complete', false);
  }
};
</script>

<template>
  <!-- Main modal overlay -->
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50"
  >
    <!-- Modal container -->
    <div class="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 sm:mx-auto">
      <!-- Modal header with title and close button -->
      <div class="flex justify-between items-center border-b px-6 py-3">
        <h2 class="text-lg font-semibold text-gray-800">Upload</h2>
        <button 
          @click="closeModal" 
          class="text-gray-400 hover:text-gray-600"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            class="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        </button>
      </div>

      <!-- Modal body with upload form -->
      <div class="px-6 py-4">
        <form @submit.prevent="handleUpload" class="space-y-4">
          <!-- File input field -->
          <div>
            <input
              type="file"
              id="file"
              @change="onFileChange"
              class="block w-full text-sm text-gray-700 border border-gray-300 rounded p-2"
            />
          </div>

          <!-- Uploader name input -->
          <div>
            <input
              type="text"
              id="uploader"
              v-model="uploader"
              placeholder="Uploader"
              class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>

          <!-- Category selection dropdown -->
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

          <!-- Date input field -->
          <div>
            <input
              type="date"
              id="date"
              v-model="date"
              class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>
        </form>
      </div>

      <!-- Modal footer with action buttons -->
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

  <!-- Success notification modal -->
  <Modal v-if="showSuccessModal" :isOpen="showSuccessModal" title="Success">
    <template #body>
      <div class="text-center">
        <p class="text-black-600 font-semibold">File uploaded successfully!</p>
      </div>
    </template>
  </Modal>
</template>
