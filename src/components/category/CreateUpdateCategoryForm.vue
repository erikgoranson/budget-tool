<script lang="ts" setup>
import type {  Category } from '@/types/';
import { useForm } from 'vee-validate';
import { v4 as uuidv4 } from 'uuid';
import { toTypedSchema } from '@vee-validate/zod';
import * as zod from 'zod';
import { useCategoryStore } from '@/stores/category';

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

import HideVirtualKeyboard from '@/components/HideVirtualKeyboard.vue';

const props = defineProps({
    category : {
        type: Object as () => Category,
        required: false,
        default: {} as Category,
    }, 
    onSubmitFunction: { 
        type: Function as (...args: any) => any,
        required: true,
    }
});

const categoryStore = useCategoryStore();

const validationSchema = toTypedSchema(
    zod.object({
        id: zod.string().default(uuidv4()),
        name: zod.string().min(1, { message: 'Category name is required' }),
        description: zod.string().optional(),
        hasDueDates: zod.boolean().default(false).optional(),
    }),
);

const { handleSubmit, errors } = useForm({
    validationSchema,
    initialValues: props.category
});

const compareObjects = (originalValue: any, formInput: Category) => {
    const idValuesAltered = originalValue?.id !== formInput.id && formInput.id !== undefined;
    if (idValuesAltered)
    {
        console.error(`ID value is being changed from ${originalValue?.id} to ${formInput.id}`);
        return;
    }
    return JSON.stringify(originalValue) == JSON.stringify(formInput);
}

const onSubmit = handleSubmit(values => {
    const valuesMatch = compareObjects(values, props.category);
    if (!valuesMatch) 
    {
        const mergedValues = { ...props.category, ...values }; 
        // console.log('existing values', JSON.stringify(props.category, null, 2));
        // console.log('new values', JSON.stringify(values, null, 2));
        // console.log('MERGED values', JSON.stringify(mergedValues, null, 2));

        if (!props.category?.id)
        {
            console.log('creating new category:', JSON.stringify(mergedValues, null, 2));
            categoryStore.addCategory(mergedValues);
        }
        else 
        {
            console.log(`updating category ${props.category.id}:`, JSON.stringify(mergedValues, null, 2));
            categoryStore.updateCategory(mergedValues);
        }
    }

    if(props.onSubmitFunction !== undefined){
        props.onSubmitFunction();
    }
});
</script>

<template>
    <form class="grid items-start gap-1 px-4" @submit.prevent="onSubmit">
        <HideVirtualKeyboard />

        <FormField v-slot="{ componentField }" name="name">
            <FormItem>
                <FormLabel></FormLabel>
                <FormControl>
                    <Input type="text" placeholder="Category Name, i.e. 'Monthly Bills'" v-bind="componentField" />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
            </FormItem>
        </FormField>

        <FormField v-slot="{ componentField, }" name="description">
            <FormItem>
                <FormLabel></FormLabel>
                <FormControl>
                    <Input type="text" placeholder="Add a description" v-bind="componentField" />
                </FormControl>
                <FormDescription>
                </FormDescription>
                <FormMessage />
            </FormItem>
        </FormField>

        <FormField v-slot="{ value, componentField, handleChange }" name="hasDueDates">
            <FormItem>
                <FormLabel></FormLabel>
                <FormControl>
                    <div class="flex items-center space-x-2">
                        <Switch 
                            :defaultChecked="props.category?.hasDueDates" 
                            v-bind="componentField"
                            :check="value"
                            @update:checked="handleChange"
                        />
                        <Label>Does this category have due dates?</Label>
                    </div>
                </FormControl>
                <FormDescription>
                </FormDescription>
                <FormMessage />
            </FormItem>
        </FormField>

        <Button type="submit">
        Create
        </Button>
    </form>
</template>