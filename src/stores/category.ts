import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { Category } from '../types/';

export const useCategoryStore = defineStore('category', () => {
    const categories = ref(<Category[]>[]);

    const addCategory = (category: Category) => {
        categories.value.unshift(category);
    };

    const deleteCategory = (id: number) => {
        categories.value = categories.value.filter(x => x.id !== id);
    };

    const updateCategory = (category: Category) => {
        const index = categories.value.findIndex(x => x.id == category.id);

        categories.value.splice(index, 1, category);
    };

    const deleteBudget = (categoryId: number, budgetId: number) => {
        categories.value = categories.value.map(cat => {
            if (cat.id == categoryId){
                cat.budgets = cat.budgets.filter(budget => budget.id !== budgetId);
            }

            return cat;
        });
    };

    const getBudgetCategoryName = (categoryId: number, budgetId: number) => {
        const category = categories.value.find(cat => cat.id == categoryId);

        const budget = category?.budgets.find(budget => budget.id == budgetId);

        const name = `${category?.name} : ${budget?.name}`

        return name;
    };

    return { categories, addCategory, deleteCategory, updateCategory, deleteBudget, getBudgetCategoryName };
});