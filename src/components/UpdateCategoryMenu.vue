<script lang="ts" setup>
import type { Budget, Category } from '../types/';
import { useForm, useField } from 'vee-validate';
import { useCategoryStore } from '../stores/category';

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../components/ui/form';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { AlertDialogAction, AlertDialogCancel, AlertDialogFooter, } from '../components/ui/alert-dialog';

import UpdateMenu from '../components/UpdateMenu.vue';

const props = defineProps({
    category : {
        type: Object as () => Category,
        required: true
    }
});

const categoryStore = useCategoryStore();

const deleteCategory = () => {
    categoryStore.deleteCategory(props.category.id);
}

const { handleSubmit, errors } = useForm({
});

const onSubmit = handleSubmit(values => {

    const updatedCategory: Category = {
        id: props.category.id, 
        budgets: props.category.budgets, 
        name: values.name ? values.name : props.category.name,
        description: values.description ? values.description : props.category.description,
        hasDueDates: values.hasDueDates !== null ? values.hasDueDates : props.category.hasDueDates,
    };
    
    const valuesMatch = JSON.stringify(updatedCategory) == JSON.stringify(props.category);

    if(!valuesMatch){
        categoryStore.updateCategory(updatedCategory);
    }
});
</script>

<template>
    <UpdateMenu name="Category">

        <template v-slot:deleteForm>
                <div>
                    This action will permanently delete the selected category and all its related data. This cannot be undone. 
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction class="bg-red-500" @click="deleteCategory">Delete</AlertDialogAction>
                </AlertDialogFooter>
            </template>

        <template v-slot:editForm="{ events: { toggleEditForm } }">

            <form class="grid items-start gap-1 px-4" @submit.prevent="onSubmit">

                <FormField v-slot="{ componentField }" name="name">
                    <FormItem>
                        <FormLabel></FormLabel>
                        <FormControl>
                            <Input type="text" placeholder="Category Name, i.e. 'Monthly Bills'" :default-value="props.category.name" v-bind="componentField" />
                        </FormControl>
                        <FormDescription></FormDescription>
                        <FormMessage />
                    </FormItem>
                </FormField>

                <FormField v-slot="{ componentField, }" name="description">
                    <FormItem>
                        <FormLabel></FormLabel>
                        <FormControl>
                            <Input type="text" placeholder="Add a description" :default-value="props.category.description" v-bind="componentField" />
                        </FormControl>
                        <FormDescription></FormDescription>
                        <FormMessage />
                    </FormItem>
                </FormField>

                <FormField v-slot="{ value, handleChange }" name="hasDueDates">
                    <FormItem>
                        <FormLabel></FormLabel>
                        <FormControl>
                            <div class="flex justify-center items-center space-x-2">
                                <Switch 
                                :defaultChecked="props.category.hasDueDates" 
                                :checked="value"
                                @update:checked="handleChange"/>
                                <Label>Does this category have due dates?</Label>
                            </div>
                        </FormControl>
                        <FormDescription></FormDescription>
                        <FormMessage />
                    </FormItem>
                </FormField>

                <Button type="submit" @click="toggleEditForm">Update</Button>
                <Button @click="toggleEditForm">Cancel</Button>
            </form>

        </template>

    </UpdateMenu>
</template>