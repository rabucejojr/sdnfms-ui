<script setup>

// Props
const props = defineProps({
  isOpen: { type: Boolean, required: true }, // Modal visibility
  title: { type: String, default: '' }, // Modal title
  closeModal:{ type: Boolean },
});

// Emit event to close the modal
const emit = defineEmits(['close']);
const closeModal = () => emit('close');
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50 px-4"
  >
    <div class="bg-white rounded-lg shadow-lg  w-full max-w-lg sm:w-1/2">
      <!-- Modal Header -->
      <div class="flex justify-between items-center border-b px-6 py-4">
        <h2 class="text-lg font-semibold text-gray-800">{{ title }}</h2>
            <slot name="header">
            </slot>
        </div>

      <!-- Modal Body -->
      <div class="px-6 py-4">
        <slot name="body">
          <!-- Default content if no body slot is provided -->
          <p>No content provided for the modal body.</p>
        </slot>
      </div>

      <!-- Modal Footer -->
      <div class="flex justify-end border-t px-6 py-4 space-x-2">
        <slot name="footer">
        </slot>
      </div>
    </div>
  </div>
</template>
