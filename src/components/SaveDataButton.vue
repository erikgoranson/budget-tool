<script setup lang="ts">
import { computed } from 'vue';
import * as localStorageHelper from '@/helpers/localStorage';
import { saveAs } from 'file-saver';
import { Download } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';

const content = computed(() => {
    const budgets = localStorageHelper.default.getData('budget');
    const category = localStorageHelper.default.getData('category');
    const subcategories = localStorageHelper.default.getData('subcategory');
    const transactions = localStorageHelper.default.getData('transactions');
    const goals = localStorageHelper.default.getData('goal');

    const obj = { budgets, category, subcategories, transactions, goals };
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
    <Button @click="saveData"><Download class="icon" />Download</Button>
</template>