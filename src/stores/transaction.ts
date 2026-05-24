import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { CalendarDate, DateFormatter, type DateValue, getLocalTimeZone, parseDate, today } from '@internationalized/date';
import { toDate } from 'radix-vue/date';
import type { Transaction, TransactionRow } from '../types/';
import { useCategoryStore } from '@/stores/category';
import { useSubcategoryStore } from './subcategory';
import localStorageHelper from '@/helpers/localStorage';
import dateFormatter from '@/helpers/dateFormatter';
import uncategorized from '@/helpers/uncategorizedHelper';

export const useTransactionStore = defineStore('transaction', () => {

    const storageKey = 'transactions';
    const getData = () => localStorageHelper.getData(storageKey) as Transaction[];
    const setData = () => {
        console.log('transaction store saved to localstorage');
        localStorageHelper.setData(storageKey, transactions.value);
    };
    
    const categoryStore = useCategoryStore();
    const subcategoryStore = useSubcategoryStore();

    const transactions = ref(getData());

    const transactionRows = computed(() => {
        return transactions.value.map(tran => {
            let transformed = tran as Transaction as TransactionRow; 

            const transName = getTransactionName(tran);
            transformed.budgetCategoryName = transName;
            transformed.note = tran.note ?? '';
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

    const putTransaction = (transaction: Transaction) => {
        const index = transactions.value.findIndex(x => x.id == transaction.id);
        if (index !== -1) {
            updateTransaction(transaction);
        } else {
            createTransaction(transaction);
        }
    };

    const getTransactionName = (tran: Transaction) => {
        if (tran.categoryId == uncategorized.incomeGuid){
            return `Income for ${dateFormatter.format(tran.date, 'monthName')}`;
        };

        if (tran.categoryId == uncategorized.guid){
            return uncategorized.label;
        };

        const categoryName = categoryStore.getCategoryName(tran.categoryId);
        const subcategoryName = subcategoryStore.getSubcategoryNameById(tran.subcategoryId);
        return `${categoryName} : ${subcategoryName}`;
    };

    return { transactions, transactionRows, lastTouchedDate, setLastTouchedDate, createTransaction, updateTransaction, deleteTransaction, putTransaction };
});