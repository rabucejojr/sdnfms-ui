<script setup>
// Import required components and libraries
import Modal from "@/components/Modal.vue";
import Button from "@/components/Button.vue";
import { ref, watch, nextTick } from "vue";
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
  resetForm();
};

// Initialize reactive form data variables
const selectedCategory = ref(null);
const file = ref(null);
const uploader = ref("");
const date = ref("");
const showSuccessModal = ref(false);
const showErrorModal = ref(false);
const isUploading = ref(false);
const errorMessage = ref("");

const API = import.meta.env.VITE_API;

// Category options for vue-select
const categoryOptions = ref([
  { id: "setup", label: "SETUP" },
  { id: "gia", label: "GIA" },
  { id: "others", label: "Others" },
]);

// Reset form fields
function resetForm() {
  file.value = null;
  uploader.value = "";
  selectedCategory.value = null;
  date.value = "";
  errorMessage.value = "";
  // Reset file input element
  nextTick(() => {
    const fileInput = document.getElementById("upload-file-input");
    if (fileInput) fileInput.value = "";
  });
}

// Watch for modal open/close to reset form
watch(
  () => props.isOpen,
  (val) => {
    if (val) {
      resetForm();
    }
  }
);

// Handle file input change event
const onFileChange = (event) => {
  const selected = event.target.files && event.target.files[0];
  file.value = selected || null;
};

// Main file upload handler
const handleUpload = async () => {
  errorMessage.value = "";
  if (isUploading.value) return;

  // Validate required fields
  if (!file.value) {
    errorMessage.value = "Please select a file before uploading.";
    showErrorModal.value = true;
    setTimeout(() => (showErrorModal.value = false), 1500);
    return;
  }
  if (!uploader.value.trim()) {
    errorMessage.value = "Uploader is required.";
    showErrorModal.value = true;
    setTimeout(() => (showErrorModal.value = false), 1500);
    return;
  }
  if (!selectedCategory.value) {
    errorMessage.value = "Please select a category.";
    showErrorModal.value = true;
    setTimeout(() => (showErrorModal.value = false), 1500);
    return;
  }
  if (!date.value) {
    errorMessage.value = "Please select a date.";
    showErrorModal.value = true;
    setTimeout(() => (showErrorModal.value = false), 1500);
    return;
  }

  isUploading.value = true;
  const selectedCategoryLabel = categoryOptions.value.find(
    (option) => option.id === selectedCategory.value
  )?.label;

  try {
    // Check if file already exists
    const checkResponse = await axios.get(`${API}/files`);
    const existingFiles = Array.isArray(checkResponse.data.files)
      ? checkResponse.data.files
      : [];
    if (
      existingFiles.some(
        (existingFile) =>
          existingFile.filename &&
          file.value &&
          existingFile.filename.toLowerCase() === file.value.name.toLowerCase()
      )
    ) {
      errorMessage.value = "A file with this name already exists.";
      showErrorModal.value = true;
      setTimeout(() => (showErrorModal.value = false), 1800);
      isUploading.value = false;
      return;
    }
  } catch (error) {
    // If the check fails, allow upload but log error
    console.error("Error checking existing files:", error);
  }

  // Prepare form data
  const formData = new FormData();
  formData.append("file", file.value);
  formData.append("uploader", uploader.value.trim());
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
      showSuccessModal.value = true;
      emit("upload-complete", true);
      props.fetchRecentFiles?.();
      setTimeout(() => {
        showSuccessModal.value = false;
        closeModal();
      }, 1200);
    } else {
      throw new Error("Upload failed");
    }
  } catch (error) {
    let msg =
      error?.response?.data?.message ||
      error?.message ||
      "Upload failed. Please try again.";
    errorMessage.value = msg;
    showErrorModal.value = true;
    setTimeout(() => (showErrorModal.value = false), 1800);
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
        <button @click="closeModal" class="text-gray-400 hover:text-gray-600" type="button" aria-label="Close">
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
        <form @submit.prevent="handleUpload" class="space-y-4" autocomplete="off">
          <input
            id="upload-file-input"
            type="file"
            @change="onFileChange"
            class="block w-full text-sm text-gray-700 border border-gray-300 rounded p-2"
            :disabled="isUploading"
            required
          />
          <input
            type="text"
            v-model="uploader"
            placeholder="Uploader"
            class="w-full p-2 border border-gray-300 rounded"
            :disabled="isUploading"
            required
            autocomplete="off"
          />
          <v-select
            v-model="selectedCategory"
            :options="categoryOptions"
            label="label"
            :reduce="(option) => option.id"
            class="w-full"
            placeholder="Select category"
            :disabled="isUploading"
            required
          />
          <input
            type="date"
            v-model="date"
            class="w-full p-2 border border-gray-300 rounded"
            :disabled="isUploading"
            required
          />
          <div v-if="errorMessage && showErrorModal" class="text-red-600 text-sm text-center">
            {{ errorMessage }}
          </div>
          <div class="flex justify-center space-x-2 pt-2">
            <Button
              type="submit"
              :disabled="isUploading"
              bg="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
            >
              {{ isUploading ? "Uploading..." : "Upload" }}
            </Button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <Modal v-if="showSuccessModal" :isOpen="showSuccessModal" title="Success" @close="showSuccessModal = false">
    <template #body>
      <div class="text-center">
        <p class="text-green-700 font-semibold">File uploaded successfully!</p>
      </div>
    </template>
  </Modal>
</template>
