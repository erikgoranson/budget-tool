import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { CalendarDate, DateFormatter, getLocalTimeZone, parseDate, today } from '@internationalized/date';
import dateFormatter from '@/helpers/dateFormatter';

export const useCarouselStore = defineStore('carousel', () => {
    const now = ref<CalendarDate>( today(getLocalTimeZone()) );
    const selectedMonth = ref<CalendarDate>( today(getLocalTimeZone()).set({day: 1}) );
    const selectedMonthString = computed(() => selectedMonth.value?.toString()); 
    const selectedMonthName = computed(() => dateFormatter.format(selectedMonth.value as CalendarDate, 'monthName')); 

    return { now, selectedMonth, selectedMonthString, selectedMonthName };
});