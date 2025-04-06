<script setup lang="ts">
import {ref} from 'vue';
import type { Category, Transaction } from '../types/';
import AddCategoryDialog from '@/components/AddCategoryDialog.vue';
import AddTransactionDialog from '@/components/AddTransactionDialog.vue';
import Button from './ui/button/Button.vue';
import { Plus } from 'lucide-vue-next';
import CategoryForm from './category/CreateUpdateForm.vue';
import ResponsiveDialog from './ResponsiveDialog.vue';
const testCategory = {} as Category;
const openOrNot = ref(false);
</script>

<template>
    <footer class="flex items-center justify-center px-4 py-4 bg-indigo-200 border-t border-gray-200">
        <div class="flex justify-start">
        </div>
        <div class="flex-1 items-center justify-center">
            <div class="flex ml-auto items-center justify-center flex space-x-2" >
                <AddTransactionDialog />
                <AddCategoryDialog />

                <ResponsiveDialog name="create" :is-content-visible="openOrNot" @update:is-content-visible="openOrNot = !openOrNot">
                    <template v-slot:defineContent="{ events: { toggleDialog } }" >
                        <CategoryForm :category="testCategory" :close-dialog-function="toggleDialog"></CategoryForm>
                    </template>
                    <template v-slot:triggerButton>
                        <Button class="bg-rose-200 flex justify-center items-center w-50" variant="secondary">
                            <Plus class="h-4 w-4 mr-1 px-0"/> Budget Category
                        </Button>
                    </template>
                </ResponsiveDialog>
            </div>
        </div>
    </footer>
</template>