<script setup lang="ts">
import { computed } from "vue";
import { baseProps } from '@/helpers/baseFormHelper';
import { AlertDialogAction, AlertDialogCancel } from '@/components/ui/alert-dialog';

const props = defineProps({
    ...baseProps,
    recordType : {
        type: String,
        required: true
    },
    message : {
        type: String,
        required: false,
    },
});

const deleteMessage = computed(() => props.message ?? `This action will permanently delete the selected ${props.recordType} and all its related data. This cannot be undone.`);
</script>

<template>
    <div>
        <slot name="messageContent">{{ deleteMessage }}</slot>
    </div>
    <div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-x-2">
        <AlertDialogAction class="bg-red-500" @click="onSubmitFunction">
            Delete
        </AlertDialogAction>
        <AlertDialogCancel variant="outline">
            Cancel
        </AlertDialogCancel>
    </div>
</template>