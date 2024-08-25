import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { Category } from '../types/';

export const useCategoryStore = defineStore('category', () => {
    const categories = ref(<Category[]>[]);

    const addCategory = (category: Category) => {
        categories.value.unshift(category);
    };

    const deleteCategory = (id: number) => {
        categories.value = categories.value.filter(x => x.id !== id);
    };
    
    return { categories, addCategory, deleteCategory};
});