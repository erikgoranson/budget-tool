<script setup lang="ts">
import type { TransactionRow } from '@/types';
import { formProps } from './transactionFormHelper';
import { useTransactionStore } from '@/stores/transaction';
import DeleteAlert from '../DeleteAlert.vue';
const props = defineProps(formProps);
const transactionStore = useTransactionStore();

const deleteTransaction = () => {
    console.log('deleting transactions', props.transaction);
    transactionStore.deleteTransaction(props.transaction.id);
};
</script>

<template>
    <DeleteAlert record-type="transaction" :onSubmitFunction="deleteTransaction"/>
</template>