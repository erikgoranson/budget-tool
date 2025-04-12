<script setup lang="ts">
import type { Category } from '@/types';
import { formProps } from './budgetFormHelper';
import DialogDropdownMenu from '../DialogDropdownMenu.vue';
import UpdateBudgetForm from './UpdateBudgetForm.vue';
import DeleteBudgetAlert from './DeleteBudgetAlert.vue';

const props = defineProps(formProps);
const dropdownOptions = [
    {
        slotName: 'update',
        dialogName: 'Edit Budget',
        isAlert: false,
    },
    // { //TODO: rework this process
    //     slotName: 'delete',
    //     dialogName: 'Delete Budget',
    //     isAlert: true,
    // },
];
</script>

<template>
    <DialogDropdownMenu :options="dropdownOptions">
        <template v-slot:update="{ dialogFunction: { toggleDialog } }">
            <UpdateBudgetForm :budget-row="budgetRow" :onSubmitFunction="toggleDialog" />
        </template>
        <template v-slot:delete>
            <DeleteBudgetAlert :budget-row="budgetRow" />
        </template>
    </DialogDropdownMenu>
</template>