// src/store/transactionStore.js
import { getRecentTransactions } from '@/api/endpoints';
import { create } from 'zustand';

// Parse transaction string from API
const parseTransactionString = (atsString) => {
  if (!atsString) return [];

  return atsString.split('|').map((txn) => {
    const parts = txn.split('#');

    return {
      id: parts[0],
      date: parts[1],
      amount: parseFloat(parts[2]),
      transactionCode: parts[3],
      fromAccount: parts[4],
      fromAccountType: parts[5],
      toAccount: parts[6],
      toAccountType: parts[7],
      status: parts[8],
      description: parts[9] || 'N/A',
      userName: parts[10],
      fromCurrency: parts[11],
      toCurrency: parts[12],
      fee1: parseFloat(parts[13] || 0),
      fee2: parseFloat(parts[14] || 0),
      fee3: parseFloat(parts[15] || 0),
      fee4: parseFloat(parts[16] || 0),
      fee5: parseFloat(parts[17] || 0),
      fee6: parseFloat(parts[18] || 0),
      additionalInfo: parts[19] || '',
      refAccount1: parts[20],
      refAccount2: parts[21],
      extra: parts[22] || '',
    };
  });
};

export const useTransactionStore = create((set) => ({
  transactions: [],
  loading: false,
  error: null,
  selectedTransaction: null,

  // Fetch transactions
  fetchTransactions: async (payload = {}) => {
    set({ loading: true, error: null });
    try {
      const response = await getRecentTransactions(payload);
      const rs = response?.rs || response;

      if (rs.status === 'success') {
        const parsed = parseTransactionString(rs.ats || '');
        set({ transactions: parsed, loading: false });
      } else {
        set({ error: rs.msg, loading: false });
      }
    } catch (error) {
      console.error('Transaction fetch error:', error);
      set({ error: 'Failed to load transactions', loading: false });
    }
  },

  // Set selected transaction for modal
  setSelectedTransaction: (transaction) => {
    set({ selectedTransaction: transaction });
  },

  clearTransactions: () => {
    set({ transactions: [], selectedTransaction: null });
  },
}));
