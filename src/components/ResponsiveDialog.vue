<script setup lang="ts">
import { ref, defineEmits, computed, onMounted } from 'vue';
import { createReusableTemplate, useMediaQuery } from '@vueuse/core';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const props = defineProps({
    title : { 
        type: String,
        required: true
    },
    description : { 
        type: String,
        required: false
    },
    isAlert: {
        type: Boolean,
        required: false,
        default: false,
    },
    isDialogVisible: { 
        type: Boolean,
        required: false,
        default: undefined,
    },
});

const isDesktop = useMediaQuery('(min-width: 768px)');
const [DefineContent, UseContent] = createReusableTemplate();

const isDialogVisible = ref(false);
const emit = defineEmits(['update:isDialogVisible']);

const isOpen = computed({
    get: () => props.isDialogVisible ?? isDialogVisible.value,
    set: (value) => {
        emit('update:isDialogVisible', value);
        isDialogVisible.value = value;
    },
});

const toggleDialog = () => {
    isDialogVisible.value = !isDialogVisible.value;
}
</script>

<template>
    <span @click="toggleDialog">
        <slot name="toggleButton"></slot>
    </span>

    <DefineContent>
        <slot :close="{ toggleDialog }">
            DEFAULT CONTENT FOR {{ title }}
        </slot>
    </DefineContent>

    <AlertDialog v-if="isAlert" v-model:open="isOpen" @update:open="!isOpen">
        <AlertDialogTrigger asChild></AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>
                    {{ title }}
                </AlertDialogTitle>
                <AlertDialogDescription>
                    {{ description }}
                </AlertDialogDescription>
            </AlertDialogHeader>
            <UseContent />
        </AlertDialogContent>
    </AlertDialog>

    <Dialog v-else-if="isDesktop" v-model:open="isOpen" @update:open="!isOpen">
        <DialogTrigger >
        </DialogTrigger>
        <DialogContent class="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>
                    {{ title }}
                </DialogTitle>
                <DialogDescription>
                    {{ description }}
                </DialogDescription>
            </DialogHeader>
            <UseContent />
        </DialogContent>
    </Dialog>

    <Drawer v-else v-model:open="isOpen">
        <DrawerTrigger as-child></DrawerTrigger>
        <DrawerContent>
            <DrawerHeader class="text-left">
                <DrawerTitle>
                    {{ title }}
                </DrawerTitle>
                <DrawerDescription>
                    {{ description }}
                </DrawerDescription>
            </DrawerHeader>
            <UseContent />
            <DrawerFooter class="pt-2"></DrawerFooter>
        </DrawerContent>
    </Drawer>
</template>