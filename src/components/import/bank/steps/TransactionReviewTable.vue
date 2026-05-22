<script setup lang="ts" >
import type { TransactionImport, Subcategory, Transaction, TransactionRow } from '@/types';
import type { ColumnFiltersState, GlobalFilterTableState, SortingState, VisibilityState } from '@tanstack/vue-table';
import { h, ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { valueUpdater } from '@/lib/utils'; 
import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useVueTable } from '@tanstack/vue-table';
import { useSubcategoryStore } from '@/stores/subcategory';
import { useCategoryStore } from '@/stores/category';
import { useDynamicColumns } from '@/composables/useDynamicColumns';

import BaseTransactionTable from '@/components/transaction/BaseTransactionTable.vue';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label';

const categoryStore = useCategoryStore();
const { categories } = storeToRefs(categoryStore);

const subcategoryStore = useSubcategoryStore();
const { subcategories } = storeToRefs(subcategoryStore);

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

//TODO: refactor as own component
const applyBulkCategory = (value: Subcategory | unknown) => {
    const subcategory = value as Subcategory;
    const selectedIds = table.getFilteredSelectedRowModel().rows.map(row => row.original.id);
    const budgetCategory = subcategoryStore.getBudgetCategoryName(subcategory);

    transactions.value = transactions.value.map(item => {
        if (selectedIds.includes(item.id)) {
            return { 
                ...item, 
                budgetCategoryName: budgetCategory, 
                categoryId: subcategory.categoryId, 
                subcategoryId: subcategory.id 
            };
        }
        return item;
    });
};
</script>

<template>
    <div class="mb-5">
        Please review the following transactions and make necessary changes or deletions. To make changes,simply click on any field to begin. 
    </div>

    <div class="mb-5 flex flex-col p-4 rounded-lg border">
        <div class="flex items-center gap-4 flex-wrap">
            <p class="text-sm font-medium text-muted-foreground">
                <span class="font-semibold text-primary">{{ table.getFilteredSelectedRowModel().rows?.length }}</span> of <span class="font-semibold text-primary">{{ table.getFilteredRowModel().rows?.length }}</span> row(s) selected. 
            </p>

            <div v-if="table.getFilteredSelectedRowModel().rows?.length == 0" class="text-sm">
                Select one or more items to bulk edit the category field.
            </div>
            <div v-else class="flex items-center gap-2 border-l pl-4 border-border text-sm">
                <label class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Bulk Category:</label>
                <Select @update:model-value="applyBulkCategory"> <!--  -->
                    <SelectTrigger class="h-9">
                        <SelectValue  placeholder="Change selected to..." />
                    </SelectTrigger>
                    <SelectContent>
                        <span v-for="category in categories">
                            <Label v-if="subcategories.filter(x => x.categoryId == category.id)?.length > 0">{{ category.name }}</Label>
                            <SelectItem
                                v-for="subcategory in subcategories.filter(x => x.categoryId == category.id)"
                                :key="subcategory.id"
                                :value="subcategory"
                            >
                                {{ subcategory.name }}
                            </SelectItem>
                        </span>
                    </SelectContent>
                </Select>
            </div>
        </div>
    </div>

    <BaseTransactionTable v-model:table="table" v-model:filter="filter"/>
</template>