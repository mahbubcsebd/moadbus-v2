import GlobalInput from '@/components/global/GlobalInput';
import GlobalSelect from '@/components/global/GlobalSelect';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useState } from 'react';

const transactionTypeOptions = [
  {
    value: 'TMA01',
    label: 'Between my Accounts at Moadbus',
  },
  {
    value: 'TTP01',
    label: 'To Other Moadbus Account',
  },
  { value: 'TOB01', label: 'To Other Local Bank' },
  { value: 'LNP01', label: 'Loan Payment' },
  { value: 'SND01', label: 'Send Money' },
  { value: 'TUP01', label: 'Mobile Topup' },
];

const HistoryFilterForm = ({ initialFilters, onSearch, isSearching = false }) => {
  const [filters, setFilters] = useState(initialFilters);

  const handleChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(filters);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 max-w-4xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative">
            <GlobalInput
              label="Date From"
              type="date"
              placeholder="mm/dd/yyyy"
              value={filters.dateFrom}
              onChange={(e) => handleChange('dateFrom', e.target.value)}
              className="pr-10"
              required
            />
          </div>

          <div className="relative">
            <GlobalInput
              label="Date To"
              type="date"
              placeholder="mm/dd/yyyy"
              value={filters.dateTo}
              onChange={(e) => handleChange('dateTo', e.target.value)}
              className="pr-10"
            />
          </div>

          <GlobalSelect
            label="Transaction Type"
            placeholder="Select type"
            value={filters.type} // bind to state
            onChange={(value) => setFilters((prev) => ({ ...prev, type: value }))}
            options={transactionTypeOptions}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <GlobalInput
            label="Min Amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={filters.minAmount}
            onChange={(e) => handleChange('minAmount', e.target.value)}
          />

          <GlobalInput
            label="Max Amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={filters.maxAmount}
            onChange={(e) => handleChange('maxAmount', e.target.value)}
          />

          <Button
            variant="primary"
            type="submit"
            loading={isSearching}
            size="default"
            className="w-full h-10 md:h-12"
          >
            Search
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default HistoryFilterForm;
