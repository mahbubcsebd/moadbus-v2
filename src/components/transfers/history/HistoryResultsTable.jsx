import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const getStatusColor = (status) => {
  switch (status) {
    case 'SUCCESS':
      return 'bg-green-100 text-green-800';
    case 'SCHEDULED':
      return 'bg-blue-100 text-blue-800';
    case 'FAILED':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const HistoryResultsTable = ({ data = [], isSearching = false }) => {
  const columns = [
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => (
        <div className="text-sm font-medium text-gray-900">{row.original.date}</div>
      ),
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => <div className="text-sm text-gray-700">{row.original.description}</div>,
    },
    {
      accessorKey: 'type',
      header: 'Transaction Type',
      cell: ({ row }) => <div className="text-xs text-gray-500">{row.original.type}</div>,
    },
    {
      accessorKey: 'amount',
      header: () => <div className="text-right">Amount</div>,
      cell: ({ row }) => (
        <div className="text-right font-semibold text-gray-900">
          {row.original.currency} {row.original.amount.toFixed(2)}
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: () => <div className="text-right">Status</div>,
      cell: ({ row }) => (
        <div className="text-right">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
              row.original.status,
            )}`}
          >
            {row.original.status}
          </span>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // Loading/Empty State logic remains unchanged
  if (isSearching) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center flex items-center justify-center space-x-2 mx-auto">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
        <p className="text-gray-500">Searching...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center max-w-4xl mx-auto">
        <p className="text-gray-500">No transfers found matching your filters.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-4xl"
    >
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Transfer History</h3>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row, index) => (
              <motion.tr
                key={row.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="hover:bg-gray-50 transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🌟 Mobile Card View 🌟 */}
      <div className="md:hidden space-y-3">
        {data.map((transfer, index) => (
          <motion.div
            key={transfer.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
          >
            {/* Row 1: Amount and Status */}
            <div className="flex items-start justify-between mb-3 border-b border-gray-100 pb-3">
              <div className="text-base font-bold text-gray-900">
                {transfer.currency} {transfer.amount.toFixed(2)}
              </div>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ml-2 lowercase ${getStatusColor(
                  transfer.status,
                )}`}
              >
                {transfer.status}
              </span>
            </div>

            {/* Row 2: Description and Date */}
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0 pr-4">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {transfer.description}
                </div>
                <div className="text-xs text-gray-500">{transfer.desc}</div>
              </div>
              <div className="text-xs text-gray-400 shrink-0">{transfer.date}</div>
            </div>
          </motion.div>
        ))}
      </div>
      {/* 🌟 End Mobile Card View 🌟 */}
    </motion.div>
  );
};

export default HistoryResultsTable;
