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
const date = ref("");
const showSuccessModal = ref(false);

// Handle file input change event
const onFileChange = (event) => {
  file.value = event.target.files[0];
};

const API = import.meta.env.VITE_API;

const handleAddDocument = async () => {
  const response = await axios.get(`${API}/document`);
  console.log(response.data);
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
              class="block w-full text-sm text-gray-700 border border-gray-300 rounded p-2"
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

          <!-- Date input field -->
          <div>
            <input
              type="date"
              id="date"
              v-model="date"
              class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
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
