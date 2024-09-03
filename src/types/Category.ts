import type { Budget } from "./Budget";

export type Category = {
    id: string,
    name: string,
    description: string, 
    hasDueDates: boolean, 
    budgets: Array<Budget>,
};