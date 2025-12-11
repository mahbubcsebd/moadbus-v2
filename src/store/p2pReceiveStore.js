import {
  deleteP2PAccount,
  getP2PAccountList,
  registerP2PAccount,
  validateP2PContact,
} from '@/api/endpoints';
import { generatedRoi } from '@/globals/appGlobals';
import { useSuccessModalStore } from '@/store/successModalStore';
import { parseP2PAccountList } from '@/utils/p2pReceiveHelper';
import {
  generateUniqueID,
  // parseP2PAccountList,
  parseRechargeReceipt,
} from '@/utils/rechargeHelpers';
import { create } from 'zustand';

export const useP2PReceiveStore = create((set, get) => ({
  payees: [],
  loading: false,
  isSubmitting: false,

  isValidated: false,
  recipientFound: false,
  recipientDetails: { firstName: '', lastName: '' },
  validationError: null,
  validationSuccessMessage: null,

  fetchPayees: async () => {
    set({ loading: true });
    try {
      const response = await getP2PAccountList();
      const list = parseP2PAccountList(response);
      set({ payees: list, loading: false });
    } catch (error) {
      set({ payees: [], loading: false });
    }
  },

  validateContact: async (identifier, type) => {
    set({
      loading: true,
      validationError: null,
      validationSuccessMessage: null,
      isValidated: false,
      recipientFound: false,
      recipientDetails: { firstName: '', lastName: '' },
    });

    try {
      const payload = type === 'email' ? { emailId: identifier } : { mobileNo: identifier };
      const response = await validateP2PContact(payload);
      const rs = response?.rs || response;

      if ((rs.statusCode === 0 || rs.status === 'success') && rs.pp) {
        const ppString = rs.pp || '';
        const [firstName, lastName] = ppString.split('#');
        set({
          isValidated: true,
          recipientFound: true,
          validationSuccessMessage: 'User found.',
          recipientDetails: { firstName, lastName },
          loading: false,
        });
        return true;
      } else if (rs.ec && rs.ec.toString().startsWith('2')) {
        set({
          isValidated: true,
          recipientFound: false,
          validationSuccessMessage: rs.msg || 'No Customer information available for this Email!', // Show Warning
          recipientDetails: { firstName: '', lastName: '' },
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
      set({ validationError: 'Error connecting to server', loading: false });
      return false;
    }
  },

  resetValidation: () =>
    set({
      isValidated: false,
      recipientFound: false,
      recipientDetails: { firstName: '', lastName: '' },
      validationError: null,
      validationSuccessMessage: null,
    }),

  registerAccount: async (formData) => {
    set({ isSubmitting: true });
    try {
      const payload = {
        nickName: formData.nickname,
        from: formData.receiveAccount,
        emailId: formData.contactType === 'email' ? formData.contactValue : '',
        phone: formData.contactType === 'phone' ? formData.contactValue : '',
        firstName: formData.firstName,
        lastName: formData.lastName,
        uniqueID: generateUniqueID(),
        roi: generatedRoi,
      };

      const response = await registerP2PAccount(payload);
      const rs = response?.rs || response;

      if (rs.status === 'success') {
        const receipt = parseRechargeReceipt(rs.rcpt);
        useSuccessModalStore.getState().showSuccess(receipt, 'Registration Successful');
        set({ isSubmitting: false });
        return true;
      } else {
        set({ validationError: rs.msg, isSubmitting: false });
        return false;
      }
    } catch (error) {
      set({ isSubmitting: false });
      return false;
    }
  },

  deletePayees: async (ids) => {
    set({ isSubmitting: true });
    try {
      for (const id of ids) {
        const payload = { userId: id, uniqueID: generateUniqueID(), roi: generatedRoi };
        await deleteP2PAccount(payload);
      }
      await get().fetchPayees();
      useSuccessModalStore
        .getState()
        .showSuccess(
          [{ label: 'Status', value: 'Deleted successfully' }],
          'P2P Account(s) Deleted',
        );
      set({ isSubmitting: false });
      return true;
    } catch (error) {
      set({ isSubmitting: false });
      return false;
    }
  },
}));
