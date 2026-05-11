<script setup lang="ts">
import type { BudgetImport, Budget, Category, Goal, Subcategory, Transaction } from '@/types';
import dateFormatter from '@/helpers/dateFormatter';
import { ref, computed } from 'vue';

import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';

const props = defineProps({
    data : {
        type: Object as () => BudgetImport,
        required: true
    }
});

const tree = computed(() => {
  return buildBudgetTree(props.data);
});

const buildBudgetTree = (data: BudgetImport) => {

  const outputThingy = data.category.map(cat => {

    const subcategory = data?.subcategories.filter(x => x.categoryId == cat.id).map(subcat => {
      const budgets = data?.budgets?.filter(b => b.subcategoryId == subcat.id) as Budget[];
      const goals = data?.goals?.filter(g => g.subcategoryId == subcat.id) as Goal[];
      
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
    category: outputThingy,
    transaction: data.transactions,
  };

  //return finalObj;
};

const getCategoryLabel = (tran: Transaction) => {
  if (tran.income){
      return `Income for ${dateFormatter.format(tran.date, 'monthName')}`;
  };

  //const categoryName = categoryStore.getCategoryName(tran.categoryId);
  //const categoryName = props.data['category'].find(x => x['id]'] == tran.categoryId);
  const categoryName = props.data.category.find(x => x.id == tran.categoryId);

  //const subcategoryName = props.data['subcategory'].find(x => x['id]'] == tran.subcategoryId);
  const subcategoryName = props.data.subcategories.find(x => x.id == tran.subcategoryId);

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

<ul v-for="category in tree.category">
            Category: {{ category.name }}
            <ul class="list-disc pl-5" v-for="subcategory in category.subcategory">
            <li>
                Budget: {{ subcategory.name }}
                <ul class="list-disc pl-5"  v-for="budget in subcategory.budget">
                <li>${{ budget.amount }} budgeted for {{ budget.date }}</li>
                </ul>
                <ul class="list-disc pl-5"  v-for="goal in subcategory.goal">
                <li>{{ goal.goalOption }} goal ({{ goal.amount }} by {{ goal.targetDate }})</li>
                </ul>
            </li>
            </ul>
        </ul>

        <p v-if="tree.transaction.length > 0">Transactions:</p>
        <ul v-for="tran in tree.transaction" class="list-disc pl-5" >
            <li>
            {{ tran.income ? '+' : '-' }}${{ tran.amount }} on {{ tran.date }} : {{ getCategoryLabel(tran) }}
            
            {{ tran.note != null ? `(${tran.note})` : ''}}
            </li>
        </ul>

        </CardContent>
    </Card>
</template>