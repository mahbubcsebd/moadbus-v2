import { calculateP2PFee, submitP2PPayment, validateP2PRecipient } from '@/api/endpoints';
import { useSuccessModalStore } from '@/store/successModalStore';
import { successResponseParser } from '@/utils/globalResponseParser';
import { generateUniqueID } from '@/utils/rechargeHelpers';
import { create } from 'zustand';

export const useP2PStore = create((set, get) => ({
  loading: false,
  isSubmitting: false,

  // Validation State
  isValidated: false,
  recipientFound: false,
  recipientDetails: { firstName: '', lastName: '' },
  validationError: null,
  validationMessage: null,
  validationMessageType: 'info',

  // Reset State
  resetValidation: () =>
    set({
      isValidated: false,
      recipientFound: false,
      recipientDetails: { firstName: '', lastName: '' },
      validationError: null,
      validationMessage: null,
      validationMessageType: 'info',
    }),

  validateRecipient: async (identifier, type) => {
    set({
      loading: true,
      validationError: null,
      validationMessage: null,
      isValidated: false,
      recipientFound: false,
    });

    try {
      const payload =
        type === 'email'
          ? { emailId: identifier, otp: '000000', fp: '0' }
          : { mobileNo: identifier, otp: '000000', fp: '0' };

      const response = await validateP2PRecipient(payload);
      const rs = response?.rs || response;

      if ((rs.statusCode === 0 || rs.status === 'success') && rs.pp) {
        const ppString = rs.pp || '';
        const [firstName, lastName] = ppString.split('#');

        set({
          isValidated: true,
          recipientFound: true,
          recipientDetails: {
            firstName: firstName || '',
            lastName: lastName || '',
          },
          validationMessage: null,
          loading: false,
        });
        return true;
      } else if (rs.ec && rs.ec.toString().startsWith('2')) {
        set({
          isValidated: true,
          recipientFound: false,
          recipientDetails: { firstName: '', lastName: '' },
          validationMessage: rs.msg || 'No Customer information available for this Email!',
          validationMessageType: 'warning',
          loading: false,
        });
        return true;
      } else {
        set({
          validationError: rs.msg || 'Validation failed',
          loading: false,
        });
        return false;
      }
    } catch (error) {
      console.error('Validation Error:', error);
      set({ validationError: 'Validation failed. Please try again.', loading: false });
      return false;
    }
  },

  calculateFees: async (formData) => {
    set({ isSubmitting: true });
    try {
      const payload = {
        amount: formData.amount,
        amt: formData.amount,
        from: formData.fromAccount,
        currencyCode: 'USD',
        firstName: formData.firstName,
        lastName: formData.lastName,
      };

      const response = await calculateP2PFee(payload);
      const rs = response?.rs || response;

      set({ isSubmitting: false });

      if (rs.status === 'success') {
        return {
          success: true,
          data: {
            'From Account': formData.fromAccountLabel,
            'First Name': formData.firstName,
            'Last Name': formData.lastName,
            'Email/Phone': formData.recipientValue,
            Description: formData.description,
            Amount: `USD ${rs.amount}`,
            Commission: rs.c,
            Stamp: rs.s,
            rawComm: rs.c,
            rawStamp: rs.s,
            rawTax: rs.ta,
            rawTca: rs.ca,
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

  submitPayment: async (formData, feeData) => {
    set({ isSubmitting: true });
    try {
      const payload = {
        method: 'p2pPayment',
        amount: formData.amount,
        fromAcct: formData.fromAccount,

        toMobile: formData.recipientType === 'phone' ? formData.recipientValue : '',
        toEmail: formData.recipientType === 'email' ? formData.recipientValue : '',

        firstName: formData.firstName,
        lastName: formData.lastName,

        description: formData.description,
        uniqueID: generateUniqueID(),

        comm: feeData.rawComm || 'USD 0.00',
        stamp: feeData.rawStamp || 'USD 0.00',
        tax: feeData.rawTax || 'USD 0.00',
        tca: feeData.rawTca || 'USD 0.00',
      };

      const response = await submitP2PPayment(payload);
      const rs = response?.rs || response;

      if (rs.status === 'success') {
        const receipt = successResponseParser(rs.rcpt);

        useSuccessModalStore.getState().showSuccess(receipt, 'Transfer Successful');

        set({ isSubmitting: false });
        return { success: true };
      } else {
        set({ isSubmitting: false });
        return { success: false, message: rs.msg };
      }
    } catch (error) {
      console.error('Payment Error:', error);
      set({ isSubmitting: false });
      return { success: false, message: error.message };
    }
  },
}));
