<script setup lang="ts">
import { ref, onBeforeUnmount, onMounted } from "vue";
import type { Budget, Category } from '../types';
import { MoreHorizontal } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import ResponsiveDialog from "@/components/ResponsiveDialog.vue";

const props = defineProps({
  options: {
    type: Array as () => {}[], //make typesafe
    required: false,
    default: {}
  }
});

const optionsRefs = ref<any>([]); //make typesafe

onMounted(() => {
  const optionBools = props.options.map(() => false);
  optionsRefs.value = optionBools;
});
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="h-8 w-8 p-0">
        <span class="sr-only">Open dropdown menu</span>
        <MoreHorizontal class="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-56">
      <DropdownMenuLabel>My Account</DropdownMenuLabel>
      <DropdownMenuSeparator />

      <DropdownMenuItem v-for="(option, index) in props.options" @click="optionsRefs[index] = !optionsRefs[index]">
        {{ option.name }}
      </DropdownMenuItem>

    </DropdownMenuContent>
  </DropdownMenu>

  <div v-for="(option, index) in props.options">
    <ResponsiveDialog :name="option.name" :is-content-visible="optionsRefs[index]" @update:is-content-visible="optionsRefs[index] = !optionsRefs[index]" :is-alert="option.isAlert">
        <template v-slot:defineContent="{ events: { toggleDialog } }" >
          <slot :name="option.name" :events="{ toggleDialog }">
            hi, im troy mcclure 
            <button @click="toggleDialog">test me plz</button>
          </slot>
        </template>
      </ResponsiveDialog>
  </div>
</template>