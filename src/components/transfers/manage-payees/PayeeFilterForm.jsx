import GlobalSelect from '@/components/global/GlobalSelect';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router';

const payeeTypeOptions = [
  {
    value: 'TTP01',
    label: 'To Other Moadbus Account',
  },
  {
    value: 'TOB01',
    label: 'To Other Local Bank',
  },
];

const PayeeFilterForm = ({ initialFilters, onSearch, isSearching }) => {
  const [filters, setFilters] = useState(initialFilters);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 max-w-4xl mx-auto"
    >
      <Link to="/dashboard/transfers/add-payee" className="flex justify-end">
        <Button type="button" variant="primary">
          Add Payee
        </Button>
      </Link>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlobalSelect
            label="Payee Type"
            placeholder="Select type"
            value={filters.type}
            onChange={(value) => setFilters({ ...filters, type: value })}
            options={payeeTypeOptions}
          />
        </div>

        <Button
          variant="primary"
          type="submit"
          loading={isSearching}
          size="default"
          className="w-full h-10 md:h-12"
        >
          Search
        </Button>
      </form>
    </motion.div>
  );
};

export default PayeeFilterForm;
