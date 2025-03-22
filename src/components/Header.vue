<script setup lang="ts">
import { ref, toRef, computed } from "vue";
import { AlignJustify } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';

import { useSidebarStore } from '@/stores/sidebar';
import { useBudgetStore } from '@/stores/budget';
import { useTransactionStore } from '@/stores/transaction';
import { useCarouselStore } from '@/stores/carousel';
import currencyFormatter from '@/helpers/numberFormat';
import BudgetMonthCarousel from "./BudgetMonthCarousel.vue";

import { Badge } from '@/components/ui/badge';

const sidebarStore = useSidebarStore();
const carouselStore = useCarouselStore();

const transactionStore = useTransactionStore();
const { transactions } = storeToRefs(transactionStore);

const budgetStore = useBudgetStore();
const { budgets } = storeToRefs(budgetStore);

const previousIncome = computed(() => {
    return transactions.value
        .filter(t => t.income === true && t.date < carouselStore.selectedMonth.toString())
        .reduce((total, i) => total + i.amount, 0);
});

const previousExpenses = computed(() => {
    return transactions.value
        .filter(t => t.income === false && t.date < carouselStore.selectedMonth.toString())
        .reduce((total, i) => total + i.amount, 0);
});

const startingBalance = computed(() => previousIncome.value - previousExpenses.value );

const totalIncomeForMonth = computed(() => {
    const currentMonthIncome = transactions.value.filter(t => t.date > carouselStore.selectedMonthString && t.income && t.date < carouselStore.selectedMonth.add({months:1}).toString());
    return currentMonthIncome.reduce((total, i) => total + i.amount, 0);
});

const totalIncome = computed(() => {
    return totalIncomeForMonth.value + startingBalance.value;
});

const totalSpent = computed(() => {
    const stuff = transactions.value
        .filter(t => t.income === false && t.date < carouselStore.selectedMonth.add({months:1}).toString()) 
        .reduce((t, {amount}) => t + amount, 0);
    console.log('total spent', stuff);
    return stuff;
});

const totalSpentInCurrentMonth = computed(() => {
    const stuff = transactions.value
        .filter(t => t.income === false && t.date < carouselStore.selectedMonth.add({months:1}).toString() && t.date >= carouselStore.selectedMonth.toString())
        .reduce((t, {amount}) => t + amount, 0);
    console.log('total spent', stuff);
    return stuff;
});

const remainingToSpend = computed(() => {
    return totalIncomeForMonth.value + previousIncome.value - totalSpent.value;
});

const budgetTotal = computed(() => {
    const currentBudgetedAmounts = budgets.value.filter(b => b.date == carouselStore.selectedMonthString);
    return currentBudgetedAmounts.reduce((b, {amount}) => b + amount, 0);
});

const totalBudgeted = computed(() => {
    return budgets.value
        .filter(t => t.date < carouselStore.selectedMonth.add({months:1}).toString())
        .reduce((t, {amount}) => t + amount, 0);
});

const remainingBudgetTotal = computed(() => {
    console.log('remainingBudgetTotal:', totalIncomeForMonth.value, '+', startingBalance.value, '-', budgetTotal.value);
    return totalIncomeForMonth.value + startingBalance.value - budgetTotal.value; 
});
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
                    <div class="flex flex-col">
                    <div class="flex flex-col justify-center items-center">
                        <div class="text-sm flex flex-col items-end justify-end">
                            <div>
                                Total Income: 
                                <Badge class="ml-2 w-30 bg-blue-800">{{ currencyFormatter.format(totalIncome) }}</Badge>
                            </div>
                            <div>
                                Total Budgeted: 
                                <Badge class="ml-2 w-30 bg-blue-800">{{ currencyFormatter.format(budgetTotal) }}</Badge>
                            </div>
                            <div>
                                <template v-if="remainingToSpend > 0 || remainingToSpend == 0">
                                    Left to Spend:
                                </template>
                                <template v-else>
                                    Overspent:
                                </template>
                                <Badge class="ml-2 w-30" :class="{'bg-red-500': remainingToSpend < 0, 'bg-green-500': remainingToSpend > 0}">
                                    {{ currencyFormatter.format(remainingToSpend) }}
                                </Badge>
                            </div>
                            
                            <div>
                                <template v-if="remainingBudgetTotal > 0 || remainingBudgetTotal == 0">
                                    Left to Budget:
                                </template>
                                <template v-else>
                                    Over Budgeted:
                                </template>
                                <Badge class="ml-2 w-30"  :class="{'bg-red-500': remainingBudgetTotal < 0, 'bg-green-500': remainingBudgetTotal > 0}">{{ currencyFormatter.format(remainingBudgetTotal) }}</Badge>
                            </div>
                            
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
    </header>
</template>
