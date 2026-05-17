<script setup lang="ts">
import { useBudgetDataStore } from '@/stores/budgetData';
import { AlertDialog, AlertDialogAction,AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter,AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const dataStore = useBudgetDataStore();
const deleteData = () => {
    dataStore.truncateBudgetData();
}
</script>

<template>
    <AlertDialog>
        <AlertDialogTrigger as-child>
            <div>
                <slot/>
            </div>
        </AlertDialogTrigger>
    <AlertDialogContent>
        <AlertDialogHeader>
            <AlertDialogTitle>
                Are you sure?
            </AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. This action will permanently delete all the data you have entered so far and it cannot be recovered unless you have already downloaded a copy. 
            </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter class="flex flex-row justify-center gap-4">
            <AlertDialogAction @click="deleteData" class="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
            </AlertDialogAction>
            <AlertDialogCancel class="mt-0 w-full">
                Cancel
            </AlertDialogCancel>
        </AlertDialogFooter>
    </AlertDialogContent>
    </AlertDialog>
</template>
