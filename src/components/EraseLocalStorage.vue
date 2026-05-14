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
            <div @click="deleteData">
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
        <AlertDialogFooter>
            <AlertDialogAction class="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
            </AlertDialogAction>
            <AlertDialogCancel>
                Cancel
            </AlertDialogCancel>
        </AlertDialogFooter>
    </AlertDialogContent>
    </AlertDialog>
</template>
