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
            <Button class="bg-rose-200 flex justify-center items-center w-50" variant="secondary">
                <Plus class="h-4 w-4 mr-1 px-0"/>
                Budget Category
            </Button>
        </template>
    </ResponsiveDialog>
</template>