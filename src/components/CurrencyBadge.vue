<script setup lang="ts">
import { Badge } from '@/components/ui/badge';
import currencyFormatter from '@/helpers/numberFormat';

const props = defineProps({
    currencyValue : {
        type: Number,
        required: true
    },
    baseStyle : {
        type: Boolean,
        required: false
    },
});
</script>

<template>
    <Badge class="w-30 font-mono"  :class="{
            'bg-red-500': currencyValue < 0, 
            'bg-green-500': currencyValue > 0, 
            '': currencyValue == 0, 
            'bg-blue-800' : baseStyle === true
    }">
        {{ currencyFormatter.format(currencyValue) }}
    </Badge>
</template>