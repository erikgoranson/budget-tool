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
            <Button class="[&_svg]:size-6 rounded-full h-12 w-12" >
                <Plus />
            </Button>
        </template>
    </ResponsiveDialog>
</template>