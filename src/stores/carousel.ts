import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

const formatDate = (date : Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return `${year}${month}`;
};

export const useCarouselStore = defineStore('carousel', () => {
    const selectedMonth = ref<Date>(new Date());
    const selectedMonthFormatted = computed(() => formatDate(selectedMonth.value));

    console.log('formatted version is:', selectedMonthFormatted.value)

    return { selectedMonth, selectedMonthFormatted };
});