<script setup>
import Modal from '@/components/Modal.vue';
import Button from '@/components/Button.vue';
import { RiCloseFill } from '@remixicon/vue';
import axios from 'axios';
import { ref } from 'vue';

// Props
const props = defineProps({
  isOpen: { type: Boolean, required: true },
  file: {
    type: Object,
    required: true,
    default: () => ({
      id: null,
      filename: '',
    }),
  },
});

// Modal states
const showSuccessModal = ref(false);

// Emit event to close the modal
const emit = defineEmits(['close', 'delete-complete']);
const closeModal = () => emit('close');

// Handle file deletion
const handleDelete = async () => {
  try {
    const response = await axios.delete(`http://127.0.0.1:8000/api/files/${props.file.id}`);
    
    if (response.status === 200) {
      showSuccessModal.value = true;
      emit('delete-complete', true);
      setTimeout(() => {
        showSuccessModal.value = false;
        closeModal();
      }, 2000);
    }
  } catch (error) {
    alert('Failed to delete file.');
    console.error(error);
    emit('delete-complete', false);
  }
};
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50"
  >
    <Modal :isOpen="isOpen" title="Confirm Deletion" @close="closeModal">
      <template #header>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
          <RiCloseFill />
        </button>
      </template>

      <template #body>
        <p class="text-gray-700">
          Are you sure you want to delete "{{ file.filename }}"? This action cannot be undone.
        </p>
      </template>

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

    <!-- Success Modal -->
    <Modal v-if="showSuccessModal" :isOpen="showSuccessModal" title="Success">
      <template #body>
        <div class="text-center">
          <p class="text-green-600 font-medium">File deleted successfully!</p>
        </div>
      </template>
    </Modal>
  </div>
</template>
