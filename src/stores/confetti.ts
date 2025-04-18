import { ref, nextTick } from 'vue';
import { defineStore } from 'pinia';

export const useConfettiStore = defineStore('confetti', () => {
    const isActive = ref(false);

    const throwConfetti = async () => {
        isActive.value = false;
        await nextTick();
        isActive.value = true;
    };
    
    return { isActive, throwConfetti };
});