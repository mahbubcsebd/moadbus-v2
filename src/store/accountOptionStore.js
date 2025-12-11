import { changeAccountNickname, restoreAccountNickname } from '@/api/endpoints';
import { generatedRoi } from '@/globals/appGlobals';
import { useSuccessModalStore } from '@/store/successModalStore';
import { successResponseParser } from '@/utils/globalResponseParser';
import { generateUniqueID } from '@/utils/rechargeHelpers';
import { create } from 'zustand';

export const useAccountOptionStore = create((set) => ({
  isSubmitting: false,
  error: null,

  // Change Nickname (Keeps using Global Modal as per previous request)
  changeNickname: async (accountNumber, newName) => {
    set({ isSubmitting: true, error: null });
    try {
      const payload = {
        accNo: accountNumber,
        desc: newName,
        uniqueID: generateUniqueID(),
        roi: generatedRoi,
      };

      const response = await changeAccountNickname(payload);
      const rs = response?.rs || response;

      if (rs.status === 'success') {
        const receipt = successResponseParser(rs.rcpt);
        useSuccessModalStore.getState().showSuccess(receipt, 'Success');
        set({ isSubmitting: false });
        return true;
      } else {
        set({ isSubmitting: false, error: rs.msg || 'Failed to update nickname' });
        return false;
      }
    } catch (error) {
      console.error('Change Nickname error:', error);
      set({ isSubmitting: false, error: 'Network error. Please try again.' });
      return false;
    }
  },

  // Restore Nickname (UPDATED: Returns message instead of opening modal)
  restoreNickname: async (accountNumber) => {
    set({ isSubmitting: true, error: null });
    try {
      const payload = {
        accNo: accountNumber,
        uniqueID: generateUniqueID(),
        roi: generatedRoi,
      };

      const response = await restoreAccountNickname(payload);
      const rs = response?.rs || response || {};

      if (rs.status === 'success' || rs.statusCode === 0) {
        set({ isSubmitting: false });
        // Return success status AND the message to display in Alert
        return { success: true, message: rs.msg || 'Account name restored successfully.' };
      } else {
        set({ isSubmitting: false, error: rs.msg || 'Failed to restore name' });
        return { success: false, message: rs.msg };
      }
    } catch (error) {
      console.error('Restore Nickname error:', error);
      set({ isSubmitting: false, error: 'Network error. Please try again.' });
      return { success: false, message: 'Network error' };
    }
  },
}));
