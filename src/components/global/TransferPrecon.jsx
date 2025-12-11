import { getCalculatedFees } from '@/api/endpoints';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useEffect } from 'react';

const TransferPrecon = ({
  isOpen,
  onClose,
  formData,
  onConfirm,
  isSubmitting,
  feesData,
  setFeesData,
  heading,
  skipCalculateFees,
}) => {
  useEffect(() => {
    if (!isOpen || !formData) return;
    if (skipCalculateFees) return;

    const calculateFees = async () => {
      try {
        const payload = {
          from: formData.fromAccount,
          to: formData.toAccount,
          amount: formData.amount ? formData.amount : '0',
          currencyCode: formData.currency || 'USD',
          code: formData.code,
          payNow: formData.payNow ? formData.payNow : 'N',
        };

        if (formData.toCurrencyCode) payload.toCurrencyCode = formData.toCurrencyCode;
        if (formData.accNo) payload.accNo = formData.accNo;
        const res = await getCalculatedFees(payload);

        const data = res.rs;
        if (data) {
          setFeesData({
            comm: data.c, // Commission
            stamp: data.s, // Stamp
            tax: data.ta, // Tax
            tca: data.ca, // TCA
          });
        }
      } catch (err) {
        console.error('Fee calculation failed', err);
      }
    };

    calculateFees();
  }, [isOpen, formData, skipCalculateFees]);

  if (!formData) return null;

  const filteredEntries = Object.entries(formData).filter(
    ([key, value]) =>
      value !== null &&
      value !== undefined &&
      !(typeof value === 'string' && value.trim() === '') &&
      key !== 'payNow' &&
      key !== 'code' &&
      key !== 'toCurrencyCode' &&
      key !== 'action' &&
      key !== 'binding',
  );

  // Calculate total fees
  const totalFees =
    feesData && feesData.comm && feesData.stamp && feesData.tax && feesData.tca
      ? Number(feesData.comm.replace(/[^\d.]/g, '')) +
        Number(feesData.stamp.replace(/[^\d.]/g, '')) +
        Number(feesData.tax.replace(/[^\d.]/g, '')) +
        Number(feesData.tca.replace(/[^\d.]/g, ''))
      : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-lg w-full p-0 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="p-4 border-b border-gray-200 relative">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            {heading ?? 'Review Transfer Details'}
          </DialogTitle>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
          />
        </DialogHeader>

        <div className="p-4 space-y-2">
          {filteredEntries.map(([key, value]) => (
            <div key={key} className="flex justify-between pb-1 text-sm gap-10">
              <span className="text-gray-500 capitalize text-left whitespace-nowrap">
                {formatLabel(key)}
              </span>
              <span className="text-gray-900 text-right">{String(value)}</span>
            </div>
          ))}

          {feesData && (
            <div className="mt-4 p-2 border-t border-gray-200 text-sm space-y-1">
              <div className="flex justify-between pb-1 text-sm">
                <span className="text-gray-500 capitalize">Commission</span>
                <span className="text-gray-900">{feesData.comm}</span>
              </div>
              <div className="flex justify-between pb-1 text-sm">
                <span className="text-gray-500 capitalize">Stamp</span>
                <span className="text-gray-900">{feesData.stamp}</span>
              </div>
              <div className="flex justify-between pb-1 text-sm">
                <span className="text-gray-500 capitalize">Tax Fee</span>
                <span className="text-gray-900">{feesData.tax}</span>
              </div>
              <div className="flex justify-between pb-1 text-sm">
                <span className="text-gray-500 capitalize">TCA</span>
                <span className="text-gray-900">{feesData.tca}</span>
              </div>
              <div className="flex justify-between pb-1 text-sm">
                <span className="text-gray-500 capitalize">Total Fees</span>
                <span className="text-gray-900"> USD {totalFees.toFixed(2)}</span>
              </div>
            </div>
          )}

          {filteredEntries.length === 0 && (
            <p className="text-center text-gray-500">No details to review.</p>
          )}
        </div>

        <DialogFooter className="p-4 border-t border-gray-200 flex gap-3">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            Change
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            className="flex-1 bg-primary hover:bg-primary text-white"
            loading={isSubmitting}
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

function formatLabel(text) {
  return text.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());
}

export default TransferPrecon;
