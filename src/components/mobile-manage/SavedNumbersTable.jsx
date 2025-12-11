import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { motion } from 'framer-motion';
import { Edit, SortAsc, SortDesc, Trash2, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '../ui/button';

import DeleteMobileNumberModal from './DeleteMobileNumberModal';
import EditMobileNumberModal from './EditMobileNumberModal';

const SavedNumbersTable = ({ data = [], onDelete, onEdit }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [sorting, setSorting] = useState([]);

  const handleEditAction = (number) => {
    setSelectedNumber(number);
    setIsEditModalOpen(true);
  };

  const handleDeleteAction = (number) => {
    setSelectedNumber(number);
    setIsDeleteModalOpen(true);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'nickname',
        header: 'Nickname',
        cell: ({ row }) => (
          <div className="text-sm font-medium text-gray-900">{row.original.nickname}</div>
        ),
      },
      {
        accessorKey: 'mobileNumber',
        header: 'Mobile Number',
        cell: ({ row }) => <div className="text-sm text-gray-700">{row.original.mobileNumber}</div>,
      },
      {
        accessorKey: 'mobileCarrier',
        header: 'Mobile Carrier',
        cell: ({ row }) => (
          <div className="text-sm text-gray-700">{row.original.mobileCarrier}</div>
        ),
      },
      {
        accessorKey: 'deleteAction',
        header: 'Delete',
        cell: ({ row }) => (
          <div className="text-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteAction(row.original);
              }}
              className="text-red-500 hover:text-red-700"
            >
              <X className="w-4 h-4 mx-auto" />
            </button>
          </div>
        ),
      },
      {
        accessorKey: 'editAction',
        header: 'Edit',
        cell: ({ row }) => (
          <div className="text-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEditAction(row.original);
              }}
              className="text-blue-500 hover:text-blue-700"
            >
              <Edit className="w-4 h-4 mx-auto" />
            </button>
          </div>
        ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
    onSortingChange: setSorting,
  });

  const handleSortClick = () => {
    const currentSort = sorting[0];
    let newSort = [];
    if (!currentSort || currentSort.id !== 'nickname' || currentSort.desc === false) {
      newSort = [{ id: 'nickname', desc: true }];
    } else if (currentSort.desc === true) {
      newSort = [{ id: 'nickname', desc: false }];
    }
    setSorting(newSort);
  };

  const sortIcon =
    sorting.length && sorting[0].id === 'nickname' ? (
      sorting[0].desc ? (
        <SortDesc className="w-4 h-4" />
      ) : (
        <SortAsc className="w-4 h-4" />
      )
    ) : (
      <SortAsc className="w-4 h-4 opacity-50" />
    );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto">
      <EditMobileNumberModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        numberData={selectedNumber}
        onEditSubmit={onEdit}
      />
      <DeleteMobileNumberModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        numberData={selectedNumber}
        onConfirm={onDelete}
      />

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Saved Numbers</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSortClick}
          className="flex items-center space-x-1"
        >
          {sortIcon}
          <span>Sort</span>
        </Button>
      </div>

      {data.length === 0 ? (
        <div className="p-8 text-center bg-white border border-gray-200 rounded-lg shadow-sm">
          <p className="text-gray-500">No saved mobile numbers found.</p>
        </div>
      ) : (
        <>
          <div className="hidden overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm md:block">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-6 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase"
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="transition-colors hover:bg-gray-50">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4 text-sm whitespace-nowrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 md:hidden">
            {data.map((number) => (
              <div
                key={number.id}
                className="p-4 space-y-3 bg-white border border-gray-200 rounded-lg shadow-sm"
              >
                <div className="flex items-start justify-between pb-2 border-b border-gray-100">
                  <div className="text-base font-semibold text-gray-900">{number.nickname}</div>
                  <div className="text-sm text-gray-600">{number.mobileCarrier}</div>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div className="text-sm font-medium text-gray-700">{number.mobileNumber}</div>
                  <div className="flex space-x-4">
                    <button onClick={() => handleDeleteAction(number)} className="text-red-500">
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleEditAction(number)} className="text-blue-500">
                      <Edit className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
};

export default SavedNumbersTable;
