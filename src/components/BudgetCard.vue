<script setup lang="ts">
import type { Budget, Category } from '../types/';

import { ref, toRef, computed } from "vue";
import { storeToRefs } from 'pinia';
import { useTransactionStore } from '@/stores/transaction';
import currencyFormatter from '@/helpers/numberFormat';
import { Rows4, ChevronUp, ChevronDown, ChevronsDown, ChevronsUp } from 'lucide-vue-next';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Toggle } from '@/components/ui/toggle';

import UpdateCategoryMenu from '@/components/UpdateCategoryMenu.vue'
import BudgetTable from '@/components/BudgetTable.vue';

const props = defineProps({
    budgetCategory : {
        type: Object as () => Category,
        required: true
    }
});

const isOpen = ref(false); 
const transactionStore = useTransactionStore();
const { transactions } = storeToRefs(transactionStore);

const toggleBudgetdata = () => {
    isOpen.value = !isOpen.value;
};

const budgetTotal = computed(() => {
    if(props.budgetCategory.budgets.length == 0){
        return 0.00;
    } else {
        const amounts = props.budgetCategory.budgets.map((x) => x.amount);
        return amounts.reduce((a, b) => a + b);
    }
});

const expensedTotal = computed(() => {
    const transactionsStuff = transactions.value.filter(x => x.categoryId == props.budgetCategory.id && x.income == false)
    console.log('wat', JSON.stringify(transactionsStuff, null, 2))

    if(transactionsStuff.length == 0){
        return 0.00;
    } else {
        const transAmts = transactionsStuff.map(x => x.amount);
        return transAmts.reduce((a, b) => a + b);
    }
})

const remainingTotal = computed(() => {
    return budgetTotal.value - expensedTotal.value
});
</script>

<template>
    <div class="mt-6 overflow-hidden bg-white rounded-md shadow-lg">

        <!--top part of the card-->
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

        <!--middle (collapsed area of card)-->
        <div class="pb-4">
            <div>
                <Collapsible v-model:open="isOpen">
                    <CollapsibleContent>
                        
                        <BudgetTable :category="budgetCategory"/>
                
                    </CollapsibleContent>
                </Collapsible>
            </div>
        </div>

        <!--bottom graph area-->
        <div class="px-6 pt-4 pb-2 mb-2">
            <div>
                buttons and pretty stuff goes here 
            </div>
            <UpdateCategoryMenu :category="budgetCategory"/>
        </div>

    </div> 
</template>