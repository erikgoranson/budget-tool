<script setup lang="ts">
import type { DialogDropdownItem } from '@/types';
import { ref } from 'vue';
import { MoreHorizontal } from 'lucide-vue-next';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import ResponsiveDialog from './ResponsiveDialog.vue';

const props = defineProps({
    name : { 
        type: String,
        required: false,
        default: 'Actions'
    },
    options: { 
        type: Array as () => DialogDropdownItem[], 
        required: false,
        default: [] as DialogDropdownItem[],
    }
});

const currentActiveOption = ref<string>('');
const currentOptionisAlert = ref<boolean>(false);
const isDialogVisible = ref<boolean>(false);

const toggleDialog = () => {
    isDialogVisible.value = !isDialogVisible.value;
};

const setActiveContent = (option: DialogDropdownItem) => {
    currentActiveOption.value = option.slotName;
    toggleDialog();
    currentOptionisAlert.value = option.isAlert;
};
</script>

<template>
    <span v-for="(option, index) in props.options">
        <span v-if="option.slotName == currentActiveOption">
            <ResponsiveDialog :title="option.dialogName" :is-alert="option.isAlert" v-model:isDialogVisible="isDialogVisible" @update:is-dialog-visible="!isDialogVisible">
                <slot :name="currentActiveOption" :dialogFunction="{ toggleDialog }"></slot>
            </ResponsiveDialog>
        </span>
    </span>

    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" class="h-8 w-8 p-0">
                <span class="sr-only">Open menu</span>
                <MoreHorizontal class="h-4 w-4" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" class="w-56">
            <DropdownMenuLabel>{{ name }}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem v-for="(option, index) in props.options" @click="setActiveContent(option)">
                {{ option.dialogName }}
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
</template>
