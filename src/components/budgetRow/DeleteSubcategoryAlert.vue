<script setup lang="ts">
import type { Budget, Category } from '@/types';
import { computed } from 'vue';
import { formProps } from './budgetFormHelper';
import { useBudgetStore } from '@/stores/budget';
import { useSubcategoryStore } from '@/stores/subcategory';
import DeleteAlert from '../DeleteAlert.vue';

const props = defineProps(formProps);
const budgetStore = useBudgetStore();
const subcategoryStore = useSubcategoryStore();

const deleteSubcategoryAndChildren = () => {
    subcategoryStore.deleteSubcategory(props.budgetRow.subcategoryId);
    associatedBudgets.value.forEach(x => budgetStore.deleteBudget(x.id));
};

const associatedBudgets = computed(() => {
    return budgetStore.getBudgetsBySubcategoryId(props.budgetRow.subcategoryId);
});
</script>

<template>
    <DeleteAlert :onSubmitFunction="deleteSubcategoryAndChildren" record-type="budget subcategory">
        <template #messageContent>
            <p class="mb-2">This action will delete the budget subcategory '{{ budgetRow.name }}' and all budgets assigned to it for previous or future months. There are currently {{ associatedBudgets.length }} budget(s) associated with this subcategory. </p>
            <p>Are you sure you want to proceed? This may cause problems with reconciling your overall budget amount. </p>
        </template>
    </DeleteAlert>
</template>