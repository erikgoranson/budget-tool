<script setup lang="ts">
import type { TransactionImport } from '@/types/TransactionImport';
import type { TransactionRow } from '@/types';
import { ref } from 'vue';

import dateFormatter from '@/helpers/dateFormatter';
import { getOrAssignGuid } from '@/helpers/baseFormHelper';

import { Button } from '@/components/ui/button';
import { Item, ItemContent, ItemTitle, ItemActions, ItemDescription } from '@/components/ui/item';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const importData = defineModel<TransactionImport>({ required: true });
const stepComplete = defineModel<boolean>('stepComplete', { required: true });

const columnsToMap = ['amount', 'date', 'description'];
const columnMap = ref<Record<string, any>>({});

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

const confirm = () => {
    importData.value.mappedTransactions = getMappedTransactions() as TransactionRow[];
    stepComplete.value = true;
    //TODO: detects if all the dropdowns have been completed. then set stepComplete to true
};
</script>

<template>
    <div>
        Please select the closest match for the following columns:
    </div>

    <div class="mt-15" v-for="col in columnsToMap">
        <div>
            <Item variant="outline">
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
            {{ importData?.fileData?.data?.slice(0, 3) }}
        <div v-if="(importData?.fileData?.data?.length ?? 0) >= 3" class="p-2 text-center text-xs text-gray-400 bg-gray-50">
            Showing 3 of {{ importData?.fileData?.data?.length }} rows
        </div>
    </div>

    <Button @click="confirm">confirm mapping</Button>
</template>