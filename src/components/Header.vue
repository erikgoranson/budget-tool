<script setup lang="ts">
import BudgetDashboard from "./budgetRow/BudgetDashboard.vue";
</script>

<template>
    <header class="flex items-center justify-center px-4 py-4 bg-white border-b-4 border-indigo-600 header pt-[env(safe-area-inset-top)]" >
        <BudgetDashboard />
    </header>
</template>