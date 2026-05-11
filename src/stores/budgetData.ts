import { defineStore } from 'pinia';
import type { BudgetImport } from '@/types';
import localStorageHelper from '@/helpers/localStorage';

import { useCategoryStore } from './category';
import { useSubcategoryStore } from './subcategory';
import { useBudgetStore } from './budget';
import { useGoalStore } from './goal';
import { useTransactionStore } from './transaction';

export const useBudgetDataStore = defineStore('budgetdata', () => {
    const transactionStore = useTransactionStore();
    const categoryStore = useCategoryStore();
    const subcategoryStore = useSubcategoryStore();
    const budgetStore = useBudgetStore();
    const goalStore = useGoalStore();

    const getAllBudgetData =() => {
        const transactions = transactionStore.transactions;
        const category = categoryStore.categories;
        const subcategories = subcategoryStore.subcategories;
        const budgets = budgetStore.budgets;
        const goals = goalStore.goals;

        return { budgets, category, subcategories, transactions, goals } as BudgetImport;
    };

    const putBudgetData = (data: BudgetImport) => {
        data?.category?.forEach(category => categoryStore.putCategory(category));
        data?.subcategories?.forEach(subcategory => subcategoryStore.putSubcategory(subcategory));
        data?.budgets?.forEach(budget => budgetStore.putBudget(budget));
        data?.goals?.forEach(goal => goalStore.putGoal(goal));
        data?.transactions?.forEach(transaction => transactionStore.putTransaction(transaction));
    };

    const truncateBudgetData = () => {
        localStorageHelper.clearData();
        categoryStore.categories = [];
        subcategoryStore.subcategories = [];
        budgetStore.budgets = [];
        goalStore.goals = [];
        transactionStore.transactions = [];
    };

    return { getAllBudgetData, putBudgetData, truncateBudgetData }
})