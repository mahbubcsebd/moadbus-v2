import { useAccountsStore } from '@/store/accountsStore';
import { parseNotifications } from '@/utils/notificationHelper';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, Bell, Clock, Gift, Info } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import NotificationDetailsModal from '../notification/NotificationDetailsModal';
// import NotificationDetailsModal from './NotificationDetailsModal';

const NotificationDropdown = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationSections, setNotificationSections] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const rawNotifications = useAccountsStore((s) => s.notifications);

  useEffect(() => {
    const parsedData = parseNotifications(rawNotifications);
    setNotificationSections(parsedData);
  }, [rawNotifications]);

  // Calculate total unread count (only sections with messages)
  const totalUnreadCount = notificationSections.reduce(
    (total, section) => total + section.messages.length,
    0,
  );

  // Get icon based on section title
  const getSectionIcon = (title) => {
    if (title.includes('Alert')) return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    if (title.includes('Promotion')) return <Gift className="w-4 h-4 text-gray-600" />;
    if (title.includes('Reminder')) return <Clock className="w-4 h-4 text-gray-600" />;
    return <Info className="w-4 h-4 text-gray-600" />;
  };

  const handleMessageClick = (message, sectionTitle) => {
    setSelectedMessage({
      ...message,
      title: sectionTitle,
    });
    setIsModalOpen(true);
    setShowNotifications(false);
  };

  return (
    <>
      <NotificationDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        messageData={selectedMessage}
      />

      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative p-2 transition-colors rounded-lg hover:bg-gray-100"
        >
          <Bell className="w-5 h-5 text-gray-700" />
          {totalUnreadCount > 0 && (
            <span className="absolute flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-primary rounded-full top-0 right-0">
              {totalUnreadCount > 9 ? '9+' : totalUnreadCount}
            </span>
          )}
        </motion.button>

        <AnimatePresence>
          {showNotifications && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 z-20 mt-2 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-lg w-80 lg:w-96"
              >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                  {totalUnreadCount > 0 && (
                    <span className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
                      {totalUnreadCount}
                    </span>
                  )}
                </div>

                {/* Notification Sections */}
                <div className="overflow-x-hidden overflow-y-auto max-h-96">
                  {notificationSections.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Bell className="w-12 h-12 mb-3 text-gray-300" />
                      <p className="text-sm text-gray-500">No notifications</p>
                    </div>
                  ) : (
                    notificationSections.map((section) =>
                      section.messages.length > 0 ? (
                        <div key={section.id} className="border-b border-gray-100 last:border-b-0">
                          {/* Section Header */}
                          <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50">
                            {getSectionIcon(section.title)}
                            <h4 className="text-xs font-semibold text-gray-700">{section.title}</h4>
                            <span className="ml-auto text-xs text-gray-500">
                              {section.messages.length}
                            </span>
                          </div>

                          {/* Messages */}
                          {section.messages.map((message, messageIndex) => (
                            <motion.div
                              key={message.id || messageIndex}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{
                                delay: messageIndex * 0.03,
                                duration: 0.2,
                              }}
                              onClick={() => handleMessageClick(message, section.title)}
                              className="px-4 py-3 transition-colors border-b cursor-pointer hover:bg-gray-50 border-gray-50 last:border-b-0"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <p className="flex-1 text-sm text-gray-700 line-clamp-2">
                                  {message.content}
                                </p>
                                <span className="text-xs text-gray-400 shrink-0">
                                  {message.date}
                                </span>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : null,
                    )
                  )}
                </div>

                {/* Footer */}
                {totalUnreadCount > 0 && (
                  <div className="px-4 py-3 border-t border-gray-200">
                    <Link
                      to="/dashboard/settings/notifications"
                      onClick={() => setShowNotifications(false)}
                    >
                      <Link
                        to="/dashboard/notification"
                        className="text-sm font-medium text-gray-700 transition-colors hover:text-primary"
                      >
                        View all notifications
                      </Link>
                    </Link>
                  </div>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default NotificationDropdown;
