<script setup lang="ts">
import type { Budget, Category, Transaction } from '../types/';

import { cn } from '@/lib/utils';
import { CalendarDate, DateFormatter, getLocalTimeZone, parseDate, today } from '@internationalized/date';
import { toDate } from 'radix-vue/date';
import { computed, h, ref, onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { createReusableTemplate, useMediaQuery } from '@vueuse/core';
import { Check, ChevronsUpDown, Calendar as CalendarIcon, Plus } from 'lucide-vue-next';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm, useField } from 'vee-validate';
import * as zod from 'zod';
import { useTransactionStore } from '@/stores/transaction';
import { useCategoryStore } from '@/stores/category';
import { v4 as uuidv4 } from 'uuid';

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
} from '@/components/ui/form';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';

const categoryStore = useCategoryStore();
const { categories } = storeToRefs(categoryStore);
const transactionStore = useTransactionStore();

const [DefineAddTransactionForm, UseAddTransactionForm] = createReusableTemplate();
const [DefineTriggerTemplate, ReuseTriggerTemplate] = createReusableTemplate()
const isDesktop = useMediaQuery('(min-width: 768px)')

const isOpen = ref(false)
const isComboBoxOpen = ref(false);

const calendarPlaceholder = ref();

const popupTitle = 'Add Transaction';

const df = new DateFormatter('en-US', {
  dateStyle: 'long',
})

const mf = new DateFormatter('en-US', {
  month: 'long',
  year: 'numeric'
})

const dateValue = computed({
  get: () => values.date ? parseDate(values.date) : undefined,
  set: val => val,
})

const validationSchema = toTypedSchema(
    zod.object({
        date: zod.string().refine(v => v, { message: 'A date is required.' }),
        amount: zod.number(),
        category: zod.object({
            budgetId: zod.string(),
            categoryId: zod.string(),
            formatedName: zod.string(),
        }),
        income: zod.boolean().optional(),
    })
);

const { handleSubmit, setFieldValue, values, errors } = useForm({
  validationSchema,
  initialValues: {
    date: today(getLocalTimeZone()).toString(),
    category: {
      budgetId: categoryStore.uncategorizedBudgetGuid,
      categoryId: categoryStore.uncategorizedBudgetGuid,
      formatedName: 'Uncategorized'
    }, 
    income: false,
  },
});

const onSubmit = handleSubmit(values => {
    //console.log(JSON.stringify(values, null, 2))
    isOpen.value = !isOpen.value;

    const newTransaction: Transaction = {
        id: uuidv4(),
        date: values.date,
        income: values.income ? values.income : false,
        categoryId: values.category.categoryId, 
        budgetId: values.category.budgetId,
        hasCleared: false,
        amount: values.amount
    };

    if(values.income){
      newTransaction.budgetId = categoryStore.incomeGuid;
      newTransaction.categoryId = categoryStore.incomeGuid;
    };
    
    console.log('new transaction:', newTransaction);
    transactionStore.createTransaction(newTransaction);
});

const cancelForm = () => {
  isOpen.value = !isOpen.value;
}
</script>

