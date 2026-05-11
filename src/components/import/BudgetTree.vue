<script setup lang="ts">
import type { BudgetData, Budget, Category, Goal, Subcategory, Transaction } from '@/types';
import dateFormatter from '@/helpers/dateFormatter';
import currencyFormatter from '@/helpers/numberFormat';
import { ref, computed } from 'vue';

import { Card, CardContent, } from '@/components/ui/card';
import TreeItem from '../TreeItem.vue';

const props = defineProps({
  data : {
    type: Object as () => BudgetData,
    required: true
  }
});

const tree = computed(() => {
  return buildBudgetTree(props.data);
});

const buildBudgetTree = (data: BudgetData) => {
  const category = data.category.map(cat => {
    const subcategory = data?.subcategory?.filter(x => x.categoryId == cat.id).map(subcat => {
      const budgets = data?.budget?.filter(b => b.subcategoryId == subcat.id) as Budget[];
      const goals = data?.goal?.filter(g => g.subcategoryId == subcat.id) as Goal[];
      
      return {
        id: subcat.id,
        name: subcat.name,
        dueDate: subcat.dueDate,
        budget: budgets,
        goal: goals,
      };
    });

    return {
      id: cat.id,
      name: cat.name,
      description: cat.description, 
      hasDueDates: cat.hasDueDates, 
      subcategory: subcategory,      
    }
  });

  return { 
    category: category,
    transaction: data.transaction,
  };
};

const getCategoryLabel = (tran: Transaction) => {
  if (tran.income){
    return `Income for ${dateFormatter.format(tran.date, 'monthName')}`;
  };

  const categoryName = props.data.category.find(x => x.id == tran.categoryId)?.name;
  const subcategoryName = props.data.subcategory.find(x => x.id == tran.subcategoryId)?.name;

  if (categoryName === undefined || subcategoryName === undefined){
    return 'Uncategorized';
  }
  else {
    return `${categoryName} : ${subcategoryName}`;
  }
};
</script>

<template>
  <Card class="border-gray-400 bg-gray-100">
    <CardContent class="p-6">
      
      <TreeItem v-for="category in tree.category">
        Category: {{ category.name }}
        <template #content>
          <TreeItem v-for="subcategory in category.subcategory">
            Budget: {{ subcategory.name }}
            <template #content v-if="subcategory.budget?.length > 0 || subcategory.goal?.length > 0">
              <TreeItem v-for="budget in subcategory.budget">
                {{ currencyFormatter.format(budget.amount) }} for {{ dateFormatter.format(budget.date, 'monthName') }} {{ dateFormatter.format(budget.date, 'yearNumeric') }} 
              </TreeItem>

              <TreeItem v-for="goal in subcategory.goal">
                {{ goal.goalOption }} goal ({{ currencyFormatter.format(goal.amount) }} by {{ dateFormatter.format(goal.targetDate, 'longDate') }}) 
              </TreeItem>
            </template>
          </TreeItem>
        </template>
      </TreeItem>

      <TreeItem>
        Transactions: ({{tree.transaction.length}})
        <template #content>
          <TreeItem v-for="tran in tree.transaction">
            {{ dateFormatter.format(tran.date, 'murica') }} &nbsp; {{ tran.income ? '+' : '' }}{{currencyFormatter.format(tran.amount)}}
            <template #content>
              <TreeItem>
                {{ getCategoryLabel(tran) }} {{ tran.note != null ? ` - (${tran.note})` : ''}}
              </TreeItem>
            </template>
          </TreeItem>
        </template>
      </TreeItem>

    </CardContent>
  </Card>
</template>