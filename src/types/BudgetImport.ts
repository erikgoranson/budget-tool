import type { Budget, Category, Subcategory, Transaction, Goal } from '.';

export type BudgetImport = {
    budgets: Budget[],
    category: Category[],
    transactions: Transaction[],
    subcategories: Subcategory[];
    goals: Goal[],
};