'use client';

import HeaderTop from '@/components/global/HeaderTop';
import NotificationSection from '@/components/notification/NotificationSection';
import { useAccountsStore } from '@/store/accountsStore';
import { parseNotifications } from '@/utils/notificationHelper'; // Import helper
import { useEffect, useState } from 'react';

export default function Notifications() {
  const rawNotifications = useAccountsStore((s) => s.notifications);

  const [notificationSections, setNotificationSections] = useState([]);

  useEffect(() => {
    // Parse the data whenever raw string changes
    const parsedData = parseNotifications(rawNotifications);

    setNotificationSections(parsedData);
  }, [rawNotifications]);

  return (
    <div>
      <HeaderTop
        title="Notifications"
        text="Manage and view your account alerts, reminders, and promotional messages."
        link="/dashboard/settings"
        linkText="Back to Settings"
      />

      {/* Notifications Display Section */}
      <div className="max-w-4xl p-6 mx-auto mb-8 space-y-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        {notificationSections.map((section) => (
          <NotificationSection key={section.id} section={section} />
        ))}
      </div>
    </div>
  );
}
