<script setup>
// Import required components and libraries
import Modal from "@/components/Modal.vue";
import Button from "@/components/Button.vue";
import { ref } from "vue";
import axios from "axios";

// Define props for modal visibility control
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  fetchRecentFiles: {
    type: Function,
    required: true,
  },
});

// Define emitted events for parent component communication
const emit = defineEmits(["close", "upload-complete"]);

// Handler to close the modal
const closeModal = () => {
  emit("close");
};

// Initialize reactive form data variables
const selectedCategory = ref(null);
const file = ref(null);
const uploader = ref("");
const date = ref("");
const showSuccessModal = ref(false);
const showErrorModal = ref(false);
const isUploading = ref(false);

const API = import.meta.env.VITE_API;

// Handle file input change event
const onFileChange = (event) => {
  file.value = event.target.files[0];
};

// Category options for vue-select
const categoryOptions = ref([
  { id: 1, label: "SETUP" },
  { id: 2, label: "GIA" },
  { id: 3, label: "Others" },
]);

// Main file upload handler
const handleUpload = async () => {
  if (!file.value) {
    alert("Please select a file before uploading.");
    return;
  }

  isUploading.value = true;
  const selectedCategoryLabel = categoryOptions.value.find(
    (option) => option.id === selectedCategory.value
  )?.label;

  try {
    // Check if file already exists
    const checkResponse = await axios.get(`${API}/files`);
    const existingFiles = checkResponse.data.files;
    if (existingFiles.some((existingFile) => existingFile.filename === file.value.name)) {
      showErrorModal.value = true;
      setTimeout(() => (showErrorModal.value = false), 1500);
      return;
    }
  } catch (error) {
    console.error("Error checking existing files:", error);
  }

  // Prepare form data
  const formData = new FormData();
  formData.append("file", file.value);
  formData.append("uploader", uploader.value);
  formData.append("category", selectedCategoryLabel);
  formData.append("date", date.value);

  try {
    const response = await axios.post(`${API}/files`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
    });

    if (response.status >= 200 && response.status < 300) {
      file.value = null;
      uploader.value = "";
      selectedCategory.value = null;
      date.value = "";

      closeModal();
      showSuccessModal.value = true;
      emit("upload-complete", true);
      props.fetchRecentFiles();
      setTimeout(() => (showSuccessModal.value = false), 1500);
    }
  } catch (error) {
    console.error("Upload failed:", error.response?.data || error.message);
    showErrorModal.value = true;
    setTimeout(() => (showErrorModal.value = false), 1500);
    emit("upload-complete", false);
  } finally {
    isUploading.value = false;
  }
};
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50"
  >
    <div class="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 sm:mx-auto">
      <div class="flex justify-between items-center border-b px-6 py-3">
        <h2 class="text-lg font-semibold text-gray-800">Upload</h2>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
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

      <div class="px-6 py-4">
        <form @submit.prevent="handleUpload" class="space-y-4">
          <input
            type="file"
            @change="onFileChange"
            class="block w-full text-sm text-gray-700 border border-gray-300 rounded p-2"
          />
          <input
            type="text"
            v-model="uploader"
            placeholder="Uploader"
            class="w-full p-2 border border-gray-300 rounded"
            required
          />
          <v-select
            v-model="selectedCategory"
            :options="categoryOptions"
            label="label"
            :reduce="(option) => option.id"
            class="w-full"
            placeholder="Select category"
          />
          <input
            type="date"
            v-model="date"
            class="w-full p-2 border border-gray-300 rounded"
            required
          />
        </form>
      </div>

      <div class="flex justify-center space-x-2 px-6 py-3">
        <Button
          @click="handleUpload"
          :disabled="isUploading"
          bg="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          {{ isUploading ? "Uploading..." : "Upload" }}
        </Button>
      </div>
    </div>
  </div>

  <Modal v-if="showSuccessModal" :isOpen="showSuccessModal" title="Success">
    <template #body>
      <div class="text-center">
        <p class="text-black-600 font-semibold">File uploaded successfully!</p>
      </div>
    </template>
  </Modal>
</template>
