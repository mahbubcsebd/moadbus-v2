import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button';

const DeleteMessageModal = ({ isOpen, onClose, messageData, onConfirm }) => {
  const handleConfirm = () => {
    onConfirm(messageData.id);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-sm w-full p-0 gap-0">
        <DialogHeader className="relative p-6 pb-4">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center w-16 h-16 mb-4 bg-red-100 rounded-full">
              <AlertTriangle className="w-10 h-10 text-red-600" />
            </div>
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Delete Message
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-4 text-center">
          <p className="text-base font-medium text-gray-700">
            Are you sure you want to delete this message?
          </p>
          <p className="text-sm text-gray-500">This action cannot be undone.</p>
        </div>

        <DialogFooter className="p-6 pt-0 border-t border-gray-200">
          <div className="flex justify-between w-full gap-4">
            <Button
              variant="outline"
              onClick={onClose}
              size="default"
              className="w-full text-sm text-gray-600 border-gray-300 hover:bg-gray-50"
              type="button"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirm}
              size="default"
              className="w-full text-sm text-white bg-red-600 hover:bg-red-700"
              type="button"
            >
              Delete
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteMessageModal;
