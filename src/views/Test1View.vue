<script setup lang="ts">
import BudgetCard from '@/components/BudgetCard.vue';
import { storeToRefs } from 'pinia'
import { useCategoryStore } from '@/stores/category.ts';

const categoryStore = useCategoryStore();
const { categories } = storeToRefs(categoryStore);
</script>

<template>
    <div v-for="bud in categories">
        <BudgetCard :budget="bud"/>
    </div>
</template>