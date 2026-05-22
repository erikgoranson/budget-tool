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
  data: any[];
}>();

const columns = computed(() => Object.keys(props.data[0] || []));
</script>

<template>
  <div class="border rounded-md">
      <Table>
      <TableHeader>
          <TableRow >
              <TableHead v-for="column in columns">
                  {{ column }}
              </TableHead>
          </TableRow>
      </TableHeader>
          <TableBody>
              <TableRow v-for="row in data">
                  <TableCell v-for="column in columns">
                      {{ row[column] }}
                  </TableCell>
              </TableRow>
          </TableBody>
      </Table>
  </div>
</template>