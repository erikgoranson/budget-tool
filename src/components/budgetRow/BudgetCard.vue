<script setup lang="ts">
import type { Category  } from "@/types";
import { ref  } from "vue";
import { ChevronsDown, ChevronsUp } from 'lucide-vue-next';

import {
  Collapsible,
  CollapsibleContent,
} from '@/components/ui/collapsible';
import { Toggle } from '@/components/ui/toggle';

import BudgetTable from "./BudgetTable.vue";
import CategoryActionsMenu from "../category/CategoryActionsMenu.vue";
import CreateBudgetForm from "./CreateBudgetForm.vue";
import BudgetTotalsReport from "./BudgetTotalsReport.vue";

const props = defineProps({
    budgetCategory : {
        type: Object as () => Category,
        required: true
    }
});

const isOpen = ref(false); 

const toggleBudgetdata = () => {
    isOpen.value = !isOpen.value;
};
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
                    <div>
                        {{ props.budgetCategory.description }}
                    </div>
                </div>
            </div>
            <BudgetTotalsReport :category="budgetCategory"/>
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