<script setup lang="ts">
import type { Budget, Category } from '../types/';

import { ref, computed } from "vue";
import { toTypedSchema } from '@vee-validate/zod'
import { useForm, useField } from 'vee-validate'
import * as zod from 'zod';
import { ListPlus, FilePenLine, FilePlus } from 'lucide-vue-next';
import { useCategoryStore } from '@/stores/category';
import { v4 as uuidv4 } from 'uuid';

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

import BudgetTableRow from '@/components/BudgetTableRow.vue';

const props = defineProps({
    category : {
        type: Object as () => Category,
        required: true
    }
});

const categoryStore = useCategoryStore();

const validationSchema = toTypedSchema(
    zod.object({
        name: zod.string().min(1, { message: 'Budget name is required' }),
        dueDate: zod.number().optional(),
        amount: zod.number(),
    })
)

const { handleSubmit, errors, resetForm } = useForm({
  validationSchema,
});

const onSubmit = handleSubmit((values, actions) => {
    console.log(JSON.stringify(values, null, 2));

    const newBudget = <Budget>{
        id: uuidv4(),
        name: values.name,
        amount: values.amount,
        dueDate: values.dueDate,
    };

    categoryStore.createBudget(props.category.id, newBudget);
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
                        </div>     
                    </TableHead>
					<TableHead v-if="category.hasDueDates" class="w-4">Due</TableHead>
					<TableHead>Budget</TableHead>
					<TableHead>Out</TableHead>
					<TableHead class="text-right">Remain</TableHead>
                    <TableHead class="w-4">
                        <div class="flex justify-center items-center">
                            <FilePenLine class="h-4 w-4"/>
                        </div>
                    </TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
                <BudgetTableRow v-for="b in category.budgets" :category="props.category" :budget="b"/>
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