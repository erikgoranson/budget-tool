export type Transaction = {
    id: string,
    date: string,
    income: boolean,
    payee?: string,
    categoryId: string,
    subcategoryId: string,
    note?: string,
    hasCleared: boolean,
    amount: number, 
};