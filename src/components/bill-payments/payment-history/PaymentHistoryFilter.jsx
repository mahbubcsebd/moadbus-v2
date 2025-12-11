

import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { Calendar } from 'lucide-react';
import GlobalInput from '../../global/GlobalInput';
import GlobalSelect from '../../global/GlobalSelect';
import { Button } from '../../ui/button';


import { getlistOfBills } from '@/api/endpoints';



const PaymentHistoryFilter = ({
  initialFilters,
  onSearch,
  isSearching = false,
}) => {
  const [filters, setFilters] = useState(initialFilters);
  const [billerOptions, setBillersOption] = useState([]);
  const handleChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(filters);
    }
  };

  const getBillersList = async (params) => {
    try {
      let listOfBills = await getlistOfBills();
      listOfBills = listOfBills.rs.b.split('|');
      let billerOptions = [];
      listOfBills.map((item) => {
        let current_array = item.split(';');
        let x = current_array[0];
        let nickName = x.substr(x.indexOf('-') + 1);

        billerOptions.push({
          label: nickName,
          value: nickName
        })
      })
      setBillersOption(billerOptions);
    } catch (e) {
      console.error("Error get biller list", e);
      setBillersOption([])
    }
  }
  useMemo(() => {
    getBillersList()
  }, [])

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Row 1: Date From, Date To, Biller, Search Button */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
        {/* Date From */}
        <div className="relative">
          <GlobalInput
            label="Date From"
            type="date"
            placeholder="mm/dd/yyyy"
            value={filters.fromDate}
            onChange={(e) => handleChange('fromDate', e.target.value)}
            className="pr-10"
          />
          {/* <Calendar className="absolute right-3 top-1/2 -mt-1 transform -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer" /> */}
        </div>

        {/* Date To */}
        <div className="relative">
          <GlobalInput
            label="Date To"
            type="date"
            placeholder="mm/dd/yyyy"
            value={filters.endDate}
            onChange={(e) => handleChange('endDate', e.target.value)}
            className="pr-10"
          />
          {/* <Calendar className="absolute right-3 top-1/2 -mt-1 transform -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer" /> */}
        </div>

        {/* Biller Select */}
        <GlobalSelect
          label="Biller"
          placeholder="Select"
          value={filters.billerId}
          onChange={(value) => handleChange('billerId', value)}
          options={billerOptions}
        />

        {/* Search Button */}
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
  );
};

export default PaymentHistoryFilter;