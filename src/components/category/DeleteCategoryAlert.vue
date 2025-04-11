<script setup lang="ts">
import type { Category } from '@/types';
import { useCategoryStore } from '@/stores/category';
import DeleteAlert from '../DeleteAlert.vue';

const props = defineProps({
    category : {
        type: Object as () => Category,
        required: true
    },
});

const categoryStore = useCategoryStore();

const deleteCategory = () => {
    categoryStore.deleteCategory(props.category.id);
};
</script>

<template>
    <DeleteAlert :onSubmitFunction="deleteCategory" record-type="category" />
</template>