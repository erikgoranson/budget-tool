<script setup lang="ts">
import { useRoute } from 'vue-router';
const route = useRoute();
</script>

<template>
    <header class="flex items-center justify-center px-4 py-4 bg-white border-b-4 border-indigo-600 header pt-[env(safe-area-inset-top)]" >
        <h1 class="text-4xl font-medium uppercase text-gray-900 mt-2">
            {{ route.meta.displayName }}
        </h1>
    </header>
</template>