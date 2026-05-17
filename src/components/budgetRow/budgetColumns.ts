import type { BudgetRow } from '@/types';
import type { ColumnDef } from '@tanstack/vue-table';
import { h, ref } from 'vue';
import { storeToRefs } from 'pinia';
import currencyFormatter from '@/helpers/numberFormat';
import dateFormatter from '@/helpers/dateFormatter';
import { useCarouselStore } from '@/stores/carousel';
import { useTransactionStore } from '@/stores/transaction';
import { FilePenLine, ArrowRightLeft } from 'lucide-vue-next';
import BudgetActionsMenu from './BudgetActionsMenu.vue';
import Button from '../ui/button/Button.vue';
import CurrencyBadge from '../CurrencyBadge.vue';

type BudgetTotalToggle = 'spent' | 'remaining';
const activeToggleColumn = ref<BudgetTotalToggle>('spent'); 

const cellStyle = 'capitalize';

const getTotalExpensed = (row: BudgetRow) => {
    const carouselStore = useCarouselStore();
    const transactionStore = useTransactionStore();
    const { transactions } = storeToRefs(transactionStore);

    return transactions.value
        .filter(t => 
            t.subcategoryId == row.subcategoryId && 
            t.income === false && 
            t.date < carouselStore.selectedMonth.add({months:1}).toString() &&
            t.date >= carouselStore.selectedMonth.toString()
        )
        .reduce((t, {amount}) => t + amount, 0);
};

const getTotalCell = (row: BudgetRow, type: BudgetTotalToggle) => {
    const spent = getTotalExpensed(row);
    let totalValue = spent;
    let warning = spent > row.amount;

    if (type == 'remaining'){
        const remaining = row.amount - spent;
        totalValue = remaining;
        warning = remaining < 0;
    }

    return h('div', { class: 'flex items-center justify-center' }, [
        h(CurrencyBadge, { currencyValue: totalValue, class: 'text-base font-normal py-.5 px-1.5 truncate flex items-center justify-center' })
    ]);
};

export const editableColumns = ['name','dueDate','amount'] as string[];

export const budgetColumns: ColumnDef<BudgetRow>[] = [
    {
        accessorKey: 'name',
        header: ({ column }) => h('div', { }, 'budget'),
        cell: ({ row }) => h('div', { class: cellStyle }, row.getValue('name')),
    },
    {
        accessorKey: 'dueDate',
        header: ({ column }) => h('div', { }, 'due'),
        cell: ({ row }) => h('div', { class: cellStyle }, dateFormatter.addDateSuffix(row.getValue('dueDate'))),
    },
    {
        accessorKey: 'amount',
        header: ({ column }) => h('div', { }, 'amt'),
        cell: ({ row }) => h('div', { class: cellStyle }, currencyFormatter.format(row.getValue('amount'))),
    },
    {
        accessorKey: 'totalExpensed',
        header: ({ column }) => h('div', { }, 'spent'),
        cell: ({ row }) => getTotalCell(row.original, 'spent')
    },
    {
        accessorKey: 'totalRemaining',
        header: ({ column }) => h('div', { }, 'remain'),
        cell: ({ row }) => getTotalCell(row.original, 'remaining')
    },
    {
        accessorKey: 'spentRemainToggle',
        header: ({ column }) => {
            return h(Button, 
                {
                    class: 'p-0 px-1 bg-gray-100 h-8',
                    onClick: () => activeToggleColumn.value = activeToggleColumn.value === 'spent' ? 'remaining' : 'spent',
                    variant: 'outline', 
                },
                {
                    default: () => [
                        h('span', { class: 'uppercase w-10' }, activeToggleColumn.value === 'spent' ? 'Spent' : 'Remain'),
                        h(ArrowRightLeft, { class: 'w-1 h-1'}) 
                    ]
                }
            );
        },
        cell: ({ row }) => getTotalCell(row.original, activeToggleColumn.value)
    },
    {
        id: 'actions',
        header: () => h('div', { class:'flex items-center text-center justify-center' }, h(FilePenLine, { class: 'h-4 w-4' })),
        enableHiding: false,
        cell: ({ row }) => {
            return h('div', { class:'flex items-center text-center justify-center' }, 
                h(BudgetActionsMenu, {
                    budgetRow: row.original
                })
            );
        },
    },
];
