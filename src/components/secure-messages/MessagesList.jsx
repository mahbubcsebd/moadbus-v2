import { motion } from 'framer-motion';
import { AlertCircle, Loader2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import DeleteMessageModal from './DeleteMessageModal';
import MessageDetailsModal from './MessageDetailsModal';

const MessagesList = ({ data = [], loading, error, onNewMessageClick, onDelete }) => {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const handleMessageClick = (message) => {
    setSelectedMessage(message);
    setIsDetailsModalOpen(true);
  };

  const handleDeleteIconClick = (e, message) => {
    e.stopPropagation();
    setSelectedMessage(message);
    setIsDeleteModalOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm"
    >
      {/* Modals */}
      <MessageDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        messageData={selectedMessage}
      />
      <DeleteMessageModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        messageData={selectedMessage}
        onConfirm={onDelete}
      />

      {/* Header and New Message Button */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b">
        <h2 className="text-xl font-semibold text-gray-900">Messages</h2>
        <Button
          variant="primary"
          onClick={onNewMessageClick}
          size="default"
          className="flex items-center space-x-1 text-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          + New Message
        </Button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-10 h-10 mb-3 text-blue-600 animate-spin" />
          <p className="text-sm text-gray-600">Loading messages...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="flex items-center justify-center w-16 h-16 mb-4 bg-red-100 rounded-full">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900">Unable to Load Messages</h3>
          <p className="max-w-md mb-4 text-sm text-center text-gray-600">{error}</p>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            size="default"
            className="text-sm text-blue-600 border-blue-600 hover:bg-blue-50"
          >
            Try Again
          </Button>
        </div>
      )}

      {/* List of Messages */}
      {!loading && !error && (
        <div className="space-y-0 divide-y divide-gray-100">
          {data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="flex items-center justify-center w-16 h-16 mb-4 bg-gray-100 rounded-full">
                <svg
                  className="w-10 h-10 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">No Messages</h3>
              <p className="max-w-md mb-4 text-sm text-center text-gray-500">
                No messages found matching your criteria.
              </p>
            </div>
          ) : (
            data.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => handleMessageClick(message)}
                className={`flex justify-between items-center py-3 px-3 rounded-md transition-colors cursor-pointer border border-transparent ${
                  message.isRead ? 'hover:bg-gray-50' : 'bg-blue-50/30 hover:bg-blue-100/50'
                }`}
              >
                {/* Subject and Date */}
                <div className="flex-1 min-w-0 pr-4">
                  <div
                    className={`text-base font-medium truncate ${
                      message.isRead ? 'text-gray-900' : 'text-blue-700'
                    }`}
                  >
                    {message.subject}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">{message.date}</div>
                </div>

                {/* Delete Icon */}
                <button
                  onClick={(e) => handleDeleteIconClick(e, message)}
                  className="p-1 text-gray-400 transition-colors rounded-full hover:text-red-600 shrink-0 hover:bg-gray-200"
                  title="Delete Message"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </motion.div>
            ))
          )}
        </div>
      )}
    </motion.div>
  );
};

export default MessagesList;
