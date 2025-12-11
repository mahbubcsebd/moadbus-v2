import { getTransactionHistory } from '@/api/endpoints';
import { useCallback, useEffect, useState } from 'react';

export function useTransactionHistory(type) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);

      const res = await getTransactionHistory({ type });

      if (res.rs?.status === 'success') {
        const raw = res.rs.ats.split('|').filter(Boolean);

        const formatted = raw.map((row) => {
          const parts = row.split('#');

          return {
            id: parts[0],
            date: parts[1],
            amount: Number(parts[2]),
            fromAccount: `${parts[4]} (${parts[5]})`,
            toAccount: `${parts[6]} (${parts[7]})`,
            status: parts[8],
            reference: parts[9] || '',
          };
        });

        setHistory(formatted);
      } else {
        console.error('Failed to fetch history:', res.rs?.msg);
      }
    } catch (err) {
      console.error('Error loading history:', err);
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return { history, loading, refresh: fetchHistory };
}
