import type { Budget, BudgetRow, Category, Subcategory } from '@/types/';
import { toTypedSchema } from '@vee-validate/zod'
import * as zod from 'zod';
import { getOrAssignGuid, compareObjects, baseProps } from '@/helpers/baseFormHelper';

import { useBudgetStore } from '@/stores/budget';
import { useCarouselStore } from '@/stores/carousel';
import { useSubcategoryStore } from '@/stores/subcategory';

export const formProps = {
    ...baseProps,
    category : {
        type: Object as () => Category,
        required: true,
        default: {} as Category,
    },
    budgetRow : {
        type: Object as () => BudgetRow,
        required: false,
        default: {} as BudgetRow,
    },
};

export const getValidationSchema = (category: Category) => {
    return toTypedSchema(
        zod.object({
          budgetId: zod.string().default(''),
          name: zod.string().min(1, { message: 'Budget name is required' }),
          dueDate: zod.number().or(zod.string()).optional(),
          amount: zod.number(),
          budgetMonth: zod.string().default(''),
          subcategoryId: zod.string().default(''),
          categoryId: zod.string().default(category.id),
        })
    );
};

export const handleSubmission = (userInput: any, originalRow: BudgetRow) => {
    const budgetStore = useBudgetStore();
    const carouselStore = useCarouselStore();
    const subcategoryStore = useSubcategoryStore();

    const valuesMatch = compareObjects(userInput, originalRow);
    if (!valuesMatch) {

        const mergedValues: BudgetRow = { ...originalRow, ...userInput }; 
        // console.log('existing values', JSON.stringify(originalRow, null, 2));
        // console.log('new values', JSON.stringify(userInput, null, 2));
        // console.log('MERGED values', JSON.stringify(mergedValues, null, 2));

        //validate guids and month string
        mergedValues.subcategoryId = getOrAssignGuid(mergedValues.subcategoryId);
        mergedValues.budgetId = getOrAssignGuid(mergedValues.budgetId);
        mergedValues.budgetMonth = carouselStore.selectedMonthString;
        // console.log('revised values', JSON.stringify(mergedValues, null, 2));

        const mergedSubcategory = <Subcategory>{
            id: mergedValues.subcategoryId,
            name: mergedValues.name,
            dueDate: mergedValues.dueDate ?? '', //TODO: fix this
            categoryId: mergedValues.categoryId,
        };
        
        const mergedBudget = <Budget>{
            id: mergedValues.budgetId,
            amount: mergedValues.amount,
            date: mergedValues.budgetMonth,
            subcategoryId: mergedValues.subcategoryId,
        };
        
        const subcategoryExists = originalRow.subcategoryId !== '' && originalRow.subcategoryId !== undefined;
        if (subcategoryExists) {
            console.log('updating subcategory:', JSON.stringify(mergedSubcategory, null, 2));
            subcategoryStore.updateSubcategory(mergedSubcategory);
        }
        else 
        {
            console.log('creating new subcategory:', JSON.stringify(mergedSubcategory, null, 2));
            subcategoryStore.createSubcategory(mergedSubcategory);
        };

        const budgetExistsForThisMonth = originalRow.budgetId !== '' && originalRow.budgetId !== undefined;
        if (budgetExistsForThisMonth){
            console.log('updating', mergedSubcategory.name, 'budget for', carouselStore.selectedMonthString, JSON.stringify(mergedBudget, null, 2));
            budgetStore.updateBudget(mergedBudget);
        }
        else 
        {
            console.log('creating new', mergedSubcategory.name, 'budget for', carouselStore.selectedMonthString, JSON.stringify(mergedBudget, null, 2));
            budgetStore.createBudget(mergedBudget);
        };
    };
};