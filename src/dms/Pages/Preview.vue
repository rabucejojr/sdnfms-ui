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
    class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50"
  >
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6">
      <Modal :isOpen="isOpen" title="Document Details" @close="closeModal">
        <!-- Modal Header -->
        <template #header>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <RiCloseFill />
          </button>
        </template>

        <!-- Modal Body -->
        <template #body>
          <div class="space-y-4">
            <div v-for="(value, key) in data" :key="key" class="flex items-center gap-2">
              <h4 class="text-gray-600 font-semibold capitalize w-1/3">
                {{ key.replace("_", " ") }}:
              </h4>
              <p class="text-gray-700 w-2/3">{{ value }}</p>
            </div>
          </div>
        </template>
      </Modal>
    </div>
  </div>
</template>
