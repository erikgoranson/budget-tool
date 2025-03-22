<script setup lang="ts">
import type { CarouselApi } from '@/components/ui/carousel'; 
import { computed, ref,  watch, nextTick } from 'vue';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useCarouselStore } from '@/stores/carousel';
import { CalendarDate, DateFormatter, getLocalTimeZone, parseDate, today } from '@internationalized/date';

const now = ref(today(getLocalTimeZone()).set({day: 1})); 

const carouselApi = ref<CarouselApi>();
const carouselStore = useCarouselStore();
const setCarouselApi = (api: CarouselApi) => {
  carouselApi.value = api;
}

const monthOptions = computed(() => {
  const previousYear = now.value.set({day: 1}).subtract({years: 1}); //or oldest budget category date
  const nextYear = now.value.set({day: 1}).add({years: 1});

  const options = [] as CalendarDate[];
  let date = previousYear;
  while (date <= nextYear) {
    options.push(date);
    date = date.add({months: 1}); 
  }
  
  return options; 
});

const currentMonthIndex = computed(() => {
  const currentDate = now.value.toString();
  let monthIndex = 0;
  monthOptions.value.forEach((option, index) => {
    const optionDate = option.toString();
    if (currentDate == optionDate){
      console.log('match found!:',currentDate, optionDate);
      monthIndex = index;
    }
  });
  return monthIndex;
});

const selectedSlideIndex = ref<number>(currentMonthIndex.value);
const selectedSlideValue = computed(() => {
  return monthOptions.value[selectedSlideIndex.value];
});

const stopWatch = watch(carouselApi, (api) => {
  if (!api) return;
  nextTick(() => {
    stopWatch(); // Stop watching after the first callback
    api.on('select', () => {
      selectedSlideIndex.value = api.selectedScrollSnap();
      carouselStore.selectedMonth = selectedSlideValue.value;
    });
  });
});
</script>

<template>
  <Carousel @init-api="setCarouselApi" class="relative w-full max-w-xs" :opts="{ startIndex: currentMonthIndex }">
    <CarouselContent>
      <CarouselItem v-for="(month, index) in monthOptions" :key="index" :id="index">
        <div class="p-1">
          <div>
            <div class="flex flex-col items-center justify-center p-6">
              <span class="text-4xl font-semibold"> {{ carouselStore.getMonthName(month) }} </span>
              <span class="text-2xl" > {{ carouselStore.getYear(month) }} </span>
            </div>
          </div>
        </div>
      </CarouselItem>
    </CarouselContent>
    <CarouselPrevious />
    <CarouselNext />
  </Carousel>
</template>