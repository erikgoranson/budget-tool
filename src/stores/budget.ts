import { ref, computed} from 'vue';
import { defineStore } from 'pinia';
import type { Budget } from '../types/';
import localStorageHelper from '@/helpers/localStorage';

export const useBudgetStore = defineStore('budget', () => {

    const storageKey = 'budget';

    const getData = () => localStorageHelper.getData(storageKey) as Budget[];
    const setData = () => {
        console.log('budget store saved to localstorage');
        localStorageHelper.setData(storageKey, budgets.value);
    };

    const budgets = ref(getData());
    
    const createBudget = (budget: Budget) => {
        budgets.value.unshift(budget);
        setData();
    };

    const updateBudget = (budget: Budget) => {
        const index = budgets.value.findIndex(x => x.id == budget.id);

        budgets.value.splice(index, 1, budget);
        setData();
    };

    const deleteBudget = (id: string) => {
        budgets.value = budgets.value.filter(x => x.id !== id);
        console.log('after delete:', JSON.stringify(budgets.value));
        setData();
    };
    return { budgets, createBudget, deleteBudget, updateBudget };
});