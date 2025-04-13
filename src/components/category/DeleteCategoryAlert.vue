<script setup lang="ts">
import type { Budget, Category } from '@/types';
import { useBudgetStore } from '@/stores/budget';
import { useCategoryStore } from '@/stores/category';
import { useSubcategoryStore } from '@/stores/subcategory';
import DeleteAlert from '../DeleteAlert.vue';

const props = defineProps({
    category : {
        type: Object as () => Category,
        required: true
    },
});

const budgetStore = useBudgetStore();
const categoryStore = useCategoryStore();
const subcategoryStore = useSubcategoryStore();

const deleteCategory = () => {
    const associatedSubcategories = subcategoryStore.getSubcategoriesByCategoryId(props.category.id);

    let associatedBudgets: Budget[] = [];
    associatedSubcategories.forEach(x => {
        const budgets = budgetStore.getBudgetsBySubcategoryId(x.id);
        budgets.forEach(b => associatedBudgets.push(b));
    });

    categoryStore.deleteCategory(props.category.id);
    associatedSubcategories.forEach(subcategory => subcategoryStore.deleteSubcategory(subcategory.id));
    associatedBudgets.forEach(budget => budgetStore.deleteBudget(budget.id));
};
</script>

<template>
    <DeleteAlert :onSubmitFunction="deleteCategory" record-type="category" />
</template>