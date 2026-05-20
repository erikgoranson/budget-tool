<script setup lang="ts">
import type { Category } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import CollapsibleCard from "../app/CollapsibleCard.vue";

import BudgetTable from "./BudgetTable.vue";
import CategoryActionsMenu from "../category/CategoryActionsMenu.vue";
import CreateBudgetForm from "./CreateBudgetForm.vue";
import BudgetTotalsReport from "./BudgetTotalsReport.vue";

const props = defineProps({
    budgetCategory : {
        type: Object as () => Category,
        required: true
    }
});
</script>

<template>
    <CollapsibleCard>
        <template #header>
            <div class="flex flex-1 justify-between justify-center items-center">
                <div class="min-w-0">
                    <CardTitle>
                        {{ props.budgetCategory.name }}
                    </CardTitle>

                    <CardDescription class="line-clamp-2 mt-1 text-sm">
                        {{ props.budgetCategory.description }}
                    </CardDescription>
                </div>
                <div class="flex flex-col gap-2 text-right shrink-0">
                    <BudgetTotalsReport :category="budgetCategory"/>
                </div>
            </div>
        </template>

        <template #content>
            <BudgetTable :category="budgetCategory"/>
            <CreateBudgetForm :category="budgetCategory"/>
        </template>

        <template #footer>
            <CategoryActionsMenu :category="budgetCategory" />
        </template>
    </CollapsibleCard>
</template>