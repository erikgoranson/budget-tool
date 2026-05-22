<script setup lang="ts">
import type { ParseResult } from 'papaparse';
import { ref } from 'vue';
import Papa from 'papaparse';
import { useFileDialog } from '@vueuse/core';
import { Button } from '@/components/ui/button';
import { Item, ItemContent, ItemTitle, ItemActions, ItemDescription } from '@/components/ui/item';
import { Label } from '@/components/ui/label';

const selectedFile = ref<File>();

const importData = ref<ParseResult<any>>();
const importError = ref<string>('');

const { files, open, onChange } = useFileDialog({
  accept: '.csv',
  multiple: false
});

onChange((selectedFiles) => {
    const file = selectedFiles?.[0]
    if (!file) return;
    selectedFile.value = file;

    //TODO: add trycatch tho
    Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
            console.log('Parsed CSV Data:', results.data)
            importData.value = results;
        },
        error: (error) => {
            console.error('Error parsing file:', error);
        }
    });
})
</script>

<template>
    <Item variant="outline">
        <ItemContent>
            <ItemTitle class="font-semibold">Upload CSV File</ItemTitle>
            <ItemDescription>
                This is a simple text-only file to which most banks will allow you to export transaction activity.  
            </ItemDescription>
        </ItemContent>
        <ItemActions>
            <Button variant="ghost" class="border border-gray-500 bg-gray-200" @click="open">Browse</Button>
            <Label class="text-sm text-gray-500" v-if="selectedFile == null">No file selected.</Label>
            <Label class="text-sm text-gray-500" v-if="selectedFile != null">{{ selectedFile.name }}</Label>
        </ItemActions>
    </Item>

    <p v-if="importError" class="text-sm text-red-600 font-medium">{{ importError }}</p>

    <p v-if="importData !== undefined" class="text-sm text-green-600 font-medium">
        File parsed successfully!
        {{ importData }}
        </p>
</template>