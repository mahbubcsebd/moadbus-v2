import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Info, X } from 'lucide-react';
import { Button } from '../ui/button';

const calculateFees = (amount) => {
  const safeAmount = Number(amount) || 0;

  const commission = safeAmount * 0.01;
  const stamp = safeAmount * 0.02;
  const taxFee = 1.0;
  const tca = 1.0;
  const totalFees = commission + stamp + taxFee + tca;
  const totalAmount = safeAmount + totalFees;

  return { commission, stamp, taxFee, tca, totalFees, totalAmount };
};

const TransferConfirmationModal = ({ isOpen, onClose, transferData, onConfirm, isSubmitting }) => {
  if (!transferData) return null;

  const fees = calculateFees(Number(transferData.amount));

  const displayData = [
    { label: 'From Account', value: transferData.fromAccountLabel },
    { label: 'To Account', value: transferData.toAccountLabel },
    { label: 'Description', value: transferData.description },
    { label: 'Amount', value: `USD ${Number(transferData.amount).toFixed(2)}` },
    {
      label: 'When',
      value: transferData.transferType === 'immediate' ? 'Immediate' : 'Scheduled',
    },
    { label: 'Commission', value: `USD ${fees.commission.toFixed(2)}` },
    { label: 'Stamp', value: `USD ${fees.stamp.toFixed(2)}` },
    { label: 'Tax Fee', value: `USD ${fees.taxFee.toFixed(2)}` },
    { label: 'TCA', value: `USD ${fees.tca.toFixed(2)}` },
    { label: 'Total Fees', value: `USD ${fees.totalFees.toFixed(2)}` },
  ];

  const handleConfirm = () => {
    onConfirm({ ...transferData, ...fees });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-md w-full p-0 gap-0 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="relative p-6 border-b border-gray-200">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Transfer Between My Accounts At Moadbus Bank
          </DialogTitle>
          <button
            onClick={onClose}
            className="absolute text-gray-400 transition-colors right-4 top-4 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </DialogHeader>

        <div className="p-6 space-y-4">
          {displayData.map((item, index) => (
            <div
              key={index}
              className={`flex justify-between pb-1 text-sm ${
                index >= 3 ? 'font-medium' : 'font-semibold'
              }`}
            >
              <span className="text-gray-500">{item.label}</span>
              <span className="text-gray-900">{item.value}</span>
            </div>
          ))}

          {/* Total Fees */}
          <div className="flex justify-between pt-4 text-base font-bold border-t border-gray-200">
            <span className="text-gray-800">TOTAL COST</span>
            <span className="text-gray-900">USD {fees.totalAmount.toFixed(2)}</span>
          </div>

          {/* Review Box */}
          <div className="flex p-4 mt-4 border-l-4 border-primary rounded-lg bg-primary/5">
            <Info className="w-5 h-5 mt-1 mr-3 text-primary" />
            <p className="text-sm text-gray-700">
              Please review your transfer details carefully. By confirming, you authorize MCB Bank
              Banking to process this transfer according to the details specified above.
            </p>
          </div>
        </div>

        <DialogFooter className="p-6 border-t border-gray-200">
          <Button
            type="button"
            onClick={handleConfirm}
            variant="primary"
            loading={isSubmitting}
            className="w-full text-sm text-white bg-primary sm:w-auto hover:bg-primary"
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TransferConfirmationModal;
