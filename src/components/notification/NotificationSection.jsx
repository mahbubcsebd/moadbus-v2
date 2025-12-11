import { motion } from 'framer-motion';
import { AlertTriangle, Clock, Gift, Info } from 'lucide-react';
import { useState } from 'react';
import NotificationDetailsModal from './NotificationDetailsModal';

const NotificationSection = ({ section }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const handleMessageClick = (message) => {
    setSelectedMessage({
      ...message,
      title: section.title,
    });
    setIsModalOpen(true);
  };

  const getSectionIcon = (title) => {
    if (title.includes('Alert')) return <AlertTriangle className="w-5 h-5 text-red-500" />;
    if (title.includes('Promotion')) return <Gift className="w-5 h-5 text-green-500" />;
    if (title.includes('Reminder')) return <Clock className="w-5 h-5 text-blue-500" />;
    return <Info className="w-5 h-5 text-gray-500" />;
  };

  const titleColor = section.title.includes('Alert') ? 'text-red-600' : 'text-blue-600';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-3"
    >
      <NotificationDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        messageData={selectedMessage}
      />

      {/* Section Header */}
      <div className="flex items-center pb-2 space-x-2 border-b border-gray-100">
        {getSectionIcon(section.title)}
        <h3 className={`text-lg font-semibold ${titleColor}`}>{section.title}</h3>
        <span className="text-xs font-medium px-2 py-0.5 bg-gray-100 rounded-full text-gray-500">
          {section.messages.length}
        </span>
      </div>

      {/* Message List */}
      <div className="pl-0 space-y-2 md:pl-6">
        {section.messages.length === 0 ? (
          <div className="py-2 pl-2 text-sm italic text-gray-400">No new messages.</div>
        ) : (
          section.messages.map((message, index) => (
            <motion.div
              key={message.id || index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={() => handleMessageClick(message)}
              className="flex items-center justify-between p-3 text-gray-700 transition-colors bg-white border border-gray-200 rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 hover:border-orange-200 group"
            >
              <div className="flex-1 min-w-0 pr-4">
                <p className="text-sm font-medium text-gray-800 truncate transition-colors group-hover:text-primary">
                  {message.content}
                </p>
              </div>
              <div className="text-xs text-gray-400 shrink-0 whitespace-nowrap">{message.date}</div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default NotificationSection;
