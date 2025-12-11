'use client';

import HeaderTop from '@/components/global/HeaderTop';
import ActivityLog from '@/components/security-history/ActivityLog';
import { useActivityStore } from '@/store/activityStore'; // Import Store
import { Loader2, Printer } from 'lucide-react';
import { useEffect } from 'react';

export default function SecurityHistory() {
  const { activities, fetchActivities, loading } = useActivityStore();

  useEffect(() => {
    fetchActivities();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <HeaderTop
        title="User Activity"
        text="Monitor User Activity"
        link="/dashboard"
        linkText="Back to Dashboard"
      />

      <div className="max-w-4xl p-6 mx-auto mb-8 bg-white border border-gray-200 rounded-lg shadow-sm min-h-[400px]">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : (
          <ActivityLog data={activities} />
        )}

        {!loading && activities.length > 0 && (
          <div className="flex justify-center pt-8 mt-6 border-t border-gray-100">
            <button
              onClick={handlePrint}
              className="flex flex-col items-center gap-1 p-2 text-gray-500 transition-colors hover:text-blue-600"
              title="Print Activity Log"
            >
              <Printer className="w-6 h-6" />
              <span className="text-xs">Print</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
