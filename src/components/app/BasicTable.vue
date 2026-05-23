<script setup lang="ts">
import { computed } from 'vue';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const props = defineProps<{
    data: any[],
    headers?: any[],
}>();

const columns = computed(() => {
    if (props.headers !== undefined){
        return props.headers;
    }
    else {
        return Object.keys(props.data[0] || []);
    }
});
</script>

<template>
  <div class="border rounded-md">
      <Table>
      <TableHeader>
          <TableRow >
              <TableHead v-for="column in columns" :key="column" class="p-0">
                <slot :name="`column-${column}`" :columnKey="column">
                    {{ column }}
                </slot>
              </TableHead>
          </TableRow>
      </TableHeader>
          <TableBody>
              <TableRow v-for="(row, index) in data" :key="index">
                  <TableCell v-for="column in columns" :key="column" class="p-0">
                    <slot :name="column" :value="row[column]" :columnKey="column">
                        {{ row[column] }}
                    </slot>
                  </TableCell>
              </TableRow>
          </TableBody>
      </Table>
  </div>
</template>