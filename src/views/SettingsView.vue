<script setup lang="ts">
import { h } from 'vue';
import { RouterLink } from 'vue-router';
import Button from '@/components/ui/button/Button.vue';
import { Item, ItemContent, ItemDescription, ItemTitle, ItemActions } from '@/components/ui/item';
import { ChevronRightIcon, Shredder, ShredderIcon, Download } from 'lucide-vue-next';

import SaveDataButton from '@/components/SaveDataButton.vue';
import EraseLocalStorage from '@/components/EraseLocalStorage.vue'; //need to rename

const importButton = () => {
    return h(
      RouterLink,
      { to: '/import' },
      {
        default: () => h(ChevronRightIcon, { class: 'size-8' })
      }
    );
};

const deleteButton = () => {
    return h(EraseLocalStorage, null, {
      default: () => [
        h(Button, null, {
          default: () => [
            h(ShredderIcon),
            'Delete'
          ]
        })
      ]
    });
};

const settingsOptions = [
    {
        title: 'Export Budget Data',
        description: 'Download data to a .json file.',
        action: SaveDataButton,
    },
    {
        title: 'Import Budget Data',
        description: 'Import data using a previously downloaded .json file',
        action: importButton,
    },
    {
        title: 'Delete Budget Data',
        description: 'Delete all budget data that has been saved to local storage',
        action: deleteButton,
    }
];
</script>

<template>
    <div class="flex flex-col gap-6">
        <Item v-for="option in settingsOptions" variant="outline" class="!border-gray-400">
            <ItemContent>
                <ItemTitle>{{option.title}}</ItemTitle>
                <ItemDescription>
                    {{ option.description}}
                </ItemDescription>
            </ItemContent>
            <ItemActions>
                <component :is="option.action" />
            </ItemActions>
        </Item>
    </div>
</template>