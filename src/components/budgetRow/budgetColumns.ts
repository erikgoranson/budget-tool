import type { BudgetRow } from '@/types';
import type { ColumnDef } from '@tanstack/vue-table';
import { h } from 'vue';
import { storeToRefs } from 'pinia';
import currencyFormatter from '@/helpers/numberFormat';
import dateFormatter from '@/helpers/dateFormatter';
import { useCarouselStore } from '@/stores/carousel';
import { useTransactionStore } from '@/stores/transaction';
import { FilePenLine, } from 'lucide-vue-next';
import BudgetActionsMenu from './BudgetActionsMenu.vue';

const getTotalExpensed = (row: BudgetRow) => {
    const carouselStore = useCarouselStore();
    const transactionStore = useTransactionStore();
    const { transactions } = storeToRefs(transactionStore);

    return transactions.value
        .filter(t => 
            t.subcategoryId == row.subcategoryId && 
            t.income === false && 
            t.date < carouselStore.selectedMonth.add({months:1}).toString() &&
            t.date >= carouselStore.selectedMonth.toString()
        )
        .reduce((t, {amount}) => t + amount, 0);
};

export const editableColumns = ['name','dueDate','amount'] as string[];

export const budgetColumns: ColumnDef<BudgetRow>[] = [
    {
        accessorKey: 'name',
        header: ({ column }) => h('div', { }, 'name'),
        cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('name')),
    },
    {
        accessorKey: 'dueDate',
        header: ({ column }) => h('div', { }, 'due'),
        cell: ({ row }) => h('div', { class: 'capitalize' }, dateFormatter.addDateSuffix(row.getValue('dueDate'))),
    },
    {
        accessorKey: 'amount',
        header: ({ column }) => h('div', { }, 'budget'),
        cell: ({ row }) => h('div', { class: 'capitalize' }, currencyFormatter.format(row.getValue('amount'))),
    },
    {
        accessorKey: 'totalExpensed',
        header: ({ column }) => h('div', { }, 'spent'),
        cell: ({ row }) => {
            const totalExpensed = getTotalExpensed(row.original);
            return h('div', { }, currencyFormatter.format(totalExpensed));
        },
    },
    {
        accessorKey: 'totalRemaining',
        header: ({ column }) => h('div', { }, 'remain'),
        cell: ({ row }) => {
            const totalExpensed = getTotalExpensed(row.original);
            const totalRemaining = row.original.amount - totalExpensed;

            return h('div', { }, currencyFormatter.format(totalRemaining));
        },
    },
    {
        id: 'actions',
        header: () => h('div', { class:'flex items-center text-center justify-center' }, h(FilePenLine, { class: 'h-4 w-4' })),
        enableHiding: false,
        cell: ({ row }) => {
            return h('div', { class:'flex items-center text-center justify-center' }, 
                h(BudgetActionsMenu, {
                    budgetRow: row.original
                })
            );
        },
    },
];