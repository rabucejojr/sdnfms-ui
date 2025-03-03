<script setup>
// Import required components and libraries
import Modal from "@/components/Modal.vue";
import Button from "@/components/Button.vue";
import { ref } from "vue";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
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
const emit = defineEmits(["close", "add", "add-complete"]);

// Handler to close the modal and notify parent
const closeModal = () => {
  emit("close");
};

// Initialize reactive form data variables
const file = ref(null);
const subject = ref("");
const title = ref("");
const priorityOptions = ref([
  { id: 1, label: "Received" },
  { id: 2, label: "Processing" },
  { id: 3, label: "Approved" },
  { id: 4, label: "Released" },
]);
const selectedPriority = ref(""); // This holds the selected priority
const date_uploaded = ref("");
const showSuccessModal = ref(false);
const status = ref("");
const deadline = ref("");
const showErrorModal = ref(false);

// Handle file input change event
const onFileChange = (event) => {
  file.value = event.target.files[0];
};

const API = import.meta.env.VITE_API;

const handleAddDocument = async () => {
  // Validate file selection
  if (!file.value) {
    alert("Please select a file before uploading.");
    return;
  }

  // Check if file already exists
  try {
    const checkResponse = await axios.get(`${API}/document`);
    const existingFiles = checkResponse.data.files || [];

    const fileExists = existingFiles.some(
      (existingFile) => existingFile.filename === file.value.name
    );

    if (fileExists) {
      showErrorModal.value = true;
      setTimeout(() => {
        showErrorModal.value = false;
      }, 1500);
      return;
    }
  } catch (error) {
    console.error("Error checking existing files:", error);
  }

  // Prepare form data for API request
  const formData = new FormData();
  formData.append("file", file.value);
  formData.append("title", title.value);
  formData.append("subject", subject.value);
  formData.append("status", selectedPriority.value);
  formData.append("date_uploaded", date_uploaded.value);
  formData.append("deadline", deadline.value);

  try {
    // Send POST request to API endpoint
    const response = await axios.post(`${API}/document`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
    });

    if (response.status >= 200 && response.status < 300) {
      // Reset form fields
      file.value = null;
      title.value = "";
      subject.value = "";
      selectedPriority.value = "";
      date_uploaded.value = "";
      deadline.value = "";

      closeModal();
      showSuccessModal.value = true;

      // Notify parent & refresh recent files
      emit("add-complete", true);
      props.fetchRecentFiles();

      setTimeout(() => {
        showSuccessModal.value = false;
      }, 1500);
    }
  } catch (error) {
    // Handle errors with error modal
    console.error("Upload failed:", error.response?.data || error.message);
    showErrorModal.value = true;
    setTimeout(() => {
      showErrorModal.value = false;
    }, 1500);
    emit("add-complete", false);
  }
};

// API methods for fetching file data
const fetchRecentFiles = async () => {
  try {
    const response = await fetch(`${API}/document`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    recentFiles.value = data.files || [];
  } catch (error) {
    console.error("Error fetching recent files:", error.message || error);
    recentFiles.value = [];
  }
};
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50"
  >
    <!-- Modal container -->
    <div class="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 sm:mx-auto">
      <!-- Modal header with title and close button -->
      <div class="flex justify-between items-center border-b px-6 py-3">
        <h2 class="text-lg font-semibold text-gray-800">Track Document</h2>
        <Button @click="closeModal" class="text-gray-400 hover:text-gray-600">
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
        </Button>
      </div>

      <!-- Modal body with upload form -->
      <div class="px-6 py-2">
        <form @submit.prevent="handleAddDocument" class="space-y-4">
          <!-- File input field -->
          <div>
            <input
              type="file"
              id="file"
              @change="onFileChange"
              class="block w-full text-sm text-gray-700 border border-gray-300 rounded p-2 cursor-pointer"
            />
          </div>

          <!-- Concern Person name input -->
          <div>
            <input
              type="text"
              id="subject"
              v-model="subject"
              placeholder="Subject"
              class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>

          <!-- File title -->
          <div>
            <input
              type="text"
              id="title"
              v-model="title"
              placeholder="Document Title"
              class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>
          <!-- Category selection dropdown -->
          <div>
            <v-select
              v-model="selectedPriority"
              :options="priorityOptions"
              label="label"
              :reduce="(option) => option.id"
              placeholder="Document Status"
            />
          </div>

          <!-- Date Uploaded field -->
          <div class="relative group">
            <input
              type="date"
              id="date_uploaded"
              v-model="date_uploaded"
              class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300 cursor-pointer"
              required
            />
            <!-- Tooltip -->
            <div
              class="absolute left-1/2 -top-5 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs rounded px-2 py-1 transition-opacity duration-300"
            >
              Date Uploaded
            </div>
          </div>
          <!-- Deadline field -->
          <div class="relative group">
            <input
              type="date"
              id="deadline"
              v-model="deadline"
              class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300 cursor-pointer"
              required
            />
            <!-- Tooltip -->
            <div
              class="absolute left-1/2 -top-5 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs rounded px-2 py-1 transition-opacity duration-300"
            >
              Deadline
            </div>
          </div>
        </form>
      </div>

      <!-- Modal footer with action buttons -->
      <div class="flex justify-center space-x-2 px-6 py-3">
        <Button
          @click="handleAddDocument"
          bg="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          Generate Tracking Code
        </Button>
      </div>
    </div>
  </div>

  <!-- Success notification modal -->
  <Modal v-if="showSuccessModal" :isOpen="showSuccessModal" title="Success">
    <template #body>
      <div class="text-center">
        <p class="text-black-600 font-semibold">Uploaded successfully!</p>
      </div>
    </template>
  </Modal>
</template>
