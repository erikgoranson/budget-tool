<script setup lang="ts">
import type { Goal, BudgetRow } from '@/types';
import { GoalOption } from '@/types';

import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { cn } from '@/lib/utils';
import { CalendarDate, getLocalTimeZone, parseDate, today } from '@internationalized/date';
import { useForm } from 'vee-validate';
import { Calendar as CalendarIcon } from 'lucide-vue-next';
import { useSubcategoryStore } from '@/stores/subcategory';
import dateFormatter from '@/helpers/dateFormatter';
import { validationSchema, handleSubmission, goalOptionKeys, formProps } from './goalFormHelper';

import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const props = defineProps(formProps);

const subcategoryStore = useSubcategoryStore();
const { subcategories } = storeToRefs(subcategoryStore);

const dateValue = computed({
  get: () => values.date ? parseDate(values.date) : today(getLocalTimeZone()),
  set: val => val,
});

const goalAmountText = computed(() => {
  let goalFlavorText = '';
  if(values.goalOption == GoalOption.Savings)
  {
    goalFlavorText = 'saving';
  }
  else {
    goalFlavorText = 'paying off';
  }

  return `How much will you be ${goalFlavorText}?`;
});

const { handleSubmit, setFieldValue, values, errors } = useForm({
  validationSchema: validationSchema,
  initialValues: props.input,
});

const onSubmit = handleSubmit(values => {
  handleSubmission(values, props.input);
  props?.onSubmitFunction();
});
</script>

<template>
    <form class="grid items-start gap-1 px-4" @submit.prevent="onSubmit">
    
      <FormField v-if="props.input.subcategoryId == undefined" v-slot="{ componentField, }" name="subcategoryId">
        <FormItem class="flex flex-col">
          <FormLabel>Goal Category</FormLabel>
          <FormDescription>Select which budget category this goal will be associated with</FormDescription>

          <Select v-bind="componentField" >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a budget category..." />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectGroup>
                <SelectItem v-for="item in subcategories" :value="item.id">
                  {{ item.name }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField :keepValue=true name="date">
        <FormItem class="flex flex-col">
          <FormLabel>Goal Date</FormLabel>
          <FormDescription>What date do you aim to complete this goal by?</FormDescription>
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
          
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField, }" name="goalOption">
        <FormItem class="flex flex-col">
          <FormLabel>Goal Type</FormLabel>
          <FormDescription>Is this a savings goal or a debt goal?</FormDescription>
          <Select v-bind="componentField" >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a goal type..." />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectGroup>
                <SelectItem v-for="item in goalOptionKeys" :value="item">
                  {{ item }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField, }" name="amount">
        <FormItem class="flex flex-col">
          <FormLabel>Goal Amount</FormLabel>
          <FormDescription>{{ goalAmountText }}</FormDescription>
          <FormControl>
            <Input type="number" inputmode='decimal' step=0.01 placeholder="0" v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      
      <Button type="submit">Create Goal</Button>
    </form>
</template>