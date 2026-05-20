<script setup lang="ts" generic="T">
import { ref, nextTick, computed } from 'vue';
import { onClickOutside } from '@vueuse/core';
import dateFormatter from '@/helpers/dateFormatter';
import { Switch } from '@/components/ui/switch'

const props = defineProps<{
    label?: string,
    type?: inputType 
}>();

type inputType = 'text' | 'number' | 'email' | 'date' | 'bool';

const model = defineModel<T>({ required: true });
const target = ref<HTMLElement | null>(null);
const isEditing = ref<boolean>(false);
const tempValue = ref<T>(model.value);

const inputType = computed(() => {
    if (props.type !== undefined){
        return props.type;
    }

    return lookupInputType(model.value);
})

const lookupInputType = (value: unknown): inputType => {
    let type = typeof value;
    if (type == "string" && dateFormatter.isDate(value as string)){
        return 'date';
    }

    const map: Record<string, inputType> = { 
        number: 'number', 
        boolean: 'bool',
        string: 'text',
        //email?
    };

    return map[type] || 'text';
};

const startEditing = async () => {
    tempValue.value = model.value;
    isEditing.value = true;

    await nextTick();
    if (target.value) target.value.focus();
};

const handleBlur = () => {
    if (!isEditing.value) return;

    model.value = tempValue.value;
    isEditing.value = false;
};

const save = () => {
    model.value = tempValue.value;
    isEditing.value = false;
};

const saveBool = () => {
    tempValue.value = !tempValue.value as unknown as boolean;
    save();
};

const cancel = () => {
    isEditing.value = false;
};

onClickOutside(target, () => {
    if (isEditing.value) {
        save();
    }
})
</script>

<template>
    <Switch 
        v-if="inputType == 'bool'"
        class="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-input" 
        :checked="(tempValue as unknown as boolean)" 
        @update:checked="saveBool"
    />
    <div v-else>
        <div v-if="isEditing" >
            <label v-if="props.label">{{ props.label }}</label>
            <input 
                ref="target"
                v-model="tempValue" 
                :type="inputType" 
                autofocus
                @keydown.enter="save"
                @keydown.escape="cancel"
                @blur="handleBlur"
            />
        </div>
        <div v-else  @click="startEditing">
            <span v-if="props.label" >{{ props.label }}:</span>
            <span>{{ model }}</span>
        </div>
    </div>
</template>