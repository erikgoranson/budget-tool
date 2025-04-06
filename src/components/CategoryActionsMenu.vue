<script setup lang="ts">
import type { Category } from '../types/';
import { ref, toRef, computed } from "vue";

import { useTransactionStore } from '@/stores/transaction';
import { useBudgetStore } from '@/stores/budget';
import { useSubcategoryStore } from '@/stores/subcategory';

import Button from './ui/button/Button.vue';
import DynamicDropdownMenu from './DynamicDropdownMenu.vue';
import Form from './category/CreateUpdateForm.vue';

const transactionStore = useTransactionStore();
const budgetStore = useBudgetStore();
const subcategoryStore = useSubcategoryStore();

const props = defineProps({
    category : {
        type: Object as () => Category,
        required: true
    }
});

const dropdownOptions = [
    {
        name: 'edit',
        isAlert: false,
    },
    {
        name: 'delete',
        isAlert: true,
    },
];
</script>

<template>
    <DynamicDropdownMenu :options="dropdownOptions">
        <template v-slot:edit="{ events: { toggleDialog } }">
            <Form :category="category" :close-dialog-function="toggleDialog"></Form>
        </template>
        <template v-slot:delete="{ events: { toggleDialog } }">
            <div>
                This action will permanently delete the selected category and all its related data. This cannot be undone.
            </div>
            <div>
                <Button class="bg-red-500" @click="toggleDialog">Delete</Button>
                <Button @click="toggleDialog">Cancel</Button>
            </div>
        </template>
    </DynamicDropdownMenu>
</template>