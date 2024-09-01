export type Transaction = {
    id: number,
    date: string //Date, //needs to be yyyyMMdd
    income: boolean,
    //monthInt: number, //i.e., '08',
    //yearInt: number, //i.e., '2024',
    payee?: string,
    categoryId: number,
    budgetId: number,
    note?: string,
    hasCleared: boolean,
    amount: number, 
    //status: 'pending' | 'processing' | 'success' | 'failed'
};