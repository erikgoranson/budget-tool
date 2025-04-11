import type { TransactionRow, Transaction } from '@/types';
import { toTypedSchema } from '@vee-validate/zod';
import * as zod from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { useTransactionStore } from '@/stores/transaction';

const compareObjects = (originalValue: any, formInput: any) => {
    return JSON.stringify(originalValue) == JSON.stringify(formInput);
};

const getOrAssignGuid = (guid: string) => {
    return (guid != '') ? guid : uuidv4();
};

export const formProps = {
    transaction : {
        type: Object as () => TransactionRow,
        required: false,
        default: {} as TransactionRow,
    },
    onSubmitFunction: { 
        type: Function as (...args: any) => any,
        required: false,
    },
};

export const getTransactionRowSchema = () => {
    const transactionStore = useTransactionStore();
    return toTypedSchema(
        zod.object({
            id: zod.string().default(''),
            date: zod.string().refine(v => v, { message: 'A date is required.' }),
            income: zod.boolean().optional().default(false),
            //payee: zod.string().default(''), //not used
            categoryId: zod.string().default(transactionStore.uncategorizedGuid),
            subcategoryId: zod.string().default(transactionStore.uncategorizedGuid),
            note: zod.string().optional(),
            hasCleared: zod.boolean().optional().default(false),
            amount: zod.number(),
            budgetCategoryName: zod.string().default('Uncategorized'),
        })
    );
};

export const handleSubmission = (userInput: any, originalRow: Transaction) => {
    const transactionStore = useTransactionStore();
    const mergedValues: Transaction = { ...originalRow, ...userInput }; 
    // console.log('existing values', JSON.stringify(originalRow, null, 2));
    // console.log('new values', JSON.stringify(userInput, null, 2));
    // console.log('MERGED values', JSON.stringify(mergedValues, null, 2));

    const valuesMatch = compareObjects(userInput, originalRow);
    if (!valuesMatch) 
    {
        mergedValues.id = getOrAssignGuid(mergedValues.id);
        if (mergedValues.income)
        {
            mergedValues.categoryId = transactionStore.incomeGuid;
        }
        // console.log('validated values', JSON.stringify(mergedValues, null, 2));

        const transactionExists = originalRow.id !== '' && originalRow.id !== undefined;
        if (transactionExists)
        {
            console.log('update transaction');
            transactionStore.updateTransaction(mergedValues);
        }
        else 
        {
            console.log('create transaction');
            transactionStore.createTransaction(mergedValues);
        }
    };
};
