<script setup lang="ts">
import { ref } from "vue";
import type { Budget, Category } from '../types/';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { Rows4, ChevronUp, ChevronDown, ChevronsDown, ChevronsUp } from 'lucide-vue-next';

import BudgetTable from '@/components/BudgetTable.vue';import UpdateCategoryDialog from '@/components/UpdateCategoryDialog.vue';

import DeleteCategoryDialog from '@/components/DeleteCategoryDialog.vue';

import { useCategoryStore } from '@/stores/category.ts';
const categoryStore = useCategoryStore();

const props = defineProps({
    budget : {
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
                        {{ props.budget.name }}
                    </div>
                    <div class="text-sm">
                        {{ props.budget.description }}
                    </div>
                </div>
            </div>
            <div class="font-semibold text-sm w-sm">
                <div>budget progress</div>
                <div>out progress</div>
                <div>rem progress</div>
            </div>
        </div>

        <!--middle (collapsed area of card)-->
        <div class="pb-4">
            <div>
                <Collapsible v-model:open="isOpen">
                    <CollapsibleContent>
                        
                        <BudgetTable :budgets="$props.budget.budgets"/>
                
                    </CollapsibleContent>
                </Collapsible>
            </div>
        </div>

        <!--bottom graph area-->
        <div class="px-6 pt-4 pb-2 mb-2">
            <div>
                buttons and pretty stuff goes here 
            </div>
            
            <UpdateCategoryDialog :budget="$props.budget"/>
            <DeleteCategoryDialog :id="$props.budget.id"/>
        </div>

    </div> 
</template>