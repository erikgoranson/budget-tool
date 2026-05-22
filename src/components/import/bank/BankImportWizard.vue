<script setup lang="ts">
import { Card, CardContent, CardFooter, CardHeader, CardTitle, } from '@/components/ui/card';
import CsvParser from './steps/CsvParser.vue';
</script>

<template>
  <div>
    <Card class="border-gray-400 ">
      <CardHeader>
        <CardTitle>
          Bank File Import
        </CardTitle>
      </CardHeader>

      <CardContent>

        <CsvParser />

      </CardContent>

      <CardFooter>
      </CardFooter>
    </Card>
  </div>
</template>