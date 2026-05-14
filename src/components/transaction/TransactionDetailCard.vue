<script setup lang="ts">
import type { TransactionRow } from '@/types';
const props = defineProps({
    data : {
        type: Object as () => TransactionRow,
        required: true,
    }
});
</script>

<template>
    <div class=" flex justify-between items-center ">
        <div class="flex flex-col gap-1">
            <span class="text-sm font-medium tracking-tight">
                {{ data.date }}
            </span>
            
            <span class="font-semibold text-gray-900">
                {{ data.budgetCategoryName }}
            </span>
            
            <span class="text-sm text-gray-900">
                {{ data.note }}
            </span>
        </div>
        
        <div class="flex items-center gap-2">
            <span
            :class="data.income ? 'text-emerald-600' : 'text-rose-600'"
            class="font-medium truncate"
            >
            {{ data.income ? '+' : '-' }}${{ data.amount.toFixed(2) }}
            </span>
        </div>
    </div>
</template>