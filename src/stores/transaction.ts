import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import type { Transaction, TransactionRow } from '../types/';
import { useBudgetStore } from '@/stores/budget';
import { useCategoryStore } from '@/stores/category';
import * as localStorageHelper from '@/helpers/localStorage';

export const useTransactionStore = defineStore('transaction', () => {

    const storageKey = 'transactions';
    const getData = () => localStorageHelper.default.getData(storageKey) as Transaction[];
    const setData = () => {
        console.log('transaction store saved to localstorage');
        localStorageHelper.default.setData(storageKey, transactions.value);
    };

    const uncategorizedGuid = '00000000-0000-0000-0000-000000000000';
    const incomeGuid = '00000000-0000-0000-0000-000000000001';

    const budgetStore = useBudgetStore();
    const categoryStore = useCategoryStore();

    const transactions = ref(getData());

    const transactionRows = computed(() => {
        return transactions.value.map(tran => {
            let transformed = tran as Transaction as TransactionRow; 

            const transName = getTransactionName(tran);
            transformed.budgetCategoryName = transName;
            return transformed;
        })
    });
    
    const createTransaction = (transaction: Transaction) => {
        transactions.value.unshift(transaction);
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

    const getTransactionName = (tran: Transaction) => {
        if (tran.categoryId == incomeGuid || tran.budgetId == incomeGuid){
            return 'Income for MONTH';
        };

        if (tran.categoryId == uncategorizedGuid || tran.budgetId == uncategorizedGuid){
            return 'Uncategorized';
        };

        const categoryName = categoryStore.getCategoryName(tran.categoryId);
        const budgetName = budgetStore.getBudgetName(tran.budgetId);
        return  `${categoryName} : ${budgetName}`;
    };

    return { transactions, transactionRows, createTransaction, updateTransaction, deleteTransaction, uncategorizedGuid, incomeGuid };
});