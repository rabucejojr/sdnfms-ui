<script setup>
import Button from "@/components/Button.vue";
import Modal from "@/components/Modal.vue";
import { RiCloseFill } from "@remixicon/vue";
import { ref, watch } from "vue";
import axios from "axios";
import { rewriteDefault } from "vue/compiler-sfc";

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
      date_uploaded: "",
      deadline: "",
    }),
  },
  fetchRecentDocuments: Function,
});

// Emit event to close modal
const emit = defineEmits(["close", "complete"]);
const closeModal = () => emit("close");

// Reactive variables for form fields
const document = ref(null);
const title = ref("");
const subject = ref("");
const status = ref("");
const date_uploaded = ref("");
const deadline = ref("");
const selectedPriority = ref("");
const showSuccessModal = ref(false);
const showErrorModal = ref(false);

// API Endpoint
const API = import.meta.env.VITE_API;

// Priority Options
const statusOptions = ref([
  { id: "received", label: "Received" },
  { id: "processing", label: "Processing" },
  { id: "approved", label: "Approved" },
  { id: "released", label: "Released" },
]);

// Watch for changes in `props.data` and update form fields
watch(
  () => props.data,
  (newData) => {
    title.value = newData.title || "";
    subject.value = newData.subject || "";
    status.value = newData.status || "";
    date_uploaded.value = newData.date_uploaded || "";
    deadline.value = newData.deadline || "";
  },
  { deep: true, immediate: true }
);

// Handle file selection
const onDocumentChange = (event) => {
  const selectedDocument = event.target.document[0]; // Get the selected file
  document.value = selectedDocument ? selectedDocument : null; // Assign file or null
};

// Reset form fields
const resetForm = () => {
  document.value = null;
  title.value = "";
  subject.value = "";
  status.value = "";
  date_uploaded.value = "";
  deadline.value = "";
};

// Handle document update
const handleUpdate = async () => {
  if (!props.data.id) return;

  try {
    const payload = new FormData();
    payload.append("_method", "PUT");
    if (document.value) {
      payload.append("document", document.value);
    }
    payload.append("title", title.value);
    payload.append("subject", subject.value);
    payload.append(
      "status",
      statusOptions.value.find((option) => option.id === status.value)?.label
    );
    payload.append("date_uploaded", date_uploaded.value);
    payload.append("deadline", deadline.value);

    await axios.post(`${API}/document/${props.data.id}`, payload);

    showSuccessModal.value = true;

    // Close success modal automatically after 1 second
    setTimeout(() => {
      showSuccessModal.value = false;
      closeModal(); // Close the update modal
    }, 1000);

    // Refresh document list and close modal
    props.fetchRecentDocuments();
    closeModal();
    resetForm();
  } catch (error) {
    showErrorModal.value = true;
    setTimeout(() => {
      showErrorModal.value = false;
      closeModal(); // Close the update modal
    }, 1000);
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
      <Modal :isOpen="isOpen" title="Update Document" @close="closeModal">
        <template #header>
          <Button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <RiCloseFill />
          </Button>
        </template>
        <template #body>
          <form @submit.prevent="handleUpdate" class="space-y-4">
            <!-- File input field -->
            <div>
              <input
                type="file"
                @change="onDocumentChange"
                class="block w-full text-sm border rounded p-2"
              />
            </div>
            <!-- Document Title -->
            <div>
              <input
                v-model="title"
                type="text"
                placeholder="Document Title"
                class="w-full p-2 border rounded"
                required
              />
            </div>
            <!-- Subject -->
            <div>
              <input
                v-model="subject"
                type="text"
                placeholder="Subject"
                class="w-full p-2 border rounded"
                required
              />
            </div>
            <!-- Status Dropdown -->
            <div>
              <v-select
                v-model="status"
                :options="statusOptions"
                label="label"
                :reduce="(option) => option.id"
                class="w-full"
              />
            </div>
            <!-- Date Uploaded -->
            <div>
              <input
                v-model="date_uploaded"
                type="date"
                class="w-full p-2 border rounded"
                required
              />
            </div>
            <!-- Deadline -->
            <div>
              <input
                v-model="deadline"
                type="date"
                class="w-full p-2 border rounded"
                required
              />
            </div>
          </form>
        </template>
        <template #footer>
          <Button
            @click="handleUpdate"
            bg="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
            >Update</Button
          >
          <Button
            @click="closeModal"
            bg="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded"
            >Close</Button
          >
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
