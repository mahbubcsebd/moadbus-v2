import {
  calculateTopUpFee,
  getTopUpList,
  getUpdatedAccounts,
  loadCreditCardDetails,
  submitTopUp,
} from '@/api/endpoints';
import { generatedRoi } from '@/globals/appGlobals';
import { generateUniqueID, parseRechargeReceipt, parseTopUpList } from '@/utils/rechargeHelpers';
import { create } from 'zustand';

export const useRechargeStore = create((set, get) => ({
  // State
  topUpList: [],
  feeDetails: null, // Stores data from /calculatefee
  receipt: null, // Stores final success data

  loading: false,
  submitting: false,
  error: null,

  // Modals State
  showConfirmModal: false,
  showSuccessModal: false,

  // 1. Fetch Top Up Numbers
  fetchTopUpList: async () => {
    // No specific payload needed based on image, just standard defaults
    try {
      const response = await getTopUpList();
      const list = parseTopUpList(response);
      set({ topUpList: list });
    } catch (error) {
      console.error('Failed to fetch topups', error);
    }
  },

  // 2. Calculate Fee (Step 1 of Submit)
  initiateRecharge: async (formData) => {
    set({ loading: true, error: null });

    try {
      const payload = {
        amount: formData.rechargeAmount,
        currencyCode: formData.currency,
        from: formData.fromAccount, // Account ID
        // code: 'MB_TOPUP', payNow: 'Y' (Handled in defaults)
      };

      const response = await calculateTopUpFee(payload);
      const rs = response?.rs || response;

      if (rs.status === 'success') {
        // Store fee details for the next step and UI display
        set({
          feeDetails: {
            ...rs,
            // Map API keys to readable keys for next payload/UI
            commission: rs.c,
            stamp: rs.s,
            tax: rs.ta,
            tca: rs.ca,
            amount: rs.amount,
            totalFee: (
              parseFloat(rs.c?.replace(/[^\d.]/g, '') || 0) +
              parseFloat(rs.s?.replace(/[^\d.]/g, '') || 0) +
              parseFloat(rs.ta?.replace(/[^\d.]/g, '') || 0) +
              parseFloat(rs.ca?.replace(/[^\d.]/g, '') || 0)
            ).toFixed(2),
          },
          showConfirmModal: true,
          loading: false,
        });
        return true;
      } else {
        set({ error: rs.msg || 'Calculation failed', loading: false });
        return false;
      }
    } catch (error) {
      set({ error: error.message, loading: false });
      return false;
    }
  },

  // 3. Confirm & Submit Recharge (Step 2)
  confirmRecharge: async (formData) => {
    set({ submitting: true, error: null });
    const { feeDetails, topUpList } = get();

    // Find full topup details to get ID (accNo) and Name (payeeId)
    const selectedTopUp = topUpList.find((item) => item.value === formData.topUpNumber);

    try {
      const payload = {
        curr: formData.currency,
        currencyCode: formData.currency,
        fromAcct: formData.fromAccount, // Account ID

        // Specific fields from selected topup number
        accNo: selectedTopUp?.id || '', // The ID from the list (e.g. 151)
        payeeId: selectedTopUp?.name || '', // Name
        phone: formData.topUpNumber,

        amount: formData.rechargeAmount,
        comment: formData.comment || '',

        // Fee details from previous step
        comm: feeDetails.c,
        stamp: feeDetails.s,
        tax: feeDetails.ta,
        tca: feeDetails.ca,

        note: '',
        uniqueID: generateUniqueID(),
        roi: generatedRoi,
      };

      const response = await submitTopUp(payload);
      const rs = response?.rs || response;

      if (rs.status === 'success') {
        const parsedReceipt = parseRechargeReceipt(rs.rcpt);

        set({
          receipt: parsedReceipt,
          showConfirmModal: false,
          showSuccessModal: true,
          submitting: false,
        });

        // Trigger background updates
        getUpdatedAccounts();
        loadCreditCardDetails();

        return true;
      } else {
        set({ error: rs.msg || 'Transaction failed', submitting: false, showConfirmModal: false });
        return false;
      }
    } catch (error) {
      set({ error: error.message, submitting: false, showConfirmModal: false });
      return false;
    }
  },

  // Reset Modal State
  closeModals: () => {
    set({ showConfirmModal: false, showSuccessModal: false, error: null });
  },
}));
