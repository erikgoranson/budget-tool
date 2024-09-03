<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCategoryStore } from '@/stores/category';
import BudgetCard from '@/components/BudgetCard.vue';

const categoryStore = useCategoryStore();
const { categories } = storeToRefs(categoryStore);
</script>

<template>
  <div v-for="budgetCategory in categories">
      <BudgetCard :budgetCategory="budgetCategory"/>
  </div>
</template>