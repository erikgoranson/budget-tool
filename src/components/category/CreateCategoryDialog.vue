<script setup lang="ts">
import { Plus } from 'lucide-vue-next';
import Button from '../ui/button/Button.vue';
import ResponsiveDialog from '../ResponsiveDialog.vue';
import CreateUpdateCategoryForm from './CreateUpdateCategoryForm.vue';

const title = 'Add New Budget Category';
const description = 'Define a new category to be added to your budget, i.e., "Monthly Bills"';
</script>

<template>
    <ResponsiveDialog :title="title" :description="description">
        <template v-slot="{ close: { toggleDialog } }">
            <CreateUpdateCategoryForm :onSubmitFunction="toggleDialog" />
        </template>
        <template #toggleButton>
            <div class="text-center font-medium px-4 py-4 bg-blue-100 mt-6 overflow-hidden bg-white rounded-md shadow-lg">
                Add Category
            </div>
        </template>
    </ResponsiveDialog>
</template>