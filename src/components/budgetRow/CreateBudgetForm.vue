<script setup lang="ts">
import type { Category } from '@/types';
import { useForm } from 'vee-validate'
import { getValidationSchema, formProps, handleSubmission } from './budgetFormHelper';

import { FilePlus } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const props = defineProps(formProps);

const { handleSubmit, errors, resetForm } = useForm({
  validationSchema: getValidationSchema(props.category?.id),
});

const onSubmit = handleSubmit((values, actions) => {
    handleSubmission(values, props.budgetRow);
    actions.resetForm();
});
</script>

<template>
    <div class="w-full ">
      <form @submit.prevent="onSubmit">
        <Table class="table-auto">
        <TableBody>
          <TableRow>
              <TableCell>
                  <FormField v-slot="{ componentField, }" name="name">
                      <FormItem>
                          <FormControl>
                              <Input class="text-right" type="text" placeholder="Budget name" v-bind="componentField" />
                          </FormControl>
                      </FormItem>
                  </FormField>
              </TableCell>
  
              <TableCell v-if="category.hasDueDates">
                  <FormField v-slot="{ componentField, }" name="dueDate">
                      <FormItem>
                          <FormControl>
                              <Input class="text-right" type="number" placeholder="Due date " v-bind="componentField" />
                          </FormControl>
                      </FormItem>
                  </FormField>
              </TableCell>
  
              <TableCell>
                  <FormField v-slot="{ componentField, }" name="amount">
                      <FormItem>
                          <FormControl>
                              <Input type="number" step=0.01 inputmode='decimal' placeholder="Budget amount" v-bind="componentField" />
                          </FormControl>
                      </FormItem>
                  </FormField>
              </TableCell>
  
              <TableCell>
                  <div class="flex items-center justify-center">
                      <Button variant="ghost" class="bg-green-100 h-6">
                          <FilePlus class="h-4" />
                      </Button>
                  </div>
              </TableCell>
          </TableRow>
    </TableBody>
    </Table>
      </form>
  </div>
  </template>
  
  <style scoped>
  input {
      @apply h-6 border-none text-right
  }
  
  th {
    text-transform: capitalize;
    @apply px-2 py-1 text-xs font-semibold tracking-wider text-center text-gray-600 uppercase  border-r border-t border-b-2 border-indigo-200;
  } 
  tr {
      @apply hover:bg-gray-200;
  }
  td {
    text-transform: capitalize;
    @apply px-2 py-1 text-sm text-right border-b border-r border-gray-200;
  }
  table {
    @apply w-full text-left border-collapse;
  }
  thead {
    @apply border-b;
  }
  </style>