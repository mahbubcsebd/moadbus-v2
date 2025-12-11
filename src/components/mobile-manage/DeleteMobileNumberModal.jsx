import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';

const DeleteMobileNumberModal = ({ isOpen, onClose, numberData, onConfirm }) => {
  const data = numberData || {};
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm(data.id, data);
    setLoading(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-md w-full p-0 gap-0">
        <DialogHeader className="p-6 border-b border-gray-200">
          <DialogTitle>Delete Mobile Number</DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-5 text-sm">
          <p className="flex items-center justify-center space-x-2 font-medium text-center text-red-600">
            <Trash2 className="w-5 h-5" />
            <span>Are you sure you want to delete this number?</span>
          </p>

          <div className="pt-4 space-y-3 border-t">
            <div className="flex justify-between pb-2 border-b">
              <span className="text-gray-500">Nickname</span>
              <span className="font-medium text-gray-900">{data.nickname}</span>
            </div>
            <div className="flex justify-between pb-2 border-b">
              <span className="text-gray-500">Mobile Number</span>
              <span className="font-medium text-gray-900">{data.mobileNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Mobile Carrier</span>
              <span className="font-medium text-gray-900">{data.mobileCarrier}</span>
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 border-t border-gray-200">
          <div className="flex justify-end w-full gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="w-full text-blue-600 border-blue-600"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              loading={loading}
              className="w-full text-white bg-primary hover:bg-primary"
            >
              Submit
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteMobileNumberModal;
