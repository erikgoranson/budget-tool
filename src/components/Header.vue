<script setup lang="ts">
import { ref, toRef, computed } from "vue";
import { AlignJustify } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import { useSidebarStore } from '@/stores/sidebar';
import { useTransactionStore } from '@/stores/transaction';
import { useCategoryStore } from '@/stores/category';
import currencyFormatter from '@/helpers/numberFormat';

import { Badge } from '@/components/ui/badge';

const sidebarStore = useSidebarStore();

const transactionStore = useTransactionStore();
const { transactions } = storeToRefs(transactionStore);

const categoryStore = useCategoryStore();
const { categories } = storeToRefs(categoryStore);

const dateFormatter = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric'
});

const incomeTotal = computed(() => {
    const amounts = transactions.value
        .filter(x => x.income)
        .map(tran => tran.amount);
    if (amounts.length == 0) return 0.00;
    return amounts.reduce((a, b) => a + b);
});

const budgetTotal = computed(() => {
    let budgetAmts = [] as number[];
    categories.value.forEach(cat => {
        const amounts = cat.budgets.map((x) => x.amount);
        if(amounts.length != 0) {
            budgetAmts.push(amounts.reduce((a, b) => a + b));
        }
    });

    if (budgetAmts.length == 0){
        return 0.00;
    } 
    else {
        return budgetAmts.reduce((a, b) => a + b);
    }
});

const remainingBudgetTotal = computed(() => {
    return incomeTotal.value - budgetTotal.value; 
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

                <!-- here is where month used to be-->
                <div class="flex flex-col">
                    <span class="text-3xl mb-2">{{  dateFormatter.format(new Date()) }}</span>
                    <div class="flex flex-col justify-center items-center">
                        <div class="text-sm flex flex-col items-end justify-end">
                            <div>
                                Total Income: 
                                <Badge class="ml-2 w-30" :class="{'bg-red-500': incomeTotal < 0, 'bg-green-500': incomeTotal > 0}">{{ currencyFormatter.format(incomeTotal) }}</Badge>
                            </div>
                            <div>
                                Total Budgeted: 
                                <Badge class="ml-2 w-30 bg-blue-800">{{ currencyFormatter.format(budgetTotal) }}</Badge>
                            </div>
                            <div>
                                <template v-if="remainingBudgetTotal > 0 || remainingBudgetTotal == 0">
                                    Left to Budget:
                                </template>
                                <template v-else>
                                    Over Budget:
                                </template>
                                <Badge class="ml-2 w-30"  :class="{'bg-red-500': remainingBudgetTotal < 0, 'bg-green-500': remainingBudgetTotal > 0}">{{ currencyFormatter.format(remainingBudgetTotal) }}</Badge>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>
