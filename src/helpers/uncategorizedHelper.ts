import type { Subcategory, TransactionRow, Category } from "@/types";

const guid = '00000000-0000-0000-0000-000000000000';
const label = 'Uncategorized';

const subcategory = <Partial<Subcategory>>{ 
    categoryId: guid, 
    id: guid,
};

const transaction = <Partial<TransactionRow>>{
    budgetCategoryName: label,
    categoryId: guid, 
    id: guid,
};

const category = <Category>{
    id: guid,
    name: label,
    description: 'Transactions have been added that have no budget category.',
    hasDueDates: false,
};

const incomeGuid = '00000000-0000-0000-0000-000000000001';
const importedGuid = '11111111-1111-1111-1111-111111111111';

const importedCategory = <Category>{
    id: importedGuid,
    name: 'Imported',
    description: 'Budgets created while importing from a bank file',
    hasDueDates: false,
}

export default { guid, label, category, subcategory, transaction, incomeGuid, importedGuid, importedCategory }