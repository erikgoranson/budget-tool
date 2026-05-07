<script setup lang="ts">
import CreateTransactionDialog from './transaction/CreateTransactionDialog.vue';
</script>

<template>
    <footer class="flex items-center justify-center px-4 py-4 bg-indigo-200 border-t border-gray-200">
        <div class="flex justify-start">
        </div>
        <div class="flex-1 items-center justify-center">
            <div class="flex ml-auto items-center justify-center flex space-x-2" >
                <CreateTransactionDialog />
            </div>
        </div>
    </footer>
</template>