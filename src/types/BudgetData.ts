import type { Budget, Category, Subcategory, Transaction, Goal } from '.';

export type BudgetData = {
    budget: Budget[],
    category: Category[],
    transaction: Transaction[],
    subcategory: Subcategory[];
    goal: Goal[],
};