<script setup lang="ts" generic="T">
import { ref, nextTick } from 'vue';
import { onClickOutside } from '@vueuse/core';

const props = defineProps<{
  label?: string
  type?: 'text' | 'number' | 'email' | 'date'
}>();

const model = defineModel<T>({ required: true });
const target = ref<HTMLElement | null>(null);

const isEditing = ref<boolean>(false);
const tempValue = ref<T>(model.value);

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
    model.value = tempValue.value
    isEditing.value = false
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
    <div>
        <div v-if="isEditing" >
            <label v-if="props.label">{{ props.label }}</label>
            <input 
                ref="target"
                v-model="tempValue" 
                :type="props.type || 'text'" 
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