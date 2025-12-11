import { getTransactionHistory } from '@/api/endpoints';
import HeaderTop from '@/components/global/HeaderTop';
import { formatToMMDDYYYY } from '@/utils/formatDate';
import { useEffect, useState } from 'react';
import HistoryFilterForm from './history/HistoryFilterForm';
import HistoryResultsTable from './history/HistoryResultsTable';

export default function TransferHistoryPage() {
  const [filters, setFilters] = useState({
    fromDate: '',
    endDate: '',
    type: 'TMA01',
    minAmount: '',
    maxAmount: '',
  });

  const [filteredResults, setFilteredResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (newFilters) => {
    setIsSearching(true);

    try {
      const payload = {
        fromDate: formatToMMDDYYYY(filters.fromDate),
        endDate: formatToMMDDYYYY(filters.endDate),
        type: filters.type,
      };

      // Optional — include only if user selected
      if (newFilters.type) {
        payload.type = newFilters.type;
      }

      if (newFilters.minAmount) payload.minAmount = newFilters.minAmount;
      if (newFilters.maxAmount) payload.maxAmount = newFilters.maxAmount;

      setFilters(newFilters);

      const res = await getTransactionHistory(payload);

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
            desc: parts[9] || '',
            currency: parts[11] || '',
          };
        });
        setFilteredResults(formatted);
      } else {
        console.warn('API error:', res.rs?.msg);
        setFilteredResults([]);
      }
    } catch (err) {
      console.error('API failure:', err);
      setFilteredResults([]);
    }

    setIsSearching(false);
  };

  // 🔥 INITIAL LOAD — auto-search using default filters
  useEffect(() => {
    if (filters.dateFrom && filters.dateTo) {
      handleSearch(filters);
    }
  }, []);

  return (
    <div>
      <HeaderTop
        title="Transfer History"
        text="View and track all your money transfers"
        link="/dashboard"
        linkText="Back to Dashboard"
      />

      <HistoryFilterForm
        initialFilters={filters}
        onSearch={handleSearch}
        isSearching={isSearching}
      />

      <HistoryResultsTable data={filteredResults} isSearching={isSearching} />
    </div>
  );
}
