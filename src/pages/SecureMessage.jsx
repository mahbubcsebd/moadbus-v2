import Alert from '@/components/global/Alert';
import HeaderTop from '@/components/global/HeaderTop';
import MessageFilter from '@/components/secure-messages/MessageFilter';
import MessageSuccessModal from '@/components/secure-messages/MessageSuccessModal';
import MessagesList from '@/components/secure-messages/MessagesList';
import NewSecureMessageModal from '@/components/secure-messages/NewSecureMessageModal';
import { useMessageStore } from '@/store/useMessageStore';
import { AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function SecureMessage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [ticketNumber, setTicketNumber] = useState('');
  const [notification, setNotification] = useState(null); // { type: 'success'|'error', message: '' }

  const {
    filteredMessages,
    filters,
    loading,
    error,
    sending,
    fetchInboxMessages,
    updateFilters,
    clearFilters,
    sendMessage,
    deleteMessage,
    fetchSubjects,
  } = useMessageStore();

  // Initial load
  useEffect(() => {
    fetchInboxMessages();
    fetchSubjects();
  }, []);

  const handleFilterChange = (newFilters) => {
    updateFilters(newFilters);
  };

  const handleClearFilters = () => {
    clearFilters();
  };

  const handleSendNewMessage = async (formData) => {
    const result = await sendMessage(formData);

    if (result.success) {
      setIsModalOpen(false);

      // Show success modal with ticket number
      setTicketNumber(result.ticketNumber);
      setIsSuccessModalOpen(true);

      // Also show notification
      setNotification({
        type: 'success',
        message: 'Message sent successfully!',
      });
    } else {
      // Show error notification
      setNotification({
        type: 'error',
        message: result.message || 'Failed to send message',
      });
    }
  };

  const handleDeleteMessage = async (messageId) => {
    const result = await deleteMessage(messageId);

    if (result.success) {
      setNotification({
        type: 'success',
        message: 'Message deleted successfully!',
      });
    } else {
      setNotification({
        type: 'error',
        message: result.message || 'Failed to delete message',
      });
    }
  };

  return (
    <div>
      <HeaderTop
        title="Secure Messages"
        text="Securely communicate with our banking team"
        link="/dashboard"
        linkText="Back to Dashboard"
      />

      {/* Alert Notification */}
      <AnimatePresence>
        {notification && (
          <Alert
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification(null)}
            autoClose={5000}
          />
        )}
      </AnimatePresence>

      {/* Filter Section */}
      <MessageFilter
        initialFilters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {/* Messages List */}
      <MessagesList
        data={filteredMessages}
        loading={loading}
        error={error}
        onNewMessageClick={() => setIsModalOpen(true)}
        onDelete={handleDeleteMessage}
      />

      {/* New Message Modal */}
      <NewSecureMessageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSendNewMessage}
        sending={sending}
      />

      {/* Success Modal with Ticket Number */}
      <MessageSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        ticketNumber={ticketNumber}
      />
    </div>
  );
}
