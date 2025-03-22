import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { CalendarDate, DateFormatter, getLocalTimeZone, parseDate, today } from '@internationalized/date';

export const useCarouselStore = defineStore('carousel', () => {

    const getMonthName = (calendarDate : CalendarDate) => {
        const jsDate = calendarDate.toDate(getLocalTimeZone());
        return jsDate.toLocaleString('en-US', { month: 'long' })
    };

    const getYear = (calendarDate : CalendarDate) => {
        const jsDate = calendarDate.toDate(getLocalTimeZone());
        return jsDate.getFullYear();
    };
    
    const now = ref<CalendarDate>( today(getLocalTimeZone()) );
    const selectedMonth = ref<CalendarDate>( today(getLocalTimeZone()).set({day: 1}) );
    const selectedMonthString = computed(() => selectedMonth.value?.toString()); 
    const selectedMonthName = computed(() => getMonthName(selectedMonth.value as CalendarDate)); 

    return { now, selectedMonth, selectedMonthString, selectedMonthName, getMonthName, getYear };
});