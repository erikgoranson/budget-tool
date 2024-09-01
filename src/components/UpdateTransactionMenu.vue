<script setup lang="ts">
import type { Transaction, TransactionRow } from '../types/';

import { ref, computed, watch } from 'vue';
//import { SquarePlus, Check, ChevronsUpDown, Calendar as CalendarIcon } from 'lucide-vue-next';
import { Calendar as CalendarIcon, MoreHorizontal } from 'lucide-vue-next';
import { createReusableTemplate, useMediaQuery } from '@vueuse/core';
import { useForm, useField } from 'vee-validate';
//zod?
import { cn } from '@/lib/utils';
import { CalendarDate, DateFormatter, type DateValue, getLocalTimeZone, parseDate, today } from '@internationalized/date';
import { toDate } from 'radix-vue/date';
import { storeToRefs } from 'pinia';
import { useCategoryStore } from '@/stores/category';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '../components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
} from '@/components/ui/drawer';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
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

const props = defineProps({
    transaction : {
        type: Object as () => TransactionRow,
        required: true
    }
});

const categoryStore = useCategoryStore();
const { categories } = storeToRefs(categoryStore);


const [DefineEditForm, UseEditForm] = createReusableTemplate();
const [DefineDeleteForm, UseDeleteForm] = createReusableTemplate();

const isDesktop = useMediaQuery('(min-width: 768px)');
const editDialogOpen = ref(false);
const deleteDialogOpen = ref(false);
const isComboBoxOpen = ref(false);

const editTransaction = () => {
    //do stuff
};

const cancelForm = () => {
  //isOpen.value = !isOpen.value;
  editDialogOpen.value = false;
}

const dateFormatter = new DateFormatter('en-US', {
  dateStyle: 'long',
})


//const wat = parseDate(props.transaction.date) as DateValue;
const wat = computed(() => {
    return parseDate(props.transaction.date) as DateValue;
});

//const calendarPlaceholder = ref(dateFormatter.format(toDate(wat.value)));
const calendarPlaceholder = ref();
watch(calendarPlaceholder, (newValue, oldValue) => {
    console.log('old placeholder: ', oldValue);
    console.log('new placeholder: ', newValue);
});


const { handleSubmit, setFieldValue, errors, values, resetForm } = useForm({
});

const onSubmit = handleSubmit((values, actions) => {
    console.log(JSON.stringify(values, null, 2))
    //editDialogOpen.value = !editDialogOpen.value;
    editDialogOpen.value = false;

    /*const updatedBudget = <Budget>{
        id: props.budget.id,
        name: values.name ? values.name : props.budget.name,
        amount: values.amount ? parseFloat(values.amount) : props.budget.amount,
        dueDate: values.dueDate ? values.dueDate : props.budget.dueDate,
    };

    const valuesMatch = JSON.stringify(updatedBudget) == JSON.stringify(props.budget);
    if (!valuesMatch) updateBudget(updatedBudget);
    actions.resetForm();*/
});

</script>

<template>
    <DefineDeleteForm as-child>
        <div>
            This action will permanently delete the selected transaction and all its related data. This cannot be undone. 
        </div>
        <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Save</AlertDialogAction>
        </AlertDialogFooter>
    </DefineDeleteForm>

    <DefineEditForm as-child>

        <!--maybe this should be its own component? oh, but the prop drilling-->

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

            <Button type="submit">Add</Button>
            <Button variant="outline" @click="cancelForm">Cancel</Button>
        </form>

    </DefineEditForm>

    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" class="h-8 w-8 p-0">
                <span class="sr-only">Open menu</span>
                <MoreHorizontal class="h-4 w-4" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem @click="editDialogOpen = true">Edit</DropdownMenuItem>

            <DropdownMenuItem @click="deleteDialogOpen = true">Delete</DropdownMenuItem>
            
        </DropdownMenuContent>
    </DropdownMenu>
    
    <Dialog v-if="isDesktop" :open="editDialogOpen" @update:open="editDialogOpen = !editDialogOpen">
        <DialogTrigger as-child></DialogTrigger>
        <DialogContent class="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>title</DialogTitle>
                <DialogDescription>description</DialogDescription>
            </DialogHeader>
            <UseEditForm />
        </DialogContent>
    </Dialog>

    <Drawer v-else v-model:open="editDialogOpen">
        <DrawerTrigger as-child></DrawerTrigger>
        <DrawerContent>
            <DrawerHeader class="text-left">
                <DrawerTitle>title</DrawerTitle>
                <DrawerDescription>description</DrawerDescription>
            </DrawerHeader>
            <UseEditForm />
            <DrawerFooter class="pt-2"></DrawerFooter>
        </DrawerContent>
    </Drawer>

    <AlertDialog :open="deleteDialogOpen" @update:open="deleteDialogOpen = !deleteDialogOpen">
        <AlertDialogTrigger asChild></AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            </AlertDialogHeader>
            <UseDeleteForm />
        </AlertDialogContent>
    </AlertDialog>

</template>
