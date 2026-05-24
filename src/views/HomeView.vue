<script setup lang="ts">
import type { Category } from '../types/';
import { computed } from "vue";
import { storeToRefs } from 'pinia';
import { useCategoryStore } from '@/stores/category';
import { useTransactionStore } from '@/stores/transaction';
import uncategorized from '@/helpers/uncategorizedHelper';
import BudgetCard from '@/components/budgetRow/BudgetCard.vue';
import BudgetDashboard from '@/components/budgetRow/BudgetDashboard.vue';
import CreateCategoryDialog from '../components/category/CreateCategoryDialog.vue';
import UncategorizedCard from '@/components/budgetRow/UncategorizedCard.vue';

const categoryStore = useCategoryStore();
const { categories } = storeToRefs(categoryStore);
const transactionStore = useTransactionStore();
const { transactions } = storeToRefs(transactionStore);

const uncategorizedTransactionsExist = computed(() => {
  const amounts = transactions.value.filter(tran => {
    return tran.categoryId == uncategorized.guid;
  });

  if (amounts.length > 0){
    return true;
  } 
  else {
    return false;
  }; 
});
</script>

<template>
  <BudgetDashboard/>
  <UncategorizedCard v-if="uncategorizedTransactionsExist"/>
  <div v-for="budgetCategory in categories">
      <BudgetCard :budgetCategory="budgetCategory"/>
  </div>
  <CreateCategoryDialog />
</template>