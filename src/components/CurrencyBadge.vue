<script setup lang="ts">
import { computed } from "vue";
import { Badge } from '@/components/ui/badge';
import currencyFormatter from '@/helpers/numberFormat';

const props = defineProps({
    currencyValue : {
        type: Number,
        required: true
    },
    label : {
        type: String,
        required: true
    },
    warningLabel : {
        type: String,
        required: false
    },
});

const label = computed(() => (props.currencyValue < 0) ? props.warningLabel : props.label);
</script>

<template>
    <div>
        {{ label }}
        <Badge class="ml-2 w-30"  :class="{
            'bg-red-500': currencyValue < 0, 
            'bg-green-500': currencyValue > 0, 
            '': currencyValue == 0, 
            'bg-blue-800' : warningLabel === undefined
        }">
            {{ currencyFormatter.format(currencyValue) }}
        </Badge>
    </div>
</template>