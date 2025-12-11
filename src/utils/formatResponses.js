export function parseTransactions(atsString) {
  if (!atsString) return [];

  return atsString
    .split('|')
    .filter(Boolean)
    .map((row) => {
      const parts = row.split('#');

      return {
        id: parts[0],
        date: parts[1],
        amount: Number(parts[2]),
        txnType: parts[3],
        fromAcc: parts[4],
        fromType: parts[5],
        toAcc: parts[6],
        toType: parts[7],
        status: parts[8],
        description: parts[9],
        user: parts[10],
        currency: parts[11],
        fee: Number(parts[14] || 0),
        total: Number(parts[16] || 0),

        category: parts[3],
        accountNumber: parts[4],
        type: Number(parts[2]) >= 0 ? 'credit' : 'debit',
      };
    });
}
