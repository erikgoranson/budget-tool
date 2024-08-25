<script setup lang="ts">
import { ref } from "vue";
import BudgetCard from '@/components/BudgetCard.vue';
import type { Budget, Category } from '../types/';
import { Button } from '@/components/ui/button';
import AddBudgetCategoryDrawer from '@/components/AddBudgetCategoryDrawer.vue';
import { storeToRefs } from 'pinia'

import { useCategoryStore } from '@/stores/category.ts';
const categoryStore = useCategoryStore();

const { categories } = storeToRefs(categoryStore);

//addCategory
const addBudget = () => {
    console.log('adding budget category');
    const newBC: Category = {
        name: 'Expense',
        description: 'expenses and stuff',
        hasDueDate: true,
        budgets: [
            {
                name: 'Groceries',
                dueDate: 25,
                amount: 8954.22,
            },
            {
                name: 'Toys',
                amount: 500.00,
                dueDate: null,
            }
        ]
    };
    categories.value.push(newBC);
}
</script>

<template>
    <AddBudgetCategoryDrawer />
    <Button @click="addBudget">Add category (test)</Button>
    
    <div v-for="bud in categories">
        <BudgetCard :budget="bud"/>
    </div>
</template>