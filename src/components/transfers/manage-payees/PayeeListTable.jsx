import { Button } from '@/components/ui/button';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const PayeeListTable = ({ data = [], loading, onDeletePreview, onEditPreview }) => {
  const columns = [
    {
      accessorKey: 'name',
      header: 'Payee Name',
      cell: ({ row }) => <div className="font-medium text-gray-900">{row.original.name}</div>,
    },
    {
      accessorKey: 'bankName',
      header: 'Bank',
      cell: ({ row }) => <div className="text-gray-700">{row.original.bankName}</div>,
    },
    {
      accessorKey: 'accountNumber',
      header: 'Account Number',
      cell: ({ row }) => <div className="text-gray-700">{row.original.accountNumber}</div>,
    },
    {
      accessorKey: 'currency',
      header: 'Currency',
      cell: ({ row }) => <div className="font-semibold text-gray-900">{row.original.currency}</div>,
    },
  ];
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // Loading UI
  if (loading) {
    return (
      <div className="bg-white p-6 text-center border rounded-lg max-w-3xl mx-auto">
        <Loader2 className="w-5 h-5 animate-spin text-primary mx-auto" />
        <p className="text-gray-500 mt-2">Loading payees...</p>
      </div>
    );
  }

  // Empty UI
  if (data.length === 0) {
    return (
      <div className="bg-white p-6 text-center border rounded-lg max-w-3xl mx-auto">
        <p className="text-gray-500">No payees found.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto mt-4"
    >
      {/* DESKTOP TABLE */}
      <div className="hidden md:block">
        <table className="w-full border rounded-lg bg-white shadow-sm overflow-hidden">
          <thead className="bg-gray-100 text-left">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="p-3 text-sm font-semibold text-gray-700">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map((row, i) => (
              <motion.tr
                key={row.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="border-t hover:bg-gray-50 transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-3 whitespace-nowrap text-sm">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARD VIEW */}
      <div className="md:hidden space-y-3">
        {data.map((p, index) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="flex justify-between bg-white rounded-lg shadow-sm border border-gray-200 p-4"
          >
            <div>
              <div className="text-base font-bold text-gray-900">{p.name}</div>
              <div className="text-sm mt-2 text-gray-700">{p.bankName}</div>

              <div className="flex justify-between mt-2 text-sm">
                <div className="font-medium text-gray-900">{p.accountNumber}</div>
              </div>

              <div className="flex justify-between text-sm mt-1">
                <div className="font-semibold text-gray-900">{p.currency}</div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                variant="primary"
                type="button"
                size="small"
                className="px-3 py-2 text-xs"
                onClick={() => onDeletePreview(p)}
              >
                Transfer
              </Button>
              <Button
                variant="primary"
                type="button"
                size="small"
                className="px-3 py-2 text-xs"
                onClick={() => onDeletePreview(p)}
              >
                Delete
              </Button>

              <Button
                variant="primary"
                type="button"
                size="small"
                className="px-3 py-2 text-xs"
                onClick={() => onEditPreview(p)}
              >
                Edit
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default PayeeListTable;
