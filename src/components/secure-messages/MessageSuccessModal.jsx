import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CheckCircle } from 'lucide-react';
import { Button } from '../ui/button';

const MessageSuccessModal = ({ isOpen, onClose, ticketNumber }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-sm w-full p-0 gap-0">
        <DialogHeader className="relative p-6 pb-4">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center w-16 h-16 mb-4 bg-green-100 rounded-full">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Message Sent Successfully!
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-4 text-center">
          <p className="text-base text-gray-700">Your message has been sent to the bank.</p>
          <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
            <p className="text-sm font-medium text-blue-900">
              {ticketNumber || 'Your ticket has been created'}
            </p>
          </div>
        </div>

        <DialogFooter className="p-6 pt-0">
          <Button
            variant="primary"
            onClick={onClose}
            size="default"
            className="w-full text-sm text-white bg-blue-600 hover:bg-blue-700"
            type="button"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MessageSuccessModal;
