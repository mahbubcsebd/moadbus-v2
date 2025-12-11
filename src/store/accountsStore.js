import { changeAccountOrder, getAuthAccounts, getUpdatedAccounts } from '@/api/endpoints';
import { generatedRoi } from '@/globals/appGlobals';
import {
  detectAccountColor,
  detectAccountType,
  getAvaiableFunctions,
} from '@/utils/formatAccounts';
import { create } from 'zustand';

// Parse accounts reusing logic
const parseAccountsFromResponse = (rs) => {
  if (!rs) return [];

  // Filter keys starting with 'A' followed by a number (A1, A2...)
  return Object.keys(rs)
    .filter((k) => k.startsWith('A') && !isNaN(k.substring(1)))
    .map((k) => {
      const item = rs[k];
      const type = detectAccountType(item);
      const av_functions = getAvaiableFunctions(item);

      return {
        id: item.i,
        accountNumber: item.a,
        description: item.d,
        currency: item.c,
        accountName: item.n,
        balance: Number(item.b || 0),
        availableBalance: Number(item.ab || 0),
        accountType: item.atype || '1',
        type,
        color: detectAccountColor(item),
        available_functions: av_functions,
      };
    });
};

export const useAccountsStore = create((set, get) => ({
  userName: '',
  userId: '',
  accounts: [],
  notifications: {},
  tn: {},
  loading: false,
  error: null,

  setUserName: (name) => set({ userName: name }),
  setUserId: (userId) => set({ userId }),
  setAccounts: (accounts) => set({ accounts }),
  setNotifications: (notifications) => set({ notifications }),
  setTn: (tn) => set({ tn }),

  // Fetch Accounts
  fetchAccounts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await getAuthAccounts();
      const rs = response?.rs || response;

      if (rs.status === 'success') {
        const parsedAccounts = parseAccountsFromResponse(rs);

        set({
          accounts: parsedAccounts,
          userName: rs.n || 'User',
          notifications: {
            alert: rs.nfg || {},
            promotion: rs.nfp || {},
            reminder: rs.nfu || {},
          },
          tn: rs.tn,
          loading: false,
        });
      } else {
        set({ error: rs.msg, loading: false });
      }
    } catch (error) {
      console.error('Fetch Accounts Error:', error);
      set({ error: 'Failed to load accounts', loading: false });
    }
  },

  // Local Reorder
  reorderAccountsLocal: (newOrder) => {
    set({ accounts: newOrder });
  },

  // Save Order (Following your legacy app pattern)
  saveAccountOrder: async (newAccounts) => {
    try {
      let msgPayLoad = '';
      let order = 1;

      // Build msgPayLoad: accountType##accountNumber##position
      newAccounts.forEach((acc) => {
        const accountType = acc.accountType || '1';
        const accountId = acc.accountNumber;

        if (msgPayLoad !== '') {
          msgPayLoad += '@@';
        }

        msgPayLoad += `${accountType}##${accountId}##${order}`;
        order++;
      });

      const uniqueTypes = [...new Set(newAccounts.map((acc) => acc.accountType || '1'))];
      const msgLoad = uniqueTypes.join('#');

      const payload = {
        msgPayLoad,
        msgLoad,
        roi: generatedRoi,
      };

      console.log('📦 Reorder Payload:', {
        msgPayLoad,
        msgLoad,
        accountCount: newAccounts.length,
      });

      // Call API
      const orderRes = await changeAccountOrder(payload);
      const rsOrder = orderRes?.rs || orderRes;

      if (rsOrder.status === 'success') {
        console.log('Reorder Success:', rsOrder.msg);

        // Fetch updated accounts
        const updateRes = await getUpdatedAccounts();
        const rsUpdate = updateRes?.rs || updateRes;

        if (rsUpdate.status === 'success') {
          const freshAccounts = parseAccountsFromResponse(rsUpdate);

          // Resort fresh data based on newAccounts order
          const sortedFreshAccounts = newAccounts.map(
            (orderedAcc) => freshAccounts.find((fresh) => fresh.id === orderedAcc.id) || orderedAcc,
          );

          set({ accounts: sortedFreshAccounts });
          console.log('Accounts updated successfully');
        } else {
          console.error('Update failed:', rsUpdate.msg);
        }
      } else {
        console.error('Reorder failed:', rsOrder.msg);
        set({ error: rsOrder.msg });
      }
    } catch (error) {
      console.error('Reorder/Update Error:', error);
      set({ error: 'Failed to reorder accounts' });
    }
  },

  clearAccounts: () => set({ accounts: [] }),
  logout: () => set({ userId: '', accounts: [] }),
}));

export const useTransactionStore = create((set) => ({
  transactions: [],
  loading: false,
  error: null,

  fetchRecent: async (apiCall) => {
    set({ loading: true });

    try {
      const res = await apiCall();

      const atsString = res.rs?.ats || '';
      const parsed = parseTransactions(atsString);

      set({ transactions: parsed, loading: false });
    } catch (err) {
      console.error('Failed recent:', err);
      set({ error: true, loading: false });
    }
  },
}));
