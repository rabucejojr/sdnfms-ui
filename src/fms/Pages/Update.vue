<script setup>
import Button from "@/components/Button.vue";
import Modal from "@/components/Modal.vue";
import { RiCloseFill } from "@remixicon/vue";
import { ref, watch, nextTick } from "vue";
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
const uploader = ref(formData.value.uploader || "");
const category = ref(formData.value.category || "");
const date = ref(formData.value.date || "");
const showSuccessModal = ref(false);
const showErrorModal = ref(false);

const API = import.meta.env.VITE_API;

// Category Options
const categoryOptions = ref([
  { id: "setup", label: "SETUP" },
  { id: "gia", label: "GIA" },
  { id: "others", label: "Others" },
]);

// Watch for changes in props.data and update formData and fields
watch(
  () => props.data,
  (newData) => {
    formData.value = { ...newData };
    uploader.value = newData.uploader ?? "";
    category.value = newData.category ?? "";
    date.value = newData.date ?? "";
    file.value = null;
    // Reset file input after modal opens with new data
    nextTick(() => {
      const fileInput = document.getElementById("file");
      if (fileInput) fileInput.value = "";
    });
  },
  { immediate: true, deep: true }
);

// Handle file selection
const onFileChange = (event) => {
  const selectedFile = event.target.files && event.target.files[0];
  file.value = selectedFile || null;
};

// File Update using API
const handleUpdate = async (e) => {
  // Prevent double submission
  if (showSuccessModal.value || showErrorModal.value) return;

  // Validate required fields
  if (!props.data.id) {
    showErrorModal.value = true;
    setTimeout(() => {
      showErrorModal.value = false;
    }, 1200);
    return;
  }
  if (!uploader.value || !category.value || !date.value) {
    showErrorModal.value = true;
    setTimeout(() => {
      showErrorModal.value = false;
    }, 1200);
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

    const response = await axios.post(`${API}/files/${props.data.id}`, payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.status === 200 || response.status === 201) {
      showSuccessModal.value = true;

      // Refresh file list after update
      props.fetchRecentFiles?.();

      // Reset form fields
      file.value = null;
      uploader.value = "";
      category.value = "";
      date.value = "";
      nextTick(() => {
        const fileInput = document.getElementById("file");
        if (fileInput) fileInput.value = "";
      });

      // Close success modal automatically after 1 second
      setTimeout(() => {
        showSuccessModal.value = false;
        closeModal(); // Close the update modal
      }, 1000);
    } else {
      throw new Error("Update failed");
    }
  } catch (error) {
    showErrorModal.value = true;
    setTimeout(() => {
      showErrorModal.value = false;
      closeModal(); // Close the update modal
    }, 1200);
    props.fetchRecentFiles?.();
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
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600" type="button">
            <RiCloseFill />
          </button>
        </template>

        <template #body>
          <!-- Modal Body -->
          <form @submit.prevent="handleUpdate" class="space-y-4" autocomplete="off">
            <div>
              <input
                type="file"
                id="file"
                @change="onFileChange"
                class="block w-full text-sm text-gray-700 border border-gray-300 rounded p-2"
                accept="*"
                autocomplete="off"
              />
            </div>

            <div>
              <input
                type="text"
                id="uploader"
                v-model="uploader"
                placeholder="Uploader"
                class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                required
                autocomplete="off"
              />
            </div>

            <!-- Updated Category Dropdown -->
            <div>
              <v-select
                v-model="category"
                :options="categoryOptions"
                label="label"
                :reduce="(option) => option.id"
                class="w-full"
                placeholder="Select Category"
                required
              />
            </div>

            <div>
              <input
                type="date"
                id="date"
                v-model="date"
                placeholder=""
                class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                required
                autocomplete="off"
              />
            </div>
            <div class="flex justify-center space-x-2 px-6 py-3">
              <Button
                type="submit"
                bg="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
              >
                Update
              </Button>
            </div>
          </form>
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
          <p class="text-red-600 font-medium">Failed to update file! Please check all fields.</p>
        </div>
      </template>
    </Modal>
  </div>
</template>
