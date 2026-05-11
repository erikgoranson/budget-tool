<script setup lang="ts">
import { useRoute , useRouter } from 'vue-router';
import { ChevronLeft } from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
</script>

<template>
    <header class="flex items-center justify-center w-full bg-indigo-200 border-indigo-600 pt-[env(safe-area-inset-top)] relative lg:hidden" >
        <div v-if="route.name !== 'home'" class="absolute left-4 p-2">
            <ChevronLeft class="h-8 w-8" @click="router.back()"/>
        </div>

        <h1 class="text-lg lg:text-4xl font-semibold py-2 text-gray-900 uppercase">
            {{ route.meta.displayName }}
        </h1>
    </header>
</template>