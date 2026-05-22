import type { ParseResult } from 'papaparse';
import type { TransactionRow } from '.';

export type TransactionImport = {
    selectedFile: File,
    fileData: ParseResult<any>,
    mappedTransactions: TransactionRow[],
};

