<script setup lang="ts">
import type { BudgetRow, Category } from '@/types';
import type { Cell } from '@tanstack/vue-table';
import { ref, nextTick, computed } from 'vue';
import { useForm } from 'vee-validate';
import { FlexRender } from '@tanstack/vue-table';
import { formProps, handleSubmission } from './budgetFormHelper';
import { Input } from '@/components/ui/input';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from '@/components/ui/form';

const props = defineProps({
    ...formProps,
    cell : {
        type: Object as () => Cell<BudgetRow, unknown>,
        required: true
    },
    index : {
        type: Number,
        required: true
    },
});

const editField = ref<string | undefined>(undefined);
const submittedRow = ref<BudgetRow>({} as BudgetRow); 
let inputs = ref<HTMLInputElement[]>([]);

const { handleSubmit, errors, resetForm } = useForm({});

const focusInput = async (key: string | undefined, index: number) => {
    editField.value = key;
    await nextTick();
    inputs.value[0].focus(); 
};

const onSubmit = handleSubmit((values, actions) => {
    handleSubmission(values, submittedRow.value);
});

const modifyBudget = (budget: BudgetRow) => {
    submittedRow.value = budget;
    onSubmit();
};
</script>

<template >
    <div @click="focusInput(String(cell.getValue()), index)">
	<button v-show="editField != cell.getValue()" >
        <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
    </button>

	<form @submit.prevent="modifyBudget(cell.row.original)" v-show="editField == cell.getValue()" ref="inputs" >
		<FormField v-slot="{ componentField }" :name="String(cell.column.id)">
			<FormItem>
				<FormLabel></FormLabel>
				<FormControl>
					<Input
                        class="text-end"
						:type="typeof cell.getValue()" 
						@blur="focusInput(undefined, index)"
						v-bind="componentField"
						:placeholder="'budget '+ cell.column.id"
						:default-value="String(cell.getValue())"
					/>
				</FormControl>
				<FormDescription></FormDescription>
				<FormMessage />
			</FormItem>
		</FormField>
	</form>
    </div>
</template>