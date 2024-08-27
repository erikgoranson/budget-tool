import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { Transaction } from '../types/';

export const useTransactionStore = defineStore('transaction', () => {
    const transactions = ref(<Transaction[]>[]);

    const addTransaction = (transaction: Transaction) => {
        transactions.value.unshift(transaction);
    };

    return { transactions, addTransaction };
});