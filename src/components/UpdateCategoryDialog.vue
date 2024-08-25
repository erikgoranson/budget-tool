<script lang="ts" setup>
import { ref } from 'vue'
import { createReusableTemplate, useMediaQuery } from '@vueuse/core'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

import { toTypedSchema } from '@vee-validate/zod'
import { useForm, useField } from 'vee-validate'
import * as zod from 'zod';

import type { Budget, Category } from '../types/';
import { useCategoryStore } from '@/stores/category.ts';

const props = defineProps({
    budget : {
        type: Object as () => Category,
        required: true
    }
});

const categoryStore = useCategoryStore();

const { handleSubmit, errors } = useForm({
  //validationSchema,
});

const onSubmit = handleSubmit(values => {
    console.log('current dialog state:', isOpen.value)
    console.log(JSON.stringify(values, null, 2))
    isOpen.value = !isOpen.value;
    console.log('name:', values.name)
    console.log('description:', values.description)
    
    const updatedCategory: Category = {
        id: props.budget.id, 
        budgets: props.budget.budgets, 
        name: values.name ? values.name : props.budget.name,
        description: values.description ? values.description : props.budget.description,
        hasDueDates: values.hasDueDates ? values.hasDueDates : props.budget.hasDueDates,
    };
    
    console.log('category with new input:', updatedCategory);

    const valuesMatch = JSON.stringify(updatedCategory) == JSON.stringify(props.budget);
    console.log('old value and new values match?:', valuesMatch)

    if(!valuesMatch){
        categoryStore.updateCategory(updatedCategory);
    }
});

const [UseTemplate, GridForm] = createReusableTemplate()
const isDesktop = useMediaQuery('(min-width: 768px)')

const isOpen = ref(false)

const buttonTitle = 'Update';
const popupTitle = 'Update Budget Category';
const popupDescription = 'Update details as needed';
</script>

<template>
  <UseTemplate>
    <form class="grid items-start gap-1 px-4" @submit.prevent="onSubmit">

      <FormField v-slot="{ componentField }" name="name">
        <FormItem>
            <FormLabel></FormLabel>
            <FormControl>
                <Input type="text" placeholder="Category Name, i.e. 'Monthly Bills'" :default-value="props.budget.name" v-bind="componentField" />
            </FormControl>
            <FormDescription>
            </FormDescription>
            <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField, }" name="description">
        <FormItem>
            <FormLabel></FormLabel>
            <FormControl>
                <Input type="text" placeholder="Add a description" :default-value="props.budget.description" v-bind="componentField" />
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
                    v-model:checked="props.budget.hasDueDates"
                    
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
        Update
      </Button>
      <Button>Cancel</Button>
    </form>
  </UseTemplate>

  <Dialog v-if="isDesktop" v-model:open="isOpen">
    <DialogTrigger as-child>
      <Button variant="outline">
        {{ buttonTitle }}
      </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{{ popupTitle }}</DialogTitle>
        <DialogDescription>{{ popupDescription }}</DialogDescription>
      </DialogHeader>
      <GridForm />
    </DialogContent>
  </Dialog>

  <Drawer v-else v-model:open="isOpen">
    <DrawerTrigger as-child>
      <Button variant="outline">
        {{ buttonTitle }}
      </Button>
    </DrawerTrigger>
    <DrawerContent>
      <DrawerHeader class="text-left">
        <DrawerTitle>{{ popupTitle }}</DrawerTitle>
        <DrawerDescription>{{ popupDescription }} </DrawerDescription>
      </DrawerHeader>
      <GridForm />
      <DrawerFooter class="pt-2">
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
</template>