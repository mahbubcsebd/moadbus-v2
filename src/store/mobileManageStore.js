import {
  addTopUpNumber,
  deleteTopUpNumber,
  getTopUpList,
  updateTopUpNumber,
} from '@/api/endpoints';
import { generateUniqueID, parseRechargeReceipt, parseTopUpList } from '@/utils/rechargeHelpers';
import { create } from 'zustand';

const getCarrierCode = (name) => {
  const map = { Digicel: 'DG', UTS: 'UT', Chippie: 'CH' };
  return map[name] || 'OT';
};

export const useMobileManageStore = create((set, get) => ({
  // State
  savedNumbers: [],
  loading: false,
  isSubmitting: false,

  // Success Modal State
  successModal: {
    isOpen: false,
    data: [],
    message: '',
  },

  // 1. Fetch List
  fetchSavedNumbers: async () => {
    set({ loading: true });
    try {
      const response = await getTopUpList();
      const parsedList = parseTopUpList(response);

      // Map to UI friendly format
      const formattedList = parsedList.map((item) => ({
        id: item.id,
        nickname: item.name,
        mobileNumber: item.phone,
        mobileCarrier: item.operatorName,
        carrierCode: item.operatorCode,
      }));

      set({ savedNumbers: formattedList, loading: false });
    } catch (error) {
      console.error('Fetch error:', error);
      set({ savedNumbers: [], loading: false });
    }
  },

  // 2. Add Number
  addNumber: async (formData) => {
    set({ isSubmitting: true });
    try {
      const payload = {
        payeeName: formData.nickname,
        mobileNumber: formData.mobileNumber,
        carrier: getCarrierCode(formData.mobileCarrier),
        carrierName: formData.mobileCarrier,
        uniqueID: generateUniqueID(),
      };

      const response = await addTopUpNumber(payload);
      const rs = response?.rs || response;

      if (rs.status === 'success') {
        const receipt = parseRechargeReceipt(rs.rcpt);
        set({
          isSubmitting: false,
          successModal: { isOpen: true, data: receipt, message: 'Number Added Successfully' },
        });
        return true;
      }
    } catch (error) {
      console.error('Add error:', error);
    }
    set({ isSubmitting: false });
    return false;
  },

  // 3. Delete Number
  deleteNumber: async (id, numberData) => {
    set({ isSubmitting: true });
    try {
      const payload = {
        id: id,
        mobileNo: numberData.mobileNumber,
        carrierName: numberData.mobileCarrier,
        uniqueID: generateUniqueID(),
      };

      const response = await deleteTopUpNumber(payload);
      const rs = response?.rs || response;

      if (rs.status === 'success') {
        const receipt = parseRechargeReceipt(rs.rcpt);
        set({
          isSubmitting: false,
          successModal: { isOpen: true, data: receipt, message: 'Number Deleted Successfully' },
        });
        return true;
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
    set({ isSubmitting: false });
    return false;
  },

  // 4. Update Number
  updateNumber: async (id, formData) => {
    set({ isSubmitting: true });
    try {
      const payload = {
        id: id,
        payeeName: formData.nickname,
        mobileNumber: formData.mobileNumber,
        carrier: getCarrierCode(formData.mobileCarrier),
        carrierName: formData.mobileCarrier,
        uniqueID: generateUniqueID(),
      };

      const response = await updateTopUpNumber(payload);
      const rs = response?.rs || response;

      if (rs.status === 'success') {
        const receipt = parseRechargeReceipt(rs.rcpt);
        set({
          isSubmitting: false,
          successModal: { isOpen: true, data: receipt, message: 'Number Updated Successfully' },
        });
        return true;
      }
    } catch (error) {
      console.error('Update error:', error);
    }
    set({ isSubmitting: false });
    return false;
  },

  // Close Modal & Refresh
  closeSuccessModal: () => {
    set({ successModal: { isOpen: false, data: [], message: '' } });
    get().fetchSavedNumbers();
  },
}));
