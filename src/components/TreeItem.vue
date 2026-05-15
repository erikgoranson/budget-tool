<script setup>
import { useSlots, computed } from 'vue'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ChevronRight, Dot } from 'lucide-vue-next'

const sluts = useSlots()
const hasContent = computed(() => !!sluts.content);
</script>

<template>
    <div>
        <Collapsible :disabled="!hasContent">
            <CollapsibleTrigger class="flex items-center gap-2 py-1 px-2 w-full hover:bg-accent rounded-sm group" >
                <ChevronRight class="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-90" v-if="hasContent" />
                <Dot class="h-4 w-4" v-else/>
                <slot/>
            </CollapsibleTrigger>
            
            <CollapsibleContent class="ml-4 border-l pl-2">
                <slot name="content" />
            </CollapsibleContent>
        </Collapsible>
    </div>
</template>

