<script setup lang="ts">
import type { BudgetImport } from '@/types';
import { ref, computed } from 'vue';

import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';

const props = defineProps({
    data : {
        type: Object as () => BudgetImport,
        required: false,
        default: null,
    }
});

const incomeTotal = computed(() => {
    const income = props.data?.transactions?.filter(x => x.income).map(t => t.amount);
    return income?.reduce((a, b) => a + b, 0);
});

const expenseTotal = computed(() => {
    const income = props.data?.transactions?.filter(x => !x.income)?.map(t => t.amount);
    return income?.reduce((a, b) => a + b, 0);
});
</script>

<template>
    <Card class="border-gray-400 bg-gray-100">
        <CardContent v-if="props.data" class="p-6">
            <div>
                <ul>
                    <li>{{ data?.category?.length ?? 0}} category record(s)</li>
                        <ul class="list-disc pl-5">
                            <li>{{ data?.subcategories?.length ?? 0}} budget record(s)</li>
                            <ul class="list-disc pl-5">
                                <li>{{ data?.budgets?.length ?? 0}} budgeted months</li>
                                <li>{{ data?.goals?.length ?? 0}} goal(s)</li>
                            </ul>
                        </ul>
                    <li>{{ data?.transactions?.length ?? 0}} transaction record(s)</li>
                </ul>
            </div>
            
            <p class="mt-2">Total income: ${{ incomeTotal }}</p>
            <p>Total expenses: ${{ expenseTotal }}</p>
        </CardContent>
        <CardContent v-else class="p-6">
            <slot />
        </CardContent>
    </Card>
</template>