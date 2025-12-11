import { getAccountActivity, getAccountSummary } from '@/api/endpoints'; // Import new API
import { parseAccountSummary, parseTransactionActivity } from '@/utils/transactionHelpers'; // Import helper
import { create } from 'zustand';

export const useTransactionStore = create((set) => ({
  transactions: [],
  summary: null, // New State for Summary
  loading: false,
  error: null,

  // Fetch Transactions (Existing)
  fetchTransactions: async (accountNumber) => {
    set({ loading: true, error: null }); // Don't clear transactions immediately to avoid flicker
    try {
      const payload = { accNo: accountNumber };
      const response = await getAccountActivity(payload);
      const rs = response?.rs || response;

      if (rs.status === 'success') {
        const parsedList = parseTransactionActivity(rs.at);
        set({ transactions: parsedList, loading: false });
      } else {
        set({ error: rs.msg, loading: false, transactions: [] });
      }
    } catch (error) {
      console.error('Fetch Activity Error:', error);
      set({ error: 'Failed to fetch transactions', loading: false });
    }
  },

  // Fetch Summary (NEW)
  fetchSummary: async (accountNumber) => {
    // Note: We don't set loading: true here to avoid overwriting the transaction loading state if called together
    // Or you can create a separate loadingSummary state if needed.
    try {
      const payload = { accNo: accountNumber };
      const response = await getAccountSummary(payload);
      const rs = response?.rs || response;

      if (rs.status === 'success') {
        // Assuming details are in 'rs' directly or a sub-object like 'summary'
        const parsedSummary = parseAccountSummary(rs.details || rs);
        set({ summary: parsedSummary });
      }
    } catch (error) {
      console.error('Fetch Summary Error:', error);
    }
  },
}));
