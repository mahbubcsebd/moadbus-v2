import { getFraudSubjects, submitFraudReport } from '@/api/endpoints';
import { generatedRoi } from '@/globals/appGlobals';
import { useSuccessModalStore } from '@/store/successModalStore';
import { successResponseParser } from '@/utils/globalResponseParser';
import { generateUniqueID } from '@/utils/rechargeHelpers'; // Ensure imported
import { create } from 'zustand';

export const useFraudStore = create((set) => ({
  subjects: [],
  loading: false,
  isSubmitting: false,

  // 1. Fetch Subjects
  fetchSubjects: async () => {
    set({ loading: true });
    try {
      const response = await getFraudSubjects();
      const rs = response?.rs || response;

      if (rs.status === 'success' && rs.ats) {
        const parsedSubjects = rs.ats
          .split('|')
          .filter((item) => item && item.trim() !== '')
          .map((item) => {
            const [id, label] = item.split('#');
            return { value: id, label: label };
          });

        set({ subjects: parsedSubjects, loading: false });
      } else {
        set({ subjects: [], loading: false });
      }
    } catch (error) {
      set({ subjects: [], loading: false });
    }
  },

  // 2. Submit Report
  submitReport: async (formData) => {
    set({ isSubmitting: true });
    try {
      const payload = {
        memo: formData.reason, // Send ID (e.g., 52)
        message: formData.message,
        uniqueID: generateUniqueID(),
        roi: generatedRoi,
      };

      const response = await submitFraudReport(payload);
      const rs = response?.rs || response;

      if (rs.status === 'success') {
        // --- FIX: Parse Receipt String to Array ---
        const receipt = successResponseParser(rs.rcpt);

        // Pass Parsed Array to Modal
        useSuccessModalStore.getState().showSuccess(receipt, 'Report Fraud');

        set({ isSubmitting: false });
        return true;
      } else {
        set({ isSubmitting: false });
        return false;
      }
    } catch (error) {
      console.error('Submit error:', error);
      set({ isSubmitting: false });
      return false;
    }
  },
}));
