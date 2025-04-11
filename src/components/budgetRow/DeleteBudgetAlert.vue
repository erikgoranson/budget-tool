<script setup lang="ts">
import type { Category } from '@/types';
import { formProps } from './budgetFormHelper';
import { useBudgetStore } from '@/stores/budget';
import { useSubcategoryStore } from '@/stores/subcategory';
import DeleteAlert from '../DeleteAlert.vue';

const props = defineProps(formProps);
const budgetStore = useBudgetStore();
const subcategoryStore = useSubcategoryStore();

const deleteBudget = () => {
    console.log('deleting budget', props.budgetRow.budgetId);
    budgetStore.deleteBudget(props.budgetRow.budgetId);
    subcategoryStore.deleteSubcategory(props.budgetRow.subcategoryId);
};
</script>

<template>
    <DeleteAlert :onSubmitFunction="deleteBudget" record-type="budget subcategory">
        <template #messageContent>
            <p>
                This action will permanently delete the selected budget and all its related data. This cannot be undone.
            </p>
            <p>
                Be advised that this includes the budgeted amounts towards this subcategory for ALL months. If your intent is to zero out the budget for this subcategory on a single month, consider revising that month's budget instead
            </p>
        </template>
    </DeleteAlert>
</template>