<script setup lang="ts">
import type { BudgetImport } from '@/types';
import { ref, computed } from 'vue';
import { useFileDialog } from '@vueuse/core';

import { HardDriveUpload } from 'lucide-vue-next';

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
  ItemActions,
} from '@/components/ui/item';
import { Button } from '@/components/ui/button';

const parsedData = ref<BudgetImport | null>(null);
const fileName = ref<string | null>(null);
const fileLoaded = ref(false); 

const isFileValid = computed(() => {
  var anyRecords = parsedData.value?.category?.length || parsedData.value?.budgets?.length || parsedData.value?.subcategories?.length || parsedData.value?.transactions?.length || parsedData.value?.goals?.length || 0;
  return anyRecords > 0;
});

const restart = () => {
  reset();
  fileLoaded.value = false;
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
      parsedData.value = JSON.parse(rawText) as BudgetImport;
    } catch (error) {
      console.log('Invalid file format');
      parsedData.value = null;
      fileName.value = null;
      files.value = null;
    }
  }

  reader.onerror = () => {
    console.log('Error reading file.');
  }
  
  reader.readAsText(file)
});

</script>

<template>

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

    <div v-else-if="isFileValid && !fileLoaded">
      file summary (good)
      <Button @click="reset">
            Merge Data
          </Button>
          <Button @click="reset">
            Overwrite Existing
          </Button>
          <Button @click="reset" variant="destructive">
            Cancel</Button> 
    </div>

    <div v-else-if="!isFileValid && !fileLoaded">
      file summary (bad)
      <Button @click="reset">Start Over</Button>
    </div>

    <div v-if="fileLoaded && files != null">
      <p>import summary</p>
      <Button @click="restart" variant="destructive">Start Over</Button>
    </div>
</template>