<script setup lang="ts">
import { defineEmits } from 'vue';
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
    name : { 
        type: String,
        required: true
    },
    isContentVisible: {
        type: Boolean,
        required: true,
        default: false,
    },
    isAlert: {
        type: Boolean,
    },
});

const [DefineContent, UseContent] = createReusableTemplate();
const isDesktop = useMediaQuery('(min-width: 768px)');

const emit = defineEmits(['update:isContentVisible'])
const toggleDialog = () => {
    emit('update:isContentVisible', !props.isContentVisible)
};
</script>

<template>
    <button @click="toggleDialog">
        <slot name="triggerButton"></slot>
    </button>

    <DefineContent as-child>
        <slot name="defineContent" :events="{ toggleDialog }"></slot>
    </DefineContent>

    <AlertDialog v-if="isAlert" :open="isContentVisible" @update:open="toggleDialog">
        <AlertDialogTrigger asChild></AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>
                    Delete {{ name }} - Are you sure?
                </AlertDialogTitle>
            </AlertDialogHeader>
            <UseContent />
            <AlertDialogFooter>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    
    <Dialog v-else-if="isDesktop" :open="isContentVisible" @update:open="toggleDialog">
        <DialogTrigger as-child></DialogTrigger>
        <DialogContent class="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Edit {{ name }}</DialogTitle>
                <DialogDescription></DialogDescription>
            </DialogHeader>
            <UseContent />
        </DialogContent>
    </Dialog>

    <Drawer v-else :open="isContentVisible">
        <DrawerTrigger as-child @click.stop></DrawerTrigger>
        <DrawerContent>
            <DrawerHeader class="text-left">
                <DrawerTitle>Edit {{ name }}</DrawerTitle>
                <DrawerDescription></DrawerDescription>
            </DrawerHeader>
            <UseContent />
            <DrawerFooter class="pt-2">
                <button @click="toggleDialog">cancel</button>
            </DrawerFooter>
        </DrawerContent>
    </Drawer>
</template>
