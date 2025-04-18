<script setup lang="ts">
import type { DialogDropdownItem } from '@/types';
import { formProps } from './goalFormHelper';
import DialogDropdownMenu from '../DialogDropdownMenu.vue';
import GoalForm from '../goal/GoalForm.vue';
import DeleteGoalAlert from './DeleteGoalAlert.vue';

const props = defineProps(formProps);
const dropdownOptions: DialogDropdownItem[] = [
    {
        slotName: 'update',
        dialogName: 'Edit Goal',
        isAlert: false,
    },
    {
        slotName: 'delete',
        dialogName: 'Delete Goal',
        isAlert: true,
    },
];
</script>

<template>
    <DialogDropdownMenu :options="dropdownOptions">
        <template v-slot:update="{ dialogFunction: { toggleDialog } }">
            <GoalForm :input="input" :onSubmitFunction="toggleDialog" /> 
        </template>
        <template v-slot:delete="{ dialogFunction: { toggleDialog } }">
            <DeleteGoalAlert :input="input" />
        </template>
    </DialogDropdownMenu>
</template>