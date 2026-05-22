<script setup lang="ts">
import type { TransactionImport } from '@/types/TransactionImport';
import { ref } from 'vue';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, } from '@/components/ui/card';
import CsvParser from './steps/CsvParser.vue';

const importData = ref<TransactionImport>({} as TransactionImport);

const currentStep = ref<number>(0); 
const stepComplete = ref<boolean>(false);
const steps = [];

const setStep = (step: number) => {
  currentStep.value = step;
  stepComplete.value = false;
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

        <CsvParser v-model="importData" v-model:stepComplete="stepComplete"/>

        <!-- {{ importData.fileData }} -->

      </CardContent>

      <CardFooter class="mt-5 border-t pt-5 justify-between">
        <Button @click="setStep(currentStep -1)">Prev</Button>
        <Button @click="setStep(currentStep +1)">Next</Button>
      </CardFooter>
    </Card>
  </div>
</template>