<script setup lang="ts">
import type { Category } from '@/types';
import { formProps } from './budgetFormHelper';
import dateFormatter from '@/helpers/dateFormatter';
import { useBudgetStore } from '@/stores/budget';
import DeleteAlert from '../DeleteAlert.vue';

const props = defineProps(formProps);
const budgetStore = useBudgetStore();

const deleteBudget = () => {
    console.log('deleting budget', props.budgetRow.budgetId, props.budgetRow.budgetMonth);
    budgetStore.resetBudget(props.budgetRow);
};
</script>

<template>
    <DeleteAlert :onSubmitFunction="deleteBudget" record-type="budget">
        <template #messageContent>
            This action will permanently delete the {{ dateFormatter.format(budgetRow.budgetMonth, 'monthYearDate') }} budget for {{ budgetRow.name }}. This cannot be undone.
        </template>
    </DeleteAlert>
</template>