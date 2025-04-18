<script setup lang="ts">
import Button from '../ui/button/Button.vue';
import ResponsiveDialog from '../ResponsiveDialog.vue';
import GoalForm from './GoalForm.vue';
import { FilePlus2 } from 'lucide-vue-next';

const title = 'Create Goal';
const description = 'Add a long-term savings (or debt-related) goal for additional tracking';
</script>

<template>
    <ResponsiveDialog :title="title" :description="description">
        <template v-slot="{ close: { toggleDialog } }">
            <GoalForm :onSubmitFunction="toggleDialog" />
        </template>
        <template #toggleButton>
            <Button class="rounded-full" variant="ghost">
                <FilePlus2 class="h-4 w-4"/>
            </Button>
        </template>
    </ResponsiveDialog>
</template>