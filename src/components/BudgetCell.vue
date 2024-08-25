<script setup lang="ts">
import { ref, computed } from "vue";
import type { Budget, Category } from '../types/';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const props = defineProps({
    amount: {
        type: Number,
        required: true,
    },
    //name of budget we're checking against?
});

//set this up later once I have a way to access transactions and master budgeted amounts

</script>

<template>
    <TableCell class="font-medium">{{ b.name }}</TableCell>
</template>