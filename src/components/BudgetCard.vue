<script setup lang="ts">
import { ref } from "vue";
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
import { Toggle } from '@/components/ui/toggle';
import { Rows4, ChevronUp, ChevronDown, ChevronsDown, ChevronsUp } from 'lucide-vue-next';

const isOpen = ref(false); 

const toggleBudgetdata = () => {
    isOpen.value = !isOpen.value;
};

const tableData = ref([
    {
        amount: '1200.00',
        date: 'date',
        hasCleared: true,
        id: 'id1',
        isInflow: true,
        month: '08',
        year: '2024',
        payee: 'bank',
        //subcategory_id
        category: 'Mortgage', //possibly subcategory now 
        note: 'mortgage pymt',
    },
    {
        amount: '250.00',
        date: 'date',
        hasCleared: true,
        id: 'id1',
        isInflow: true,
        month: '08',
        year: '2024',
        payee: 'bank',
        //subcategory_id
        category: 'Car Insurance',
        note: '????',
    },
]);

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
                    <div class="font-semibold text-2xl">Bills</div>
                    <div class="text-sm">reoccurring bills and stuff</div>
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
                        
                        <!--begin table -->
                        <div class="mb-6 overflow-hidden">
                            <Table>
                                <TableHeader class="bg-blue-300">
                                    <TableRow>
                                        <TableHead>Category</TableHead>
                                        <TableHead class="w-6">Due</TableHead>
                                        <TableHead>Budget</TableHead>
                                        <TableHead>Out</TableHead>
                                        <TableHead class="text-right">Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow v-for="row in tableData">
                                        <TableCell class="font-medium">{{ row.category }}</TableCell>
                                        <TableCell>??</TableCell>
                                        <TableCell>{{ row.amount }}</TableCell>
                                        <TableCell>{{ row.amount }}</TableCell>
                                        <TableCell class="text-right">{{ row.amount }}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                        <!-- end table  -->

                    </CollapsibleContent>
                </Collapsible>
            </div>
        </div>

        <!--bottom graph area-->
        <div class="px-6 pt-4 pb-2 mb-2">
            <div>buttons and pretty stuff goes here </div>
        </div>

    </div> 
</template>

<style scoped>
th {
  text-transform: capitalize;
  @apply px-2 py-1 text-xs font-semibold tracking-wider text-center text-gray-600 uppercase /*bg-indigo-100*/ border-r border-t border-b-2 border-indigo-200;
} 
tr {
    @apply hover:bg-gray-200;
}
td {
  text-transform: capitalize;
  @apply px-2 py-1 text-sm text-right border-b border-r border-gray-200;
}
table {
  @apply w-full text-left border-collapse;
}
thead {
  @apply border-b;
}
</style>