<script setup lang="ts">
import { GoalOption } from '@/types';
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia'

import { useMediaQuery, createReusableTemplate } from '@vueuse/core';
import { useGoalStore } from '@/stores/goal';

import GoalCard from '@/components/goal/GoalCard.vue';

const goalStore = useGoalStore();
const { goals } = storeToRefs(goalStore);

const isDesktop = useMediaQuery('(min-width: 768px)');
const cardCols = computed(() => isDesktop.value ? 'grid-cols-5' : 'grid-cols-2');
</script>

<template>
    <div class="grid" :class="cardCols" >
        <GoalCard v-for="goal in goals" :goal="goal" />
    </div>
</template>