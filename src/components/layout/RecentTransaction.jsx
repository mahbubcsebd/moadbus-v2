import { useTransactionStore } from '@/store/RecentTransactionStore';
import { useMetaDataStore } from '@/store/useMetaDataStore';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { motion } from 'framer-motion';
import {
  ArrowDownLeft,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Search,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import TransactionDetailsModal from './TransactionDetailsModal';

const columnHelper = createColumnHelper();

export default function RecentTransactions() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [globalFilter, setGlobalFilter] = useState('');
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const {
    transactions,
    loading,
    error,
    fetchTransactions,
    selectedTransaction,
    setSelectedTransaction,
  } = useTransactionStore();

  const transferTypes = useMetaDataStore((state) => state.transferTypes) || [];

  // Initial load
  useEffect(() => {
    const loadInitialData = async () => {
      await fetchTransactions();
      setIsInitialLoading(false);
    };

    loadInitialData();
  }, [fetchTransactions]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setGlobalFilter(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const getTransferLabel = (code) => {
    const item = transferTypes.find((t) => t.value === code);
    return item ? item.label : code;
  };

  // Handle filter click
  const handleFilterClick = async (type) => {
    setActiveFilter(type.value);
    await fetchTransactions({ type: type.value });
  };

  // Show all transactions
  const handleShowAll = async () => {
    setActiveFilter('all');
    await fetchTransactions();
  };

  // Filtered data with search
  const filteredData = useMemo(() => {
    let data = transactions;

    if (globalFilter) {
      data = data.filter(
        (transaction) =>
          transaction.description.toLowerCase().includes(globalFilter.toLowerCase()) ||
          transaction.fromAccount.includes(globalFilter) ||
          transaction.toAccount.includes(globalFilter),
      );
    }

    return data;
  }, [transactions, globalFilter]);

  const columns = useMemo(
    () => [
      columnHelper.accessor('description', {
        header: 'TRANSACTION',
        cell: (info) => {
          const isCredit = info.row.original.transactionCode === 'TMA01';
          return (
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-200 ${
                  isCredit
                    ? 'bg-linear-to-br from-teal-50 to-emerald-50'
                    : 'bg-linear-to-br from-red-50 to-primary/5'
                }`}
              >
                {isCredit ? (
                  <ArrowDownLeft className="w-4 h-4 text-teal-600" />
                ) : (
                  <ArrowUpRight className="w-4 h-4 text-red-600" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{info.getValue()}</p>
              </div>
            </div>
          );
        },
      }),
      columnHelper.accessor('transactionCode', {
        header: 'CATEGORY',
        cell: (info) => (
          <div>
            <p className="text-sm font-medium text-gray-700">{getTransferLabel(info.getValue())}</p>
            <p className="text-xs text-gray-400">****{info.row.original.fromAccount.slice(-4)}</p>
          </div>
        ),
      }),
      columnHelper.accessor('date', {
        header: 'DATE',
        cell: (info) => <p className="text-sm font-medium text-gray-600">{info.getValue()}</p>,
      }),
      columnHelper.accessor('amount', {
        header: 'AMOUNT',
        cell: (info) => {
          const amt = info.getValue();
          const currency = info.row.original.fromCurrency;
          const isCredit = info.row.original.transactionCode === 'TMA01';

          return (
            <div className="text-right">
              <p
                className={`font-bold text-sm transition-colors duration-200 ${
                  isCredit ? 'text-teal-600' : 'text-red-600'
                }`}
              >
                {isCredit ? '+' : '-'}
                {currency} {amt.toFixed(2)}
              </p>
            </div>
          );
        },
      }),
    ],
    [transferTypes, getTransferLabel],
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  // Show full-page loader only on initial load
  if (isInitialLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 mb-4"
        >
          <RefreshCw className="w-full h-full text-primary" />
        </motion.div>
        <p className="text-gray-500">Loading transactions...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="py-8 text-center">
        <div className="inline-block px-4 py-3 text-red-700 border border-red-200 rounded-lg bg-red-50">
          {error}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {/* Section Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-900">Recent Transactions</h2>
          </div>
          <Link to="transfers/transfers-history">
            <motion.button
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/90 transition-colors duration-200 px-3 py-1.5 rounded-lg hover:bg-primary/5"
            >
              View All
              <ChevronRight className="w-3.5 h-3.5" />
            </motion.button>
          </Link>
        </div>

        {/* Desktop filter */}
        <div className="hidden p-4 space-y-3 bg-white border border-gray-200 rounded-xl lg:block">
          <div className="relative">
            <Search className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 pr-4 text-sm transition-all duration-200 border border-gray-200 rounded-lg pl-9 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleShowAll}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                activeFilter === 'all'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {transferTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => handleFilterClick(type)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  activeFilter === type.value
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile filter */}
        <div className="flex flex-col gap-2 lg:hidden">
          {/* Search Row (Always Single Line) */}
          <div className="flex items-center gap-2 pb-1 overflow-x-auto scrollbar-hide">
            <div className="relative w-full shrink-0">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 pl-8 pr-3 text-xs transition-all duration-200 border border-gray-200 rounded-md focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Filter Chips in 2-Column Wrapping Layout */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleShowAll}
              className={`px-3 py-2 rounded-md text-xs font-normal transition-all duration-200 text-center
                ${
                  activeFilter === 'all'
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                }
              `}
            >
              All
            </button>
            {transferTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => handleFilterClick(type)}
                className={`px-3 py-2 rounded-md text-xs font-normal transition-all duration-200 text-center
                  ${
                    activeFilter === type.value
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }
                `}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading indicator for data section */}
        {loading && (
          <div className="flex justify-center py-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-8 h-8"
            >
              <RefreshCw className="w-full h-full text-primary" />
            </motion.div>
          </div>
        )}

        {/* Mobile Card View */}
        <div className={`md:hidden space-y-2 ${loading ? 'opacity-50' : ''}`}>
          {table.getRowModel().rows.length === 0 && !loading ? (
            <div className="p-8 text-center bg-white border border-gray-200 rounded-xl">
              <Search className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p className="text-sm font-semibold text-gray-500">No transactions found</p>
              <p className="mt-1 text-xs text-gray-400">Try adjusting your filters</p>
            </div>
          ) : (
            table.getRowModel().rows.map((row, index) => {
              const transaction = row.original;
              const isCredit = transaction.transactionCode === 'TMA01';

              return (
                <motion.div
                  key={row.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03, duration: 0.2 }}
                  onClick={() => setSelectedTransaction(transaction)}
                  className="bg-white rounded-xl border border-gray-200 p-4 hover:bg-primary/5 transition-all duration-200 cursor-pointer active:scale-[0.98]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start flex-1 min-w-0 gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isCredit
                            ? 'bg-gradient-to-br from-teal-50 to-emerald-50'
                            : 'bg-gradient-to-br from-red-50 to-primary/5'
                        }`}
                      >
                        {isCredit ? (
                          <ArrowDownLeft className="w-4 h-4 text-teal-600" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4 text-red-600" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate mb-0.5">
                          {transaction.description}
                        </p>
                        <p className="text-xs text-gray-500">
                          {getTransferLabel(transaction.transactionCode)} • ****
                          {transaction.fromAccount.slice(-4)}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">{transaction.date}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p
                        className={`font-bold text-base ${
                          isCredit ? 'text-teal-600' : 'text-red-600'
                        }`}
                      >
                        {isCredit ? '+' : '-'}
                        {transaction.fromCurrency} {transaction.amount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}

          {/* Mobile Pagination */}
          {filteredData.length > table.getState().pagination.pageSize && !loading && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-gray-500">
                {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}-
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) *
                    table.getState().pagination.pageSize,
                  filteredData.length,
                )}{' '}
                of {filteredData.length}
              </p>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    table.getCanPreviousPage()
                      ? 'bg-gray-100 text-gray-700 active:scale-95'
                      : 'text-gray-300 cursor-not-allowed'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="px-3 py-1.5 text-xs font-bold text-gray-700 bg-gray-100 rounded-lg">
                  {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
                </div>

                <button
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    table.getCanNextPage()
                      ? 'bg-gray-100 text-gray-700 active:scale-95'
                      : 'text-gray-300 cursor-not-allowed'
                  }`}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Desktop Table - Simple & Clean */}
        <div
          className={`hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm ${
            loading ? 'opacity-50' : ''
          }`}
        >
          <div className="overflow-x-auto overflow-y-hidden">
            <table className="w-full">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="border-b border-gray-200 bg-gray-50">
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-6 py-3 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-gray-100">
                {table.getRowModel().rows.length === 0 && !loading ? (
                  <tr>
                    <td colSpan={columns.length} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <Search className="w-12 h-12 mb-3 opacity-50" />
                        <p className="font-medium">No transactions found</p>
                        <p className="mt-1 text-sm">Try adjusting your search or filter</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map((row, index) => (
                    <tr
                      key={row.id}
                      style={{
                        opacity: 0,
                        animation: `fadeIn 0.2s ease-out ${index * 0.02}s forwards`,
                      }}
                      onClick={() => setSelectedTransaction(row.original)}
                      className="transition-colors duration-200 cursor-pointer hover:bg-primary/5"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* pagination */}
          {filteredData.length > table.getState().pagination.pageSize && !loading && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="text-xs text-gray-600">
                Showing{' '}
                <span className="font-semibold text-gray-900">
                  {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
                </span>{' '}
                -{' '}
                <span className="font-semibold text-gray-900">
                  {Math.min(
                    (table.getState().pagination.pageIndex + 1) *
                      table.getState().pagination.pageSize,
                    filteredData.length,
                  )}
                </span>{' '}
                of <span className="font-semibold text-gray-900">{filteredData.length}</span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    table.getCanPreviousPage()
                      ? 'hover:bg-gray-200 text-gray-700'
                      : 'text-gray-300 cursor-not-allowed'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="items-center hidden gap-1 sm:flex">
                  {Array.from({ length: table.getPageCount() }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => table.setPageIndex(i)}
                      className={`min-w-8 h-8 px-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                        table.getState().pagination.pageIndex === i
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <div className="px-3 py-1 text-xs font-medium text-gray-700 sm:hidden">
                  {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
                </div>

                <button
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    table.getCanNextPage()
                      ? 'hover:bg-gray-200 text-gray-700'
                      : 'text-gray-300 cursor-not-allowed'
                  }`}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(4px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <TransactionDetailsModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
    </>
  );
}
