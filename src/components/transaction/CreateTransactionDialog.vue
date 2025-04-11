<script setup lang="ts">
import { Plus } from 'lucide-vue-next';
import Button from '../ui/button/Button.vue';
import ResponsiveDialog from '../ResponsiveDialog.vue';
import CreateTransactionForm from './TransactionForm.vue';

const title = 'Add New Transaction';
const description = '';
</script>

<template>
    <ResponsiveDialog :title="title" :description="description">
        <template v-slot="{ close: { toggleDialog } }">
            <CreateTransactionForm :onSubmitFunction="toggleDialog" />
        </template>
        <template #toggleButton>
            <Button class="bg-orange-200 flex justify-center items-center" variant="secondary">
                <Plus class="h-4 w-4 mr-1 px-0"/>
                Transaction
            </Button>
        </template>
    </ResponsiveDialog>
</template>