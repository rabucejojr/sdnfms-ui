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
      filename: "",
      uploader: "",
      category: "",
      date: "",
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
const uploader = ref(formData.value.uploader);
const category = ref(formData.value.category);
const date = ref(formData.value.date);
const showSuccessModal = ref(false);
const showErrorModal = ref(false);

const API = import.meta.env.VITE_API;

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
  const selectedFile = event.target.files[0]; // Get the selected file
  file.value = selectedFile ? selectedFile : null; // Assign file or null
};

// File Update using API
const handleUpdate = async () => {
  if (!props.data.id) {
    showErrorModal.value = true;
    return;
  }

  try {
    const payload = new FormData();
    payload.append("_method", "PUT"); // Laravel requires this for updating via POST
    if (file.value) {
      payload.append("file", file.value);
    }
    payload.append("uploader", uploader.value);
    payload.append("category", category.value);
    payload.append("date", date.value);

    const response = await axios.post(`${API}/files/${props.data.id}`, payload);

    showSuccessModal.value = true;

    // Close success modal automatically after 3 seconds
    setTimeout(() => {
      showSuccessModal.value = false;
      closeModal(); // Close the update modal
    }, 1000);

    props.fetchRecentFiles();

    // Reset form fields
    file.value = null;
    uploader.value = "";
    category.value = "";
    date.value = "";
    document.getElementById("file").value = ""; // Reset file input
  } catch (error) {
    showErrorModal.value = true;
    // Close success modal automatically after 3 seconds
    setTimeout(() => {
      closeModal(); // Close the update modal
    }, 1000);
    showErrorModal.value = false;
    props.fetchRecentFiles();
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
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
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
                v-model="uploader"
                placeholder="Uploader"
                class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>

            <div>
              <select
                id="category"
                v-model="category"
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
                v-model="date"
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
