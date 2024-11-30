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

        <Modal :isOpen="isOpen" title="File Update" @close="closeModal">
            <template #header>
                <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
                  <RiCloseFill />
                </button>
            </template>
            <template #body>
                <!-- Modal Body -->
                <div class="space-y-4">
                    <div>
                    <input type="file" class="text-gray-700 font-medium"/>
                    <!-- <input type="file"class="text-gray-800">{{ file.name }}</input> -->
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
                    bg="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
                    >
                    Update
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
    </div>
</template>
  