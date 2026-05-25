<script setup lang="ts">
import type { Subcategory, Transaction, TransactionRow, Category} from '@/types';
import { computed, h, ref, onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { ChevronsUpDown, Calendar as CalendarIcon, Plus } from 'lucide-vue-next';
import { useCategoryStore } from '@/stores/category';
import { useSubcategoryStore } from '@/stores/subcategory';
import dateFormatter from '@/helpers/dateFormatter';
import uncategorized from '@/helpers/uncategorizedHelper';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface CategoryGroup extends Category {
    subcategories: Subcategory[],
}

const transaction = defineModel<TransactionRow>( { required: true, } );
const emit = defineEmits<{(e: 'update:model', value: TransactionRow): void}>();

const categoryStore = useCategoryStore();
const { categories } = storeToRefs(categoryStore);
const subcategoryStore = useSubcategoryStore();
const { subcategories } = storeToRefs(subcategoryStore);

const isComboBoxOpen = ref(false);
const searchTerm = ref<string>('');

const categoryGroups = computed(() => {
    return categories.value.map(x => {
        const subcategoryMatches = subcategories.value.filter(s => s.categoryId == x.id);
        const group = x as CategoryGroup;
        group.subcategories = subcategoryMatches;
        return group;
    });
});

const displayedLabel = computed(() => {
    const subcategory = subcategories.value.find(sc => sc.id === transaction.value.subcategoryId) ?? uncategorized.subcategory as Subcategory;
    return subcategoryStore.getBudgetCategoryName(subcategory);
});

const isIncome = computed(() => transaction.value?.income ?? false);
</script>

<template>

    <template v-if="isIncome">
        <Button disabled="true">Income for {{ dateFormatter.format(transaction.date as string, 'monthYearDate') }}</Button>
    </template>
    <template v-else>

        <Popover v-model:open="isComboBoxOpen">
        <PopoverTrigger as-child>
            <Button  variant="outline" role="combobox" >
                {{ displayedLabel ?? 'Select category...' }}
                <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
        </PopoverTrigger>

        <PopoverContent class="flex w-[350px] p-0">
            <Command v-model:search-term="searchTerm">
            <CommandInput placeholder="Search categories..." />
            <CommandEmpty>Nothing found.</CommandEmpty>
            <CommandList>

                <CommandGroup v-for="group in categoryGroups" :key="group.id"  :heading="group.name">
                    <CommandItem
                    v-for="subcategory in group.subcategories"
                    :key="subcategory.id"
                    :value="subcategory.name"
                    @select="() => {
                        transaction.categoryId = subcategory.categoryId;
                        transaction.subcategoryId = subcategory.id;
                        transaction.budgetCategoryName = displayedLabel;

                        emit('update:model', transaction);
                        console.log('we emitted update model')
                        isComboBoxOpen = false;
                    }">
                        {{ subcategory.name }}
                    </CommandItem>
                </CommandGroup>

            </CommandList>
            </Command>
        </PopoverContent>
        </Popover>

    </template>
</template>