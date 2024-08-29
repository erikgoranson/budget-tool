<script setup lang="ts">
import type { Budget, Category, Transaction } from '../types/';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
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
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@/components/ui/number-field';
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { toast } from '@/components/ui/toast'

import { cn } from '@/lib/utils'

import { CalendarDate, DateFormatter, getLocalTimeZone, parseDate, today } from '@internationalized/date'
import { toDate } from 'radix-vue/date'
import { Calendar as CalendarIcon } from 'lucide-vue-next'


import { computed, h, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { createReusableTemplate, useMediaQuery } from '@vueuse/core'
import { SquarePlus } from 'lucide-vue-next';
import { toTypedSchema } from '@vee-validate/zod'
import { useForm, useField } from 'vee-validate'
import * as zod from 'zod';
import { useTransactionStore } from '@/stores/transaction';

const transactionStore = useTransactionStore();
const { transactions } = storeToRefs(transactionStore);

const [TransactionTemplate, TransactionForm] = createReusableTemplate();
const isDesktop = useMediaQuery('(min-width: 768px)')
const isOpen = ref(false)
const placeholder = ref()

const buttonTitle = '+ Transaction'; 
const popupTitle = 'Add Transaction';
const popupDescription = 'gib transaction';

const df = new DateFormatter('en-US', {
  dateStyle: 'long',
})

const value = computed({
  get: () => values.date ? parseDate(values.date) : undefined,
  set: val => val,
})

const validationSchema = toTypedSchema(
    zod.object({
        date: zod.string().refine(v => v, { message: 'A date is required.' }),
        category: zod.string().optional(), //will set 'uncategorized' if no selection is made 
        amount: zod.number()//.multipleOf(0.01),
    })
);

const { handleSubmit, setFieldValue, values, errors } = useForm({
  validationSchema,
});

const onSubmit = handleSubmit(values => {
    console.log(JSON.stringify(values, null, 2))
    isOpen.value = !isOpen.value;


    
    const newTransaction: Transaction = {
        id: Math.floor(Math.random() * 100000),
        date: values.date,
        income: false,
        categoryId: 0, //set later
        budgetId: 0, //set later
        hasCleared: false,
        amount: values.amount
    };
    
    console.log('new transaction:', newTransaction);
    transactions.value.push(newTransaction);
});

const cancel = () => {
    isOpen.value = !isOpen.value;
}
</script>

<template>
    <TransactionTemplate>
      <form class="grid items-start gap-1 px-4" @submit.prevent="onSubmit">
  
        <FormField name="dob">
      <FormItem class="flex flex-col">
        <FormLabel>Date of birth</FormLabel>
        <Popover>
          <PopoverTrigger as-child>
            <FormControl>
              <Button
                variant="outline" :class="cn(
                  'w-[240px] ps-3 text-start font-normal',
                  !value && 'text-muted-foreground',
                )"
              >
                <span>{{ value ? df.format(toDate(value)) : "Pick a date" }}</span>
                <CalendarIcon class="ms-auto h-4 w-4 opacity-50" />
              </Button>
              <input hidden>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent class="w-auto p-0">
            <Calendar
              v-model:placeholder="placeholder"
              v-model="value"
              calendar-label="Date of birth"
              initial-focus
              :min-value="new CalendarDate(1900, 1, 1)"
              :max-value="today(getLocalTimeZone())"
              @update:model-value="(v) => {
                if (v) {
                  setFieldValue('date', v.toString())
                }
                else {
                  setFieldValue('date', undefined)
                }

              }"
            />
          </PopoverContent>
        </Popover>
        <FormDescription>
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>
  
        <FormField v-slot="{ componentField, }" name="category">
          <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                  <Input type="text" placeholder="combo box goes here" v-bind="componentField" />
              </FormControl>
              <FormDescription>
              </FormDescription>
              <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField, }" name="amount">
          <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                  <Input type="number" step=0.01 placeholder="0" v-bind="componentField" />
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
    </TransactionTemplate>
  
    <Dialog v-if="isDesktop" v-model:open="isOpen">
      <DialogTrigger as-child >
        <Button variant="outline">
          {{ buttonTitle }}
        </Button>
      </DialogTrigger>

      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle class="flex items-center justify-center">{{ popupTitle }}</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <TransactionForm />
      </DialogContent>
    </Dialog>
  
    <Drawer v-else v-model:open="isOpen">
      <DrawerTrigger as-child>
        <Button variant="outline">
          {{ buttonTitle }}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader class="flex items-center justify-center">
          <DrawerTitle>{{ popupTitle }}</DrawerTitle>
          <DrawerDescription />
        </DrawerHeader>
        <TransactionForm />
        <DrawerFooter class="pt-2">
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  </template>