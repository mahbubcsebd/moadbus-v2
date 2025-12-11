import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { Link } from 'react-router';

export default function RecentTransfers({
  data = [],
  showViewAll = true,
  viewAllLink = '/dashboard/transfers-history',
}) {
  const columns = [
    {
      accessorKey: 'transfer',
      header: 'Transfer',
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
            <span>{row.original.fromAccount}</span>
            <ArrowRight className="w-4 h-4 text-gray-400" />
            <span>{row.original.toAccount}</span>
          </div>
          <div className="text-xs text-gray-500">{row.original.date}</div>
          <div className="text-xs text-gray-400">{row.original.reference}</div>
        </div>
      ),
    },
    {
      accessorKey: 'amount',
      header: () => <div className="">Amount</div>,
      cell: ({ row }) => (
        <div className="text font-semibold text-gray-900">USD {row.original.amount.toFixed(2)}</div>
      ),
    },
    {
      accessorKey: 'status',
      header: () => <div className="text-right">Status</div>,
      cell: ({ row }) => (
        <div className="text-right">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Recent Transfers</h2>
        {showViewAll && (
          <Link
            to={viewAllLink}
            className="text-sm text-primary hover:text-orange-700 font-medium flex items-center gap-1 transition-colors"
          >
            View All Transfers
            <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>

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

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {data.map((transfer, index) => (
          <motion.div
            key={transfer.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-1">
                  <span className="truncate">{transfer.fromAccount}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <ArrowRight className="w-3 h-3 text-gray-400 shrink-0" />
                  <span className="truncate">{transfer.toAccount}</span>
                </div>
              </div>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 shrink-0 ml-2 lowercase">
                {transfer.status}
              </span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="text-xs text-gray-500">
                <div>{transfer.date}</div>
                <div className="text-gray-400">{transfer.reference}</div>
              </div>
              <div className="text-base font-semibold text-gray-900">
                USD {transfer.amount.toFixed(2)}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {data.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-500">No transfers found</p>
        </div>
      )}
    </motion.div>
  );
}
