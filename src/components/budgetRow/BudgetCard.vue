<script setup lang="ts">
import type { Category } from "@/types";
import { ref  } from "vue";
import { ChevronDown, ChevronRight } from 'lucide-vue-next';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

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
const cardColor = ref('blue');

const cardStyles = {
  green: { bg: 'bg-green-300', border: 'border-green-300' },
  red:   { bg: 'bg-red-300',   border: 'border-red-300' },
  blue:  { bg: 'bg-blue-300',  border: 'border-blue-300' },
}; 
</script>

<template>
    <Collapsible v-model:open="isOpen" >
        <Card class="w-full my-6 overflow-hidden shadow-md " :class="isOpen ? '' : cardStyles[cardColor].border">
            <CollapsibleTrigger as-child>
            <CardHeader class="h-25 p-3 flex flex-row items-center justify-between gap-2" :class="cardStyles[cardColor].bg">
                <div class="flex items-center  gap-3 flex-1 min-w-0">

                    
                        <div class="flex-shrink-0">
                            <ChevronRight v-if="!isOpen" />
                            <ChevronDown v-else />
                        </div>
                    

                    <div class="min-w-0">
                        <CardTitle>
                        {{ props.budgetCategory.name }}
                        </CardTitle>
                        
                        <CardDescription class="line-clamp-2 mt-1 text-sm">
                            {{ props.budgetCategory.description }}
                        </CardDescription>
                    </div>
                </div>

                <div class="flex flex-col gap-2 text-right shrink-0">
                    <BudgetTotalsReport :category="budgetCategory"/>
                </div>
            </CardHeader>
            </CollapsibleTrigger>

            <CollapsibleContent>
                <CardContent class="p-0">
                    <BudgetTable :category="budgetCategory"/>
                    <CreateBudgetForm :category="budgetCategory"/>
                </CardContent>
                
                <CardFooter class="py-2">
                    <CategoryActionsMenu :category="budgetCategory" />
                </CardFooter>
            </CollapsibleContent>
        </Card>
    </Collapsible>
</template>