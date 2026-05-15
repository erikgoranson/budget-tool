<script setup lang="ts">
import DataTable from '@/components/transaction/TransactionTable.vue';
import CreateTransactionDialog from '@/components/transaction/CreateTransactionDialog.vue';
</script>

<template>
    <DataTable />
    <div class="hidden md:flex items-center justify-center mt-10 ">
        <CreateTransactionDialog/>
    </div>
</template>