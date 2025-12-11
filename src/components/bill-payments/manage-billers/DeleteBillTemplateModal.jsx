import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '../../ui/button';

const DeleteBillTemplateModal = ({ isOpen, onClose, billerData, onConfirm }) => {
  const handleConfirm = () => {
    onConfirm(billerData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-sm w-full p-0 gap-0">
        <DialogHeader className="p-6 border-b border-gray-200 relative">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Delete Bill Template
          </DialogTitle>
          {/* Shadcn style close button */}
          {/* <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button> */}
        </DialogHeader>

        <div className="p-6 pt-5 text-center">
          <DialogDescription className="text-gray-700 mb-2 text-sm sm:text-base">
            Deleting a biller will also delete all its scheduled payment.
          </DialogDescription>
          <p className="font-semibold text-gray-900 text-sm sm:text-base">
            Would you like to continue?
          </p>
        </div>

        <DialogFooter className="p-6 border-t border-gray-200">
          <div className="flex justify-between w-full gap-4">
            <Button
              variant="outline"
              onClick={onClose}
              size="default"
              className="w-full text-sm border-blue-600 text-blue-600 hover:bg-blue-50"
              type="button"
            >
              No
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirm}
              size="default"
              className="w-full text-sm bg-primary hover:bg-primary text-white"
              type="button"
            >
              Yes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteBillTemplateModal;