<template>

  <DefineTriggerTemplate>
    <div class="flex justify-center items-center">
      <Button class="bg-orange-200 flex justify-center items-center" variant="secondary">
        <Plus class="h-4 w-4 mr-1 px-0"/>
        Transaction
      </Button>
    </div>
  </DefineTriggerTemplate>

  <DefineAddTransactionForm>
    <form class="grid items-start gap-1 px-4" @submit.prevent="onSubmit">
      
      <FormField :keepValue=true name="date">
        <FormItem class="flex flex-col">
          <FormLabel>Transaction date</FormLabel>
          <Popover>
            <PopoverTrigger as-child>
              <FormControl>
                <Button variant="outline" :class="cn(' ps-3 text-start font-normal', !dateValue && 'text-muted-foreground',)">
                  <span>{{ dateValue ? df.format(toDate(dateValue)) : "Pick a date" }}</span>
                  <CalendarIcon class="ms-auto h-4 w-4 opacity-50" />
                </Button>
                <input hidden>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent class="w-auto p-0">
              <Calendar 
                v-model:placeholder="calendarPlaceholder"
                v-model="dateValue"
                calendar-label="Transaction date"
                initial-focus
                :min-value="new CalendarDate(1900, 1, 1)"
                @update:model-value="(v) => {
                  if (v) {
                    setFieldValue('date', v.toString())
                  }
                  else {
                    setFieldValue('date', undefined)
                  }
                  }"/>
            </PopoverContent>
          </Popover>
          <FormDescription>
          </FormDescription>
          <FormMessage />
        </FormItem>
      </FormField>
      
      <FormField :keepValue=true name="category">
        <FormItem class="flex flex-col">
          <FormLabel>Budget Category</FormLabel>
          <Popover v-model:open="isComboBoxOpen">
            <PopoverTrigger as-child>
              <FormControl>
                <Button :disabled="values.income" variant="outline" role="combobox" :class="cn('justify-between', !values.category?.categoryId && 'text-muted-foreground')">
                  <template v-if="values.income">
                    Income for {{  mf.format(new Date()) }}
                  </template>
                  <template v-else>
                    {{ values.category?.formatedName ? values.category?.formatedName : 'Select category...' }}
                    <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </template>
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent class="flex w-[350px] p-0">
              <Command>
                <CommandInput placeholder="Search categories..." />
                <CommandEmpty>Nothing found.</CommandEmpty>
                <CommandList>
                  <CommandGroup>
                    <span v-for="category in categories">
                      <Label v-if="category.budgets.length > 0">{{ category.name }}</Label>
                      <CommandItem
                        v-for="budget in category.budgets"
                        :key="budget.id"
                        :value="budget.name"
                        @select="() => {
                          setFieldValue('category', {
                            budgetId: budget.id,
                            categoryId: category.id,
                            formatedName: `${category.name} : ${budget.name}`
                          });
                          isComboBoxOpen = false;
                        }">
                          <Check :class="cn('mr-2 h-4 w-4', budget.id === values.category?.budgetId ? 'opacity-100' : 'opacity-0')"/>
                          {{ budget.name }}
                      </CommandItem>
                    </span>
                    
                    <CommandItem 
                      v-if="categories.length === 0"
                      key="none"
                      value="Uncategorized"
                      @select="() => {
                        setFieldValue('category', {
                          budgetId: categoryStore.uncategorizedBudgetGuid,
                          categoryId: categoryStore.uncategorizedBudgetGuid,
                          formatedName: 'Uncategorized'
                        });
                        isComboBoxOpen = false;
                        }"></CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormDescription></FormDescription>
          <FormMessage />
        </FormItem>
      </FormField>

      <div class="text-sm font-medium">Income / Expense</div>
      <div class="space-y-4">
        <FormField v-slot="{ value, handleChange }" name="income">
          <FormItem class="flex flex-row items-center justify-between rounded-lg border p-4">
            <div class="space-y-0.5">
              <FormLabel class="text-muted-foreground">
                Is this transaction income?
              </FormLabel>
            </div>
            <FormControl>
              <Switch 
                :class="'data-[state=checked]:bg-green-500'"
                :checked="value"
                @update:checked="handleChange"
              />
            </FormControl>
          </FormItem>
        </FormField>
      </div>
      
      <FormField v-slot="{ componentField, }" name="amount">
        <FormItem class="flex flex-col">
          <FormLabel>Amount</FormLabel>
          <FormControl>
            <Input type="number" inputmode='decimal' step=0.01 placeholder="0" v-bind="componentField" />
          </FormControl>
          <FormDescription></FormDescription>
          <FormMessage />
        </FormItem>
      </FormField>

      <Button type="submit">Add</Button>
      <Button variant="outline" @click="cancelForm">Cancel</Button>
    </form>
  </DefineAddTransactionForm>
  
  <Dialog v-if="isDesktop" v-model:open="isOpen">
    <DialogTrigger as-child >
      <ReuseTriggerTemplate />
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle class="flex items-center justify-center">{{ popupTitle }}</DialogTitle>
        <DialogDescription />
      </DialogHeader>
      <UseAddTransactionForm />
    </DialogContent>
  </Dialog>
  
  <Drawer v-else v-model:open="isOpen">
    <DrawerTrigger as-child>
      <ReuseTriggerTemplate />
    </DrawerTrigger>
    <DrawerContent>
      <DrawerHeader class="flex items-center justify-center">
        <DrawerTitle>{{ popupTitle }}</DrawerTitle>
        <DrawerDescription />
      </DrawerHeader>
      <UseAddTransactionForm />
      <DrawerFooter class="pt-2"></DrawerFooter>
    </DrawerContent>
  </Drawer>
</template>