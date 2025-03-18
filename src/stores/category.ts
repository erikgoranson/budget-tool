import { ref, computed} from 'vue';
import { defineStore } from 'pinia';
import type { Category, Budget } from '../types/';
import * as localStorageHelper from '@/helpers/localStorage';

const currentMonthYear = computed(() => {
    const dateFormatter = new Intl.DateTimeFormat('en-US', {
        month: 'long',
        year: 'numeric'
    });
    console.log(dateFormatter.format(new Date()));
    return dateFormatter.format(new Date());
});

export const useCategoryStore = defineStore('category', () => {

    const storageKey = 'category';

    const getData = () => localStorageHelper.default.getData(storageKey) as Category[];
    const setData = () => {
        console.log('category store saved to localstorage');
        localStorageHelper.default.setData(storageKey, categories.value);
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
        return category?.name;
    };

    return { categories, addCategory, deleteCategory, updateCategory, getCategoryName };
});