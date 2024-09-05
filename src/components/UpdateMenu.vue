<script setup lang="ts">
import { ref } from 'vue';
import { MoreHorizontal } from 'lucide-vue-next';
import { createReusableTemplate, useMediaQuery } from '@vueuse/core';

import { Button } from '../components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
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
    }
});

const [DefineEditForm, UseEditForm] = createReusableTemplate();
const [DefineDeleteForm, UseDeleteForm] = createReusableTemplate();

const isDesktop = useMediaQuery('(min-width: 768px)');
const editDialogOpen = ref(false);
const deleteDialogOpen = ref(false);

const toggleEditForm = () => {
  editDialogOpen.value = false;
}

const toggleDeleteForm = () => {
  deleteDialogOpen.value = false;
}
</script>

<template>
    <DefineDeleteForm as-child>
        <slot name="deleteForm" :events="{ toggleDeleteForm }"></slot>
    </DefineDeleteForm>

    <DefineEditForm as-child>
        <slot name="editForm" :events="{ toggleEditForm }"></slot>
    </DefineEditForm>

    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" class="h-8 w-8 p-0">
                <span class="sr-only">Open menu</span>
                <MoreHorizontal class="h-4 w-4" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem @click="editDialogOpen = true">Edit {{ name }}</DropdownMenuItem>

            <DropdownMenuItem @click="deleteDialogOpen = true">Delete {{ name }}</DropdownMenuItem>
            
        </DropdownMenuContent>
    </DropdownMenu>
    
    <Dialog v-if="isDesktop" :open="editDialogOpen" @update:open="editDialogOpen = !editDialogOpen">
        <DialogTrigger as-child></DialogTrigger>
        <DialogContent class="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Edit {{ name }}</DialogTitle>
                <DialogDescription></DialogDescription>
            </DialogHeader>
            <UseEditForm />
        </DialogContent>
    </Dialog>

    <Drawer v-else v-model:open="editDialogOpen">
        <DrawerTrigger as-child></DrawerTrigger>
        <DrawerContent>
            <DrawerHeader class="text-left">
                <DrawerTitle>Edit {{ name }}</DrawerTitle>
                <DrawerDescription></DrawerDescription>
            </DrawerHeader>
            <UseEditForm />
            <DrawerFooter class="pt-2"></DrawerFooter>
        </DrawerContent>
    </Drawer>

    <AlertDialog :open="deleteDialogOpen" @update:open="deleteDialogOpen = !deleteDialogOpen">
        <AlertDialogTrigger asChild></AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Delete {{ name }} - Are you sure?</AlertDialogTitle>
            </AlertDialogHeader>
            <UseDeleteForm />
        </AlertDialogContent>
    </AlertDialog>

</template>
