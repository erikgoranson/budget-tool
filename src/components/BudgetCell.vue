<script setup lang="ts">

//maybe rename this BudgetCell


//REORGANIZE THESE

//types
//libraries
//helpers +components
//refs
//consts
//methods

import type { Budget, Category } from '../types/';
import { h, ref, computed, nextTick, watch, toRef, toRefs, reactive } from 'vue';
import { storeToRefs } from 'pinia';
import { valueUpdater } from '../lib/utils'; 
import currencyFormatter from '../helpers/numberFormat'; 
import { useForm, useField } from 'vee-validate';
import { useTransactionStore } from '@/stores/transaction';
import { useMediaQuery } from '@vueuse/core';
import { ArrowUpDown, } from 'lucide-vue-next';
import { useCategoryStore } from '@/stores/category';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from '@/components/ui/form';
import type { Cell, ColumnDef,ColumnFiltersState, GlobalFilterTableState, SortingState, VisibilityState, } from '@tanstack/vue-table';
import { FlexRender, getCoreRowModel, getExpandedRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useVueTable, } from '@tanstack/vue-table';

const props = defineProps({
    categoryId : {
        type: String,
        required: true
    },
    cell : {
        type: Object as () => Cell<Budget, unknown>,
        required: true
    },
    index : {
        type: Number,
        required: true
    },
});

const categoryStore = useCategoryStore();
const transactionStore = useTransactionStore();

const editField = ref('');
const modifiedBudget = ref<Budget>({} as Budget);
const divs = ref([]); //to be used for autofocusing

let inputs = ref<HTMLInputElement[]>([]);


const { handleSubmit, errors, resetForm } = useForm({});

const focusInput = async (key: string, index: number) => {
    console.log('key is: ', key)
    //console.log('props')
    editField.value = key;

    //console.log('index is', index);
    //console.log('new refs thing is: ', inputs.value)
    //console.log('test', inputs.value[index])
    //console.log('childrne are', inputs.value[index].children)


    //console.log('ref is:', inputs.value[index]);
    //console.log('childrne are', inputs.value[index].children)

    await nextTick();
    inputs.value[0].focus(); 
    //this doesnt work becasue the index of inputs.value increases with every row of v-for
    //A simpler way to do this is to use a dynamic ref name. We still need i and index to find the relevant element but there's no calculation required.
    //https://stackoverflow.com/questions/58704223/how-to-access-an-elements-ref-index-within-the-nested-v-for-loop-in-vue-js
};

const onSubmit = handleSubmit((values, actions) => {
    console.log(JSON.stringify(values, null, 2)) //debug
    const updatedBudget = <Budget>{
        id: modifiedBudget.value.id,
        name: values.name ? values.name : modifiedBudget.value.name,
        amount: values.amount ? parseFloat(values.amount) : modifiedBudget.value.amount,
        dueDate: values.dueDate ? values.dueDate : modifiedBudget.value.dueDate,
    };

    const valuesMatch = JSON.stringify(updatedBudget) == JSON.stringify(modifiedBudget.value);
    if (!valuesMatch) categoryStore.updateBudget(props.categoryId, updatedBudget);
    focusInput('', 0);
});

const modifyBudget = (budget: Budget) => {
    modifiedBudget.value = budget;
    onSubmit();
};

</script>

<template>
	<span v-show="editField != cell.getValue()" @click="focusInput(String(cell.getValue()), index)">
		<FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
	</span>

	<form @submit.prevent="modifyBudget(cell.row.original)" v-show="editField == cell.getValue()" ref="inputs" >
		<FormField v-slot="{ componentField }" :name="String(cell.column.id)">
			<FormItem>
				<FormLabel></FormLabel>
				<FormControl>
					<Input 
						type="text" 
						@blur="focusInput('', index)"
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
</template>