<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useTransactionStore } from '@/stores/transaction.ts';

const transactionStore = useTransactionStore();
const { transactions } = storeToRefs(transactionStore);
</script>

<template>
    <div v-for="item in transactions">
        {{ item }}
    </div>
</template>