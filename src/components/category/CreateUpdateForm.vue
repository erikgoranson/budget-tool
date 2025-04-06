<script lang="ts" setup>
import type { Budget, Category } from '@/types/';
import { ref, computed, useTemplateRef  } from 'vue';

import { useForm, useField } from 'vee-validate';
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

enum Action {
    create = 'create',
    update = 'update'
};

import { toTypedSchema } from '@vee-validate/zod';
import * as zod from 'zod';

const props = defineProps({
    category : {
        type: Object as () => Category,
    }, 
    closeDialogFunction: {
        type: Function as (...args: any) => any,
        required: true,
    }
});

const categoryStore = useCategoryStore();

const validationSchema = toTypedSchema(
    zod.object({
        name: zod.string().min(1, { message: 'Category name is required' }),
        description: zod.string().optional(),
        hasDueDates: zod.boolean().default(false).optional(),
    }),
);

const { handleSubmit, errors } = useForm({
    validationSchema,
    //use initial values if applicable
    initialValues: props.category
});

const action = computed(() => {
    if (props.category === undefined){
        //return 'create';
        return Action.create;
    }
    else {
        //return 'update';
        return Action.update;
    }
});

const onSubmit = handleSubmit(values => {

    //merge the stuff
    console.log('existing values', JSON.stringify(props.category, null, 2));
    console.log('new values', JSON.stringify(values, null, 2));

    //const combinedObj = { ...obj1, ...obj2 }; // { a: 1, b: 2 }
    const mergeSpreadSyntaxTest = { ...props.category, ...values };
    console.log('MERGE', JSON.stringify(mergeSpreadSyntaxTest, null, 2));

    //fix duedate

    if(props.closeDialogFunction !== undefined){
        props.closeDialogFunction();
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