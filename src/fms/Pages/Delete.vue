<script setup>
import Modal from '@/components/Modal.vue';
import Button from '@/components/Button.vue';
import { RiCloseFill } from '@remixicon/vue';

// Props
const props = defineProps({
  isOpen: { type: Boolean, required: true },
});

// Emit event to close the modal
const emit = defineEmits(['close']);
const closeModal = () => emit('close');
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
          Are you sure you want to delete this file? This action cannot be undone.
        </p>
      </template>

      <template #footer>
        <Button
          bg="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          Yes
        </Button>
        <Button
          @click="closeModal"
          bg="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded"
        >
          Close
        </Button>
      </template>
    </Modal>
  </div>
</template>
