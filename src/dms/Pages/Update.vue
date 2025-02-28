<script setup>
import Button from "@/components/Button.vue";
import Modal from "@/components/Modal.vue";
import { RiCloseFill } from "@remixicon/vue";
import { ref, watch } from "vue";
import axios from "axios";

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  data: {
    type: Object,
    default: () => ({
      title: "",
      subject: "",
      status: "",
      deadline: "",
    }),
  },
  fetchRecentFiles: {
    type: Function,
    required: true,
  },
});

// Emit event to close the modal
const emit = defineEmits(["close", "complete"]);
const closeModal = () => emit("close");

// Reactive form data initialized with the prop
const formData = ref({ ...props.data });

// Reactive variables for file data
const file = ref(null);
const title = ref(formData.value.title);
const subject = ref(formData.value.subject);
const status = ref(formData.value.status);
const deadline = ref(formData.value.deadline);
const showSuccessModal = ref(false);
const showErrorModal = ref(false);

const API = import.meta.env.VITE_API;

const priorityOptions = ref([
  { id: 1, label: "Received" },
  { id: 2, label: "Processing" },
  { id: 3, label: "Approved" },
  { id: 4, label: "Released" },
]);

watch(
  () => props.data,
  (newData) => {
    formData.value = { ...newData };
  },
  { deep: true }
);

// Handle file selection
const onFileChange = (event) => {
  const selectedFile = event.target.files[0]; // Get the selected file
  file.value = selectedFile ? selectedFile : null; // Assign file or null
};

// File Update using API
const handleUpdate = async () => {
  console.log("update document");
};
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50"
  >
    <div class="bg-white rounded-lg shadow-lg w-1/3 max-w-lg">
      <Modal :isOpen="isOpen" title="Update Document" @close="closeModal">
        <template #header>
          <Button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <RiCloseFill />
          </Button>
        </template>

        <template #body>
          <!-- Modal Body -->
          <form @submit.prevent="handleUpdate" class="space-y-4">
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
                v-model="status"
                :options="priorityOptions"
                label="label"
                :reduce="(option) => option.label"
              />
            </div>

            <!-- Date input field -->
            <div>
              <input
                type="date"
                id="date"
                v-model="deadline"
                class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                required
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
