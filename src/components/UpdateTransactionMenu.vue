<script setup lang="ts">
import type { TransactionRow, Transaction } from '../types/';

import { ref, computed, watch } from 'vue';
import { Calendar as CalendarIcon, MoreHorizontal } from 'lucide-vue-next';
import { useForm, useField } from 'vee-validate';
//zod?
import { cn } from '@/lib/utils';
import { CalendarDate, DateFormatter, type DateValue, getLocalTimeZone, parseDate, today } from '@internationalized/date';
import { storeToRefs } from 'pinia';
import { useCategoryStore } from '@/stores/category';
import { useTransactionStore } from '@/stores/transaction';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '../components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { AlertDialogAction, AlertDialogCancel, AlertDialogFooter, } from '@/components/ui/alert-dialog';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

import UpdateMenu from '../components/UpdateMenu.vue';

const props = defineProps({
    transaction : {
        type: Object as () => TransactionRow,
        required: true
    }
});

const categoryStore = useCategoryStore();
const { categories } = storeToRefs(categoryStore);
const transactionStore = useTransactionStore();

const isComboBoxOpen = ref(false);

const dateFormatter = new DateFormatter('en-US', {
  dateStyle: 'long',
})

const deleteTransaction = () => {
    transactionStore.deleteTransaction(props.transaction.id);
};

const wat = computed(() => {
    return parseDate(props.transaction.date) as DateValue;
});

const calendarPlaceholder = ref();

const { handleSubmit, setFieldValue, errors, values, resetForm } = useForm({
});

const onSubmit = handleSubmit((values, actions) => {
    console.log(JSON.stringify(values, null, 2));

    const inputConfirmed = Object.values(values).filter(x => x !== undefined).length != 0;
    if (inputConfirmed) {

        console.log('update the tran');

        //make a constructor for this
        const updatedTransaction = <Transaction>{
            id: props.transaction.id,
            date: values.date ?? props.transaction.date,
            income: values.income ?? props.transaction.income,
            payee: values.payee ?? props.transaction.payee,
            categoryId: values?.category?.categoryId ?? props.transaction.categoryId,
            budgetId: values?.category?.budgetId ?? props.transaction.budgetId,
            note: values.note ?? props.transaction.note,
            hasCleared: values.hasCleared ?? props.transaction.hasCleared,
            amount: values.amount ?? props.transaction.amount,
        }

        transactionStore.updateTransaction(updatedTransaction);
    }
});

</script>

<template>

    <UpdateMenu name="Transaction">

        <template v-slot:deleteForm>
            <div>
                This action will permanently delete the selected transaction and all its related data. This cannot be undone. 
            </div>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction class="bg-red-500" @click="deleteTransaction">Delete</AlertDialogAction>
            </AlertDialogFooter>
        </template>

        <template v-slot:editForm="{ events: { toggleEditForm } }">
            <form class="grid items-start gap-1 px-4" @submit.prevent="onSubmit">

                <FormField name="date">
                    <FormItem class="flex flex-col">
                        <FormLabel>Transaction date</FormLabel>
                        <Popover>
                            <PopoverTrigger as-child>
                                <FormControl>
                                    <Button variant="outline" :class="cn(' ps-3 text-start font-normal', !transaction.date && 'text-muted-foreground',)">
                                        <span>{{ calendarPlaceholder ? dateFormatter.format(new Date(calendarPlaceholder)) : dateFormatter.format(new Date(transaction.date)) }}</span>
                                        <CalendarIcon class="ms-auto h-4 w-4 opacity-50" />
                                    </Button>
                                    <input hidden>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent class="w-auto p-0">
                                <Calendar 
                                    :defaultValue="wat"
                                    v-model:placeholder="calendarPlaceholder"
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
                                    }"
                                />
                            </PopoverContent>
                        </Popover>
                        <FormDescription></FormDescription>
                        <FormMessage />
                    </FormItem>
                </FormField>

                <FormField name="category">
                    <FormItem class="flex flex-col">
                        <FormLabel>Category Select</FormLabel>
                        <Popover v-model:open="isComboBoxOpen">
                            <PopoverTrigger as-child>
                                <FormControl>
                                    <Button variant="outline" role="combobox" :class="cn('justify-between', !values.category?.categoryId && 'text-muted-foreground')">
                                        {{ values.category?.formatedName ?? transaction.budgetCategoryName }}
                                        <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
                                                <Label>{{ category.name }}</Label>
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
                                                    }"
                                                >
                                                    <Check :class="cn('mr-2 h-4 w-4', budget.id === values.category?.budgetId ? 'opacity-100' : 'opacity-0')"/>
                                                    {{ budget.name }}
                                                </CommandItem>
                                            </span>
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        <FormDescription></FormDescription>
                        <FormMessage />
                    </FormItem>
                </FormField>

                <FormField v-slot="{ componentField, }" name="amount">
                    <FormItem class="flex flex-col">
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                            <Input type="number" step=0.01 placeholder="0" v-bind="componentField" :default-value="transaction.amount" />
                        </FormControl>
                        <FormDescription></FormDescription>
                        <FormMessage />
                    </FormItem>
                </FormField>

                <Button type="submit" @click="toggleEditForm">Add</Button>
                <Button variant="outline" @click="toggleEditForm">Cancel</Button>
            </form>
        </template>

    </UpdateMenu>

</template>