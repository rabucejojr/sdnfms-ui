<script setup>
import Button from '@/components/Button.vue';
import Modal from '@/components/Modal.vue';
import { RiCloseFill } from '@remixicon/vue';

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

        <Modal isOpen title="File Details" closeModal="closeModal">
            <template #header>
                <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
                  <RiCloseFill />
                </button>
            </template>
            <template #body>
                <!-- Modal Body -->
                <div class="space-y-4">
                    <div>
                    <h4 class="text-gray-700 font-medium">File Name:</h4>
                    <p class="text-gray-800">{{ file.name }}</p>
                    </div>
                    <div>
                    <h4 class="text-gray-700 font-medium">Owner:</h4>
                    <p class="text-gray-800">{{ file.uploadedBy }}</p>
                    </div>
                    <div>
                    <h4 class="text-gray-700 font-medium">Date Uploaded:</h4>
                    <p class="text-gray-800">{{ file.date }}</p>
                    </div>
                </div>
            </template>
            <template #footer>
                <!-- Modal Footer -->
                    <Button
                    variant="primary"
                    >
                    Update
                    </Button>
                    <Button
                    @click="closeModal"
                    variant="danger"
                    >
                    Close
                    </Button>       
            </template>
        </Modal>

        <!-- Modal Header -->





        </div>
    </div>
</template>
  