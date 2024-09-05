<script setup lang="ts">
import { ref, computed } from 'vue';
import * as localStorageHelper from '@/helpers/localStorage';
import { saveAs } from 'file-saver';
import { Button } from '@/components/ui/button';

const content = computed(() => {
    const transactions = localStorageHelper.default.getData('transactions');
    const category = localStorageHelper.default.getData('category');

    const obj = { category, transactions };
    return JSON.stringify(obj);
})

const fileName = computed(() => {
    const date = new Intl.DateTimeFormat(
        "en-US", 
        {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            hour12: false,
    }
    ).format(new Date())
    const dateString = date.replace(/[^0-9.]/g, '');
    const filename = `budget-tool-${dateString}.json`;
    return filename;
})

const saveData = () => {
    var blob = new Blob([content.value], {type: "text/plain;charset=utf-8"});
    saveAs(blob, fileName.value);
}

</script>

<template>
    <button @click="saveData">Export Data</button>
</template>