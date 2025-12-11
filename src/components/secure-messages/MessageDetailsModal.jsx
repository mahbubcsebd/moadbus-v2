import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useMessageStore } from '@/store/useMessageStore';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const MessageDetailsModal = ({ isOpen, onClose, messageData }) => {
  const [loading, setLoading] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(messageData || {});
  const { readMessage } = useMessageStore();

  // Fetch message details when modal opens
  useEffect(() => {
    if (isOpen && messageData?.id) {
      fetchMessageDetails();
    }
  }, [isOpen, messageData?.id]);

  const fetchMessageDetails = async () => {
    // If message already has content, no need to fetch
    if (currentMessage.content && currentMessage.content.trim() !== '') {
      return;
    }

    setLoading(true);

    try {
      const result = await readMessage(messageData.id);

      if (result.success && result.message) {
        setCurrentMessage(result.message);
      }
    } catch (error) {
      console.error('Error reading message:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update current message when prop changes
  useEffect(() => {
    if (messageData) {
      setCurrentMessage(messageData);
    }
  }, [messageData]);

  const data = currentMessage || {};

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-xl w-full p-0 gap-0">
        <DialogHeader className="relative p-6 border-b border-gray-200">
          <DialogTitle className="text-xl font-semibold text-gray-900">Message Details</DialogTitle>
        </DialogHeader>

        <div className="p-6">
          {/* Date and Subject */}
          <div className="pb-4 mb-4 border-b border-gray-100">
            <p className="mb-1 text-sm text-gray-500">{data.date}</p>
            <h3 className="text-lg font-bold text-gray-900">{data.subject || 'No Subject'}</h3>
          </div>

          {/* Message Content */}
          <div className="space-y-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="w-8 h-8 mb-3 text-blue-600 animate-spin" />
                <p className="text-sm text-gray-600">Loading message...</p>
              </div>
            ) : data.content && data.content.trim() !== '' ? (
              <p className="text-base text-gray-700 whitespace-pre-wrap">{data.content}</p>
            ) : (
              <div className="py-8 text-center">
                <p className="text-sm text-gray-500">No message content available</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MessageDetailsModal;
