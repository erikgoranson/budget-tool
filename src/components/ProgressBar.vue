<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps({
    percentage: {
        type: Number,
        required: true,
    },
});

const validatedPercentage = computed(() => {
    if (Number.isNaN(props.percentage))
    {
        return '0%';
    }
    else 
    {
        return props.percentage * 100 + '%';
    };
});
</script>

<template>
    <div>
        <slot name="title" />
    </div>
    <div>
        <slot name="label" />
    </div>
    <div class="relative mb-5 h-6 rounded-full bg-gray-200">
        <div class="h-6 rounded-full bg-indigo-500" :style="{ width: validatedPercentage }"></div>
        <span class="absolute inset-0 flex items-center justify-center text-sm font-medium text-gray-900">
            <slot name="progressLabel" />
        </span>
    </div>
</template>