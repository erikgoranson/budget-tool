<script setup lang="ts">
import type { Budget, Category } from '../types/';

import { ref, computed } from "vue";
import { storeToRefs } from 'pinia';
import { useTransactionStore } from '@/stores/transaction';
import currencyFormatter from '@/helpers/numberFormat';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import UpdateBudgetMenu from '@/components/UpdateBudgetMenu.vue';

const props = defineProps({
    budget : {
        type: Object as () => Budget,
        required: true
    },
    category : {
        type: Object as () => Category,
        required: true
    }
});

const transactionStore = useTransactionStore();
const { transactions } = storeToRefs(transactionStore);

const totalExpensed = computed(() => {
    const budgetTransactions = transactions.value.filter(tran => tran.budgetId == props.budget.id && tran.income == false);

    if(budgetTransactions.length == 0){
        return 0.00;
    } else {
        const amounts = budgetTransactions.map(x => x.amount);
        return amounts.reduce((a, b) => a + b);
    }
});

const totalRemaining = computed(() => {
    return props.budget.amount - totalExpensed.value;
})
</script>

<template>
    <TableRow>
        <TableCell class="font-medium">
            <div class="flex justify-end items-center">
                {{ budget.name }}
            </div>
        </TableCell>

        <TableCell v-if="category.hasDueDates">
            {{ budget.dueDate }}
        </TableCell>

        <TableCell>
            {{ currencyFormatter.format(budget.amount) }}
        </TableCell>

        <TableCell>
            {{ currencyFormatter.format(totalExpensed) }}
        </TableCell>

        <TableCell class="text-right">
            {{ currencyFormatter.format(totalRemaining) }}
        </TableCell>

        <TableCell>
            <div class="flex justify-center">
                <UpdateBudgetMenu :categoryId="category.id" :budget="props.budget"/>
            </div>
        </TableCell>
    </TableRow>
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