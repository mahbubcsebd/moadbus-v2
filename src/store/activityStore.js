import { getUserActivity } from '@/api/endpoints';
import { parseActivityLogs } from '@/utils/ActivityHelper';
// import { parseActivityLogs } from '@/utils/rechargeHelpers';
import { create } from 'zustand';

export const useActivityStore = create((set) => ({
  activities: [],
  loading: false,
  error: null,

  fetchActivities: async () => {
    set({ loading: true, error: null });
    try {
      const response = await getUserActivity();
      const rs = response?.rs || response;

      if (rs.status === 'success') {
        const parsedData = parseActivityLogs(rs.ats);
        set({ activities: parsedData, loading: false });
      } else {
        set({ error: rs.msg, loading: false });
      }
    } catch (error) {
      console.error('Fetch Activity Error:', error);
      set({ error: 'Failed to load activity log', loading: false });
    }
  },
}));
