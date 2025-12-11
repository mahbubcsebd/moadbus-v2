import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Mail } from 'lucide-react';
import { Button } from '../../ui/button';

const PaymentViewModal = ({ isOpen, onClose, paymentData }) => {
  const data = paymentData || {};

  const totalFees = data.totalFees;

  const handlePrint = () => {
    console.log('Printing confirmation for:', data.confirmationNumber || data.id);
  };

  const handleEmail = () => {
    console.log('Emailing confirmation for:', data.confirmationNumber || data.id);
    // Add actual email logic here
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-md w-full p-0 gap-0">
        <DialogHeader className="p-6 border-b border-gray-200 relative text-center">
          <DialogTitle className="text-xl font-semibold text-gray-900 mx-auto">
            Bill Payment
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-4">
          {/* --- Payment Details Grid --- */}
          <div className="space-y-3 text-sm">
            {/* Confirmation Number */}
            <div className="flex justify-between pb-1">
              <span className="text-gray-500 font-medium">Confirmation Number</span>
              <span className="text-gray-900 font-semibold">
                {data.confirmationNumber || data.id}
              </span>
            </div>

            {/* Pay From */}
            <div className="flex justify-between pb-1">
              <span className="text-gray-500 font-medium">Pay From</span>
              <span className="text-gray-900 font-semibold">{data.payFrom || ''}</span>
            </div>

            {/* Bill Template Name (Assuming this comes from payTo) */}
            <div className="flex justify-between pb-1">
              <span className="text-gray-500 font-medium">Bill Template Name</span>
              <span className="text-gray-900 font-semibold">{data.templateName || ''}</span>
            </div>

            {/* Biller Name */}
            <div className="flex justify-between pb-1">
              <span className="text-gray-500 font-medium">Biller Name</span>
              <span className="text-gray-900 font-semibold">{data.billerName || ''}</span>
            </div>

            {/* Reference Number
            <div className="flex justify-between pb-1">
              <span className="text-gray-500 font-medium">
                Reference Number
              </span>
              <span className="text-gray-900 font-semibold">
                {data.reference || ''}
              </span>
            </div>

            {/* Amount */}
            <div className="flex justify-between pt-2 border-t border-gray-200">
              <span className="text-gray-500 font-medium">Amount</span>
              <span className="text-gray-900 font-semibold">
                {data.currency || ''} {data.amount ? data.amount : ''}
              </span>
            </div>

            {/* Transaction Date */}
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">Transaction Date</span>
              <span className="text-gray-900 font-semibold">
                {data.date ? data.date.split(' ')[0] : ''}
              </span>
            </div>

            {/* Total Fees */}
            <div className="flex justify-between pt-2 border-t border-gray-200">
              <span className="text-gray-500 font-medium">Total Fees</span>
              <span className="text-gray-900 font-semibold">USD {totalFees}</span>
            </div>
          </div>

          {/* --- Done Button and Actions --- */}
          <div className="pt-4 space-y-4">
            <Button
              variant="primary"
              onClick={onClose}
              size="default"
              className="w-full py-3 bg-primary hover:bg-primary text-white font-semibold text-base shadow-md"
            >
              Done
            </Button>

            {/* Print/Email Icons */}
            <div className="flex justify-end space-x-4 text-gray-500">
              <button
                onClick={handleEmail}
                title="Email Confirmation"
                className="hover:text-blue-600 transition-colors"
              >
                <Mail className="w-6 h-6" />
              </button>
              {/* <button
                onClick={handlePrint}
                title="Print Confirmation"
                className="hover:text-blue-600 transition-colors"
              >
                <Printer className="w-6 h-6" />
              </button> */}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentViewModal;
