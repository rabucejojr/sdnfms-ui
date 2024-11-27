<script setup>
defineProps({
    bg:{
        type:String,
        default: 'bg-blue-500'
    }
});
</script>

<template>
        <div :class="`${bg} text-white p-4 rounded shadow`">
            <slot></slot>
        </div>
</template>