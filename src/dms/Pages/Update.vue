<script setup>
import Button from "@/components/Button.vue";
import Modal from "@/components/Modal.vue";
import { RiCloseFill } from "@remixicon/vue";
import { ref, watch } from "vue";
import axios from "axios";

// Props
const props = defineProps({
  isOpen: Boolean,
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

// API Endpoint
const API = import.meta.env.VITE_API;

// Priority Options
const priorityOptions = ref([
  { id: 1, label: "Received" },
  { id: 2, label: "Processing" },
  { id: 3, label: "Approved" },
  { id: 4, label: "Released" },
]);

// Watch for changes in `props.data` and update form fields
watch(
  () => props.data,
  (newData) => {
    if (newData) {
      title.value = newData.title || "";
      subject.value = newData.subject || "";
      status.value = newData.status || "";
      date_uploaded.value = newData.date_uploaded || "";
      deadline.value = newData.deadline || "";

      // Set selected priority based on current status
      const foundPriority = priorityOptions.value.find(
        (option) => option.label === newData.status
      );
      selectedPriority.value = foundPriority ? foundPriority.id : "";
    }
  },
  { deep: true, immediate: true }
);

// Handle file selection
const onDocumentChange = (event) => {
  document.value = event.target.files[0];
};

// Reset form fields
const resetForm = () => {
  document.value = null;
  title.value = "";
  subject.value = "";
  status.value = "";
  date_uploaded.value = "";
  deadline.value = "";
  selectedPriority.value = "";
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
      priorityOptions.value.find((option) => option.id === selectedPriority.value)
        ?.label || status.value
    );
    payload.append("date_uploaded", date_uploaded.value);
    payload.append("deadline", deadline.value);

    await axios.post(`${API}/document/${props.data.id}`, payload);

    // Refresh document list and close modal
    props.fetchRecentDocuments();
    closeModal();
    resetForm();
  } catch (error) {
    console.error("Update failed:", error);
  }
};
</script>

<template>
  <Modal v-if="isOpen" :isOpen="isOpen" title="Update Document" @close="closeModal">
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
            :options="priorityOptions"
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
</template>
