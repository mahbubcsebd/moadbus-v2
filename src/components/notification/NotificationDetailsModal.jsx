import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { X } from 'lucide-react'; // Optional close icon

const NotificationDetailsModal = ({ isOpen, onClose, messageData }) => {
  const data = messageData || {};

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-md w-full p-0 gap-0">
        <DialogHeader className="relative p-6 border-b border-gray-200">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            {data.title || 'Message'}
          </DialogTitle>
        </DialogHeader>

        <div className="p-8 space-y-4 text-center">
          <p className="text-lg leading-relaxed text-gray-700">
            {data.content || 'No content available.'}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationDetailsModal;
