<script setup lang="ts">
import type { TransactionRow } from '@/types';
import { formProps } from './formHelper';
import DialogDropdownMenu from '../DialogDropdownMenu.vue';
import CreateTransactionForm from './TransactionForm.vue';
import DeleteTransactionAlert from './DeleteTransactionAlert.vue';

const props = defineProps(formProps);
const dropdownOptions = [
    {
        slotName: 'update',
        dialogName: 'Edit Transaction',
        isAlert: false,
    },
    {
        slotName: 'delete',
        dialogName: 'Delete Transaction',
        isAlert: true,
    },
];
</script>

<template>
    <DialogDropdownMenu :options="dropdownOptions">
        <template v-slot:update="{ dialogFunction: { toggleDialog } }">
            <CreateTransactionForm :transaction="transaction" :onSubmitFunction="toggleDialog" />
        </template>
        <template v-slot:delete="{ dialogFunction: { toggleDialog } }">
            <DeleteTransactionAlert :transaction="transaction" :onSubmitFunction="toggleDialog" /> 
        </template>
    </DialogDropdownMenu>
</template>