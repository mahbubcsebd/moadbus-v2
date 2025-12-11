import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '../ui/button';

const AddNumberConfirmModal = ({ isOpen, onClose, formData, onConfirm, loading }) => {
  const data = formData || {};

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-md w-full p-0 gap-0">
        <DialogHeader className="p-6 border-b border-gray-200">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Confirm Mobile Number
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          <div className="p-3 mb-4 text-blue-800 rounded bg-blue-50">
            Please review the details below before adding.
          </div>

          <div className="space-y-3">
            <div className="flex justify-between pb-2 border-b">
              <span className="text-gray-500">Nickname</span>
              <span className="font-medium text-gray-900">{data.nickname}</span>
            </div>
            <div className="flex justify-between pb-2 border-b">
              <span className="text-gray-500">Mobile Carrier</span>
              <span className="font-medium text-gray-900">{data.mobileCarrier}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Mobile Number</span>
              <span className="font-medium text-gray-900">{data.mobileNumber}</span>
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 border-t border-gray-200">
          <div className="flex w-full gap-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="w-full text-blue-600 border-blue-600"
            >
              Edit / Cancel
            </Button>
            <Button
              onClick={onConfirm}
              loading={loading}
              className="w-full text-white bg-primary hover:bg-primary"
            >
              Confirm & Add
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddNumberConfirmModal;
