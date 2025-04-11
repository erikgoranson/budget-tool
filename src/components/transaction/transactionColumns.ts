import type { Transaction } from '@/types';
import type { ColumnDef } from '@tanstack/vue-table';

import { h, ref, computed } from 'vue';
import currencyFormatter from '@/helpers/numberFormat';

import Button from '../ui/button/Button.vue';
import Checkbox from '../ui/checkbox/Checkbox.vue';
import { ArrowUpDown, FilePenLine, } from 'lucide-vue-next';
import TransactionActionsMenu from './TransactionActionsMenu.vue';

export const transactionColumns: ColumnDef<Transaction>[] = [
    {
        id: 'select',
        header: ({ table }) => 
            h(Checkbox, {
                'checked': table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate'),'onUpdate:checked': value => table.toggleAllPageRowsSelected(!!value),
                'ariaLabel': 'Select all',
            }),
        cell: ({ row }) => 
            h(Checkbox, {
                'checked': row.getIsSelected(),
                'onUpdate:checked': value => row.toggleSelected(!!value),
                'ariaLabel': 'Select row',
            }),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'date',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Date', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })])
        },
        cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('date')), //TODO: format to MMddyy
    },
    {
        accessorKey: 'budgetCategoryName',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Category', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })])
        },
        cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('budgetCategoryName')),
    },
    {
        accessorKey: 'note',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Note', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })])
        },
        cell: ({ row }) => h('div', { }, row.getValue('note')),
    },
    {
        accessorKey: 'amount',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Amount', h(ArrowUpDown, { class: 'ml-2 h-4 w-4 text-right' })])
        },
        cell: ({ row }) => {
            const amount = Number.parseFloat(row.getValue('amount'))
            const isIncome = row.original.income;
            const formattedAmt = currencyFormatter.format(amount);
            const flowStyle = isIncome ? 'text-green-500' : 'text-red-500';
            return h('div', { class: `font-medium font-semibold ${flowStyle}` }, formattedAmt)
        },
    },
    {
        id: 'actions',
        header: () => ['', h(FilePenLine, { class: 'ml-2 h-4 w-4' })],
        enableHiding: false,
        cell: ({ row }) => {
            return h(TransactionActionsMenu, {
                transaction: row.original,
            })
        },
    },
];