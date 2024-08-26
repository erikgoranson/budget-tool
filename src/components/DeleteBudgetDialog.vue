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
import { SquareX } from 'lucide-vue-next';

const categoryStore = useCategoryStore();

const props = defineProps({
    categoryId: {
        type: Number,
        required: true,
    },
    budgetId: {
        type: Number,
        required: true,
    },
});

const deleteBudget = () => {
    console.log('deleting budget', props.budgetId);
    categoryStore.deleteBudget(props.categoryId, props.budgetId)
};

</script>

<template>
  <AlertDialog>
    <AlertDialogTrigger class="flex justify-center">
        <Button class="ml-0 h-4 px-0" variant="ghost" >
            <SquareX class="h-4 ml-0 px-0 text-red-300 hover:text-red-950" />
        </Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
        <AlertDialogDescription>
            This action will permanently delete the selected budget and all its related data. This cannot be undone. 
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction variant="destructive" @click="deleteBudget">
            Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>