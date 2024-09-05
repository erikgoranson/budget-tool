<script setup lang="ts">

import type {
  ColumnDef,
  ColumnFiltersState,
  GlobalFilterTableState,
  SortingState,
  VisibilityState,
} from '@tanstack/vue-table';
import type { Transaction } from '../types/';

import { h, ref, computed } from 'vue';
import { valueUpdater } from '../lib/utils'; 
import currencyFormatter from '../helpers/numberFormat'; 
import { storeToRefs } from 'pinia';
import { useTransactionStore } from '@/stores/transaction';
import { useMediaQuery } from '@vueuse/core';
import {
  FlexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import { ArrowUpDown, ChevronDown, FilePenLine } from 'lucide-vue-next';

import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import UpdateTransactionMenu from '../components/UpdateTransactionMenu.vue';

const sorting = ref<SortingState>([]);
const columnFilters = ref<ColumnFiltersState>([]);
const columnVisibility = ref<VisibilityState>({});
const rowSelection = ref({});
const filter = ref<GlobalFilterTableState>();

const isDesktop = useMediaQuery('(min-width: 768px)');

const transactionStore = useTransactionStore();
const { transactionRows } = storeToRefs(transactionStore);

const selectedTotalText = computed(() => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const rowAmounts = selectedRows.map(x => x.original.amount);
    
    if(selectedRows.length == 0){
        return `${currencyFormatter.format(0)} total`;
    } else {
        const total = rowAmounts.reduce((a, b) => a + b);
        return `${currencyFormatter.format(total)} total.`;
    }
});

const transactionsByDate = computed(() => {
    const wat = transactionRows.value;
    const selectedRows = table.getFilteredRowModel().rows;
    const groups = (<any>Object).groupBy(selectedRows, row => row.original.date );

    return groups;
})

const data = transactionRows;


const columns: ColumnDef<Transaction>[] = [
    //checkbox column
    {
        id: 'select',
        header: ({ table }) => 
            h(Checkbox, {
                'checked': table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate'),'onUpdate:checked': value => table.toggleAllPageRowsSelected(!!value),
                'ariaLabel': 'Select all',
            }),
        cell: ({ row }) => 
            h(Checkbox, {
                'checked': row.getIsSelected(),
                'onUpdate:checked': value => row.toggleSelected(!!value),
                'ariaLabel': 'Select row',
            }),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'date',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Date', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })])
        },
        cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('date')), //TODO: format to MMddyy
    },
    {
        accessorKey: 'budgetCategoryName',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Category', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })])
        },
        cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('budgetCategoryName')),
    },
    /* //temp removing these until fix mobile spacing
    {
        accessorKey: 'payee',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Payee', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })])
        },
        cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('payee')),
    },
    {
        accessorKey: 'note',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Note', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })])
        },
        cell: ({ row }) => h('div', { }, row.getValue('note')),
    },*/
    {
        accessorKey: 'amount',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Amount', h(ArrowUpDown, { class: 'ml-2 h-4 w-4 text-right' })])
        },
        cell: ({ row }) => {
            const amount = Number.parseFloat(row.getValue('amount'))

            const isIncome = row.original.income;
            const formattedAmt = currencyFormatter.format(amount);

            const flowStyle = isIncome ? 'text-green-500' : 'text-red-500';
            //const flowSign = isIncome ? '+' : '-';
            return h('div', { class: `text-right font-medium font-semibold ${flowStyle}` }, formattedAmt)
        },
    },
    {
        id: 'actions',
        header: () => ['', h(FilePenLine, { class: 'ml-2 h-4 w-4' })],
        enableHiding: false,
        cell: ({ row }) => {
            return h(UpdateTransactionMenu, {
                transaction: row.original,
            })
        },
    },
]

const table = useVueTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: updaterOrValue => valueUpdater(updaterOrValue, sorting),
    onColumnFiltersChange: updaterOrValue => valueUpdater(updaterOrValue, columnFilters),
    onColumnVisibilityChange: updaterOrValue => valueUpdater(updaterOrValue, columnVisibility),
    onRowSelectionChange: updaterOrValue => valueUpdater(updaterOrValue, rowSelection),
    state: {
        //pageSize: 50, //???
        get sorting() { return sorting.value },
        get columnFilters() { return columnFilters.value },
        get columnVisibility() { return columnVisibility.value },
        get rowSelection() { return rowSelection.value },
        get globalFilter() { return filter.value },
    },
})
</script>

<template>
    <div class="flex items-center py-4">
        <input
            type="text"
            class="border border-gray-400 rounded px-2 py-2"
            placeholder="Filter by any column ... "
            v-model="filter"
        />
        <DropdownMenu v-if="isDesktop">
            <DropdownMenuTrigger as-child>
                <Button variant="outline" class="ml-auto">
                    Columns <ChevronDown class="ml-2 h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuCheckboxItem v-for="column in table.getAllColumns().filter((column) => column.getCanHide())" :key="column.id" class="capitalize" :checked="column.getIsVisible()" @update:checked="(value) => { 
                    column.toggleVisibility(!!value)
                }">
                    {{ column.id }}
                </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </div>

    <div v-if="isDesktop" class="w-full">
        <div class="rounded-md border">
            
            <Table>
                <TableHeader>
                    <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
                        <TableHead v-for="header in headerGroup.headers" :key="header.id">
                            <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header" :props="header.getContext()" />
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <template v-if="table.getRowModel().rows?.length">
                        <template v-for="row in table.getRowModel().rows" :key="row.id">
                            <TableRow :data-state="row.getIsSelected() && 'selected'">
                                <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                                    <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                                </TableCell>
                            </TableRow>
                        </template>
                    </template>

                    <TableRow v-else>
                        <TableCell :colspan="columns.length" class="h-24 text-center">
                            No results.
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>

        <div class="flex items-center justify-end space-x-2 py-4">
            <div class="flex-1 text-sm text-muted-foreground">
                <div>{{ table.getFilteredSelectedRowModel().rows.length }} of {{ table.getFilteredRowModel().rows.length }} row(s) selected.</div>
                <div>{{ selectedTotalText }}</div>
            </div>
            <div class="space-x-2">
                <Button variant="outline" size="sm" :disabled="!table.getCanPreviousPage()" @click="table.previousPage()">
                    Previous
                </Button>
                <Button variant="outline" size="sm" :disabled="!table.getCanNextPage()" @click="table.nextPage()">
                    Next
                </Button>
            </div>
        </div>
    </div>

    <div v-else>
        <Table v-for="(value, name, index) in transactionsByDate">
            <TableHeader>
                <TableHead class="px-0 h-8">
                    <TableRow class="font-semibold ">{{ name }}</TableRow>
                </TableHead>
            </TableHeader>
            <TableBody >
                <TableRow v-for="item in value" class="px-0  h-14 ">
                    <TableCell class="w-4 ">
                        <UpdateTransactionMenu  :transaction="item.original"/>
                    </TableCell>
                    <div class="flex justify-between items-center">
                        <TableCell>
                            <div>Notes</div>
                            <div>{{ item.original.budgetCategoryName }}</div>
                    </TableCell>
                    <TableCell >
                        <div class="font-medium font-semibold" :class="{
                            'text-red-500': item.original.income == false, 
                            'text-green-500': item.original.income
                        }">
                            {{ currencyFormatter.format(item.original.amount) }}
                        </div>
                    </TableCell>
                    </div>
                    
                </TableRow>
            </TableBody>
        </Table>
    </div>
</template>