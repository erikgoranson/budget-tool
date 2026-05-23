<script setup lang="ts">
import { h } from 'vue';
import { RouterLink } from 'vue-router';
import Button from '@/components/ui/button/Button.vue';
import { Item, ItemContent, ItemDescription, ItemTitle, ItemActions } from '@/components/ui/item';
import { ChevronRightIcon, Shredder, ShredderIcon, FileUp } from 'lucide-vue-next';

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

const bankImportButton = () => {
    return h(
      RouterLink,
      { to: '/bankImport' },
      {
        default: () => [
            h(Button, null, {
                default: () => [
                    h(FileUp),
                    'Import CSV'
                ]
            })
        ]
      }
    );
}

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
    },
    {
        title: 'Import Bank Statement',
        description: 'Import a CSV file from your bank to auto-fill all the contained transactions directly into your budget. (IDGAF about your financial details -- this is all stored locally, never transmitted anywhere else)',
        action: bankImportButton,
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