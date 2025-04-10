<script setup lang="ts">
import type { Category } from '@/types';
import { formProps } from './budgetFormHelper';
import { useBudgetStore } from '@/stores/budget';
import { useSubcategoryStore } from '@/stores/subcategory';
import Button from '../ui/button/Button.vue';

const props = defineProps(formProps);
const budgetStore = useBudgetStore();
const subcategoryStore = useSubcategoryStore();

const deleteBudget = () => {
    console.log('deleting budget', props.budgetRow.budgetId);
    budgetStore.deleteBudget(props.budgetRow.budgetId);
    subcategoryStore.deleteSubcategory(props.budgetRow.subcategoryId);
    props.onSubmitFunction();
};
</script>

<template>
    <div>
        This action will permanently delete the selected budget and all its related data. This cannot be undone. 
    </div>
    <div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-x-2">
        <Button class="bg-red-500" @click="deleteBudget">
            Delete
        </Button>
        <Button variant="outline" @click="onSubmitFunction">
            Cancel
        </Button>
    </div>
</template>