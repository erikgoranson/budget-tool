import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import type { Transaction, TransactionRow } from '../types/';
import { useCategoryStore } from '@/stores/category';

export const useTransactionStore = defineStore('transaction', () => {

    const categoryStore = useCategoryStore();

    const transactions = ref(<Transaction[]>[]);

    const transactionRows = computed(() => {
        return transactions.value.map(tran => {
            let transformed = tran as Transaction as TransactionRow; 

            transformed.budgetCategoryName = categoryStore.getBudgetCategoryName(tran.categoryId, tran.budgetId);
            //transformed.date = new Date(tran.date).toDateString();

            return transformed;
        })
    });
    
    const createTransaction = (transaction: Transaction) => {
        transactions.value.push(transaction);
    };

    const updateTransaction = (transaction: Transaction) => {
        const index = transactions.value.findIndex(x => x.id == transaction.id);

        transactions.value.splice(index, 1, transaction);
    };

    const deleteTransaction = (id: number) => {
        transactions.value = transactions.value.filter(x => x.id !== id);
    };

    return { transactions, transactionRows, createTransaction, updateTransaction, deleteTransaction};
});