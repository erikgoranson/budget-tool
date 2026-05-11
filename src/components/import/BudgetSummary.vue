<script setup lang="ts">
import type { BudgetData } from '@/types';
import { ref, computed } from 'vue';

import { Card, CardContent } from '@/components/ui/card';
import currencyFormatter from '@/helpers/numberFormat';

const props = defineProps({
    data : {
        type: Object as () => BudgetData,
        required: false,
        default: null,
    }
});

const incomeTotal = computed(() => {
    const income = props.data?.transaction?.filter(x => x.income).map(t => t.amount);
    return income?.reduce((a, b) => a + b, 0) || 0;
});

const expenseTotal = computed(() => {
    const income = props.data?.transaction?.filter(x => !x.income)?.map(t => t.amount);
    return income?.reduce((a, b) => a + b, 0) || 0;
});
</script>

<template>
    <Card class="border-gray-400 bg-gray-100">
        <CardContent v-if="props.data" class="p-6">
            <div>
                <ul>
                    <li>{{ data?.category?.length ?? 0}} category record(s)</li>
                        <ul class="list-disc pl-5">
                            <li>{{ data?.subcategory?.length ?? 0}} budget record(s)</li>
                            <ul class="list-disc pl-5">
                                <li>{{ data?.budget?.length ?? 0}} budgeted months</li>
                                <li>{{ data?.goal?.length ?? 0}} goal(s)</li>
                            </ul>
                        </ul>
                    <li>{{ data?.transaction?.length ?? 0}} transaction record(s)</li>
                </ul>
            </div>
            
            <p class="mt-2">Total income: {{ currencyFormatter.format(incomeTotal) }}</p>
            <p>Total expenses: {{ currencyFormatter.format(expenseTotal) }}</p>
        </CardContent>
        <CardContent v-else class="p-6">
            <slot />
        </CardContent>
    </Card>
</template>