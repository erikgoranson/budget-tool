<script lang="ts" setup>
import type { BudgetRow, Category } from '@/types';
import { useForm } from 'vee-validate';
import { getValidationSchema, formProps, handleSubmission } from './budgetFormHelper';

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

import HideVirtualKeyboard from '@/components/HideVirtualKeyboard.vue';

const props = defineProps(formProps);

const { handleSubmit, errors, resetForm } = useForm({
  validationSchema: getValidationSchema(props.category),
  initialValues: props.budgetRow as any, 
});

const onSubmit = handleSubmit((values, actions) => {
    handleSubmission(values, props.budgetRow);
    props?.onSubmitFunction();
    actions.resetForm();
});
</script>

<template>
    <form class="grid items-start gap-1 px-4" @submit.prevent="onSubmit">

        <HideVirtualKeyboard />

        <FormField v-slot="{ componentField }" name="name">
            <FormItem>
                <FormLabel>Budget Name</FormLabel>
                <FormControl>
                    <Input type="text"  placeholder="Budget name" v-bind="componentField" />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
            </FormItem>
        </FormField>

        <FormField v-slot="{ componentField, }" name="dueDate">
            <FormItem>
                <FormLabel>Due Date</FormLabel>
                <FormDescription>The day of a given month where this budget is due. i.e., the 1st for a rent payment</FormDescription>
                <FormControl>
                    <Input type="number"  placeholder="Due date" v-bind="componentField" />
                </FormControl>
                
                <FormMessage />
            </FormItem>
        </FormField>

        <FormField v-slot="{ componentField, }" name="amount">
            <FormItem>
                <FormLabel>Budget Amount</FormLabel>
                <FormControl>
                    <Input type="number" step=0.01 inputmode='decimal'  placeholder="Budget amount" v-bind="componentField" />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
            </FormItem>
        </FormField>
        
        <Button type="submit" >Update</Button>
    </form>
</template>

<style scoped>
.lucide {
  @apply h-4 text-gray-500 hover:text-gray-950;
}
</style>