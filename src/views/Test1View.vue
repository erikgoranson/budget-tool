<script setup lang="ts">
import type { Category, Transaction } from '../types/';
import BudgetCard from '@/components/BudgetCard.vue';
import { storeToRefs } from 'pinia'
import { useCategoryStore } from '@/stores/category';
import { useTransactionStore } from '../stores/transaction';
import { computed, h, ref, onMounted, watch } from 'vue';

const transactionStore = useTransactionStore();
const { transactions } = storeToRefs(transactionStore);

const categoryStore = useCategoryStore();
const { categories } = storeToRefs(categoryStore);

//addCategory
const addTestCategory = () => {
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
            //monthInt: 8,
            //yearInt: 2024,
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
            //monthInt: 8,
            //yearInt: 2024,
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

//seed data during test
onMounted(() => {
    addTestCategory();
    addTestTransactions();
})
</script>

<template>
    <div v-for="budgetCategory in categories">
        <BudgetCard :budgetCategory="budgetCategory"/>
    </div>
</template>