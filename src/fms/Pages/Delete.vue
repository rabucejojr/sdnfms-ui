<script setup>
// Import required components and libraries
import Modal from '@/components/Modal.vue';
import Button from '@/components/Button.vue';
import { RiCloseFill } from '@remixicon/vue'; // Icon for close button
import axios from 'axios';
import { ref } from 'vue';

// Define props with validation
const props = defineProps({
  isOpen: { type: Boolean, required: true }, // Controls modal visibility
  file: {
    type: Object,
    required: true,
    default: () => ({
      id: null,
      filename: '',
    }),
    // File object containing details of file to be deleted
  },
  fetchRecentFiles: {
    type: Function,
    required: true,
  },
});

// State management
const showSuccessModal = ref(false); // Controls visibility of success confirmation

// Event handling setup
const emit = defineEmits(['close', 'delete-complete']);
const closeModal = () => emit('close');

// Fetch updated file list after deletion
const fetchFiles = async () => {
  try {
    const response = await axios.get(process.env.API);
    return response.data.files;
  } catch (error) {
    console.error('Error fetching files:', error);
    return [];
  }
};

const API = process.env.API;

/**
 * Handles the file deletion process
 * Makes API call to delete file and shows success/error feedback
 */
const handleDelete = async () => {
  try {
    // Make DELETE request to API
    const response = await axios.delete(`${API}/${props.file.id}`);
    
    if (response.status === 200) {
      // Fetch updated file list
      const updatedFiles = await fetchFiles();
      
      // Close main modal and notify parent of successful deletion with updated files
      closeModal();
      emit('delete-complete', true, updatedFiles);
      
      // Show success modal briefly
      showSuccessModal.value = true;
      setTimeout(() => {
        props.fetchRecentFiles();
        showSuccessModal.value = false;
      }, 1500);
    }
  } catch (error) {
    // Handle error case
    alert('Failed to delete file.');
    console.error(error);
    emit('delete-complete', false);
  }
};
</script>

<template>
  <!-- Main modal overlay -->
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50"
  >
    <!-- Confirmation modal -->
    <Modal :isOpen="isOpen" title="Confirm Deletion" @close="closeModal">
      <!-- Modal header with close button -->
      <template #header>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
          <RiCloseFill />
        </button>
      </template>

      <!-- Modal body with confirmation message -->
      <template #body>
        <p class="text-gray-700">
          Are you sure you want to delete "{{ file.filename }}"? This action cannot be undone.
        </p>
      </template>

      <!-- Modal footer with action buttons -->
      <template #footer>
        <Button
          @click="handleDelete"
          bg="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          Delete
        </Button>
        <Button
          @click="closeModal"
          bg="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded"
        >
          Cancel
        </Button>
      </template>
    </Modal>

    <!-- Success feedback modal -->
    <Modal v-if="showSuccessModal" :isOpen="showSuccessModal" title="Success">
      <template #body>
        <div class="text-center">
          <p class="text-green-600 font-medium">File deleted successfully!</p>
        </div>
      </template>
    </Modal>
  </div>
</template>
