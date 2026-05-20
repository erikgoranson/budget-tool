<script setup lang="ts">
import type { Category } from "@/types";
import { computed } from "vue";
import { storeToRefs } from 'pinia';
import { useTransactionStore } from '@/stores/transaction';

import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import BudgetTotalsReport from "../budgetRow/BudgetTotalsReport.vue";
import CollapsibleCard from "../app/CollapsibleCard.vue";

const transactionStore = useTransactionStore();
const { transactions } = storeToRefs(transactionStore);

const uncategorizedTransactions = computed(() => {
    return transactions.value.filter(tran => {
        return tran.categoryId == transactionStore.uncategorizedGuid;
    });
});

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
    <CollapsibleCard card-color="red">
        <template #header>
            <div class="flex flex-1 justify-between justify-center items-center">
                <div class="min-w-0">
                    <CardTitle>
                        {{ uncategorizedBudget.name }}
                    </CardTitle>

                    <CardDescription class="line-clamp-2 mt-1 text-sm">
                        {{ uncategorizedBudget.description }}
                    </CardDescription>
                </div>
                <div class="flex flex-col gap-2 text-right shrink-0">
                    <BudgetTotalsReport :category="uncategorizedBudget"/>
                </div>
            </div>
        </template>
        <template #content>
            <div class="p-4 overflow-y-scroll">
                {{ uncategorizedTransactions }}
            </div>
        </template>
    </CollapsibleCard>
</template>