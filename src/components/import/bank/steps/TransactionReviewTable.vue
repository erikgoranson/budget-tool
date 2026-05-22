<script setup lang="ts" >
import type { TransactionImport } from '@/types';
import { h, ref, computed } from 'vue';
import type { ColumnFiltersState, GlobalFilterTableState, SortingState, VisibilityState } from '@tanstack/vue-table';
import { valueUpdater } from '@/lib/utils'; 
import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useVueTable } from '@tanstack/vue-table';
import { useDynamicColumns } from '@/composables/useDynamicColumns';
import BaseTransactionTable from '@/components/transaction/BaseTransactionTable.vue';

const importData = defineModel<TransactionImport>( { required: true, } );

const transactions = computed({
    get: () => importData.value?.mappedTransactions ?? [],
    set: (newVal) => {
        importData.value = { ...importData.value, mappedTransactions: newVal }
    }
})

const { createReadOnlyColumn, createSelectorColumn, createSortableHeader, createEditableColumn } = useDynamicColumns(transactions);
const columns = [
    createSelectorColumn(),
    createReadOnlyColumn('id'),
    createEditableColumn('date'),
    createEditableColumn('budgetCategoryName'),
    createEditableColumn('income'),
    createEditableColumn('amount'),
    createEditableColumn('note'),
    //TODO: mobile
];

const sorting = ref<SortingState>([
  { id: 'date', desc: true }
]);
const columnFilters = ref<ColumnFiltersState>([]);
const rowSelection = ref({});
const filter = ref<GlobalFilterTableState>();
const columnVisibility = ref<VisibilityState>({})

const table = useVueTable({
    get data() { return transactions.value },
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
    <div class="mb-5">
        Please review the following transactions and make necessary changes or deletions. To make changes,simply click on any field to begin. 
    </div>
    <BaseTransactionTable v-model:table="table" v-model:filter="filter"/>
</template>