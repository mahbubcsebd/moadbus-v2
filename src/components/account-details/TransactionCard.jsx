'use client';

import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { ArrowDownLeft, ArrowUpRight, Clock } from 'lucide-react';

const TransactionCard = ({ transaction, index = 0 }) => {
  const isCredit = transaction.type === 'credit';
  const isPending = transaction.status === 'pending';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.03,
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      }}
      whileHover={{ scale: 1.002, y: -2 }}
      className="group bg-white rounded-xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition-all duration-300 border border-gray-100"
    >
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Left: Icon */}
        <div className="flex-shrink-0">
          <div
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${isCredit
                ? 'bg-gradient-to-br from-emerald-50 to-emerald-100 group-hover:from-emerald-100 group-hover:to-emerald-200'
                : 'bg-gradient-to-br from-rose-50 to-rose-100 group-hover:from-rose-100 group-hover:to-rose-200'
              }`}
          >
            {isCredit ? (
              <ArrowUpRight
                className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600"
                strokeWidth={2.5}
              />
            ) : (
              <ArrowDownLeft
                className="w-5 h-5 sm:w-6 sm:h-6 text-rose-600"
                strokeWidth={2.5}
              />
            )}
          </div>
        </div>

        {/* Middle: Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start sm:items-center gap-2 mb-1.5 flex-wrap">
            <p className="text-sm sm:text-base font-bold text-gray-900 truncate">
              {transaction.description}
            </p>
            {isPending && (
              <Badge
                variant="outline"
                className="flex-shrink-0 text-[10px] px-2 py-0.5 h-5 border-amber-300 bg-amber-50 text-amber-700 font-semibold"
              >
                <Clock className="w-3 h-3 mr-1" strokeWidth={2.5} />
                Pending
              </Badge>
            )}
          </div>

          {/* Date, time and category */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-gray-500">
            <span className="font-medium">{transaction.date}</span>
            <span className="text-gray-300">•</span>
            <span>{transaction.time}</span>
            {transaction.category && (
              <>
                <span className="text-gray-300 hidden sm:inline">•</span>
                <span className="hidden sm:inline px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md text-[11px] font-medium">
                  {transaction.category}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Right: Amount and balance */}
        <div className="flex-shrink-0 text-right">
          <p
            className={`text-base sm:text-lg font-bold mb-1 ${isCredit ? 'text-emerald-600' : 'text-rose-600'
              }`}
          >
            {isCredit ? '+' : '−'}{transaction.currency }
            {transaction.amount.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            })}
          </p>
          {/* <p className="text-[10px] sm:text-xs text-gray-500 font-medium">
            Balance: $
            {Math.abs(transaction.balance).toLocaleString('en-US', {
              minimumFractionDigits: 2,
            })}
          </p> */}
        </div>
      </div>
    </motion.div>
  );
};

export default TransactionCard;