<script setup lang="ts">
import CreateTransactionDialog from './transaction/CreateTransactionDialog.vue';
import SidebarToggle from './SidebarToggle.vue';
</script>

<template>
    <footer class="flex items-center justify-center px-4 py-4 bg-indigo-200 border-t border-gray-200 pt-[env(keyboard-inset-height)]">
        <div class="flex-1 items-center justify-center mx-6">
            <div class="flex ml-auto items-center justify-center flex space-x-6 mt-4">
                <CreateTransactionDialog />
                <SidebarToggle />
            </div>
        </div>
    </footer>
</template>