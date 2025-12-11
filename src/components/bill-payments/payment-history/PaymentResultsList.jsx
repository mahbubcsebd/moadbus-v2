import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Eye, Loader2 } from 'lucide-react';
import { useState } from 'react';
// Assuming PaymentViewModal is correctly placed relative to this component
import PaymentViewModal from './PaymentViewModal';

const PaymentResultsList = ({ data = [], isSearching = false }) => {
  // State for modal management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const handleView = (payment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true); // Open the modal
  };

  const columns = [
    {
      accessorKey: 'paymentDetails',
      header: 'PAYMENT DETAILS',
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-sm font-semibold text-gray-900">
            <span>{row.original.payFrom}</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span>{row.original.payTo}</span>
          </div>
          <div className="text-xs text-gray-500">
            {row.original.date.split(' ')[0]}
            <span className="text-gray-400"> Ref: {row.original.reference}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'amount',
      header: () => <div className="text-right">AMOUNT</div>,
      cell: ({ row }) => (
        <div className="text-right font-semibold text-gray-900">
          {row.original.currency} {row.original.amount}
        </div>
      ),
    },
    {
      accessorKey: 'viewAction',
      header: () => <div className="text-right">VIEW</div>,
      cell: ({ row }) => (
        <div className="text-right flex justify-end">
          <button
            onClick={() => handleView(row.original)}
            className="text-sm text-gray-600 hover:text-blue-800 flex items-center justify-end space-x-1 transition-colors"
          >
            <Eye className="w-4 h-4 text-gray-400" /> <span>View</span>
          </button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: { pageSize: 5 },
    },
  });

  if (isSearching) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center flex items-center justify-center space-x-2">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
        <p className="text-gray-500">Searching payments...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* 🌟 Payment Details Modal 🌟 */}
      <PaymentViewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        paymentData={selectedPayment}
      />

      {data.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-lg shadow-sm border mt-3 border-gray-200 p-8  text-center">
          <p className="text-gray-500 ">No payments found matching your criteria.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-lg shadow-sm border mt-5 border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className={`px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider ${
                          header.id === 'amount' || header.id === 'viewAction'
                            ? 'text-right'
                            : 'text-left'
                        }`}
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
                      <td
                        key={cell.id}
                        className={`px-6 py-4 whitespace-nowrap text-sm ${
                          cell.column.id === 'amount' || cell.column.id === 'viewAction'
                            ? 'text-right'
                            : 'text-left'
                        }`}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3  mt-3">
            {data
              .filter(
                (row, index) =>
                  index >=
                    table.getState().pagination.pageIndex * table.getState().pagination.pageSize &&
                  index <
                    table.getState().pagination.pageIndex +
                      1 * table.getState().pagination.pageSize,
              )
              .map((payment, index) => (
                <motion.div
                  key={payment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
                >
                  {/* Row 1: From/To & Amount */}
                  <div className="flex justify-between items-start mb-3 border-b border-gray-100 pb-3">
                    <div className="flex-1 min-w-0 pr-2">
                      <div className="text-sm font-semibold text-gray-900 truncate flex items-center gap-1">
                        {payment.payFrom}
                        <ChevronRight className="w-3 h-3 text-gray-400 shrink-0" />
                        {payment.payTo}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {payment.date.split(' ')[0]} | Ref: {payment.reference}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-base font-semibold text-gray-900">
                        {payment.currency} {payment.amount}
                      </div>
                    </div>
                  </div>

                  {/* Row 2: View Button */}
                  <div className="flex justify-end items-center">
                    <button
                      onClick={() => handleView(payment)}
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1 transition-colors"
                    >
                      <Eye className="w-4 h-4" /> <span>View</span>
                    </button>
                  </div>
                </motion.div>
              ))}
          </div>
        </>
      )}
      {/* Pagination */}
      {data.length > table.getState().pagination.pageSize && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-gray-500">
            {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}-
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              data.length,
            )}{' '}
            of {data.length}
          </p>

          <div className="flex items-center gap-1">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-2 rounded-lg bg-gray-100 text-gray-700 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="px-3 py-1.5 text-xs font-bold bg-gray-100 rounded-lg">
              {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
            </div>

            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-2 rounded-lg bg-gray-100 text-gray-700 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default PaymentResultsList;
