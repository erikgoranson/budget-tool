<script setup lang="ts">
import type { Budget, BudgetRow, Category } from '@/types';
import type { ColumnDef, ColumnFiltersState, GlobalFilterTableState, SortingState, VisibilityState } from '@tanstack/vue-table';

import { h, ref, computed} from 'vue';
import { storeToRefs } from 'pinia';
import { formProps } from './budgetFormHelper';
import { valueUpdater } from '@/lib/utils';

import { useBudgetStore } from '@/stores/budget';
import { useCarouselStore } from '@/stores/carousel';
import { useSubcategoryStore } from '@/stores/subcategory';

import { FlexRender, getCoreRowModel, getExpandedRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useVueTable, } from '@tanstack/vue-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table';
import BudgetCellEditor from './BudgetCellEditor.vue';
import { budgetColumns, editableColumns } from './budgetColumns';

const props = defineProps(formProps);

const budgetStore = useBudgetStore();
const { budgets } = storeToRefs(budgetStore);
const carouselStore = useCarouselStore();
const subcategoryStore = useSubcategoryStore();
const { subcategories } = storeToRefs(subcategoryStore);

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
        const budgetMatch = budgets.value.find(b => b.subcategoryId == s.id && b.date == carouselStore.selectedMonthString);
        return <BudgetRow>{
            subcategoryId: s.id,
            name: s.name,
            categoryId: props.category.id,
            dueDate: s.dueDate,
            amount: budgetMatch?.amount ?? 0,
            date: budgetMatch?.date ?? '',
            id: budgetMatch?.id ?? '',
        };
    });

    return rows;
});

const table = useVueTable({
    data: budgetRows,
    columns: budgetColumns,
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
	<div>
        <Table>
            <TableHeader class="bg-blue-300">
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
                            <TableCell v-for="(cell, index) in row.getVisibleCells()" :key="cell.id">
                                
                                <BudgetCellEditor v-if="editableColumns.includes(cell.column.id)" :cell="cell" :index="index" :category="props.category"/>

                                <FlexRender v-else :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                                
                            </TableCell>
                        </TableRow>
                    </template>
                </template>

                <TableRow v-else>
                    <TableCell :colspan="budgetColumns.length" class="h-24 text-center">
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