<script setup lang="ts">
import { MenuIcon } from 'lucide-vue-next';
import { useSidebarStore } from '@/stores/sidebar';
const sidebarStore = useSidebarStore();
</script>

<template>
    <button class="text-gray-500 focus:outline-none lg:hidden" @click="sidebarStore.isOpen = true">
        <MenuIcon class="font-medium text-black-800 h-8 w-8"/>
    </button>
</template>