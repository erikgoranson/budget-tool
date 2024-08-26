<script setup lang="ts">
import { ref, computed } from "vue";
import type { Budget, Category } from '../types/';
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

import UpdateBudgetDialog from '@/components/UpdateBudgetDialog.vue';
import DeleteBudgetDialog from '@/components/DeleteBudgetDialog.vue';

import { Button } from '@/components/ui/button';
import { ListPlus, FilePenLine } from 'lucide-vue-next';
import { Input } from '@/components/ui/input'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm, useField } from 'vee-validate'
import * as zod from 'zod';

const props = defineProps({
    category : {
        type: Object as () => Category,
        required: true
    }
});

const checkAddDueDate = computed(() => {
    const hasDueDate = props.category.budgets.some(budget => budget.dueDate != null);
    return hasDueDate
    //or if the category calls for it 
});

const addRowTest = () => {
    const newBudget = <Budget>{
        id: Math.floor(Math.random() * 100000),
        name: 'CELL PHONE BILL',
        amount: 250.25,
        dueDate: 12,
    };

    props.category.budgets.push(newBudget);
}

const validationSchema = toTypedSchema(
    zod.object({
        name: zod.string().min(1, { message: 'Budget name is required' }),
        dueDate: zod.number().optional(),
        amount: zod.string().min(1, { message: 'Budget amount is required' })
    })
)

const { handleSubmit, errors, resetForm } = useForm({
  validationSchema,
});

const onSubmit = handleSubmit((values, actions) => {
    console.log(JSON.stringify(values, null, 2));

    const newBudget = <Budget>{
        id: Math.floor(Math.random() * 100000),
        name: values.name,
        amount: parseFloat(values.amount),
        dueDate: values.dueDate,
    };

    props.category.budgets.push(newBudget);
    actions.resetForm();
});
</script>

<template>
	<div class="mb-6 overflow-hidden">
        <Table>
            <TableHeader class="bg-blue-300">
                <TableRow>
                    <TableHead>
                        <div class="flex justify-center items-center">
                            Category
                            <Button variant="ghost" @click="addRowTest">
                                <ListPlus class="h-4 w-4" />
                            </Button>
                        </div>     
                    </TableHead>
					<TableHead v-if="checkAddDueDate" class="w-6">Due</TableHead>
					<TableHead>Budget</TableHead>
					<TableHead>Out</TableHead>
					<TableHead class="text-right">Remain</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				<TableRow v-for="b in $props.category.budgets">
					<TableCell class="font-medium">
                        <div class="flex justify-end items-center">
                            {{ b.name }}
                            <UpdateBudgetDialog :budget="b"/>
                            <DeleteBudgetDialog :categoryId="props.category.id" :budgetId="b.id" />
                        </div>
                    </TableCell>
					<TableCell v-if="checkAddDueDate">{{ b.dueDate }}</TableCell>
					<TableCell>{{ b.amount }}</TableCell>
					<TableCell>?</TableCell>
					<TableCell class="text-right">?</TableCell>
				</TableRow>
			</TableBody>
		</Table>

        <form @submit.prevent="onSubmit">
            <Table>
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

                        <TableCell v-if="checkAddDueDate">
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
                                        <Input type="float" placeholder="Budget amount" v-bind="componentField" />
                                    </FormControl>
                                </FormItem>
                            </FormField>
                        </TableCell>

                        <TableCell class="flex items-center justify-center">
                            <Button variant="ghost" class="bg-green-100 h-6">
                                <ListPlus class="h-4" />
                            </Button>
                        </TableCell>

                    </TableRow>
                </TableBody>
            </Table>
            {{ errors }}
        </form>
	</div>
</template>

<style scoped>
input {
    @apply h-6 border-none text-right
}

th {
  text-transform: capitalize;
  @apply px-2 py-1 text-xs font-semibold tracking-wider text-center text-gray-600 uppercase /*bg-indigo-100*/ border-r border-t border-b-2 border-indigo-200;
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