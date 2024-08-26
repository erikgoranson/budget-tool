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

import { useForm, useField } from 'vee-validate'
import { ListPlus, FilePenLine } from 'lucide-vue-next';
import type { Budget, Category } from '../types/';

const [UseTemplate, GridForm] = createReusableTemplate()
const isDesktop = useMediaQuery('(min-width: 768px)')
const isOpen = ref(false)
const popupTitle = 'Edit Budget Details';
const popupDescription = 'Edit budget details as needed';

const props = defineProps({
    budget : {
        type: Object as () => Budget,
        required: true
    }
});

const { handleSubmit, errors, resetForm } = useForm({
});

const updateBudget = (budget: Budget) => {
    props.budget.name = budget.name;
    props.budget.amount = budget.amount;
    props.budget.dueDate = budget.dueDate;
}

const onSubmit = handleSubmit((values, actions) => {
    //console.log(JSON.stringify(values, null, 2))
    isOpen.value = !isOpen.value;
    const updatedBudget = <Budget>{
        id: props.budget.id,
        name: values.name ? values.name : props.budget.name,
        amount: values.amount ? parseFloat(values.amount) : props.budget.amount,
        dueDate: values.dueDate ? values.dueDate : props.budget.dueDate,
    };

    const valuesMatch = JSON.stringify(updatedBudget) == JSON.stringify(props.budget);
    if (!valuesMatch) updateBudget(updatedBudget);
    actions.resetForm();
});
</script>

<template>
  <UseTemplate as-child>
    <form class="grid items-start gap-1 px-4" @submit.prevent="onSubmit">

      <FormField v-slot="{ componentField }" name="name">
        <FormItem>
            <FormLabel></FormLabel>
            <FormControl>
                <Input type="text" :default-value="budget.name" placeholder="Budget name" v-bind="componentField" />
            </FormControl>
            <FormDescription>
            </FormDescription>
            <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField, }" name="dueDate">
        <FormItem>
            <FormLabel></FormLabel>
            <FormControl>
                <Input type="number" :default-value="Number(budget.dueDate)" placeholder="Due date" v-bind="componentField" />
            </FormControl>
            <FormDescription>
            </FormDescription>
            <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField, }" name="amount">
        <FormItem>
            <FormLabel></FormLabel>
            <FormControl>
                <Input type="text" :default-value="budget.amount" placeholder="Budget amount" v-bind="componentField" />
            </FormControl>
            <FormDescription>
            </FormDescription>
            <FormMessage />
        </FormItem>
      </FormField>

      <Button type="submit">
        Add
      </Button>
    </form>
  </UseTemplate>

  <Dialog v-if="isDesktop" v-model:open="isOpen">
    <DialogTrigger as-child>
        <Button variant="ghost" >
            <FilePenLine class=""/>
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
        <Button variant="ghost" >
            <FilePenLine class="h-4 text-gray-400" />
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

<style scoped>
.lucide {
  @apply h-4 text-gray-500 hover:text-gray-950;
}
Button {
    @apply ml-1 h-4 px-0;
}
</style>