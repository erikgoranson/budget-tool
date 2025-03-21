<script setup lang="ts">
import type { Budget, BudgetRow, Category } from '../types';
import type { ColumnDef,ColumnFiltersState, GlobalFilterTableState, SortingState, VisibilityState } from '@tanstack/vue-table';

import { h, ref, computed} from 'vue';
import { storeToRefs } from 'pinia';
import { ArrowUpDown, FilePenLine, } from 'lucide-vue-next';
import { FlexRender, getCoreRowModel, getExpandedRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useVueTable, } from '@tanstack/vue-table';

import BudgetCell from './BudgetCell.vue';
import UpdateBudgetMenu from './UpdateBudgetMenu.vue';
import { valueUpdater } from '../lib/utils'; 
import currencyFormatter from '../helpers/numberFormat'; 

import { useBudgetStore } from '@/stores/budget';
import { useCarouselStore } from '@/stores/carousel';
import { useTransactionStore } from '@/stores/transaction';
import { useSubcategoryStore } from '@/stores/subcategory';

import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table';

const props = defineProps({
    category : {
        type: Object as () => Category,
        required: true
    },
});

const budgetStore = useBudgetStore();
const { budgets } = storeToRefs(budgetStore);

const carouselStore = useCarouselStore();

const subcategoryStore = useSubcategoryStore();
const { subcategories } = storeToRefs(subcategoryStore);

const transactionStore = useTransactionStore();
const { transactions } = storeToRefs(transactionStore);

const sorting = ref<SortingState>([]);
const columnFilters = ref<ColumnFiltersState>([]);
const columnVisibility = computed<VisibilityState>(() => {
    return {
        dueDate: props.category.hasDueDates,
    };
});
const rowSelection = ref({});
const filter = ref<GlobalFilterTableState>();

const budgetRows = computed(() => {
    const subs = subcategories.value.filter(s => s.categoryId == props.category.id);

    const rows: BudgetRow[] = subs.map(s => {
        const budgetMatch = budgets.value.find(b => b.subcategoryId == s.id && b.budgetMonth == carouselStore.selectedMonthFormatted);
        return <BudgetRow>{
            subcategoryId: s.id,
            name: s.name,
            categoryId: s.categoryId,
            dueDate: s.dueDate,
            amount: budgetMatch?.amount ?? 0,
            budgetMonth: budgetMatch?.budgetMonth ?? '',
            budgetId: budgetMatch?.id ?? '',
        };
    });

    return rows;
});

//TODO: review this problem and fix
//https://www.reddit.com/r/vuejs/comments/1c4x7ha/what_is_your_favorite_data_table_library/
const getTable = (rows: BudgetRow[]) => {
    return useVueTable({
        //data: props.category.budgets,
        data: rows,
        columns: columnDefs,
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
    })
}
const getTotalExpensed = (budgetId: string) => {
    const budgetTransactions = transactions.value.filter(tran => tran.budgetId == budgetId && tran.income == false);
    
    let totalExpensed = 0.00;
    if(budgetTransactions.length > 0){
        const amounts = budgetTransactions.map(x => x.amount);
        totalExpensed = amounts.reduce((a, b) => a + b);
    }

    return totalExpensed;
};

const editableColumns = ['name','dueDate','amount'] as string[];

const columnDefs: ColumnDef<BudgetRow>[] = [
    {
        accessorKey: 'name',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Category', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })])
        },
        cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('name')),
    },
    {
        accessorKey: 'dueDate',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Due', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })])
        },
        cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('dueDate')),
    },
    {
        accessorKey: 'amount',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Budget', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })])
        },
        cell: ({ row }) => h('div', { class: 'capitalize' }, currencyFormatter.format(row.getValue('amount'))),
    },
    {
        accessorKey: 'totalExpensed',
        header: ({ column }) => h('div', { }, 'spent'),
        cell: ({ row }) => {
            const totalExpensed = getTotalExpensed(row.original.budgetId);
            return h('div', { }, currencyFormatter.format(totalExpensed));
        },
    },
    {
        accessorKey: 'totalRemaining',
        header: ({ column }) => h('div', { }, 'remain'),
        cell: ({ row }) => {
            const totalExpensed = getTotalExpensed(row.original.budgetId);
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
                h(UpdateBudgetMenu, {
                    categoryId: props.category.id,
                    row: row.original
                })
            );
        },
    },
];
</script>

<template>
	<div>
        <Table>
            <TableHeader class="bg-blue-300">
                <TableRow v-for="headerGroup in getTable(budgetRows).getHeaderGroups()" :key="headerGroup.id">
                    <TableHead v-for="header in headerGroup.headers" :key="header.id">
                        <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header" :props="header.getContext()" />
                    </TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                <template v-if="getTable(budgetRows).getRowModel().rows?.length">
                    <template v-for="row in getTable(budgetRows).getRowModel().rows" :key="row.id">
                        <TableRow :data-state="row.getIsSelected() && 'selected'">
                            <TableCell v-for="(cell, index) in row.getVisibleCells()" :key="cell.id">
                                
                                <BudgetCell v-if="editableColumns.includes(cell.column.id)" :cell="cell" :index="index" :category="props.category"/>

                                <FlexRender v-else :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                                
                            </TableCell>
                        </TableRow>
                    </template>
                </template>

                <TableRow v-else>
                    <TableCell :colspan="columnDefs.length" class="h-24 text-center">
                        No results.
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    </div>
</template>

<style scoped>
th {
    @apply text-xs tracking-wider text-center font-semibold text-gray-600 uppercase border border-gray-200;
}

Button {
    @apply text-xs font-semibold uppercase 
}

td {
  text-transform: capitalize;
  @apply px-3 py-2.5 text-sm text-right border-b border-r border-gray-200;
}
</style>