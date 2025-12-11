'use client';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AnimatePresence, motion } from 'framer-motion';

export default function TransactionDetailsModal({ transaction, onClose }) {
  if (!transaction) return null;

  const totalFees =
    transaction.fee1 +
    transaction.fee2 +
    transaction.fee3 +
    transaction.fee4 +
    transaction.fee5 +
    transaction.fee6;

  return (
    <AnimatePresence>
      <Dialog open={!!transaction} onOpenChange={onClose}>
        <DialogContent className="max-w-md p-0 overflow-hidden rounded-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            <DialogHeader className="p-5 border-b border-gray-100">
              <DialogTitle className="text-xl font-semibold text-gray-800">
                Transaction Details
              </DialogTitle>
            </DialogHeader>

            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <DetailRow label="Confirmation Number" value={transaction.id} />
              <DetailRow
                label="From Account"
                value={`${transaction.fromAccountType} ${transaction.fromAccount}`}
              />
              <DetailRow
                label="To Account"
                value={`${transaction.toAccountType} ${transaction.toAccount}`}
              />
              <DetailRow label="Description" value={transaction.description} />
              <DetailRow
                label="Amount"
                value={`${transaction.fromCurrency} ${transaction.amount.toFixed(2)}`}
              />
              <DetailRow label="Transaction Date" value={transaction.date} />
              {totalFees > 0 && (
                <DetailRow
                  label="Total Fees"
                  value={`${transaction.fromCurrency} ${totalFees.toFixed(2)}`}
                />
              )}
              <DetailRow label="Status" value={transaction.status} />
            </div>

            <DialogFooter className="flex items-center justify-between p-6 border-t bg-gray-50">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-primary text-white font-semibold rounded-lg transition-colors"
              >
                Done
              </button>
            </DialogFooter>
          </motion.div>
        </DialogContent>
      </Dialog>
    </AnimatePresence>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-start justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm font-medium text-gray-500">{label}</span>
      <span className="text-sm font-semibold text-right text-gray-900">{value}</span>
    </div>
  );
}
