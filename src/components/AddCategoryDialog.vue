<script lang="ts" setup>
import type { Budget, Category } from '../types/';

import { ref } from 'vue';
import { createReusableTemplate, useMediaQuery } from '@vueuse/core';
import { v4 as uuidv4 } from 'uuid';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm, useField } from 'vee-validate';
import * as zod from 'zod';
import { Plus } from 'lucide-vue-next';
import { useCategoryStore } from '@/stores/category';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

import HideVirtualKeyboard from '@/components/HideVirtualKeyboard.vue';

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
});

const onSubmit = handleSubmit(values => {

  const test = uuidv4();

    console.log(JSON.stringify(values, null, 2))
    isOpen.value = !isOpen.value;
    console.log('name:', values.name);
    console.log('description:', values.description);
    
    const newCategory: Category = {
        id: uuidv4(),
        name: values.name,
        description: values.description ? values.description : '',
        hasDueDates: values.hasDueDates ? values.hasDueDates : false,
        budgets: [],
    };
    
    console.log('new category:', newCategory);
    categoryStore.addCategory(newCategory);
});

const cancel = () => {
    isOpen.value = !isOpen.value;
}

const [UseTemplate, GridForm] = createReusableTemplate();
const [DefineTriggerTemplate, ReuseTriggerTemplate] = createReusableTemplate()
const isDesktop = useMediaQuery('(min-width: 768px)');
const isOpen = ref(false);

const buttonTitle = '+ Category';
const popupTitle = 'Add New Budget Category';
const popupDescription = 'Define a new category to be added to your budget, i.e., "Monthly Bills"';
</script>

<template>

  <DefineTriggerTemplate>
    <div class="flex justify-center items-center">
      <Button class="bg-rose-200 flex justify-center items-center w-50" variant="secondary">
        <Plus class="h-4 w-4 mr-1 px-0"/>
        Budget Category
      </Button>
    </div>
  </DefineTriggerTemplate>

  <UseTemplate>
    <form class="grid items-start gap-1 px-4" @submit.prevent="onSubmit">

      <HideVirtualKeyboard />

      <FormField v-slot="{ componentField }" name="name">
        <FormItem>
            <FormLabel></FormLabel>
            <FormControl>
                <Input type="text" placeholder="Category Name, i.e. 'Monthly Bills'" v-bind="componentField" />
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
        Add
      </Button>
      <Button variant="outline" @click="cancel">
        Cancel
      </Button>
    </form>
  </UseTemplate>

  <Dialog v-if="isDesktop" v-model:open="isOpen">
    <DialogTrigger as-child>
      <ReuseTriggerTemplate />
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
      <ReuseTriggerTemplate />
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