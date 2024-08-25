import type { Budget } from "./Budget";

//parent category: i.e., bills, debt, etc
export type Category = {
    name: string,
    //amount: number,
    description: string, //needs to be optional somehow 
    hasDueDate: boolean //whether a Due column is added (which denotes the day of any given month wherestuff is due)
    budgets: Array<Budget>
};