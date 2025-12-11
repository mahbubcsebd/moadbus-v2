import { deleteSchedulePayment } from '@/api/endpoints';
import { Button } from '@/components/ui/button';
import { usePopup } from '@/context/PopupContext';
import { useSuccessModalStore } from '@/store/successModalStore';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function ScheduleTransferView({
  isOpen,
  onClose,
  formData,
  onConfirm,
  isSubmitting,
  feesData,
  setFeesData,
  heading,
}) {
  const { showMsgPopup } = usePopup();
  const { showSuccess } = useSuccessModalStore.getState();

  const excludeKeys = ['id'];
  const labelMap = {
    desc: 'Description',
    nickName: 'Beneficiary Nickname',
    fromAc: 'From Account',
    toAc: 'To Account',
    routingNo: 'Routing Number',
  };

  const handleCancelPayment = async () => {
    try {
      const payload = {
        code: formData.id,
        from: formData.fromAc,
        to: formData.toAc,
      };

      const res = await deleteSchedulePayment(payload);

      if (res?.rs?.status === 'success') {
        showSuccess(res.rs, 'Cancelled the Scheduled Transfer');

        // onConfirm call kora hocche jodi parent component e kono logic thake
        if (onConfirm) {
          await onConfirm();
        }

        onClose();
      } else {
        showMsgPopup('error', res.rs.msg);
        alert('Unable to cancel the schedule');
      }
    } catch (error) {
      console.error('Cancel Error:', error);
      alert('Something went wrong!');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-lg w-full p-0 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="relative p-4 border-b border-gray-200">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Scheduled Transfers
          </DialogTitle>
          <button
            onClick={onClose}
            className="absolute text-gray-400 right-4 top-4 hover:text-gray-600"
          />
        </DialogHeader>

        <div className="p-4 space-y-2">
          {Object.entries(formData)
            .filter(([key]) => !excludeKeys.includes(key))
            .map(([key, value]) => {
              const label =
                labelMap[key] ||
                key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());

              return (
                <div key={key} className="flex justify-between gap-10 pb-1 text-sm">
                  <span className="text-left text-gray-500 whitespace-nowrap">{label}</span>
                  <span className="text-right text-gray-900">{value || '-'}</span>
                </div>
              );
            })}
        </div>

        <DialogFooter className="flex gap-3 p-4 border-t border-gray-200">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            OK
          </Button>
          {formData.status != 'Cancelled' && formData.status != 'Expired' && (
            <Button
              type="button"
              onClick={handleCancelPayment}
              className="flex-1 text-white bg-primary hover:bg-primary"
              loading={isSubmitting}
            >
              Cancel
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
