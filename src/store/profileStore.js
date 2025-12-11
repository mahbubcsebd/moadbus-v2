import { getCurrentUser, updateUserProfile } from '@/api/endpoints';
import { useSuccessModalStore } from '@/store/successModalStore';
import { create } from 'zustand';
// import { successResponseParser } from '@/utils/rechargeHelpers'; // Global Parser
import { generatedRoi } from '@/globals/appGlobals';
import { successResponseParser } from '@/utils/globalResponseParser';

export const useProfileStore = create((set, get) => ({
  profileData: null, // Holds formatted data for the form
  loading: false,
  isSubmitting: false,

  // 1. Fetch and Map Data
  fetchProfile: async () => {
    set({ loading: true });
    try {
      const response = await getCurrentUser();
      const rs = response?.rs || response;

      if (rs.status === 'success' && rs.pinf) {
        const info = rs.pinf;

        // Map API keys (pinf) to Form keys
        const mappedData = {
          firstName: info.fn || '',
          lastName: info.ln || '',
          address1: info.ad1 || '',
          address2: info.ad2 || '',
          city: info.cty || '',
          zipCode: info.zip || '',
          emailAddress: info.eml || '',
          mobileNumber: info.pho || '',
          // Add others if needed
        };

        set({ profileData: mappedData, loading: false });
      } else {
        set({ loading: false });
      }
    } catch (error) {
      console.error('Fetch profile error:', error);
      set({ loading: false });
    }
  },

  // 2. Update Profile
  updateProfile: async (formData) => {
    set({ isSubmitting: true });
    try {
      // Map Form keys to API Payload keys (based on your screenshot)
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        addr1: formData.address1, // Screenshot shows 'addr1'
        addr2: formData.address2, // Screenshot shows 'addr2'
        email: formData.emailAddress, // Screenshot shows 'email'
        zipCode: formData.zipCode,
        city: formData.city,
        phone: formData.mobileNumber, // Screenshot shows 'phone'
        uniqueID: `${Date.now()}_${Math.floor(Math.random() * 100000)}`,
        secretKey: 'eHov3SKYZf5saL2u', // As per screenshot example
        roi: generatedRoi,
      };

      const response = await updateUserProfile(payload);
      const rs = response?.rs || response;

      if (rs.status === 'success') {
        // STEP 1: Parse using Global Helper
        const receipt = successResponseParser(rs.rcpt);

        // STEP 2: Show Global Success Modal
        useSuccessModalStore.getState().showSuccess(receipt, 'Profile Updated Successfully');

        // Refresh data
        get().fetchProfile();
        set({ isSubmitting: false });
        return true;
      }
    } catch (error) {
      console.error('Update profile error:', error);
    }
    set({ isSubmitting: false });
    return false;
  },
}));
