<script setup lang="ts">
import { AlignJustify } from 'lucide-vue-next';
import { useSidebarStore } from '@/stores/sidebar.ts';
const sidebarStore = useSidebarStore();
</script>

<template>
    <header class="flex items-center justify-center px-4 py-4 bg-white border-b-4 border-indigo-600">
        <div class="flex justify-start">
            <button class="text-gray-500 focus:outline-none lg:hidden" @click="sidebarStore.isOpen = true">
                <AlignJustify class="h-6 w-6" />
            </button>
        </div>
        <div class="flex-1 items-center justify-center">
            <div class="flex ml-auto items-center justify-center">
                MONTH NAME
            </div>
        </div>
    </header>
</template>
