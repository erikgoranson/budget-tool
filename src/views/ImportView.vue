<script setup lang="ts">
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
  ItemActions,
} from '@/components/ui/item';
import { Button } from '@/components/ui/button';
import { HardDriveUpload } from 'lucide-vue-next';

</script>

<template>

    <div>
        <Item variant="outline" size="sm" class="!border-gray-400">
            <ItemContent>
                <ItemTitle>Select a file to begin</ItemTitle>
            </ItemContent>
            <ItemActions>
                <Button>
                    <HardDriveUpload/> Select File
                </Button>
            </ItemActions>
        </Item>
    </div>

</template>