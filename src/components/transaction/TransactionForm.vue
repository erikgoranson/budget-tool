<script setup lang="ts">
import type { Transaction, TransactionRow } from '@/types';
import { cn } from '@/lib/utils';
import { CalendarDate, DateFormatter, getLocalTimeZone, parseDate, today } from '@internationalized/date';
import { computed, h, ref, onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { Check, ChevronsUpDown, Calendar as CalendarIcon, Plus } from 'lucide-vue-next';
import { useForm, useField } from 'vee-validate';
import { useTransactionStore } from '@/stores/transaction';
import { useCategoryStore } from '@/stores/category';
import { useSubcategoryStore } from '@/stores/subcategory';
import dateFormatter from '@/helpers/dateFormatter';
import { handleSubmission, formProps, getTransactionRowSchema } from './transactionFormHelper';

import { Button } from '@/components/ui/button';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';

const props = defineProps(formProps);

const categoryStore = useCategoryStore();
const { categories } = storeToRefs(categoryStore);
const subcategoryStore = useSubcategoryStore();
const { subcategories } = storeToRefs(subcategoryStore);
const transactionStore = useTransactionStore();

const isComboBoxOpen = ref(false);

const transactionDataFound = computed(() => Object.keys(props.transaction).length !== 0);

const dateValue = computed({
  get: () => {
    const lastTouchedDate = (transactionStore.lastTouchedDate !== '') ? parseDate(String(transactionStore?.lastTouchedDate)) : undefined;
    const inputDate = (values.date) ? parseDate(values.date) : today(getLocalTimeZone());

    if (transactionDataFound.value)
    {
      return inputDate;
    }
    else 
    {
      return lastTouchedDate ?? inputDate;
    }
  },
  set: val => {
    const value = val ? val.toString() :  '';
    transactionStore.setLastTouchedDate(value);
    return val;
  },
});

const initialValues = computed(() => {
  const defaultDate = { date: today(getLocalTimeZone()).toString() } as TransactionRow;
  return (transactionDataFound.value) ? props.transaction : defaultDate;
});

const { handleSubmit, setFieldValue, values, errors } = useForm({
  validationSchema: getTransactionRowSchema(),
  initialValues: initialValues.value,
});

const onSubmit = handleSubmit(values => {
  handleSubmission(values, props.transaction);
  //actions.resetForm();
  props?.onSubmitFunction();
});
</script>

<template>
    <form class="grid items-start gap-1 px-4" @submit.prevent="onSubmit">
      
      <FormField :keepValue=true name="date">
        <FormItem class="flex flex-col">
          <FormLabel>Transaction date</FormLabel>
          <Popover>
            <PopoverTrigger as-child>
              <FormControl>
                <Button variant="outline" :class="cn(' ps-3 text-start font-normal', !dateValue && 'text-muted-foreground',)">
                  <span>{{ values.date ? dateFormatter.format(dateValue, 'longDate') : "Pick a date" }}</span>
                  <CalendarIcon class="ms-auto h-4 w-4 opacity-50" />
                </Button>
                <input hidden>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent class="w-auto p-0">
              <Calendar 
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
                <Button :disabled="values.income" variant="outline" role="combobox" :class="cn('justify-between', !values.categoryId && 'text-muted-foreground')">
                  <template v-if="values.income">
                    Income for {{ dateFormatter.format(values.date as string, 'monthYearDate') }}
                    
                  </template>
                  <template v-else>
                    {{ values.budgetCategoryName ?? 'Select category...' }}
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
                      <Label v-if="subcategories.filter(x => x.categoryId == category.id).length > 0">{{ category.name }}</Label>
                      <CommandItem
                        v-for="subcategory in subcategories.filter(x => x.categoryId == category.id)"
                        :key="subcategory.id"
                        :value="subcategory.name"
                        @select="() => {
                          setFieldValue('subcategoryId', subcategory.id);
                          setFieldValue('categoryId', category.id);
                          setFieldValue('budgetCategoryName', `${category.name} : ${subcategory.name}`); //does this work? 
                          isComboBoxOpen = false;
                        }">
                          <Check :class="cn('mr-2 h-4 w-4', subcategory.id === values.subcategoryId ? 'opacity-100' : 'opacity-0')"/>
                          {{ subcategory.name }}
                      </CommandItem>
                    </span>
                    
                    <CommandItem 
                      v-if="categories.length === 0"
                      key="none"
                      value="Uncategorized"
                      @select="() => {
                        isComboBoxOpen = false;
                        }"></CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormDescription><p></p></FormDescription>
          <FormMessage />
        </FormItem>
      </FormField>

      <div class="font-medium">Income / Expense</div>
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
      
      <FormField v-slot="{ componentField, }" name="note">
              <FormItem class="flex flex-col">
                <FormLabel>Note</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Enter a note here" v-bind="componentField" />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            </FormField>      

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
    </form>
</template>