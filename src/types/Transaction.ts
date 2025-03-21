export type Transaction = {
    id: string,
    date: string,
    income: boolean,
    payee?: string,
    categoryId: string,
    subcategoryId: string,
    budgetId: string,
    note?: string,
    hasCleared: boolean,
    amount: number, 
};