<script setup lang="ts">
import type { TransactionImport } from '@/types/TransactionImport';
import type { BudgetData } from '@/types';
import { computed } from 'vue';
import { useBudgetDataStore } from '@/stores/budgetData';
import { useCategoryStore } from '@/stores/category';
import { useSubcategoryStore } from '@/stores/subcategory';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import BudgetSummary from '@/components/import/BudgetSummary.vue';
import BudgetTree from '@/components/import/BudgetTree.vue';

const categoryStore = useCategoryStore();
const subcategoryStore = useSubcategoryStore();
const dataStore = useBudgetDataStore();

const importData = defineModel<TransactionImport>({ required: true });
const stepComplete = defineModel<boolean>('stepComplete', { required: true });
const currentData = computed(() => dataStore.getAllBudgetData());

const emit = defineEmits<{
    (e: 'cancel'): void;
    (e: 'complete'): void;
}>();

const OverwriteData = () => {
    const newData = getBudgetData();
    dataStore.truncateBudgetData(); 
    dataStore.putBudgetData(newData as BudgetData);
    
    stepComplete.value = true;
    emit('complete');
};

const MergeData = () => {
    dataStore.putBudgetData(getBudgetData() as BudgetData);
    stepComplete.value = true;
    emit('complete');
};

const getBudgetData = () => {
    const categoryIds = new Set(importData.value.mappedTransactions.map(x => x.categoryId));
    const categories = categoryStore.categories.filter(a => categoryIds.has(a.id));

    const subcategoryIds = new Set(importData.value.mappedTransactions.map(x => x.subcategoryId));
    const subcategories = subcategoryStore.subcategories.filter(a => subcategoryIds.has(a.id));

    return <Partial<TransactionImport>>{
        budget: [],
        category: categories,
        transaction: importData.value.mappedTransactions,
        subcategory: subcategories,
        goal: [],
    };
};
</script>

<template>
    <div v-if="!stepComplete">
        <div class="mb-5">
            Please review the final summaries of your current budget data and the imported data from your CSV file. You may choose to either combine everything (merge) or start complete afresh using the imported data (overwrite). 
        </div>

        <div class="grid gap-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label>Current Budget Details:</Label>
                    <BudgetSummary :data="(currentData as BudgetData)" />

                    <Label>Current Budget Breakdown:</Label>
                    <BudgetTree :data="(currentData as BudgetData)" />
                </div>

                <div>
                    <Label>Imported Budget Details:</Label>
                    <BudgetSummary :data="(getBudgetData() as BudgetData)" />

                    <Label>Imported Budget Breakdown:</Label>
                    <BudgetTree :data="(getBudgetData() as BudgetData)" />
                </div>
            </div>
        </div>

        <div class="my-5 flex justify-between">
            <Button @click="MergeData">Merge</Button>
            <Button @click="OverwriteData">Overwrite</Button>
            <Button @click="emit('cancel');" variant="destructive">Cancel</Button> 
        </div>
    </div>

    <div v-else>

        <div class="grid gap-4">
            <p>Successfully processed file '<span class="font-semibold">{{ importData.selectedFile.name }}</span>'.</p>
            <Label>New budget details:</Label>
            <BudgetSummary :data="(currentData as BudgetData)" />

            <Label>New budget Breakdown:</Label>
            <BudgetTree :data="(currentData as BudgetData)" />
        </div>
    </div>
</template>