/**
 * Parse Transaction Activity String
 * Input Format: "ID#Date#Desc#Amount#Type#?#Balance#Date|..."
 */
export const parseTransactionActivity = (atString) => {
  if (!atString || typeof atString !== 'string') return [];

  return atString
    .split('|')
    .filter((item) => item && item.trim() !== '')
    .map((item) => {
      const parts = item.split('#');
      // 0: ID, 1: Date, 2: Desc, 3: Amount (USD -20.00), 4: Type (D/C), 6: Balance

      if (parts.length < 7) return null;

      const rawAmountStr = parts[3] || '';
      const type = parts[4]; // D or C

      // Clean amount string (remove USD and comma)
      const cleanAmount = rawAmountStr.replace('USD', '').replace(/,/g, '').trim();
      const amountValue = parseFloat(cleanAmount);

      return {
        id: parts[0],
        date: parts[1],
        description: parts[2],
        amount: Math.abs(amountValue).toFixed(2), // Always show positive in column
        originalAmount: rawAmountStr,
        type: type, // 'D' for Debit, 'C' for Credit
        balance: parts[6],
      };
    })
    .filter(Boolean);
};

export const parseAccountSummary = (data) => {
  if (!data) return {};

  return {
    'Current Balance': data.currentBalance || data.cb || data.balance || '0.00',
    'Available Balance': data.availableBalance || data.ab || data.balance || '0.00',
    'Account Number': data.accountNumber || data.an || data.accNo || '',
    'Account Type': data.accountType || data.at || '',
    Currency: data.currency || data.curr || 'USD',
    Status: data.status || 'Active',
  };
};

export const parseRecentTransactions = (atsString) => {
  if (!atsString || typeof atsString !== 'string') return [];

  return atsString
    .split('|')
    .filter((item) => item && item.trim() !== '')
    .map((item) => {
      const parts = item.split('#');
      if (parts.length < 5) return null;

      const amount = parseFloat(parts[2]?.replace(/,/g, '')) || 0;

      return {
        id: parts[0],
        date: parts[1],
        amount: amount,
        category: parts[3],
        accountNumber: parts[4],
        description: parts[9] || 'Transaction',
        status: parts[8],
        type: amount < 0 ? 'debit' : 'credit',
      };
    })
    .filter(Boolean);
};
