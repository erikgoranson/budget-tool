<script setup lang="ts">
import type { Category } from '@/types';
import { useCategoryStore } from '@/stores/category';
import Button from '../ui/button/Button.vue';

const props = defineProps({
    category : {
        type: Object as () => Category,
        required: true
    },
    onSubmitFunction: { 
        type: Function as (...args: any) => any,
        required: true,
    }
});

const categoryStore = useCategoryStore();

const deleteCategory = () => {
    categoryStore.deleteCategory(props.category.id);
    props.onSubmitFunction();
};
</script>

<template>
    <div>
        This action will permanently delete the selected category and all its related data. This cannot be undone. 
    </div>
    <div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-x-2">
        <Button class="bg-red-500" @click="deleteCategory">
            Delete Category
        </Button>
        <Button variant="outline" @click="onSubmitFunction">
            Cancel
        </Button>
    </div>
</template>