<script setup lang="ts">
import { computed, ref,  watch, nextTick } from 'vue';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import type { CarouselApi } from '@/components/ui/carousel'; 

const locale: string = 'en-US';
const now = ref(new Date());

const carouselApi = ref<CarouselApi>();
const setCarouselApi = (api: CarouselApi) => {
  carouselApi.value = api;
}
const selectedSlideIndex = ref<number>(now.value.getMonth());
const selectedSlideValue = computed(() => monthOptions.value[selectedSlideIndex.value]);

const monthOptions = computed(() => {
  const options = [] as Date[];
  
  for (let i = 0; i < 12; i++) {
    const date = new Date(now.value.getFullYear(), i, 1);
    options.push(date); 
  }
  return options;
});

const stopWatch = watch(carouselApi, (api) => {
  if (!api) return;

  nextTick(() => {
    stopWatch(); // Stop watching after the first callback
    api.on('select', () => {
      selectedSlideIndex.value = api.selectedScrollSnap();
    });
  });
});
</script>

<template>
    <Carousel @init-api="setCarouselApi" class="relative w-full max-w-xs" :opts="{ startIndex: now.getMonth() }">
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