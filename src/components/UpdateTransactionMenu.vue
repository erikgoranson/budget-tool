<script setup lang="ts">
import { MoreHorizontal } from 'lucide-vue-next';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { Button } from '../components/ui/button';

defineProps<{
  payment: {
    id: string
  }
}>()

</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="h-8 w-8 p-0">
        <span class="sr-only">Open menu</span>
        <MoreHorizontal class="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <DropdownMenuItem>edit
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem>delete</DropdownMenuItem>
      <DropdownMenuItem>something else</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
