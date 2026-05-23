<script setup lang="ts" >
import type { TransactionRow } from '@/types';
import type { ColumnFiltersState, GlobalFilterTableState, SortingState, VisibilityState } from '@tanstack/vue-table';
import { storeToRefs } from 'pinia'
import { h, ref, computed } from 'vue';
import { useMediaQuery } from '@vueuse/core';
import { valueUpdater } from '@/lib/utils'; 
import currencyFormatter from '@/helpers/numberFormat';
import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useVueTable } from '@tanstack/vue-table';

import { useDynamicColumns } from '@/composables/useDynamicColumns';

import { FilePenLine, ArrowUpDown } from 'lucide-vue-next';
import { Button } from '../ui/button'
import BaseTransactionTable from './BaseTransactionTable.vue';
import TransactionActionsMenu from './TransactionActionsMenu.vue';
import TransactionDetailCard from './TransactionDetailCard.vue';

import { useTransactionStore } from '@/stores/transaction';
const transactionStore = useTransactionStore();
const { transactionRows } = storeToRefs(transactionStore);

const items = defineModel<TransactionRow[]>( { required: false} );

const { createReadOnlyColumn, createSelectorColumn, createSortableHeader } = useDynamicColumns(transactionRows);
const columns = [
    createSelectorColumn(),
    createReadOnlyColumn('date', 'Date'),
    createReadOnlyColumn('budgetCategoryName', 'Category'),
    createReadOnlyColumn('note', 'Note'),
    {
        accessorKey: 'amount',
        header: ({ column }) => createSortableHeader(column, 'Amount'),
        cell: ({ row }) => {
            const amount = Number.parseFloat(row.getValue('amount'))
            const isIncome = row.original.income;
            const formattedAmt = currencyFormatter.format(amount);
            const flowStyle = isIncome ? 'text-green-500' : 'text-red-500';
            return h('div', { class: `font-medium font-semibold ${flowStyle}` }, formattedAmt)
        },
    },
    {
        id: 'mobile',
        header: ({ table }) => {
            const dateColumn = table.getColumn('date');
            return h(Button, { 
                variant: 'ghost', 
                onClick: () => { 
                    if (dateColumn) {
                        dateColumn.toggleSorting(dateColumn.getIsSorted() === 'asc');
                    }
                }}, 
                () => [
                    'Details', 
                    h(ArrowUpDown, {  class: 'ml-2 h-4 w-4' })
                ]
            );
        },
        enableSorting: true,
        cell: ({ row }) => {
            return h(TransactionDetailCard, {
                data: row.original,
            })
        },
    },
    {
        id: 'actions',
        header: () => ['', h(FilePenLine, { class: 'ml-2 h-4 w-4' })],
        enableHiding: false,
        cell: ({ row }) => {
            return h(TransactionActionsMenu, {
                transaction: row.original,
            })
        },
    },
];

const sorting = ref<SortingState>([
  { id: 'date', desc: true }
]);
const columnFilters = ref<ColumnFiltersState>([]);
const rowSelection = ref({});
const filter = ref<GlobalFilterTableState>();
const isDesktop = useMediaQuery('(min-width: 768px)');
const columnVisibility = computed<VisibilityState>(() => ({
    mobile: !isDesktop.value,
    date: isDesktop.value,
    budgetCategoryName: isDesktop.value,
    note: isDesktop.value,
    amount: isDesktop.value,
}));

const table = useVueTable({
    get data() { return items.value ?? transactionRows.value },
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: updaterOrValue => valueUpdater(updaterOrValue, sorting),
    onColumnFiltersChange: updaterOrValue => valueUpdater(updaterOrValue, columnFilters),
    onColumnVisibilityChange: updaterOrValue => valueUpdater(updaterOrValue, columnVisibility),
    onRowSelectionChange: updaterOrValue => valueUpdater(updaterOrValue, rowSelection),
    state: {
        get sorting() { return sorting.value },
        get columnFilters() { return columnFilters.value },
        get columnVisibility() { return columnVisibility.value },
        get rowSelection() { return rowSelection.value },
        get globalFilter() { return filter.value },
    },
});
</script>

<template>
    <BaseTransactionTable v-model:table="table" v-model:filter="filter"/>
</template>