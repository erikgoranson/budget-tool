<script setup lang="ts">
import type { TransactionImport } from '@/types/TransactionImport';
import type { TransactionRow } from '@/types';
import { ref, computed, watch } from 'vue';

import dateFormatter from '@/helpers/dateFormatter';
import { getOrAssignGuid } from '@/helpers/baseFormHelper';

import { Button } from '@/components/ui/button';
import { Item, ItemContent, ItemTitle, ItemActions, ItemDescription } from '@/components/ui/item';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import BasicTable from '@/components/app/BasicTable.vue';

const importData = defineModel<TransactionImport>({ required: true });
const stepComplete = defineModel<boolean>('stepComplete', { required: true });

const columnMap = ref({
    amount: '',
    date: '',
    description: '',
});

const columnsToMap = Object.keys(columnMap.value);
const selectionsComplete = computed(() => Object.values(columnMap.value).every(value => value !== ''));

const getMappedTransactions = () => {
    return importData.value.fileData.data.map(row => {
        const transaction: Partial<TransactionRow> = {
            id: getOrAssignGuid(''),
            date: dateFormatter.getDateValue(row[columnMap.value['date']]).toString(),
            amount: Number(row[columnMap.value['amount']]?.replace('-','')),
            note: row[columnMap.value['description']],
            income: row[columnMap.value['amount']]?.includes('-') ? false : true,

            //TODO: set category as 'income' if it was income
            budgetCategoryName: 'Uncategorized', 

            //TODO: set these as applicable
            categoryId: 'string',
            subcategoryId: 'string',

            //TODO: check if these generate automatically in via existing schema
        };
        return transaction;
    })
};

watch(() => selectionsComplete.value, (newVal) => {
    if (selectionsComplete.value == true){
        importData.value.mappedTransactions = getMappedTransactions() as TransactionRow[];
        stepComplete.value = true;
    }
});
</script>

<template>
    <div>
        Please select the closest match for the following columns:
    </div>

    <div class="mt-10" >
        <div v-for="col in columnsToMap">
            <Item variant="outline" class="mt-5" >
                <ItemContent>
                    <ItemTitle class="font-semibold capitalize">{{ col }}</ItemTitle>
                </ItemContent>
                <ItemActions>

                    <DropdownMenu>
                        <DropdownMenuTrigger as-child>
                            <Button variant="outline" class="w-full justify-between">
                                {{ columnMap[col] || 'Select a field...' }}
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent class="w-56">
                            <DropdownMenuItem
                                v-for="field in importData.fileData.meta.fields"
                                :key="field"
                                @click="columnMap[col] = field"
                                :class="{ 'bg-accent text-accent-foreground': columnMap[col] === field }"
                            >
                                {{ field }}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                </ItemActions>
            </Item>
        </div>
    </div>

    <div class='mt-10'>
        <BasicTable :data="importData.fileData.data.slice(0, 3) || []" />
        <div v-if="(importData?.fileData?.data?.length ?? 0) >= 3" class="p-2 text-center text-xs text-gray-400 bg-gray-50">
            Showing 3 of {{ importData?.fileData?.data?.length }} rows
        </div>
    </div>
</template>