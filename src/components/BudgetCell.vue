<script setup lang="ts">
import type { Budget, BudgetRow, Category, Subcategory } from '../types/';
import type { Cell } from '@tanstack/vue-table';
import { v4 as uuidv4 } from 'uuid';
import { ref, nextTick, computed } from 'vue';
import { useForm } from 'vee-validate';
import { FlexRender } from '@tanstack/vue-table';
import { useCarouselStore } from '@/stores/carousel';
import { useBudgetStore } from '@/stores/budget';
import { useSubcategoryStore } from '@/stores/subcategory';
import { Input } from '@/components/ui/input';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from '@/components/ui/form';

const props = defineProps({
    category : {
        type: Object as () => Category,
        required: true
    },
    cell : {
        type: Object as () => Cell<BudgetRow, unknown>,
        required: true
    },
    index : {
        type: Number,
        required: true
    },
});

const carouselStore = useCarouselStore();
const budgetStore = useBudgetStore();
const subcategoryStore = useSubcategoryStore();

const editField = ref<string | undefined>(undefined);
const submittedRow = ref<BudgetRow>({} as BudgetRow); 
let inputs = ref<HTMLInputElement[]>([]);

const { handleSubmit, errors, resetForm } = useForm({});

const focusInput = async (key: string | undefined, index: number) => {
    editField.value = key;
    await nextTick();
    inputs.value[0].focus(); 
};

const onSubmit = handleSubmit((values, actions) => {
    console.log(JSON.stringify(values, null, 2)); 

    const updatedBudgetRow: BudgetRow = <BudgetRow>{
        budgetId: submittedRow.value.budgetId,
        name: values?.name ?? submittedRow.value.name,
        dueDate: values.dueDate || values.dueDate == '' ? values.dueDate : submittedRow.value.dueDate,
        amount: values.amount ? parseFloat(values.amount) : submittedRow.value.amount,
        budgetMonth: submittedRow.value.budgetMonth,
        categoryId: submittedRow.value.categoryId,
        subcategoryId: submittedRow.value.subcategoryId,
    };

    const valuesMatch = JSON.stringify(updatedBudgetRow) == JSON.stringify(submittedRow.value);
    if (!valuesMatch)
    {
        const budgetExists = submittedRow.value.budgetId !== '';
        if (budgetExists)
        {
            const updatedBudget = <Budget>{
                id: updatedBudgetRow.budgetId,
                amount: updatedBudgetRow.amount,
                date: updatedBudgetRow.budgetMonth,
                subcategoryId: updatedBudgetRow.subcategoryId,
            };
            budgetStore.updateBudget(updatedBudget);
        }
        else 
        {
            const newBudget = <Budget>{
                id: uuidv4(),
                amount: updatedBudgetRow.amount,
                date: carouselStore.selectedMonthString,
                subcategoryId: updatedBudgetRow.subcategoryId,
            };
            budgetStore.createBudget(newBudget);
        }

        const updatedSubcategory = <Subcategory>{
            id: updatedBudgetRow.subcategoryId,
            name: updatedBudgetRow.name,
            dueDate: updatedBudgetRow.dueDate,
            categoryId: updatedBudgetRow.categoryId,
        }
        subcategoryStore.updateSubcategory(updatedSubcategory);

        focusInput(undefined, 0);
    }
});

const modifyBudget = (budget: BudgetRow) => {
    submittedRow.value = budget;
    onSubmit();
};
</script>

<template >
    <div @click="focusInput(String(cell.getValue()), index)">
	<button v-show="editField != cell.getValue()" >
        <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
    </button>

	<form @submit.prevent="modifyBudget(cell.row.original)" v-show="editField == cell.getValue()" ref="inputs" >
		<FormField v-slot="{ componentField }" :name="String(cell.column.id)">
			<FormItem>
				<FormLabel></FormLabel>
				<FormControl>
					<Input
                        class="text-end"
						type="text" 
						@blur="focusInput(undefined, index)"
						v-bind="componentField"
						:placeholder="'budget '+ cell.column.id"
						:default-value="String(cell.getValue())"
					/>
				</FormControl>
				<FormDescription></FormDescription>
				<FormMessage />
			</FormItem>
		</FormField>
	</form>
    </div>
</template>