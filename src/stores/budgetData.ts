import { defineStore } from 'pinia';
import type { BudgetData } from '@/types';
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
        const transaction = transactionStore.transactions;
        const category = categoryStore.categories;
        const subcategory = subcategoryStore.subcategories;
        const budget = budgetStore.budgets;
        const goal = goalStore.goals;

        return { budget, category, subcategory, transaction, goal } as BudgetData;
    };

    const putBudgetData = (data: BudgetData) => {
        data?.category?.forEach(category => categoryStore.putCategory(category));
        data?.subcategory?.forEach(subcategory => subcategoryStore.putSubcategory(subcategory));
        data?.budget?.forEach(budget => budgetStore.putBudget(budget));
        data?.goal?.forEach(goal => goalStore.putGoal(goal));
        data?.transaction?.forEach(transaction => transactionStore.putTransaction(transaction));
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