<script setup lang="ts" >
import type { Table as tTable } from '@tanstack/vue-table';
import type { Transaction } from '@/types';

import { computed } from 'vue';
import currencyFormatter from '@/helpers/numberFormat'; 
import { FlexRender } from '@tanstack/vue-table';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

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

const table = defineModel<tTable<Transaction>>('table', { required: true,});
const filter = defineModel<any>('filter', { required: true,});
</script>

<template>
    <div class="flex items-center py-4">
        <input
            type="text"
            class="border border-gray-400 rounded px-2 py-2"
            placeholder="Filter by any column ... "
            v-model="filter"
        />
    </div>

    <div class="rounded-md border">
        
        <Table class="bg-card rounded-md">
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
                    <TableCell :colspan="table.getAllColumns.length" class="h-24 text-center">
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