import { ref, computed} from 'vue';
import { defineStore } from 'pinia';
import type { Budget } from '../types/';
import * as localStorageHelper from '@/helpers/localStorage';

const currentMonthYear = computed(() => {
    const dateFormatter = new Intl.DateTimeFormat('en-US', {
        month: 'long',
        year: 'numeric'
    });
    console.log(dateFormatter.format(new Date()));
    return dateFormatter.format(new Date());
});

export const useBudgetStore = defineStore('budget', () => {

    const storageKey = 'budget';

    const getData = () => localStorageHelper.default.getData(storageKey) as Budget[];
    const setData = () => {
        console.log('budget store saved to localstorage');
        localStorageHelper.default.setData(storageKey, budgets.value);
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

    const getBudgetName = (id: string) => {
        const budget = budgets.value.find(b => b.id == id);
        return budget?.name;
    }
    
    const getBudgetsByCategoryId = (categoryId: string) => {
        const matches = budgets.value.filter(b => b.categoryId == categoryId);
        return matches;
    };

    return { budgets, createBudget, deleteBudget, updateBudget, getBudgetName, getBudgetsByCategoryId };
});