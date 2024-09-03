import { ref, computed} from 'vue';
import { defineStore } from 'pinia';
import type { Category, Budget } from '../types/';
import * as localStorageHelper from '@/helpers/localStorage';

export const useCategoryStore = defineStore('category', () => {

    const storageKey = 'category';

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

    const deleteCategory = (id: number) => {
        categories.value = categories.value.filter(x => x.id !== id);
        console.log('after delete:', JSON.stringify(categories.value));
        setData();
    };

    const updateCategory = (category: Category) => {
        const index = categories.value.findIndex(x => x.id == category.id);

        categories.value.splice(index, 1, category);
        setData();
    };

    const createBudget = (categoryId: number, budget: Budget) => {
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

    const updateBudget = (categoryId: number, budget: Budget) => {
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

    const deleteBudget = (categoryId: number, budgetId: number) => {
        categories.value = categories.value.map(cat => {
            if (cat.id == categoryId){
                cat.budgets = cat.budgets.filter(budget => budget.id !== budgetId);
            }
            return cat;
        });
        setData();
    };

    const getBudgetCategoryName = (categoryId: number, budgetId: number) => {
        const category = categories.value.find(cat => cat.id == categoryId);
        const budget = category?.budgets.find(budget => budget.id == budgetId);
        const name = `${category?.name} : ${budget?.name}`

        return name;
    };

    return { categories, addCategory, deleteCategory, createBudget, updateCategory, deleteBudget, updateBudget, getBudgetCategoryName };
});