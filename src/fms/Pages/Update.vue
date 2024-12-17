<script setup>
import Button from '@/components/Button.vue';
import Modal from '@/components/Modal.vue';
import { RiCloseFill } from '@remixicon/vue';
import { ref, watch } from 'vue';

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
});

// Emit event to close the modal
const emit = defineEmits(['close']);
const closeModal = () => emit('close');

// Reactive form data initialized with the prop
const formData = ref({ ...props.data });

// Reactive variables for file data
const file = ref(null);
const uploader = ref(formData.value.uploader);
const category = ref(formData.value.category);
const date = ref(formData.value.date);

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
  if (!file.value) {
    alert('Please select a file before uploading.');
    return;
  }

  // For single file upload
  formData.append('file', file.value);
  formData.append('uploader', uploader.value);
  formData.append('category', category.value);
  formData.append('date', date.value);
  formData.append('_method', 'PUT');
  
  try {
    // Make POST request to the API endpoint
    const response = await axios.post('http://127.0.0.1:8000/api/files', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
      },
    });

    // Handle successful upload
    alert('Files uploaded successfully!');
    
    // Reset the form fields
    file.value = null;
    uploader.value = '';
    category.value = '';
    date.value = '';

  } catch (error) {
    // Handle error
    alert('Failed to update files.');
    console.error(error);
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
                required
              />
            </div>

            <div>
              <select
                id="category"
                v-model="formData.category"
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
                id="date"
                v-model="formData.date"
                placeholder=""
                class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                required
              />
            </div>
          </form>
        </template>

        <template #footer>
          <!-- Modal Footer -->
          <Button bg="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded">
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