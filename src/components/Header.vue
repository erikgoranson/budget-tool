<script setup lang="ts">
import { useRoute , useRouter } from 'vue-router';
import { ChevronLeft } from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
</script>

<template>
    <header class="flex items-center justify-center w-full h-16 px-4 bg-white border-b-4 border-indigo-600 relative pt-[env(safe-area-inset-top)]">
        <div v-if="route.name !== 'home'" class="absolute left-4 p-2 rounded-full hover:bg-gray-100">
            <ChevronLeft class="h-8 w-8 lg:hidden" @click="router.back()"/>
        </div>

        <h1 class="text-lg lg:text-4xl font-semibold text-gray-900 uppercase">
            {{ route.meta.displayName }}
        </h1>
    </header>
</template>
