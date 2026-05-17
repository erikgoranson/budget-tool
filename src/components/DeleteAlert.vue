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
    <div class="flex flex-row justify-center gap-4">
        <AlertDialogAction class="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90" @click="onSubmitFunction">
            Delete
        </AlertDialogAction>
        <AlertDialogCancel class="mt-0 w-full">
            Cancel
        </AlertDialogCancel>
    </div>
</template>