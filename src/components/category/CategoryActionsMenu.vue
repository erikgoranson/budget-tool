<script setup lang="ts">
import type { Category } from '@/types';
import DialogDropdownMenu from '../DialogDropdownMenu.vue';
import CreateUpdateForm from './CreateUpdateCategoryForm.vue';
import DeleteCategoryAlert from './DeleteCategoryAlert.vue';

const props = defineProps({
    category : {
        type: Object as () => Category,
        required: true
    }
});

const dropdownOptions = [
    {
        slotName: 'update',
        dialogName: 'Edit Category',
        isAlert: false,
        //TODO: use h() here so we can avoid using the slots
    },
    // {
    //     //TODO: rework this item to avoid math issues and orphaned budgets/subcategories
    //     slotName: 'delete',
    //     dialogName: 'Delete Category',
    //     isAlert: true,
    // },
];
</script>

<template>
    <DialogDropdownMenu :options="dropdownOptions">
        <template v-slot:update="{ dialogFunction: { toggleDialog } }">
            <CreateUpdateForm :category="category" :onSubmitFunction="toggleDialog" />
        </template>
        <template v-slot:delete>
            <DeleteCategoryAlert :category="category" />
        </template>
    </DialogDropdownMenu>
</template>