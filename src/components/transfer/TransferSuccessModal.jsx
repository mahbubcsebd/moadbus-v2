'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { Check, Printer } from 'lucide-react';
import { Button } from '../ui/button';

const TransferSuccessModal = ({ isOpen, onClose, transferData }) => {
  if (!transferData) return null;
  const confirmationNumber = '222028032';

  const getFixedValue = (value) => {
    const safeValue = Number(value);
    return isNaN(safeValue) ? 'N/A' : safeValue.toFixed(2);
  };

  // Data structures using the safe helper
  const displayData = [
    { label: 'Confirmation Number', value: confirmationNumber },
    { label: 'From Account', value: transferData.fromAccountLabel },
    { label: 'To Account', value: transferData.toAccountLabel },
    { label: 'Description', value: transferData.description },
    { label: 'Amount', value: `USD ${getFixedValue(transferData.amount)}` },
  ];

  const feesData = [
    {
      label: 'Commission',
      value: `USD ${getFixedValue(transferData.commission)}`,
    },
    { label: 'Stamp', value: `USD ${getFixedValue(transferData.stamp)}` },
    { label: 'Tax Fee', value: `USD ${getFixedValue(transferData.taxFee)}` },
    { label: 'TCA', value: `USD ${getFixedValue(transferData.tca)}` },
    {
      label: 'Total Fees',
      value: `USD ${getFixedValue(transferData.totalFees)}`,
    },
  ];

  const handlePrint = () => {
    console.log('Printing transfer confirmation...');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-md w-full p-0 gap-0 max-h-[90vh] overflow-y-auto">
        <div className="p-6 text-center sm:p-8">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-green-100 rounded-full"
          >
            <Check className="w-8 h-8 text-green-600" strokeWidth={3} />
          </motion.div>

          <DialogTitle className="max-w-xs pb-3 mx-auto mb-4 text-xl font-bold text-gray-900 border-b sm:text-2xl">
            Transfer Between My Accounts At Moadbus Bank
          </DialogTitle>

          {/* Main Details */}
          <div className="mb-6 space-y-3 text-sm font-semibold text-gray-700">
            {displayData.map((item, index) => (
              <div key={index} className="flex justify-between">
                <span className="font-medium text-gray-500">{item.label}</span>
                <span className="text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>

          {/* Fees Details */}
          <div className="pt-4 mb-6 space-y-2 text-sm text-gray-700 border-t">
            {feesData.map((item, index) => (
              <div key={index} className="flex justify-between">
                <span className="font-medium text-gray-500">{item.label}</span>
                <span className="text-gray-900">{item.value}</span>
              </div>
            ))}
            <div className="flex justify-between pt-2 text-base font-bold border-t">
              <span className="text-gray-800">TOTAL COST</span>
              <span className="text-gray-900">{getFixedValue(transferData.totalAmount)}</span>
            </div>
          </div>

          {/* Done Button and Print Icon */}
          <div className="flex items-center justify-center mt-6 space-x-4">
            <Button
              type="button"
              onClick={onClose}
              variant="primary"
              className="w-40 text-white bg-primary hover:bg-primary"
            >
              Done
            </Button>
            <button onClick={handlePrint} className="text-gray-400 hover:text-blue-600">
              <Printer className="w-6 h-6" />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransferSuccessModal;
