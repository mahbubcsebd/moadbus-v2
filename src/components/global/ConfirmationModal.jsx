import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirmation Dialog',
  message = 'Are you sure you want to submit?',
  confirmText = 'OK',
  cancelText = 'Cancel',
  isLoading = false,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-md w-full p-0 gap-0">
        {/* Header */}
        <DialogHeader className="relative flex flex-row items-center justify-between p-5 border-b border-gray-100">
          <DialogTitle className="text-xl font-semibold text-gray-800">{title}</DialogTitle>
        </DialogHeader>

        {/* Body */}
        <div className="p-8 py-10 text-center">
          <p className="text-lg text-gray-700">{message}</p>
        </div>

        {/* Footer Buttons */}
        <DialogFooter className="flex flex-row justify-center w-full gap-4 p-6 sm:justify-center">
          <Button
            variant="primary"
            onClick={onConfirm}
            disabled={isLoading}
            size="default"
            className="w-full text-white bg-primary hover:bg-primary"
          >
            {isLoading ? 'Processing...' : confirmText}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            size="default"
            className="w-full text-blue-600 border-blue-600"
          >
            {cancelText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationModal;
