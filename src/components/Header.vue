<script setup lang="ts">
import { computed } from "vue";
import { AlignJustify } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';

import { useSidebarStore } from '@/stores/sidebar';
import { useBudgetStore } from '@/stores/budget';
import { useTransactionStore } from '@/stores/transaction';
import { useCarouselStore } from '@/stores/carousel';
import BudgetMonthCarousel from "./budgetRow/BudgetMonthCarousel.vue";
import CurrencyBadge from '@/components/CurrencyBadge.vue';

const sidebarStore = useSidebarStore();
const carouselStore = useCarouselStore();

const transactionStore = useTransactionStore();
const { transactions } = storeToRefs(transactionStore);

const budgetStore = useBudgetStore();
const { budgets } = storeToRefs(budgetStore);

const previousMonthsIncome = computed(() => {
    return transactions.value
        .filter(t => t.income === true && t.date < carouselStore.selectedMonth.toString())
        .reduce((total, i) => total + i.amount, 0);
});

const totalIncomeForMonth = computed(() => {
    const currentMonthIncome = transactions.value.filter(t => t.date >= carouselStore.selectedMonthString && t.income && t.date < carouselStore.selectedMonth.add({months:1}).toString());
    return currentMonthIncome.reduce((total, i) => total + i.amount, 0);
});

const totalBudgetForCurrentMonth = computed(() => {
    return budgets.value.filter(b => b.date >= carouselStore.selectedMonthString && b.date < carouselStore.selectedMonth.add({months:1}).toString()).reduce((b, {amount}) => b + amount, 0)
});

const totalBudgetInFuture= computed(() => {
    return budgets.value.filter(b => b.date >= carouselStore.selectedMonth.add({months:1}).toString()).reduce((b, {amount}) => b + amount, 0);
});

const totalBudgeted = computed(() => {
    return budgets.value.reduce((t, {amount}) => t + amount, 0);
});

const totalSpent = computed(() => {
    return transactions.value
        .filter(t => t.income === false && t.date < carouselStore.selectedMonth.add({months:1}).toString()) 
        .reduce((t, {amount}) => t + amount, 0);
});

const totalIncome = computed(() => totalIncomeForMonth.value + previousMonthsIncome.value);
const remainingToSpend = computed(() => totalIncomeForMonth.value + previousMonthsIncome.value - totalSpent.value);
const totalBudgetRemaining = computed(() => (totalIncome.value > 0) ? totalIncome.value - totalBudgeted.value : 0);
const totalFutureBudget = computed(() => (totalIncome.value > 0) ? totalBudgetInFuture.value : 0);
</script>

<template>
    <header class="flex items-center justify-center px-4 py-4 bg-white border-b-4 border-indigo-600">

        <div class="flex justify-start">
            <button class="text-gray-500 focus:outline-none lg:hidden" @click="sidebarStore.isOpen = true">
                <AlignJustify class="h-6 w-6" />
            </button>
        </div>

        <div class="flex-1 items-center justify-center">
            <div class="flex ml-auto items-center justify-center">
                <div class="flex flex-col items-center">

                    <BudgetMonthCarousel />

                    <div > 
                        <div class="flex flex-col" id="dashboard thingy">
                            <div class="flex flex-col justify-center items-center">
                                <div class="text-sm flex flex-col items-end justify-end">
                                    <CurrencyBadge :currencyValue="totalIncome" label="Total Income: "/>
                                    <CurrencyBadge :currencyValue="totalBudgetForCurrentMonth" :label="`Budgeted for ${carouselStore.selectedMonthName}`"/>
                                    <CurrencyBadge v-if="totalFutureBudget > 0" :currencyValue="totalFutureBudget" label="Budgeted in future"/>
                                    <CurrencyBadge :currencyValue="remainingToSpend" label="Unspent Income" warning-label="Overspent Income"/>
                                    <CurrencyBadge :currencyValue="totalBudgetRemaining" label="Left to Budget" warning-label="Over Budgeted"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    </header>
</template>
