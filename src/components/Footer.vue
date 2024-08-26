<script setup lang="ts">
import type { Category } from '../types/';
import AddCategoryDialog from '@/components/AddCategoryDialog.vue';

/* TEST STUFF */
import { useCategoryStore } from '@/stores/category.ts';
import { storeToRefs } from 'pinia';
import { Button } from '@/components/ui/button';
const categoryStore = useCategoryStore();
const { categories } = storeToRefs(categoryStore);

//addCategory
const addCategory = () => {
    console.log('adding budget category');
    const newBC: Category = {
        id: Math.floor(Math.random() * 100000),
        name: 'Expense',
        description: 'expenses and stuff',
        hasDueDates: true,
        budgets: [
            {
                id: 1,
                name: 'Groceries',
                dueDate: 25,
                amount: 8954.22,
            },
            {
                id: 2,
                name: 'Toys',
                amount: 500.00,
                dueDate: null,
            }
        ]
    };
    categories.value.push(newBC);
};
</script>

<template>
    <footer class="flex items-center justify-center px-4 py-4 bg-indigo-200 border-t border-gray-200">
        <div class="flex justify-start">
        </div>
        <div class="flex-1 items-center justify-center">
            <div class="flex ml-auto items-center justify-center">
                <AddCategoryDialog />
                <Button @click="addCategory">
                    Add category (test)
                </Button>
            </div>
        </div>
    </footer>
</template>