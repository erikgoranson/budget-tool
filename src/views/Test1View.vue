<script setup lang="ts">
import BudgetCard from '@/components/BudgetCard.vue';
import { storeToRefs } from 'pinia'
import { useCategoryStore } from '@/stores/category';

const categoryStore = useCategoryStore();
const { categories } = storeToRefs(categoryStore);
</script>

<template>
    <div v-for="budgetCategory in categories">
        <BudgetCard :budgetCategory="budgetCategory"/>
    </div>
</template>