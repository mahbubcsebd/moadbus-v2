import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo } from 'react';

const TransactionTable = ({ transactions }) => {
  // 1. Define Columns
  const columns = useMemo(
    () => [
      {
        accessorKey: 'date',
        header: 'Date',
        cell: ({ getValue }) => <span className="text-gray-600">{getValue()}</span>,
      },
      {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ getValue }) => <span className="font-medium text-gray-700">{getValue()}</span>,
      },
      {
        accessorKey: 'amount', // We use raw amount, type logic handled in cell
        header: () => <div className="text-right">Debit</div>,
        cell: ({ row }) => {
          const isDebit = row.original.type === 'Debit' || row.original.type === 'D';
          return (
            <div className="text-right">
              {isDebit ? (
                <span className="font-semibold text-red-500">{row.original.amount}</span>
              ) : (
                <span className="text-gray-300">-</span>
              )}
            </div>
          );
        },
      },
      {
        id: 'credit', // Virtual column for Credit
        header: () => <div className="text-right">Credit</div>,
        cell: ({ row }) => {
          const isCredit = row.original.type === 'Credit' || row.original.type === 'C';
          return (
            <div className="text-right">
              {isCredit ? (
                <span className="font-semibold text-green-600">{row.original.amount}</span>
              ) : (
                <span className="text-gray-300">-</span>
              )}
            </div>
          );
        },
      },
    ],
    [],
  );

  // 2. Initialize Table
  const table = useReactTable({
    data: transactions,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10, // 10 items per page
      },
    },
  });

  if (!transactions || transactions.length === 0) {
    return <div className="p-8 text-center text-gray-500">No transactions found.</div>;
  }

  return (
    <div className="space-y-4">
      {/* --- DESKTOP VIEW (Table) --- */}
      <div className="hidden overflow-hidden border border-gray-200 rounded-lg md:block">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-500 uppercase"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
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
                transition={{ delay: index * 0.05 }}
                className="transition-colors hover:bg-primary/5/30"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4 text-sm whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- MOBILE VIEW (Cards) --- */}
      <div className="space-y-3 md:hidden">
        {table.getRowModel().rows.map((row, index) => {
          const txn = row.original;
          const isDebit = txn.type === 'Debit' || txn.type === 'D';

          return (
            <motion.div
              key={row.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
            >
              <div className="flex justify-between mb-2">
                <span className="text-xs font-medium text-gray-500">{txn.date}</span>
                <span
                  className={`text-sm font-bold ${isDebit ? 'text-red-500' : 'text-green-600'}`}
                >
                  {isDebit ? '-' : '+'} {txn.amount}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-800 line-clamp-2">{txn.description}</p>
                <span
                  className={`px-2 py-1 text-[10px] rounded-full ${
                    isDebit ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                  }`}
                >
                  {isDebit ? 'Debit' : 'Credit'}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* --- PAGINATION CONTROLS --- */}
      {table.getPageCount() > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="text-sm text-gray-500">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="flex items-center justify-center w-8 h-8 text-gray-600 transition-colors bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="flex items-center justify-center w-8 h-8 text-white transition-colors bg-primary rounded hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionTable;
