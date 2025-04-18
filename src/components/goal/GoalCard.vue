<script setup lang="ts">
import type { Goal } from '@/types';
import { GoalOption } from '@/types';
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useSubcategoryStore } from '@/stores/subcategory';
import { useTransactionStore } from '@/stores/transaction';
import currencyFormatter from '@/helpers/numberFormat';
import dateFormatter from '@/helpers/dateFormatter';
import ProgressBar from '../ProgressBar.vue';
import Button from '../ui/button/Button.vue';
import GoalActionsMenu from './GoalActionsMenu.vue';

const subcategoryStore = useSubcategoryStore();
const transactionStore = useTransactionStore();
const { transactions } = storeToRefs(transactionStore);

const props = defineProps({
    goal : {
        type: Object as () => Goal,
        required: true
    }
});

const totalAppliedAmount = computed(() => {
    return transactions.value
        .filter(transaction => transaction.subcategoryId == props.goal.subcategoryId && !transaction.income)
        .reduce((t, {amount}) => t + amount, 0);
});

const goalVerb = computed(() => props.goal.goalOption == GoalOption.Savings ? 'Saved' : 'Paid Off');

const totalRemainingAmount= computed(() => props.goal.amount - totalAppliedAmount.value);

const goalAchieved = computed(() => totalAppliedAmount.value > props.goal.amount);
</script>

<template>
    <div class="mt-6 overflow-hidden rounded-md shadow-lg mx-2 bg-indigo-300" >
        
        <div class="flex justify-between px-2 py-4 bg-indigo-400">
            <div class="flex items-center">
                <div class="flex justify-center content-center items-center text-center align-middle h-4 mr-2 "></div>
                <div >
                    <div class="font-semibold truncate">{{ subcategoryStore.getSubcategoryNameById(goal.subcategoryId) }} </div>
                    <div>{{ goal.goalOption }}</div>
                </div>
            </div>
            <div>
                <GoalActionsMenu :input="goal"/>
            </div>
        </div>

        <div class="my-2 px-4">  
            <div>
                Due: {{ dateFormatter.format(goal.date, 'longDate') }}
            </div>

            <ProgressBar :percentage="totalAppliedAmount / goal.amount">
                <template #title> 
                    <div class="mb-2">
                        {{ currencyFormatter.format(totalAppliedAmount) }} / {{ currencyFormatter.format(goal.amount) }}
                    </div>
                </template>
                <template #progressLabel>
                    {{ Math.round(totalAppliedAmount / goal.amount * 100) + '%' }} {{ goalVerb }}
                </template>
            </ProgressBar>
        </div>
    
        <div v-if="goalAchieved" class="px-3 pt-1 pb-1 mb-2 items-center text-center">
            <Button class="w-full">Goal Complete!</Button>
        </div>
    </div> 
</template>