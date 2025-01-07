<script setup>
import Button from '@/components/Button.vue';
import Modal from '@/components/Modal.vue';
import { RiCloseFill } from '@remixicon/vue';
import { ref, watch } from 'vue';
import axios from 'axios';

// Props
const props = defineProps({
  isOpen: { 
    type: Boolean, 
    required: true 
  },
  data: {
    type: Object,
    required: true,
    default: () => ({
      filename: '',
      uploader: '',
      category: '',
      date: '',
    }),
  },
  fetchRecentFiles: {
    type: Function,
    required: true,
  },
});

// Emit event to close the modal
const emit = defineEmits(['close', 'update-complete']);
const closeModal = () => emit('close');

// Reactive form data initialized with the prop
const formData = ref({ ...props.data });

// Reactive variables for file data
const file = ref(null);
const uploader = ref(formData.value.uploader);
const category = ref(formData.value.category);
const date = ref(formData.value.date);
const showSuccessModal = ref(false);
const showErrorModal = ref(false);

// Watch for changes in props.data and update formData
watch(
  () => props.data, 
  (newData) => {
    formData.value = { ...newData };
  }, 
  { deep: true }
);

// Handle file selection
const onFileChange = (event) => {
  file.value = event.target.files[0]; // Get the selected file
};

// File Update using API
const handleUpdate = async () => {
  const formData = new FormData();

  // Only append file if one was selected
  if (file.value) {
    formData.append('file', file.value);
  }

  formData.append('uploader', uploader);
  formData.append('category', category);
  formData.append('date', date);
  formData.append('_method', 'PUT');
  
  try {
    // Make POST request to the API endpoint
    const response = await axios.post(`http://192.168.1.13:8000/api/files/${props.data.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
      },
    });

    if (response.status === 200) {
      // Reset form and show success message
      file.value = null;
      formData.value = {
        filename: '',
        uploader: '',
        category: '',
        date: '',
      };

      // Close main modal and show success message
      closeModal();
      setTimeout(() => {
      props.fetchRecentFiles();
      }, 500);
      showSuccessModal.value = true;
      emit('update-complete', true);

      // Auto hide success message after delay
      setTimeout(() => {
        showSuccessModal.value = false;
      }, 1500);
    }

  } catch (error) {
    // Show error message
    showErrorModal.value = true;
    setTimeout(() => {
      showErrorModal.value = false;
    }, 1500);
    console.error(error);
    emit('update-complete', false);
  }
};
</script>

<template>
  <div 
    v-if="isOpen" 
    class="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50"
  >
    <div class="bg-white rounded-lg shadow-lg w-1/3 max-w-lg">
      <Modal :isOpen="isOpen" title="File Update" @close="closeModal">
        <template #header>
          <button 
            @click="closeModal" 
            class="text-gray-400 hover:text-gray-600"
          >
            <RiCloseFill />
          </button>
        </template>

        <template #body>
          <!-- Modal Body -->
          <form @submit.prevent="handleUpdate" class="space-y-4">
            <div>
              <input
                type="file"
                id="file"
                @change="onFileChange"
                class="block w-full text-sm text-gray-700 border border-gray-300 rounded p-2"
              />
            </div>

            <div>
              <input
                type="text"
                id="uploader"
                v-model="formData.uploader"
                placeholder="Uploader"
                class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>

            <div>
              <select
                id="category"
                v-model="formData.category"
                class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
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
                id="date"
                v-model="formData.date"
                placeholder=""
                class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>
          </form>
        </template>

        <template #footer>
          <!-- Modal Footer -->
          <Button 
            @click="handleUpdate"
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

    <!-- Success Modal -->
    <Modal v-if="showSuccessModal" :isOpen="showSuccessModal" title="Success">
      <template #body>
        <div class="text-center">
          <p class="text-green-600 font-medium">File updated successfully!</p>
        </div>
      </template>
    </Modal>

    <!-- Error Modal -->
    <Modal v-if="showErrorModal" :isOpen="showErrorModal" title="Error">
      <template #body>
        <div class="text-center">
          <p class="text-red-600 font-medium">Failed to update file!</p>
        </div>
      </template>
    </Modal>
  </div>
</template>