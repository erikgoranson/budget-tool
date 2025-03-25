<script lang="ts" setup>
import type { Budget, BudgetRow, Category, Subcategory } from '../types/';

import { useForm, useField } from 'vee-validate';
import { v4 as uuidv4 } from 'uuid';
import { useBudgetStore } from '@/stores/budget';
import { useSubcategoryStore } from '@/stores/subcategory';
import { useCarouselStore } from '@/stores/carousel';

import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { AlertDialogAction, AlertDialogCancel, AlertDialogFooter, } from '@/components/ui/alert-dialog';

import UpdateMenu from '../components/UpdateMenu.vue';
import HideVirtualKeyboard from '@/components/HideVirtualKeyboard.vue';

const props = defineProps({
    row : {
        type: Object as () => BudgetRow,
        required: true
    },
    categoryId: {
        type: String,
        required: true,
    },
});

const carouselStore = useCarouselStore();
const budgetStore = useBudgetStore();
const subcategoryStore = useSubcategoryStore();

const { handleSubmit, errors, resetForm } = useForm({
});

const deleteBudget = () => {
    console.log('deleting budget', props.row.budgetId);
    budgetStore.deleteBudget(props.row.budgetId);
    subcategoryStore.deleteSubcategory(props.row.subcategoryId);
};

const onSubmit = handleSubmit((values, actions) => {

    const updatedBudgetRow: BudgetRow = <BudgetRow>{
        budgetId: props.row.budgetId,
        name: values?.name ?? props.row.name, 
        dueDate: values.dueDate || values.dueDate == '' ? values.dueDate : props.row.dueDate,
        amount: values.amount ? parseFloat(values.amount) : props.row.amount,
        budgetMonth: props.row.budgetMonth,
        categoryId: props.row.categoryId,
        subcategoryId: props.row.subcategoryId,
    };
    const valuesMatch = JSON.stringify(updatedBudgetRow) == JSON.stringify(props.row);

    if (!valuesMatch) 
    {
        const budgetExists = updatedBudgetRow.budgetId !== '';
        console.log('budget exists:', budgetExists, updatedBudgetRow.budgetId);

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
    }
});
</script>

<template>

    <UpdateMenu name="Budget">
        <template v-slot:deleteForm>
            <div>
                This action will permanently delete the selected budget and all its related data. This cannot be undone. 
            </div>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction class="bg-red-500" @click="deleteBudget">Delete</AlertDialogAction>
            </AlertDialogFooter>
        </template>

        <template v-slot:editForm="{ events: { toggleEditForm } }">

            <form class="grid items-start gap-1 px-4" @submit.prevent="onSubmit">

                <HideVirtualKeyboard />
                
            <FormField v-slot="{ componentField }" name="name">
                <FormItem>
                    <FormLabel></FormLabel>
                    <FormControl>
                        <Input type="text" :default-value="row.name" placeholder="Budget name" v-bind="componentField" />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                </FormItem>
            </FormField>

            <FormField v-slot="{ componentField, }" name="dueDate">
                <FormItem>
                    <FormLabel></FormLabel>
                    <FormControl>
                        <Input type="number" :default-value="Number(row.dueDate)" placeholder="Due date" v-bind="componentField" />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                </FormItem>
            </FormField>

            <FormField v-slot="{ componentField, }" name="amount">
                <FormItem>
                    <FormLabel></FormLabel>
                    <FormControl>
                        <Input type="number" step=0.01 inputmode='decimal' :default-value="row.amount" placeholder="Budget amount" v-bind="componentField" />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                </FormItem>
            </FormField>

            <Button type="submit" @click="toggleEditForm">Add</Button>
            </form>

        </template>
    </UpdateMenu>

</template>

<style scoped>
.lucide {
  @apply h-4 text-gray-500 hover:text-gray-950;
}
</style>