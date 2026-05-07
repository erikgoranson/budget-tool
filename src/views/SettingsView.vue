<script setup lang="ts">
import { Separator } from '@/components/ui/separator';
import SaveDataButton from '@/components/SaveDataButton.vue';
</script>

<template>
<div>
    <div class="flex items-center justify-between">
        <div>Export All Data</div>
        <SaveDataButton/>
    </div>

    <Separator class="my-4 bg-gray-400" />
  </div>
</template>

<style scoped>
</style>