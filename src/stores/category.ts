import { ref, computed} from 'vue';
import { defineStore } from 'pinia';
import type { Category, Budget } from '../types/';
import * as localStorageHelper from '@/helpers/localStorage';

const currentMonthYear = computed(() => {
    const dateFormatter = new Intl.DateTimeFormat('en-US', {
        month: 'long',
        year: 'numeric'
    });
    console.log(dateFormatter.format(new Date()));
    return dateFormatter.format(new Date());
});

export const useCategoryStore = defineStore('category', () => {

    const storageKey = 'category';
    const uncategorizedBudgetGuid = '00000000-0000-0000-0000-000000000000';
    const incomeGuid = '00000000-0000-0000-0000-000000000001';

    const getData = () => localStorageHelper.default.getData(storageKey) as Category[];
    const setData = () => {
        console.log('category store saved to localstorage');
        localStorageHelper.default.setData(storageKey, categories.value);
    };

    const categories = ref(getData());

    const addCategory = (category: Category) => {
        categories.value.unshift(category);
        setData();
    };

    const deleteCategory = (id: string) => {
        categories.value = categories.value.filter(x => x.id !== id);
        console.log('after delete:', JSON.stringify(categories.value));
        setData();
    };

    const updateCategory = (category: Category) => {
        const index = categories.value.findIndex(x => x.id == category.id);

        categories.value.splice(index, 1, category);
        setData();
    };

    const createBudget = (categoryId: string, budget: Budget) => {
        categories.value = categories.value.map(cat => {
            console.log('checking', cat.id, 'against ', categoryId);
            if (cat.id == categoryId){
                console.log('found matching category for ', categoryId)
                cat.budgets.push(budget);
            }
            return cat;
        });
        setData();
    }

    const updateBudget = (categoryId: string, budget: Budget) => {
        categories.value = categories.value.map(cat => {
            console.log('checking', cat.id, 'against ', categoryId);
            if (cat.id == categoryId){
                console.log('found matching category for ', categoryId)
                const index = cat.budgets.findIndex(x => x.id == budget.id);
                cat.budgets.splice(index, 1, budget);
            }
            return cat;
        });
        setData();
    }

    const deleteBudget = (categoryId: string, budgetId: string) => {
        categories.value = categories.value.map(cat => {
            if (cat.id == categoryId){
                cat.budgets = cat.budgets.filter(budget => budget.id !== budgetId);
            }
            return cat;
        });
        setData();
    };

    const getBudgetCategoryName = (categoryId: string, budgetId: string) => {
        if (categoryId == incomeGuid && budgetId == incomeGuid){
            return `Income for ${currentMonthYear.value}`;
        };

        if (categoryId == uncategorizedBudgetGuid && budgetId == uncategorizedBudgetGuid){
            return 'Uncategorized';
        };

        const category = categories.value.find(cat => cat.id == categoryId);
        const budget = category?.budgets.find(budget => budget.id == budgetId);
        const name = `${category?.name} : ${budget?.name}`

        return name;
    };

    return { categories, uncategorizedBudgetGuid, incomeGuid, addCategory, deleteCategory, createBudget, updateCategory, deleteBudget, updateBudget, getBudgetCategoryName };
});