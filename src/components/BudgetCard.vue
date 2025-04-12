<script setup lang="ts">
import type { Budget, Category } from '../types/';

import { ref, toRef, computed } from "vue";
import { storeToRefs } from 'pinia';
import { useTransactionStore } from '@/stores/transaction';
import { useBudgetStore } from '@/stores/budget';
import { useSubcategoryStore } from '@/stores/subcategory';
import { useCarouselStore } from '@/stores/carousel';
import currencyFormatter from '@/helpers/numberFormat';
import { Rows4, ChevronUp, ChevronDown, ChevronsDown, ChevronsUp } from 'lucide-vue-next';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Toggle } from '@/components/ui/toggle';

import BudgetTable from './budgetRow/BudgetTable.vue';
import CategoryActionsMenu from './category/CategoryActionsMenu.vue';
import CreateBudgetForm from './budgetRow/CreateBudgetForm.vue';

const props = defineProps({
    budgetCategory : {
        type: Object as () => Category,
        required: true
    }
});

const isOpen = ref(false); 
const transactionStore = useTransactionStore();
const { transactions } = storeToRefs(transactionStore);
const budgetStore = useBudgetStore();
const { budgets } = storeToRefs(budgetStore);
const subcategoryStore = useSubcategoryStore();
const { subcategories } = storeToRefs(subcategoryStore);
const carouselStore = useCarouselStore();

const toggleBudgetdata = () => {
    isOpen.value = !isOpen.value;
};

const budgetTotal = computed(() => {
    let total = subcategories.value.reduce((total, s) => {
        let matches = budgets.value.filter(b => b.subcategoryId == s.id && b.date == carouselStore.selectedMonthString);
        let subtotal =  matches.reduce((subtotal, budget) => {
            return subtotal + budget.amount;
        }, 0);
        return total + subtotal;
    }, 0);

    return total;
});

const expensedTotal = computed(() => {
    return transactions.value
        .filter(t => 
            t.categoryId == props.budgetCategory.id && 
            t.income === false && 
            t.date < carouselStore.selectedMonth.add({months:1}).toString() &&
            t.date >= carouselStore.selectedMonth.toString()
        )
        .reduce((t, {amount}) => t + amount, 0);
})

const remainingTotal = computed(() => {
    return budgetTotal.value - expensedTotal.value;
});
</script>

<template>
    <div class="mt-6 overflow-hidden bg-white rounded-md shadow-lg">
        <div class="flex justify-between px-4 py-4 bg-blue-300">
            <div class="flex items-center">
                <div class="flex justify-center content-center items-center text-center align-middle h-4 mr-2 ">
                    <Toggle aria-label="Toggle" @click="toggleBudgetdata">
                        <ChevronsDown v-if="isOpen" class="h-5 w-5" />
                        <ChevronsUp v-else class="h-5 w-5" />
                    </Toggle>
                </div>
                <div class="">
                    <div class="font-semibold text-2xl">
                        {{ props.budgetCategory.name }}
                    </div>
                    <div class="text-sm">
                        {{ props.budgetCategory.description }}
                    </div>
                </div>
            </div>
            <div class="font-semibold text-sm w-sm">
                <div>Budgeted {{ currencyFormatter.format(budgetTotal) }}</div>
                <div>Expensed {{ currencyFormatter.format(expensedTotal) }}</div>
                <div>Remaining {{ currencyFormatter.format(remainingTotal) }}</div>
            </div>
        </div>

        <div class="pb-2">
            <div>
                <Collapsible v-model:open="isOpen">
                    <CollapsibleContent>
                        
                        <BudgetTable :category="budgetCategory"/>
                        <CreateBudgetForm :category="budgetCategory"/>
                
                    </CollapsibleContent>
                </Collapsible>
            </div>
        </div>

        <div class="px-3 pt-0 pb-2 mb-2">
            <CategoryActionsMenu :category="budgetCategory" />
        </div>
    </div> 
</template>