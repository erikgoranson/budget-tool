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

//props:
//isDueDate bool //maybe instead of a bool in the parent type, we just check (outside of this component:) budgets.some(x=> x.duedate !== null). less prop drilling that way?
//name
//amount (amount budgeted)
//duedate
//OH. is that all we need? just Category.Budgets? lmao. 

const props = defineProps({
    budgets : {
        type: Array as () => Budget[],
        //type: String[] define a type here
        //type: Array as () => GridItem[],
        //type: Object as () => Category,
        //budgetName: String,
        //DueDateColumn : bool,
        required: true
    }
});

const checkAddDueDate = computed(() => {
    const hasDueDate = props.budgets.some(budget => budget.dueDate != null);
    return hasDueDate
});
</script>

<template>
	<div class="mb-6 overflow-hidden">
        <Table>
            <TableHeader class="bg-blue-300">
                <TableRow>
                    <TableHead>Category</TableHead>
					<TableHead v-if="checkAddDueDate" class="w-6">Due</TableHead>
					<TableHead>Budget</TableHead>
					<TableHead>Out</TableHead>
					<TableHead class="text-right">Remain</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				<TableRow v-for="b in $props.budgets">
					<TableCell class="font-medium">{{ b.name }}</TableCell>
					<TableCell v-if="checkAddDueDate">{{ b.dueDate }}</TableCell>
					<TableCell>{{ b.amount }}</TableCell>
					<TableCell>?</TableCell>
					<TableCell class="text-right">?</TableCell>
				</TableRow>
			</TableBody>
		</Table>
	</div>
</template>

<style scoped>
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