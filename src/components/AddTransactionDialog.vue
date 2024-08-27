<script setup lang="ts">
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { SquarePlus } from 'lucide-vue-next';
</script>

<template>
    <Dialog>
        <DialogTrigger as-child>
            <div class="flex justify-center">
                <Button class="bg-green-600">
                    <SquarePlus class="h-4 w-4 mr-1 px-0"/>
                    Transaction
                </Button>
            </div>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[600px]">
            <DialogHeader>
                <DialogTitle>transaction time</DialogTitle>
                <DialogDescription>
                    gib transaction
                </DialogDescription>
            </DialogHeader>
            <div class="grid gap-4 py-4">
                table form goes here
            </div>
            <DialogFooter>
                <Button type="submit">
                    Save changes
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>