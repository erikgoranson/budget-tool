import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import type { Transaction, TransactionRow } from '../types/';
import { useCategoryStore } from '@/stores/category';
import * as localStorageHelper from '@/helpers/localStorage';


export const useTransactionStore = defineStore('transaction', () => {

    const storageKey = 'transactions';
    const getData = () => localStorageHelper.default.getData(storageKey) as Transaction[];
    const setData = () => {
        console.log('transaction store saved to localstorage');
        localStorageHelper.default.setData(storageKey, transactions.value);
    };

    const categoryStore = useCategoryStore();

    const transactions = ref(getData());

    const transactionRows = computed(() => {
        return transactions.value.map(tran => {
            let transformed = tran as Transaction as TransactionRow; 
            transformed.budgetCategoryName = categoryStore.getBudgetCategoryName(tran.categoryId, tran.budgetId);
            return transformed;
        })
    });
    
    const createTransaction = (transaction: Transaction) => {
        transactions.value.push(transaction);
        setData();
    };

    const updateTransaction = (transaction: Transaction) => {
        const index = transactions.value.findIndex(x => x.id == transaction.id);

        transactions.value.splice(index, 1, transaction);
        setData();
    };

    const deleteTransaction = (id: string) => {
        transactions.value = transactions.value.filter(x => x.id !== id);
        setData();
    };

    return { transactions, transactionRows, createTransaction, updateTransaction, deleteTransaction};
});