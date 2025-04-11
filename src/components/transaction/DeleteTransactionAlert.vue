<script setup lang="ts">
import type { TransactionRow } from '@/types';
import { formProps } from './transactionFormHelper';

import { useTransactionStore } from '@/stores/transaction';
import Button from '../ui/button/Button.vue';

const props = defineProps(formProps);
const transactionStore = useTransactionStore();

const deleteTransaction = () => {
    console.log('deleting transactions', props.transaction);
    transactionStore.deleteTransaction(props.transaction.id);
    props.onSubmitFunction();
};
</script>

<template>
    <div>
        This action will permanently delete the selected transaction and all its related data. This cannot be undone. 
    </div>
    <div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-x-2">
        <Button class="bg-red-500" @click="deleteTransaction">
            Delete
        </Button>
        <Button variant="outline" @click="onSubmitFunction">
            Cancel
        </Button>
    </div>
</template>