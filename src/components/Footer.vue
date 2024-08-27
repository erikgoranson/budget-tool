<script setup lang="ts">
import type { Category, Transaction } from '../types/';
import AddCategoryDialog from '@/components/AddCategoryDialog.vue';
import AddTransactionDialog from '@/components/AddTransactionDialog.vue';

/* TEST STUFF */
import { useCategoryStore } from '@/stores/category.ts';
import { useTransactionStore } from '../stores/transaction.ts';
import { storeToRefs } from 'pinia';
import { Button } from '@/components/ui/button';
import { SquarePlus } from 'lucide-vue-next';
const categoryStore = useCategoryStore();
const { categories } = storeToRefs(categoryStore);
const transactionStore = useTransactionStore();
const { transactions } = storeToRefs(transactionStore);

//addCategory
const addCategory = () => {
    console.log('adding budget category');
    const newBC: Category = {
        id: 9999, //Math.floor(Math.random() * 100000),
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

//test transaction
const addTestTransactions = () => {
    console.log('adding test transaction(s)');
    const testTrans: Transaction[] = [
        {
            id: Math.floor(Math.random() * 100000),
            //date: Date.now(),
            income: true,
            monthInt: 8,
            yearInt: 2024,
            payee: 'bank',
            categoryId: 9999,
            budgetId: 1,
            //note: null,
            hasCleared: false,
            amount: 25.22
        },
        {
            id: Math.floor(Math.random() * 100000),
            //date: Date.now(),
            income: false,
            monthInt: 8,
            yearInt: 2024,
            payee: 'King soopers',
            categoryId: 9999,
            budgetId: 1,
            note: 'dog food, raisins, TP',
            hasCleared: true,
            amount: 500.00
        },
    ];

    //transactions.value.concat(testTrans);
    testTrans.forEach(x => {
        transactions.value.unshift(x);
    });
}

</script>

<template>
    <footer class="flex items-center justify-center px-4 py-4 bg-indigo-200 border-t border-gray-200">
        <div class="flex justify-start">
        </div>
        <div class="flex-1 items-center justify-center">
            <div class="flex ml-auto items-center justify-center">
                <AddTransactionDialog />
                <Button @click="addTestTransactions">
                    + (test)
                </Button>
                |
                <AddCategoryDialog />
                <Button @click="addCategory">
                    + (test)
                </Button>
            </div>
        </div>
    </footer>
</template>