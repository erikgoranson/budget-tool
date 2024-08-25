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

import { toTypedSchema } from '@vee-validate/zod'
import { useForm, useField } from 'vee-validate'
import * as zod from 'zod';

import type { Budget, Category } from '../types/';
import { useCategoryStore } from '@/stores/category.ts';
const categoryStore = useCategoryStore();


const validationSchema = toTypedSchema(
    zod.object({
        name: zod.string().min(1, { message: 'This is required' }),
        description: zod.string().optional(),
        //amount
    })
)

const { handleSubmit, errors } = useForm({
  validationSchema,
});

const onSubmit = handleSubmit(values => {
  //alert(JSON.stringify(values, null, 2));
  console.log(JSON.stringify(values, null, 2))
  isOpen.value = !isOpen.value;
  console.log('name:', values.name)
  console.log('description:', values.description)

  //ConvertToCategory? 
  const test: Category = {
    name: values.name,
    //description: values.description | undefined,
    description: values.description ? values.description : '',
    hasDueDate: false,
    budgets: [],
  };

  console.log('new category:', test);
  categoryStore.addCategory(test);

});

const cancel = () => {
    isOpen.value = !isOpen.value;
}

const [UseTemplate, GridForm] = createReusableTemplate()
const isDesktop = useMediaQuery('(min-width: 768px)')

const isOpen = ref(false)
function test(){
    console.log('plz work')
    isOpen.value = !isOpen.value;
}

const buttonTitle = 'Add Budget Category';
const popupTitle = 'Add New Budget Category';
const popupDescription = 'Define a new category to be added to your budget, i.e., "Monthly Bills"';

</script>

<template>
  <UseTemplate>
    <form class="grid items-start gap-4 px-4" @submit.prevent="onSubmit">

      <FormField v-slot="{ componentField }" name="name">
        <FormItem>
            <FormLabel>Category Name</FormLabel>
            <FormControl>
                <Input type="text" placeholder="Bills" v-bind="componentField" />
            </FormControl>
            <FormDescription>
            </FormDescription>
            <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="description">
        <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
                <Input type="text" placeholder="Monthly bills and whatnot" v-bind="componentField" />
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