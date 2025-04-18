import type { Goal } from '../types/';
import { ref } from 'vue';
import { defineStore } from 'pinia';
import localStorageHelper from '@/helpers/localStorage';

const storeKey = 'goal';
export const useGoalStore = defineStore(storeKey, () => {

    const getData = () => localStorageHelper.getData(storeKey) as Goal[];
    const setData = () => {
        console.log('goal store saved to localstorage');
        localStorageHelper.setData(storeKey, goals.value);
    };

    const goals = ref(getData());

    const createGoal = (goal: Goal) => {
        goals.value.unshift(goal);
        setData();
    };

    const updateGoal = (goal: Goal) => {
        const index = goals.value.findIndex(x => x.id == goal.id);
        goals.value.splice(index, 1, goal);
        setData();
    };

    const deleteGoal = (goalId: string) => {
        console.log('deleting goal', goalId);
        goals.value = goals.value.filter(x => x.id !== goalId);
        console.log('after delete:', JSON.stringify(goals.value));
        setData();
    };

    return { goals, createGoal, updateGoal, deleteGoal };
});