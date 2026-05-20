<script setup lang="ts">
import { ref  } from "vue";
import { ChevronDown, ChevronRight } from 'lucide-vue-next';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const props = defineProps({
    cardColor: {
        type: String,
        required: false,
        default: 'blue'
    },
});

const isOpen = ref(false); 

const cardStyles = {
  green: { bg: 'bg-green-300', border: 'border-green-300' },
  red:   { bg: 'bg-red-300',   border: 'border-red-300' },
  blue:  { bg: 'bg-blue-300',  border: 'border-blue-300' },
}; 
</script>

<template>
    <Collapsible v-model:open="isOpen" >
        <Card class="w-full my-6 overflow-hidden shadow-md " :class="isOpen ? '' : cardStyles[cardColor].border">
            <CollapsibleTrigger as-child>
                <CardHeader class="h-25 p-3 flex flex-row items-center justify-between gap-2" :class="cardStyles[cardColor].bg">
                    <div class="flex items-center gap-3">    
                        <div class="flex-shrink-0">
                            <ChevronRight v-if="!isOpen" />
                            <ChevronDown v-else />
                        </div>
                    </div>

                    <slot name="header"/>

                </CardHeader>
            </CollapsibleTrigger>

            <CollapsibleContent>
                <CardContent class="p-0">
                    <slot name="content"/>
                </CardContent>
                <CardFooter class="py-2">
                    <slot name="footer"/>
                </CardFooter>
            </CollapsibleContent>
        </Card>
    </Collapsible>
</template>