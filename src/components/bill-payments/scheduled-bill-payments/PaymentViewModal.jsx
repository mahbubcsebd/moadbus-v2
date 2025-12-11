import { cancelScheduledBillPayments } from '@/api/endpoints';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { usePopup } from '@/context/PopupContext';
import { useAccountsStore } from '@/store/accountsStore';
import { Button } from '../../ui/button';

const PaymentViewModal = ({ isOpen, onClose, paymentData, action, updateList }) => {
  let data = paymentData ? paymentData : [];
  const { showMsgPopup, showConfirmPopup } = usePopup();
  const getFrequencyLabel = (id) => {
    const tn = useAccountsStore.getState().tn;
    if (!tn?.recur) return '';

    const frequency = tn.recur.split('|').find((item) => item.split('#')[0] === id);

    return frequency.split('#')[1];
  };

  const handleDelete = async () => {
    try {
      let payload = {
        code: paymentData.code,
        from: paymentData.payFrom,
        to: paymentData.payTo,
      };
      let result = await cancelScheduledBillPayments(payload);
      showMsgPopup(result.rs.status, result.rs.ec.split(',')[1]);
      updateList();
      onClose();
    } catch (e) {
      console.error('Error cancel bill Payments:', e);
    }
  };

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
            {action === 'Cancel' && 'Delete'} Scheduled Bill Payment
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-4">
          {/* --- Payment Details Grid --- */}
          <div className="space-y-3 text-sm">
            {/* Pay From */}
            <div className="flex justify-between pb-1">
              <span className="text-gray-500 font-medium">Pay From</span>
              <span className="text-gray-900 font-semibold">{data.payFrom || ''}</span>
            </div>

            {/* Bill Template Name (Assuming this comes from payTo) */}
            <div className="flex justify-between pb-1">
              <span className="text-gray-500 font-medium">Bill Template Name</span>
              <span className="text-gray-900 font-semibold">{data.payTo || ''}</span>
            </div>

            {/* Biller Name */}
            <div className="flex justify-between pb-1">
              <span className="text-gray-500 font-medium">Biller Name</span>
              <span className="text-gray-900 font-semibold">{data.billerName || ''}</span>
            </div>

            {/* Reference Number*/}
            <div className="flex justify-between pb-1">
              <span className="text-gray-500 font-medium">Reference Number</span>
              <span className="text-gray-900 font-semibold">{data.referenceNo || ''}</span>
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
            {data.until && (
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">When</span>
                <span className="text-gray-900 font-semibold">
                  {data.until ? data.until.split(' ')[0] : ''}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">Frequency</span>
              <span className="text-gray-900 font-semibold">
                {data.frequency && getFrequencyLabel(data.frequency)}
              </span>
            </div>
          </div>
          {/* --- Done Button and Actions --- */}
          <div className="pt-4 space-y-4">
            {action === 'View' && (
              <Button
                variant="primary"
                onClick={onClose}
                size="default"
                className="w-full py-3 bg-primary hover:bg-primary text-white font-semibold text-base shadow-md"
              >
                OK
              </Button>
            )}
            {action === 'Cancel' && (
              <div className="flex gap-2 justify-center">
                <Button
                  variant="primary"
                  onClick={onClose}
                  size="default"
                  className="   py-3 bg-primary hover:bg-primary text-white font-semibold text-base shadow-md"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleDelete}
                  size="default"
                  className="  py-3 bg-primary hover:bg-primary text-white font-semibold text-base shadow-md"
                >
                  Delete
                </Button>
              </div>
            )}

            {/* Print/Email Icons */}
            <div className="flex justify-end space-x-4 text-gray-500">
              {/*<button
                onClick={handleEmail}
                title="Email Confirmation"
                className="hover:text-blue-600 transition-colors"
              >
                <Mail className="w-6 h-6" />
              </button>
              <button
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
