<script setup lang="ts">
import type {
  ColumnDef,
  ColumnFiltersState,
  GlobalFilterTableState,
  SortingState,
  VisibilityState,
} from '@tanstack/vue-table';
import { useMediaQuery } from '@vueuse/core';

import { h, ref, computed } from 'vue';
import { storeToRefs } from 'pinia';

import { valueUpdater } from '@/lib/utils'; 
import currencyFormatter from '@/helpers/numberFormat'; 
import { transactionColumns } from './transactionColumns';
import { useTransactionStore } from '@/stores/transaction';

import {
  FlexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import { ChevronDown,} from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const transactionStore = useTransactionStore();
const { transactionRows } = storeToRefs(transactionStore);

const sorting = ref<SortingState>([]);
const columnFilters = ref<ColumnFiltersState>([]);
const rowSelection = ref({});
const filter = ref<GlobalFilterTableState>();
const isDesktop = useMediaQuery('(min-width: 768px)');

const selectedTotalText = computed(() => {
    const selectedRows = table.value.getFilteredSelectedRowModel().rows;
    const rowAmounts = selectedRows.map(x => x.original.amount);
    
    if(selectedRows.length == 0){
        return `${currencyFormatter.format(0)} total`;
    } else {
        const total = rowAmounts.reduce((a, b) => a + b);
        return `${currencyFormatter.format(total)} total.`;
    }
});

const columns = transactionColumns;

const columnVisibility = computed<VisibilityState>(() => ({
    mobile: !isDesktop.value,
    date: isDesktop.value,
    budgetCategoryName: isDesktop.value,
    note: isDesktop.value,
    amount: isDesktop.value,
}));


const table = computed(() => { 
    return useVueTable({
        data: transactionRows,
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
    })
});
</script>

<template>

    <div class="flex items-center py-4">
        <input
            type="text"
            class="border border-gray-400 rounded px-2 py-2"
            placeholder="Filter by any column ... "
            v-model="filter"
        />
        <DropdownMenu >
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

    <div class="rounded-md border">
        
        <Table>
            <TableHeader>
                <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id" >
                    <TableHead v-for="header in headerGroup.headers" :key="header.id">
                        <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header" :props="header.getContext()" />
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <template v-if="table.getRowModel().rows?.length">
                    <template v-for="row in table.getRowModel().rows" :key="row.id">
                        <TableRow :data-state="row.getIsSelected() && 'selected'" class="border-b border-gray-400">
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
        <div class="flex-1 text-muted-foreground">
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

</template>