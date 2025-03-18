<script setup lang="ts">
import type { Category } from '../types/';
import { computed } from "vue";
import { storeToRefs } from 'pinia';
import { useCategoryStore } from '@/stores/category';
import { useTransactionStore } from '@/stores/transaction';
import BudgetCard from '@/components/BudgetCard.vue';

const categoryStore = useCategoryStore();
const { categories } = storeToRefs(categoryStore);
const transactionStore = useTransactionStore();
const { transactions } = storeToRefs(transactionStore);

const uncategorizedTransactionsExist = computed(() => {
  const amounts = transactions.value.filter(tran => {
    return tran.categoryId == transactionStore.uncategorizedGuid;
  });

  if (amounts.length > 0){
    return true;
  } 
  else {
    return false;
  }; 
})

const uncategorizedBudget = computed(() => {
  const uncat = <Category>{
    id: transactionStore.uncategorizedGuid,
    name: 'Uncategorized',
    description: 'Transactions have been added that have no budget category.',
    hasDueDates: false,
  }

  return uncat;
});
</script>

<template>
  <BudgetCard v-if="uncategorizedTransactionsExist" :budgetCategory="uncategorizedBudget"/>
  <div v-for="budgetCategory in categories">
      <BudgetCard :budgetCategory="budgetCategory"/>
  </div>
</template>