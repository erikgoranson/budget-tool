import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { CalendarDate, DateFormatter, type DateValue, getLocalTimeZone, parseDate, today } from '@internationalized/date';
import { toDate } from 'radix-vue/date';
import type { Transaction, TransactionRow } from '../types/';
import { useCategoryStore } from '@/stores/category';
import { useSubcategoryStore } from './subcategory';
import localStorageHelper from '@/helpers/localStorage';
import dateFormatter from '@/helpers/dateFormatter';

export const useTransactionStore = defineStore('transaction', () => {

    const storageKey = 'transactions';
    const getData = () => localStorageHelper.getData(storageKey) as Transaction[];
    const setData = () => {
        console.log('transaction store saved to localstorage');
        localStorageHelper.setData(storageKey, transactions.value);
    };

    const uncategorizedGuid = '00000000-0000-0000-0000-000000000000';
    const incomeGuid = '00000000-0000-0000-0000-000000000001';

    const categoryStore = useCategoryStore();
    const subcategoryStore = useSubcategoryStore();

    const transactions = ref(getData());

    const transactionRows = computed(() => {
        return transactions.value.map(tran => {
            let transformed = tran as Transaction as TransactionRow; 

            const transName = getTransactionName(tran);
            transformed.budgetCategoryName = transName;
            return transformed;
        })
    });

    const lastTouchedDate = ref<String>('');
    const setLastTouchedDate = (date: string) => {
        lastTouchedDate.value = date;
    };
    
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
        if (tran.categoryId == incomeGuid){
            return `Income for ${dateFormatter.format(tran.date, 'monthName')}`;
        };

        if (tran.categoryId == uncategorizedGuid){
            return 'Uncategorized';
        };

        const categoryName = categoryStore.getCategoryName(tran.categoryId);
        const subcategoryName = subcategoryStore.getSubcategoryNameById(tran.subcategoryId);
        return `${categoryName} : ${subcategoryName}`;
    };

    return { transactions, transactionRows, lastTouchedDate, setLastTouchedDate, createTransaction, updateTransaction, deleteTransaction, uncategorizedGuid, incomeGuid };
});