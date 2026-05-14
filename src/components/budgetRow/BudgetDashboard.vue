<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from 'pinia';
import { useBudgetStore } from '@/stores/budget';
import { useTransactionStore } from '@/stores/transaction';
import { useCarouselStore } from '@/stores/carousel';
import BudgetMonthCarousel from "./BudgetMonthCarousel.vue";
import CurrencyBadge from '@/components/CurrencyBadge.vue';

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
    <div class="flex-1 items-center justify-center">
        <div class="flex ml-auto items-center justify-center">
            <div class="flex flex-col items-center">
                <BudgetMonthCarousel />

                <div class="flex flex-row gap-2">
                    <!-- labels -->
                    <div class="flex flex-col w-fit text-sm font-semibold font-mono justify-center">
                        <div>Total Income</div>
                        <div>{{`Budgeted for ${carouselStore.selectedMonthName}`}}</div>
                        <div v-if="totalFutureBudget > 0">Budgeted in future</div>
                        <div>{{ remainingToSpend < 0 ? 'Overspent Income' : 'Unspent Income'}}</div>
                        <div>Left to Budget</div>
                    </div>

                    <!-- badges -->
                    <div class="flex flex-col w-fit">
                        <CurrencyBadge :currencyValue="totalIncome" :base-style="true"/>
                        <CurrencyBadge :currencyValue="totalBudgetForCurrentMonth" :base-style="true"/>
                        <CurrencyBadge v-if="totalFutureBudget > 0" :currencyValue="totalFutureBudget" :base-style="true"/>
                        <CurrencyBadge :currencyValue="remainingToSpend"/>
                        <CurrencyBadge :currencyValue="totalBudgetRemaining"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>