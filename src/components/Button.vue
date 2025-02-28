<script setup>
// Props for the button
const props = defineProps({
  type: {
    type: String,
    default: "button", // Default to 'button' type
  },
  bg: {
    type: String,
    default: "", // Default to no background color
  },
  isDisabled: {
    type: Boolean,
    default: false, // Button is enabled by default
  },
});

// Emit event for click actions
const emit = defineEmits(["click"]);

// Determine Tailwind styles based on the variant
// const getButtonClass = () => {
//   switch (props.variant) {
//     case 'custom':
//       return 'bg-green-500 text-white hover:bg-green-600';
//     case 'secondary':
//       return 'bg-gray-500 text-white hover:bg-gray-600';
//     case 'danger':
//       return 'bg-red-500 text-white hover:bg-red-600';
//     default:
//       return 'bg-blue-500 text-white hover:bg-blue-600';
//   }
// };
</script>

<template>
  <button :type="type" :disabled="isDisabled" @click="$emit('click')" :class="`${bg}`">
    <slot></slot>
  </button>
</template>
