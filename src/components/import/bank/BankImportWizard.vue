<script setup lang="ts">
import type { TransactionImport } from '@/types/TransactionImport';
import { ref } from 'vue';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, } from '@/components/ui/card';

import CsvUploadForm from './steps/CsvUploadForm.vue';
import ColumnMappingMenu from './steps/ColumnMappingMenu.vue';

const importData = ref<TransactionImport>({} as TransactionImport);

const currentStep = ref<number>(0); 
const stepComplete = ref<boolean>(false);
const steps = [
  CsvUploadForm,
  ColumnMappingMenu,
];

const setStep = (step: number) => {
  currentStep.value = step;
  stepComplete.value = false;
};
</script>

<template>

  <div class="my-10 h-20 overflow-y-scroll">
    <pre>{{ JSON.stringify(importData, null, 2) }}</pre>
  </div>

  <div>
    <Card class="border-gray-400 ">
      <CardHeader>
        <CardTitle>
          Bank File Import: Step {{currentStep + 1}} of {{steps.length}}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <component 
            :is="steps[currentStep]" 
            v-model="importData" 
            v-model:stepComplete="stepComplete"
          />
      </CardContent>

      <CardFooter class="mt-5 border-t pt-5 justify-between">
        <Button 
          :disabled="currentStep == 0" 
          @click="setStep(currentStep -1)"
        >
            Prev
        </Button>
        <Button 
          :disabled="!stepComplete || currentStep+1 >= steps.length" 
          @click="setStep(currentStep +1)"
        >
          Next
        </Button>
      </CardFooter>
    </Card>
  </div>
</template>