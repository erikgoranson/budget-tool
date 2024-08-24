<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { ref } from 'vue'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

const isOpen = ref(false)
</script>

<template>
    <header>
        <div class="wrapper">

            <nav class="mb-20">
                <RouterLink to="/">Home</RouterLink> | 
                <RouterLink to="/about">About</RouterLink> | 
                <RouterLink to="/test1">Test1</RouterLink> | 
                <RouterLink to="/test2">Test2</RouterLink>
            </nav>

        </div>
    </header>
    <slot />
</template>

<style scoped>
</style>