import type { Transaction } from '../types/';

export interface TransactionRow extends Transaction {
    budgetCategoryName?: string,
}