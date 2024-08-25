<script setup lang="ts">
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
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button';
import { useCategoryStore } from '@/stores/category.ts';
const categoryStore = useCategoryStore();

const props = defineProps({
    id: {
        type: Number,
        required: true,
    },
});
</script>

<template>
  <AlertDialog>
    <AlertDialogTrigger>
        <Button variant="destructive">
            Delete Category
        </Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
        <AlertDialogDescription>
            This action will permanently delete the selected budget category and all its related data. This cannot be undone. 
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction variant="destructive" @click="categoryStore.deleteCategory(props.id)">
            Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>