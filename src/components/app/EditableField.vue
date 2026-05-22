<script setup lang="ts" generic="T">
import { ref, nextTick, computed, watch } from 'vue';
import { onClickOutside } from '@vueuse/core';
import dateFormatter from '@/helpers/dateFormatter';
import { Switch } from '@/components/ui/switch'

const props = defineProps<{
    model: T,
    type?: inputType,
    writeToStore?: boolean,
}>();

type inputType = 'text' | 'number' | 'email' | 'date' | 'bool';

const emit = defineEmits<{
    (e: 'update:model', value: T): void;
    (e: 'updateStore', value: T): void;
}>();

const target = ref<HTMLElement | null>(null);
const isEditing = ref<boolean>(false);
const tempValue = ref<T>(props.model);

const inputType = computed(() => {
    if (props.type !== undefined){
        return props.type;
    }

    return lookupInputType(props.model);
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
    tempValue.value = props.model;
    isEditing.value = true;

    await nextTick();
    if (target.value) target.value.focus();
};

const handleBlur = () => {
    if (!isEditing.value) return;
    save();
};

const save = () => {
    if (props.writeToStore === true){
        console.log('EMIT THE WHOLE ROW DUDE. not this:', tempValue.value);
        emit('updateStore', tempValue.value);
    }
    else {
        emit('update:model', tempValue.value);
    }

    isEditing.value = false;
};

const saveBool = () => {
    tempValue.value = !tempValue.value as unknown as boolean;
    save();
};

const cancel = () => {
    tempValue.value = props.model
    isEditing.value = false;
};

onClickOutside(target, () => {
    if (isEditing.value) {
        save();
    }
});

watch(() => props.model, (newVal) => {
    tempValue.value = newVal;
});
</script>

<template>
    <Switch 
        v-if="inputType == 'bool'"
        class="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-input" 
        :checked="(tempValue as unknown as boolean)" 
        @update:checked="saveBool"
    />
    <div v-else>
        <div v-if="isEditing">
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
            <span>{{ tempValue }}</span>
        </div>
    </div>
</template>