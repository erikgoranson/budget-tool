<script setup lang="ts">
import { computed } from 'vue';
import { Badge } from '@/components/ui/badge';
import currencyFormatter from '@/helpers/numberFormat';

const props = defineProps({
    amount : {
        type: Number,
        required: true
    },
    isWarning : {
        type: Boolean,
        required: false,
        default: null
    }
});

const style = computed(() => {
    if(props.amount == 0) return 'bg-blue-800';

    switch (props.isWarning) {
        case true:
            return 'bg-red-500';
        case false:
            return 'bg-green-500';
        case null:
        case undefined:
        default:
            return 'bg-blue-800';
    };
});
</script>

<template>
    <Badge class="w-30 font-mono" :class="style">
        {{ currencyFormatter.format(amount) }}
    </Badge>
</template>