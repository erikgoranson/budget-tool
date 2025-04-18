<script setup lang="ts">
import { GoalOption } from '@/types';
import { ref, computed } from 'vue';
import { RouterLink, RouterView, useRoute } from 'vue-router';
import { storeToRefs } from 'pinia'
import { useMediaQuery, createReusableTemplate } from '@vueuse/core';
import currencyFormatter from '@/helpers/numberFormat';
import { useGoalStore } from '@/stores/goal';
import { useTransactionStore } from '@/stores/transaction';

import ProgressBar from '@/components/ProgressBar.vue';
import GoalCard from '@/components/goal/GoalCard.vue';
import CreateGoalDialog from '@/components/goal/CreateGoalDialog.vue';


const goalStore = useGoalStore();
const { goals } = storeToRefs(goalStore);
const transactionStore = useTransactionStore();
const { transactions } = storeToRefs(transactionStore);

const route = useRoute();
const option = route.meta.goalOption ?? GoalOption.Savings;
const goalVerb = computed(() => option == GoalOption.Savings ? 'Saved' : 'Paid off');

const isDesktop = useMediaQuery('(min-width: 768px)');
const cardCols = computed(() => isDesktop.value ? 'grid-cols-5' : 'grid-cols-2');

const displayedGoals = computed(() => goals.value.filter(g => g.isSuccessful == false || g.isSuccessful == undefined));

const totalSuccessfulGoals = computed(() => displayedGoals.value.filter(g => g.isSuccessful));

const totalGoalAmount = computed(() => {
    return displayedGoals.value.reduce((b, {amount}) => b + amount, 0);
});

const totalGoalAppliedAmount = computed(() => {
    const goalSubcategoryIds = displayedGoals.value.map(x => x.subcategoryId);

    const goalTransactions = transactions.value.filter(transaction => goalSubcategoryIds.includes(transaction.subcategoryId) && !transaction.income);

    return goalTransactions.reduce((t, {amount}) => t + amount, 0);
});

const allGoalsData = computed(() => [
    {
        title: 'Completed',
        progressText: `${totalSuccessfulGoals.value.length} / ${displayedGoals.value.length}`,
        progress: Number(totalSuccessfulGoals.value.length / displayedGoals.value.length),
    },
    {
        title: goalVerb,
        progressText: `${currencyFormatter.format(totalGoalAppliedAmount.value)} / ${currencyFormatter.format(totalGoalAmount.value)}`,
        progress: Number(totalGoalAppliedAmount.value / totalGoalAmount.value),
    },
]);
</script>

<template>
    <div class="mt-6 overflow-hidden rounded-md shadow-lg mx-2 bg-indigo-300 ">
        <div class="flex items-center justify-center bg-indigo-400 py-2">
            <div class="flex-1"></div>
            <div class="font-semibold text-2xl truncate">All Goals</div>
            <div class="flex-1">
                <div class="w-20 flex items-center justify-center ml-auto">
                    <CreateGoalDialog />
                </div>
            </div>
        </div>
        <div class="px-4" v-if="displayedGoals.length > 0" v-for="item in allGoalsData">
            <ProgressBar :percentage="item.progress">
                <template #title>
                    <div class="mb-2">
                        Total {{ item.title }} ( {{ item.progressText }} )
                    </div>
                </template>
                <template #progressLabel>{{ Math.round(item.progress * 100) + '%' }}</template>
            </ProgressBar>
        </div>
        <div v-else>No Goals Found</div>
    </div>

    <div class="grid " :class="cardCols" >
        <GoalCard v-for="goal in displayedGoals" :goal="goal" />
    </div>
</template>