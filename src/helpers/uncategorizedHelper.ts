import type { Subcategory, TransactionRow, Category } from "@/types";

const guid = '00000000-0000-0000-0000-000000000000';
const incomeGuid = '00000000-0000-0000-0000-000000000001';
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
}

export default { guid, incomeGuid, label, category, subcategory, transaction }