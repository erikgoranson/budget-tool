import { ref, computed} from 'vue';
import { defineStore } from 'pinia';
import type { Subcategory } from '../types/';
import localStorageHelper from '@/helpers/localStorage';

const storageKey : string = 'subcategory';
export const useSubcategoryStore = defineStore(storageKey, () => {
    
    const getData = () => localStorageHelper.getData(storageKey) as Subcategory[];
    const setData = () => {
        console.log('subcategory store saved to localstorage');
        localStorageHelper.setData(storageKey, subcategories.value);
    };

    const subcategories = ref(getData());

    const createSubcategory = (subcategory: Subcategory) => {
        subcategories.value.unshift(subcategory);
        setData();
    };

    const deleteSubcategory = (id: string) => {
        subcategories.value = subcategories.value.filter(x => x.id !== id);
        console.log('after delete:', JSON.stringify(subcategories.value));
        setData();
    };

    const updateSubcategory = (subcategory: Subcategory) => {
        const index = subcategories.value.findIndex(x => x.id == subcategory.id);

        subcategories.value.splice(index, 1, subcategory);
        setData();
    };

    const getSubcategoryNameById = (id: string) => {
        const category = subcategories.value.find(c => c.id == id);
        return category?.name;
    };

    return { subcategories, createSubcategory, deleteSubcategory, updateSubcategory, getSubcategoryNameById };
});