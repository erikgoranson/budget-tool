<script setup lang="ts">
import type { Goal } from '@/types';
import { useSubcategoryStore } from '@/stores/subcategory';
const subcategoryStore = useSubcategoryStore();

const props = defineProps({
    goal : {
        type: Object as () => Goal,
        required: true
    }
});
</script>

<template>
    <div class="mt-6 overflow-hidden rounded-md shadow-lg mx-2 bg-red-300" >
        <div class="flex justify-between px-4 py-4">
            <div class="flex items-center">
                <div class="flex justify-center content-center items-center text-center align-middle h-4 mr-2 ">
                    {{ subcategoryStore.getSubcategoryNameById(goal.subcategoryId) }} 
                </div>
                <div class="">
                    
                </div>
            </div>
            <div>{{ goal.goalOption }}</div>
        </div>

        <div class="pb-2 flex flex-col justify-center items-center">
            <div>
                progress bar
            </div>
            <div>
                Goal: {{ goal.amount }}
            </div>
            <div>
                target date: {{ goal.date }}
            </div>
            <div>
                total saved: {VALUE}
            </div>
            <div>
                remaining: { value }
            </div>
            
        </div>

        <div class="px-3 pt-0 pb-2 mb-2 items-end text-end">
            ...
        </div>
    </div> 
</template>