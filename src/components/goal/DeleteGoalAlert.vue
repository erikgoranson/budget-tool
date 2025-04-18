<script setup lang="ts">
import type { Goal } from '@/types';
import { formProps } from './goalFormHelper';
import { useGoalStore } from '@/stores/goal';
import DeleteAlert from '../DeleteAlert.vue';

const goalStore = useGoalStore();
const props = defineProps(formProps);

const deleteGoal = () => {
    goalStore.deleteGoal(props.input.id);
};
</script>

<template>
    <DeleteAlert :onSubmitFunction="deleteGoal" record-type="goal" />
</template>