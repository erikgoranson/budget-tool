<script setup lang="ts">
import type { BudgetData } from '@/types';
import { ref, computed } from 'vue';
import { useFileDialog } from '@vueuse/core';
import { useBudgetDataStore } from '@/stores/budgetData';

import { HardDriveUpload } from 'lucide-vue-next';

import { Item, ItemContent, ItemTitle, ItemActions, } from '@/components/ui/item';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

import BudgetSummary from '@/components/import/BudgetSummary.vue';
import BudgetTree from '@/components/import/BudgetTree.vue';

const dataStore = useBudgetDataStore();

const parsedData = ref<BudgetData | null>(null);
const fileName = ref<string | null>(null);
const fileImported = ref(false); 
const fileErrorMessage = ref<string | null>(null);

const isFileValid = computed(() => {
  var anyRecords = parsedData.value?.category?.length || parsedData.value?.budget?.length || parsedData.value?.subcategory?.length || parsedData.value?.transaction?.length || parsedData.value?.goal?.length || 0;
  return anyRecords > 0;
});

const restart = () => {
  reset();
  fileImported.value = false;
  fileErrorMessage.value = null;
};

const { files, open, onChange, reset } = useFileDialog({
  accept: 'text/plain, application/json', 
  multiple: false,
});

onChange((selectedFiles) => {
  if (!selectedFiles?.length) return;
  
  const file = selectedFiles[0];
  const reader = new FileReader();

  reader.onload = () => {
    try {
      fileName.value = file.name;
      const rawText = reader.result as string;
      parsedData.value = JSON.parse(rawText) as BudgetData;
    } catch (error) {
      fileErrorMessage.value = 'Invalid file format';
      parsedData.value = null;
      fileName.value = null;
      files.value = null;
    }
  }

  reader.onerror = () => {
    fileErrorMessage.value =  'Error reading file.';
  }
  
  reader.readAsText(file)
});

const currentData = computed(() => dataStore.getAllBudgetData());

const OverwriteData = () => {
  dataStore.truncateBudgetData();
  dataStore.putBudgetData(parsedData.value as BudgetData);
  fileImported.value = true;
};

const MergeData = () => {
  dataStore.putBudgetData(parsedData.value as BudgetData);
  fileImported.value = true;
};
</script>

<template>

<div class="grid w-full items-center gap-4"></div>

    <div v-if="files == null" class="flex flex-col gap-6">
        <Item variant="outline" size="sm" class="!border-gray-400">
            <ItemContent>
                <ItemTitle>Select a file to begin</ItemTitle>
            </ItemContent>
            <ItemActions>
                <Button @click="open">
                    <HardDriveUpload/> Select File
                </Button>
            </ItemActions>
        </Item>
    </div>

    <div v-else-if="isFileValid && !fileImported">
      <Card class="summaryCard">
        <CardHeader>
          <CardTitle>
            File Summary: <span class="font-semibold">{{ fileName }}</span>
          </CardTitle>
        </CardHeader>
        <CardContent class="grid gap-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Current Budget Details:</Label>
              <BudgetSummary :data="(currentData as BudgetData)" />
              
              <Label>Current Budget Breakdown:</Label>
              <BudgetTree :data="(currentData as BudgetData)" />
            </div>

            <div>
              <Label>Imported Budget Details:</Label>
              <BudgetSummary :data="(parsedData as BudgetData)" />
              
              <Label>Imported Budget Breakdown:</Label>
              <BudgetTree :data="(parsedData as BudgetData)" />
            </div>
          </div>
        </CardContent>
        <CardFooter class="mb-5 flex justify-between">
          <Button @click="MergeData">
            Merge
          </Button>
          <Button @click="OverwriteData">
            Overwrite
          </Button>
          <Button @click="reset" variant="destructive">
            Cancel</Button> 
        </CardFooter>
      </Card>
    </div>

    <div v-else-if="!isFileValid && !fileImported">
      <Card class="summaryCard">
        <CardHeader>
          <CardTitle>
            File Summary: <span class="font-semibold">{{ fileName }}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Label>File Details:</Label>
          <BudgetSummary>
            This file does not contain any data to import. 
            <div v-if="fileErrorMessage">
              Error: {{ fileErrorMessage }}
            </div>
          </BudgetSummary>
        </CardContent>
        <CardFooter class="mb-5 flex justify-between">
          <Button @click="reset">Start Over</Button>
        </CardFooter>
      </Card>
    </div>

    <div v-if="fileImported && files != null">
      <Card class="summaryCard">
        <CardHeader>
          <CardTitle>
            Import Summary
          </CardTitle>
        </CardHeader>
        <CardContent class="grid gap-4">
          <p>Successfully processed file '<span class="font-semibold">{{ fileName }}</span>'.</p>
          <Label>New budget details:</Label>
          <BudgetSummary :data="(currentData as BudgetData)" />

          <Label>New budget Breakdown:</Label>
          <BudgetTree :data="(currentData as BudgetData)" />
        </CardContent>
        <CardFooter class="mb-5 flex justify-between">
          <Button @click="restart" variant="destructive">Start Over</Button>
        </CardFooter>
      </Card>
    </div>
</template>

<style scoped>
summaryCard {
  @apply border-gray-400 bg-transparent;
}
</style>