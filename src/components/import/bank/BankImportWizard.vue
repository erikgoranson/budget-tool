<script setup lang="ts">
import type { TransactionImport, TransactionRow } from '@/types';
import { ref } from 'vue';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, } from '@/components/ui/card';

import CsvUploadForm from './steps/CsvUploadForm.vue';
import ColumnMappingMenu from './steps/ColumnMappingMenu.vue';
import TransactionReviewTable from './steps/TransactionReviewTable.vue';
import ImportReviewPanel from './steps/ImportReviewPanel.vue';

const importData = ref<TransactionImport>({} as TransactionImport);
const importComplete = ref<boolean>(false);

const currentStep = ref<number>(0); 
const stepComplete = ref<boolean>(false);
const steps = [
  CsvUploadForm,
  ColumnMappingMenu,
  TransactionReviewTable,
  ImportReviewPanel,
];

const setStep = (step: number) => {
  currentStep.value = step;
  stepComplete.value = false;
};

const startOver = () => {
  setStep(0);
  importComplete.value = false;
  importData.value = {} as TransactionImport;
};
</script>

<template>
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
            v-on:complete="importComplete = true"
            v-on:cancel="startOver"
          />
      </CardContent>

      <CardFooter class="mt-5 border-t pt-5 justify-between">
        <Button v-if="!importComplete" :disabled="currentStep == 0" @click="setStep(currentStep -1)">
          Prev
        </Button>
        <Button v-if="!importComplete" :disabled="!stepComplete || currentStep+1 >= steps.length" @click="setStep(currentStep +1)">
          Next
        </Button>

        <Button  v-if="importComplete" @click="startOver">
          Start Over
        </Button>
      </CardFooter>
    </Card>
  </div>
</template>