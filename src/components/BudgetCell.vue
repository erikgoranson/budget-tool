<script setup lang="ts">
import type { Budget, Category } from '../types/';
import type { Cell } from '@tanstack/vue-table';
import { ref, nextTick, computed } from 'vue';
import { useForm } from 'vee-validate';
import { FlexRender } from '@tanstack/vue-table';
import { useCategoryStore } from '@/stores/category';
import { Input } from '@/components/ui/input';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from '@/components/ui/form';

const props = defineProps({
    category : {
        type: Object as () => Category,
        required: true
    },
    cell : {
        type: Object as () => Cell<Budget, unknown>,
        required: true
    },
    index : {
        type: Number,
        required: true
    },
});

const categoryStore = useCategoryStore();

const editField = ref('');
const modifiedBudget = ref<Budget>({} as Budget);
let inputs = ref<HTMLInputElement[]>([]);

const { handleSubmit, errors, resetForm } = useForm({});

const focusInput = async (key: string, index: number) => {
    editField.value = key;
    await nextTick();
    inputs.value[0].focus(); 
};

const onSubmit = handleSubmit((values, actions) => {
    console.log(JSON.stringify(values, null, 2)); //debug
    const updatedBudget = <Budget>{
        id: modifiedBudget.value.id,
        name: values.name ? values.name : modifiedBudget.value.name,
        amount: values.amount ? parseFloat(values.amount) : modifiedBudget.value.amount,
        dueDate: values.dueDate ? values.dueDate : modifiedBudget.value.dueDate,
    };

    const valuesMatch = JSON.stringify(updatedBudget) == JSON.stringify(modifiedBudget.value);
    if (!valuesMatch) categoryStore.updateBudget(props.category.id, updatedBudget);
    focusInput('', 0);
});

const modifyBudget = (budget: Budget) => {
    modifiedBudget.value = budget;
    onSubmit();
};
</script>

<template>
	<span v-show="editField != cell.getValue()" @click="focusInput(String(cell.getValue()), index)">
		<FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
	</span>

	<form @submit.prevent="modifyBudget(cell.row.original)" v-show="editField == cell.getValue()" ref="inputs" >
		<FormField v-slot="{ componentField }" :name="String(cell.column.id)">
			<FormItem>
				<FormLabel></FormLabel>
				<FormControl>
					<Input 
						type="text" 
						@blur="focusInput('', index)"
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
</template>