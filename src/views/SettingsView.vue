<script setup lang="ts">
import SaveDataButton from '@/components/SaveDataButton.vue';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
  ItemActions,
} from '@/components/ui/item';
import { ChevronRightIcon } from 'lucide-vue-next';
</script>

<template>
    <div class="flex flex-col gap-6">
        <Item variant="outline" class="item">
            <ItemContent>
                <ItemTitle>Export All Data</ItemTitle>
                <ItemDescription>
                    Download all user data to a .json file.
                </ItemDescription>
            </ItemContent>
            <ItemActions>
                <SaveDataButton/>
            </ItemActions>
        </Item>

        <Item variant="outline" class="item">
            <ItemContent>
                <ItemTitle>Import Budget Data</ItemTitle>
                <ItemDescription>
                    Import data using a previously downloaded .json file
                </ItemDescription>
            </ItemContent>
            <ItemActions>
                <router-link to="/import">
                    <ChevronRightIcon class="size-6" />
                </router-link>
            </ItemActions>
        </Item>
    </div>
</template>

<style scoped>
.item {
  @apply !border-gray-400;
}
</style>