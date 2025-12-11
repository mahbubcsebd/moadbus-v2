import { getListOfPayees } from '@/api/endpoints';
import { useCallback, useEffect, useState } from 'react';

export function useListOfPayees(params) {
  const [payees, setPayees] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPayees = useCallback(async () => {
    try {
      setLoading(true);

      const res = await getListOfPayees(params);

      if (res.rs?.status === 'success') {
        const raw = res.rs.p.split('|').filter(Boolean);

        const formatted = raw.map((row) => {
          const p = row.split(';');
          console.log('payeee...', p);

          return {
            name: p[0] ?? '',
            accountType: p[1] ?? '',
            routingNo: p[2] ?? '',
            accountNumber: p[5] ?? '',
            bankName: p[6] ?? '',
            nickName: p[7] ?? '',
            currency: p[9] ?? '',
            id: p[10] ?? '',
          };
        });

        setPayees(formatted);
      }
    } catch (err) {
      console.error('Error loading payees:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayees();
  }, []);

  return { payees, loading, refreshPayees: fetchPayees };
}
