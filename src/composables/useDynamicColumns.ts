import type { VNode, Ref, } from 'vue';
import type { Column } from '@tanstack/vue-table';
import { h } from 'vue'

import { ArrowUpDown, FilePenLine, } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import EditableField from '@/components/app/EditableField.vue';

export function useDynamicColumns(parentData: Ref<any[]>) {

    const createEditableColumn = (accessorKey: string, headerName?: string, isSortable: boolean = true) => ({
        accessorKey,
        header: ({ column }) => isSortable ? createSortableHeader(column, headerName ?? accessorKey) : headerName ?? accessorKey,
        cell: (info: any) => h(EditableField, {
            model: info.getValue(),
                'onUpdate:model': (newValue: any) => {
                    const rowIndex = info.row.index
                    const columnId = info.column.id

                    const updatedData = [...parentData.value];
                    updatedData[rowIndex] = { ...updatedData[rowIndex], [columnId]: newValue };
                    parentData.value = updatedData;
                }
            }
        )
    });

    const createReadOnlyColumn = (accessorKey: string, headerName?: string, isSortable: boolean = true) => ({
        accessorKey,
        header: ({ column }) => isSortable ? createSortableHeader(column, headerName ?? accessorKey) : headerName ?? accessorKey,
        cell: ({ row }) => h('div', { }, row.getValue(accessorKey)),
    });

    const createSelectorColumn = (accessorKey: string = 'select') => ({
        accessorKey,
        header: ({ table }) => 
            h(Checkbox, {
                'checked': table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate'),'onUpdate:checked': value => table.toggleAllPageRowsSelected(!!value),
                'ariaLabel': 'Select all',
            }
        ),
        cell: ({ row }) => 
            h(Checkbox, {
                'checked': row.getIsSelected(),
                'onUpdate:checked': value => row.toggleSelected(!!value),
                'ariaLabel': 'Select row',
            }
        ),
    });

    const createSortableHeader = (column: Column<any,any>, accessorKey: string) => {
        return h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, 
        () => [accessorKey, h(ArrowUpDown, { class: 'ml-2 h-4 w-4 text-right capitalize' })]);
    };
    
    return { createEditableColumn, createReadOnlyColumn, createSelectorColumn, createSortableHeader};
};