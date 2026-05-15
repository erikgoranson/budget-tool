import type { Budget } from "./Budget";

export interface BudgetRow extends Budget {
    name: string,
    dueDate: number | null,
    categoryId: string,
};