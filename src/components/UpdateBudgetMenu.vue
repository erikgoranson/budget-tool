<script lang="ts" setup>
import type { Budget, Category } from '../types/';

import { useForm, useField } from 'vee-validate'
import { useCategoryStore } from '@/stores/category';

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

const props = defineProps({
    budget : {
        type: Object as () => Budget,
        required: true
    },
    categoryId: {
        type: String,
        required: true,
    },
});

const categoryStore = useCategoryStore();

const { handleSubmit, errors, resetForm } = useForm({
});


const deleteBudget = () => {
    console.log('deleting budget', props.budget.id);
    categoryStore.deleteBudget(props.categoryId, props.budget.id)
};

const onSubmit = handleSubmit((values, actions) => {
    //console.log(JSON.stringify(values, null, 2))
    const updatedBudget = <Budget>{
        id: props.budget.id,
        name: values.name ? values.name : props.budget.name,
        amount: values.amount ? parseFloat(values.amount) : props.budget.amount,
        dueDate: values.dueDate ? values.dueDate : props.budget.dueDate,
    };

    const valuesMatch = JSON.stringify(updatedBudget) == JSON.stringify(props.budget);
    if (!valuesMatch) categoryStore.updateBudget(props.categoryId, updatedBudget);
    //actions.resetForm();
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

            <FormField v-slot="{ componentField }" name="name">
                <FormItem>
                    <FormLabel></FormLabel>
                    <FormControl>
                        <Input type="text" :default-value="budget.name" placeholder="Budget name" v-bind="componentField" />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                </FormItem>
            </FormField>

            <FormField v-slot="{ componentField, }" name="dueDate">
                <FormItem>
                    <FormLabel></FormLabel>
                    <FormControl>
                        <Input type="number" :default-value="Number(budget.dueDate)" placeholder="Due date" v-bind="componentField" />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                </FormItem>
            </FormField>

            <FormField v-slot="{ componentField, }" name="amount">
                <FormItem>
                    <FormLabel></FormLabel>
                    <FormControl>
                        <Input type="text" :default-value="budget.amount" placeholder="Budget amount" v-bind="componentField" />
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