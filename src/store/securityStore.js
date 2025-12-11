import { changeUserPassword, updateUserChallenge } from '@/api/endpoints';
import { generatedRoi } from '@/globals/appGlobals';
import { successResponseParser } from '@/utils/globalResponseParser';
import { generateUniqueID } from '@/utils/rechargeHelpers';
import { create } from 'zustand';

export const useSecurityStore = create((set) => ({
  isSubmitting: false,
  error: null,
  successMessage: null, // NEW: For showing Success Alert

  changePassword: async (formData) => {
    set({ isSubmitting: true, error: null, successMessage: null });
    try {
      const payload = {
        oldPin: formData.oldPassword,
        newPin: formData.newPassword,
        renterNewPin: formData.reEnterPassword,
        uniqueID: generateUniqueID(),
        roi: generatedRoi,
      };

      const response = await changeUserPassword(payload);
      const rs = response?.rs || response;

      if (rs.status === 'success') {
        // Instead of Global Modal, just set success message
        set({
          successMessage: rs.msg || 'Your password has been successfully changed.',
          isSubmitting: false,
        });
        return true;
      } else {
        set({
          error: rs.msg || 'Password change failed',
          isSubmitting: false,
        });
        return false;
      }
    } catch (err) {
      console.error('Password change error:', err);
      set({
        error: 'Network error. Please try again.',
        isSubmitting: false,
      });
      return false;
    }
  },

  // Update Challenge Questions
  updateChallengeQuestions: async (questions) => {
    set({ isSubmitting: true, error: null, successMessage: null });

    try {
      // 1. Format payload string: "Question?#Answer|Question2?#Answer2"
      // Filter out empty ones if any logic allowed partial, but requirements say 3 min.
      // Assuming 'questions' is array of { question: "Label", value: "ID", answer: "Answer" }
      // Or just { question: "Label", answer: "Answer" } based on your form state.

      // Based on your form: q.question is the ID/Value from Select.
      // We need the LABEL text for the payload usually?
      // The payload image shows: "1#Cumilla|3#Bangladeshi|4#Dhaka" (ID#Answer format) OR "Text#Answer"?
      // Your payload image shows: "1%23Cumilla%7C3%23Bangladeshi%7C4%23Dhaka" -> Decoded: "1#Cumilla|3#Bangladeshi|4#Dhaka"
      // So we send: "ID#Answer|ID#Answer..."

      const challengeString = questions
        .filter((q) => q.question && q.answer)
        .map((q) => `${q.question}#${q.answer}`)
        .join('|');

      const payload = {
        challenge: challengeString,
        uniqueID: generateUniqueID(),
        roi: generatedRoi,
      };

      const response = await updateUserChallenge(payload);
      const rs = response?.rs || response;

      if (rs.status === 'success') {
        // Success -> Show Global Modal with Receipt
        // rcpt: "Birth Place?#Cumilla|..."
        const receipt = successResponseParser(rs.rcpt);

        // Using global modal for this one as requested
        useSuccessModalStore.getState().showSuccess(receipt, 'Security Questions Updated');

        set({ isSubmitting: false });
        return true;
      } else {
        set({
          error: rs.msg || 'Update failed',
          isSubmitting: false,
        });
        return false;
      }
    } catch (err) {
      console.error('Challenge update error:', err);
      set({
        error: 'Network error. Please try again.',
        isSubmitting: false,
      });
      return false;
    }
  },

  // Helpers to clear messages
  // Helpers
  clearError: () => set({ error: null }),
  clearSuccess: () => set({ successMessage: null }),
  resetStore: () => set({ error: null, successMessage: null, isSubmitting: false }),
}));
