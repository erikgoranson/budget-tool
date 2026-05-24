import { ref, computed} from 'vue';
import { defineStore } from 'pinia';
import type { Category, Budget } from '../types/';
import localStorageHelper from '@/helpers/localStorage';
import uncategorized from '@/helpers/uncategorizedHelper';

export const useCategoryStore = defineStore('category', () => {

    const storageKey = 'category';

    const getData = () => localStorageHelper.getData(storageKey) as Category[];
    const setData = () => {
        console.log('category store saved to localstorage');
        localStorageHelper.setData(storageKey, categories.value);
    };

    const categories = ref(getData());

    const addCategory = (category: Category) => {
        categories.value.unshift(category);
        setData();
    };

    const deleteCategory = (id: string) => {
        categories.value = categories.value.filter(x => x.id !== id);
        console.log('after delete:', JSON.stringify(categories.value));
        setData();
    };

    const updateCategory = (category: Category) => {
        const index = categories.value.findIndex(x => x.id == category.id);

        categories.value.splice(index, 1, category);
        setData();
    };

    const getCategoryName = (id: string) => {
        const category = categories.value.find(c => c.id == id);
        return category?.name ?? uncategorized.label;
    };

    const putCategory = (category: Category) => {
        const index = categories.value.findIndex(x => x.id == category.id);
        if (index !== -1) {
            updateCategory(category);
        } else {
            addCategory(category);
        }
    };

    return { categories, addCategory, deleteCategory, updateCategory, getCategoryName, putCategory };
});