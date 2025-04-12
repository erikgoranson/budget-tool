<script setup lang="ts">
import type { Budget, Category  } from "@/types";

import { ref, toRef, computed } from "vue";
import { storeToRefs } from 'pinia';
import { useTransactionStore } from '@/stores/transaction';
import { useBudgetStore } from '@/stores/budget';
import { useSubcategoryStore } from '@/stores/subcategory';
import { useCarouselStore } from '@/stores/carousel';
import currencyFormatter from '@/helpers/numberFormat';

const props = defineProps({
    category : {
        type: Object as () => Category,
        required: true
    }
});

const transactionStore = useTransactionStore();
const { transactions } = storeToRefs(transactionStore);
const budgetStore = useBudgetStore();
const { budgets } = storeToRefs(budgetStore);
const subcategoryStore = useSubcategoryStore();
const { subcategories } = storeToRefs(subcategoryStore);
const carouselStore = useCarouselStore();

const budgetTotal = computed(() => {
    let total = subcategories.value.reduce((total, s) => {
        let matches = budgets.value.filter(b => b.subcategoryId == s.id && b.date == carouselStore.selectedMonthString);
        let subtotal =  matches.reduce((subtotal, budget) => {
            return subtotal + budget.amount;
        }, 0);
        return total + subtotal;
    }, 0);

    return total;
});

const expensedTotal = computed(() => {
    return transactions.value
        .filter(t => 
            t.categoryId == props.category.id && 
            t.income === false && 
            t.date < carouselStore.selectedMonth.add({months:1}).toString() &&
            t.date >= carouselStore.selectedMonth.toString()
        )
        .reduce((t, {amount}) => t + amount, 0);
})

const remainingTotal = computed(() => {
    return budgetTotal.value - expensedTotal.value;
});
</script>

<template>
    <div class="font-semibold text-sm w-sm">
        <div>Budgeted {{ currencyFormatter.format(budgetTotal) }}</div>
        <div>Expensed {{ currencyFormatter.format(expensedTotal) }}</div>
        <div>Remaining {{ currencyFormatter.format(remainingTotal) }}</div>
    </div>
</template>