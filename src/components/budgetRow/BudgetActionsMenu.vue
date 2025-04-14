<script setup lang="ts">
import type { Category } from '@/types';
import { formProps } from './budgetFormHelper';
import DialogDropdownMenu from '../DialogDropdownMenu.vue';
import UpdateBudgetForm from './UpdateBudgetForm.vue';
import DeleteBudgetAlert from './DeleteBudgetAlert.vue';
import DeleteSubcategoryAlert from './DeleteSubcategoryAlert.vue';

const props = defineProps(formProps);
const dropdownOptions = [
    {
        slotName: 'update',
        dialogName: 'Edit Budget',
        isAlert: false,
    },
    {
        slotName: 'deleteBudget',
        dialogName: 'Delete Budget',
        isAlert: true,
    },
    {
        slotName: 'deleteSub',
        dialogName: 'Delete Category',
        isAlert: true,
    },
];
</script>

<template>
    <DialogDropdownMenu :options="dropdownOptions">
        <template v-slot:update="{ dialogFunction: { toggleDialog } }">
            <UpdateBudgetForm :budget-row="budgetRow" :onSubmitFunction="toggleDialog" />
        </template>
        <template v-slot:deleteBudget>
            <DeleteBudgetAlert :budget-row="budgetRow" />
        </template>
        <template v-slot:deleteSub>
            <DeleteSubcategoryAlert :budget-row="budgetRow" />
        </template>
    </DialogDropdownMenu>
</template>