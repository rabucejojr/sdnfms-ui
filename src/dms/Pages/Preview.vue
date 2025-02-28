<script setup>
import Modal from "@/components/Modal.vue";
import { RiCloseFill } from "@remixicon/vue";

// Props
const props = defineProps({
  isOpen: { type: Boolean, required: true },
  data: {
    type: Object,
    required: true,
    default: () => ({
      title: "",
      subject: "",
      status: "",
      date_uploaded: "",
      deadline: "",
    }),
  },
});

// Emit event to close the modal
const emit = defineEmits(["close"]);
const closeModal = () => emit("close");
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50"
  >
    <div class="bg-white rounded-lg shadow-lg w-1/3 max-w-lg">
      <Modal :isOpen="isOpen" title="Document Details" @close="closeModal">
        <template #header>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <RiCloseFill />
          </button>
        </template>
        <template #body>
          <!-- Modal Body -->
          <div class="space-y-4">
            <div>
              <h4 class="text-gray-700 font-medium">Title:</h4>
              <p type="file" class="text-gray-800">{{ data.title }}</p>
            </div>
            <div>
              <h4 class="text-gray-700 font-medium">Subject:</h4>
              <p class="text-gray-800">{{ data.subject }}</p>
            </div>
            <div>
              <h4 class="text-gray-700 font-medium">Status:</h4>
              <p class="text-gray-800">{{ data.status }}</p>
            </div>
            <div>
              <h4 class="text-gray-700 font-medium">Date Uploaded:</h4>
              <p class="text-gray-800">{{ data.date_uploaded }}</p>
            </div>
            <div>
              <h4 class="text-gray-700 font-medium">Deadline:</h4>
              <p class="text-gray-800">{{ data.deadline }}</p>
            </div>
          </div>
        </template>
      </Modal>
    </div>
  </div>
</template>
