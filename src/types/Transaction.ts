export type Transaction = {
    id: string,
    date: string,
    income: boolean,
    payee?: string,
    categoryId: string,
    budgetId: string,
    note?: string,
    hasCleared: boolean,
    amount: number, 
};