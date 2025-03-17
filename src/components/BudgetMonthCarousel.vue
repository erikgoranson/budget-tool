<script setup lang="ts">
import type { CarouselApi } from '@/components/ui/carousel'; 
import { computed, ref,  watch, nextTick } from 'vue';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useCarouselStore } from '@/stores/carousel';

const locale: string = 'en-US';
const now = ref(new Date()); 

const carouselApi = ref<CarouselApi>();
const carouselStore = useCarouselStore();
const setCarouselApi = (api: CarouselApi) => {
  carouselApi.value = api;
}

const formatDate = (date : Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  return `${year}${month}`;
};

const monthOptions = computed(() => {
  const previousYear = new Date(now.value.getFullYear() -1, 0, 1); //or oldest budget category date 
  const nextYear = new Date(now.value.getFullYear() +1, 0, 1);

  const options = [] as Date[];
  let date = new Date(previousYear);
  while (date <= nextYear) {
    options.push(new Date(date));
    date.setMonth(date.getMonth() + 1);
  }
  
  return options; 
});

const currentMonthIndex = computed(() => {
  const currentDate = formatDate(now.value);
  let monthIndex = 0;
  monthOptions.value.forEach((option, index) => {
    const optionDate = formatDate(option);
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
              <span class="text-4xl font-semibold"> {{ month.toLocaleString(locale, { month: 'long' }) }} </span>
              <span class="text-2xl" > {{ month.getFullYear() }} </span>
            </div>
          </div>
        </div>
      </CarouselItem>
    </CarouselContent>
    <CarouselPrevious />
    <CarouselNext />
  </Carousel>
</template>