<script setup lang="ts">
import { ref } from 'vue';
import { PiggyBank, Link } from 'lucide-vue-next';
import { useRoute } from 'vue-router';
import { useSidebarStore } from '@/stores/sidebar';

const sidebarStore = useSidebarStore();
const route = useRoute();

const navOptions = ref([
    {
        pathName: 'home',
        to: '/',
        displayName: 'Home'
    },
    {
        pathName: 'transactions',
        to: '/transactions',
        displayName: 'Transactions'
    },
]);

const activeClass = ref(
  'bg-gray-600 bg-opacity-25 text-gray-100 border-gray-100',
);

const inactiveClass = ref(
  'border-gray-900 text-black hover:bg-gray-600 hover:bg-opacity-25 hover:text-gray-100',
);

</script>

<template>
    <div class="flex">
        <div
            :class="sidebarStore.isOpen ? 'block' : 'hidden'"
            class="fixed inset-0 z-20 transition-opacity bg-black opacity-50 lg:hidden"
            @click="sidebarStore.isOpen = false"
        />
        
        <div
            :class="sidebarStore.isOpen ? 'translate-x-0 ease-out' : '-translate-x-full ease-in'"
            class="fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto transition duration-300 transform bg-blue-400 lg:translate-x-0 lg:static lg:inset-0"
        >
            <div class="flex items-center justify-center mt-8">
                <div class="flex items-center">
                    <PiggyBank class="h-16 w-16" />
                    <span class="mx-2 text-2xl font-semibold text-black">Budget Tool</span>
                </div>
            </div>
            
            <nav class="mt-10">
                <router-link v-for="option in navOptions" class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4" :class="[route.name === option.pathName ? activeClass : inactiveClass]" :to=option.to @click="sidebarStore.isOpen = false">
                    <Link class="h-4 w-4" />
                    <span class="mx-4">{{ option.displayName }}</span>
                </router-link>
            </nav>
        </div>
    </div>
</template>