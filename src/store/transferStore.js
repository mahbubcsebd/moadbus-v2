import { calculateSelfTransferFee, submitFundTransfer } from '@/api/endpoints';
import { generatedRoi } from '@/globals/appGlobals';
import { useSuccessModalStore } from '@/store/successModalStore';
import { generateUniqueID, parseRechargeReceipt } from '@/utils/rechargeHelpers';
import { create } from 'zustand';

export const useTransferStore = create((set) => ({
  isSubmitting: false,
  error: null,

  // 1. Calculate Fee
  calculateFees: async (formData) => {
    set({ isSubmitting: true, error: null });
    try {
      const payload = {
        amount: formData.amount,
        from: formData.fromAccount,
        to: formData.toAccount,
        currencyCode: 'USD',
      };

      const response = await calculateSelfTransferFee(payload);
      const rs = response?.rs || response;

      set({ isSubmitting: false });

      if (rs.status === 'success') {
        return {
          success: true,
          data: {
            ...rs,
            // Format for Preview Modal
            'From Account': formData.fromAccountLabel,
            'To Account': formData.toAccountLabel,
            Amount: `USD ${rs.amount}`,
            Commission: rs.c,
            Stamp: rs.s,
            'Tax Fee': rs.ta,
            TCA: rs.ca,
            'Total Fees': (
              parseFloat(rs.c?.replace(/[^\d.]/g, '') || 0) +
              parseFloat(rs.s?.replace(/[^\d.]/g, '') || 0) +
              parseFloat(rs.ta?.replace(/[^\d.]/g, '') || 0) +
              parseFloat(rs.ca?.replace(/[^\d.]/g, '') || 0)
            ).toFixed(2),
          },
        };
      } else {
        return { success: false, message: rs.msg };
      }
    } catch (error) {
      set({ isSubmitting: false });
      return { success: false, message: error.message };
    }
  },

  // 2. Submit Transfer
  submitTransfer: async (formData, feeData) => {
    set({ isSubmitting: true });
    try {
      const payload = {
        from: formData.fromAccount,
        to: formData.toAccount,
        amt: formData.amount,
        desc: formData.description,
        uniqueID: generateUniqueID(),
        roi: generatedRoi,

        // Fee details from previous step
        comm: feeData.c,
        stamp: feeData.s,
        tax: feeData.ta,
        tca: feeData.ca,
        note: '',
      };

      const response = await submitFundTransfer(payload);
      const rs = response?.rs || response;

      if (rs.status === 'success') {
        const receipt = parseRechargeReceipt(rs.rcpt);
        useSuccessModalStore.getState().showSuccess(receipt, 'Transfer Successful');

        set({ isSubmitting: false });
        return true;
      } else {
        set({ isSubmitting: false, error: rs.msg });
        return false;
      }
    } catch (error) {
      console.error('Transfer error:', error);
      set({ isSubmitting: false, error: error.message });
      return false;
    }
  },
}));
