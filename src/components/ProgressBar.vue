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
    else if (props.percentage > 1)
    {
        return '100%';
    }
    else 
    {
        return props.percentage * 100 + '%';
    };
});
</script>

<template>
    <div class="my-4">
        <div>
            <slot name="title" />
        </div>
        <div>
            <slot name="label" />
        </div>
        <div class="relative h-6 rounded-full bg-gray-200">
            <div class="h-6 rounded-full bg-green-400" :style="{ width: validatedPercentage }"></div>
            <span class="absolute inset-0 flex items-center justify-center font-medium text-gray-900">
                <slot name="progressLabel" />
            </span>
        </div>
    </div>
</template>