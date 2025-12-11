import Alert from '@/components/global/Alert';
import { useMessageStore } from '@/store/useMessageStore';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import GlobalInput from '../global/GlobalInput';
import GlobalSelect from '../global/GlobalSelect';
import { Button } from '../ui/button';

const statusOptions = [
  { value: 'Inbox', label: 'Inbox' },
  { value: 'Outbox', label: 'Outbox' },
];

const categoryOptions = [
  { value: 'All Categories', label: 'All Categories' },
  { value: 'Account Inquiry', label: 'Bank Account' },
  { value: 'Profile Update', label: 'Cell Number Change' },
  { value: 'Notification', label: 'Change Email Address' },
  { value: 'Consumer Loan', label: 'Consumer Loan' },
  { value: 'Mortgage', label: 'Mortgage' },
];

const dateRangeOptions = [
  { value: 'Select', label: 'Select' },
  { value: 'Last 30 Days', label: 'Last 30 Days' },
  { value: 'Last 90 Days', label: 'Last 90 Days' },
  { value: 'Last 6 Months', label: 'Last 6 Months' },
  { value: 'Last Year', label: 'Last Year' },
  { value: 'Custom', label: 'Custom' },
];

const MessageFilter = ({ initialFilters, onFilterChange, onClearFilters }) => {
  const [filters, setFilters] = useState(initialFilters);
  const [showCustomDate, setShowCustomDate] = useState(false);
  const [customDateRange, setCustomDateRange] = useState({
    from: '',
    to: '',
  });
  const [notification, setNotification] = useState(null); // { type: 'error'|'success', message: '' }
  const { changeStatus } = useMessageStore();

  // Sync with parent filters
  useEffect(() => {
    setFilters(initialFilters);
    setShowCustomDate(initialFilters.dateRange === 'Custom');
  }, [initialFilters]);

  const handleChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);

    // If date range is Custom, show date inputs
    if (field === 'dateRange') {
      setShowCustomDate(value === 'Custom');

      // If not custom, apply filter immediately
      if (value !== 'Custom') {
        if (field === 'status') {
          changeStatus(value);
        } else {
          onFilterChange(newFilters);
        }
      }
    } else {
      // If status changed, trigger API call
      if (field === 'status') {
        changeStatus(value);
      } else {
        // Other filters just update local state
        onFilterChange(newFilters);
      }
    }
  };

  const handleCustomDateChange = (field, value) => {
    setCustomDateRange((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApplyCustomDate = () => {
    // Validation
    if (!customDateRange.from || !customDateRange.to) {
      setNotification({
        type: 'error',
        message: 'Please select both From and To dates',
      });
      return;
    }

    // Validate date range
    const fromDate = new Date(customDateRange.from);
    const toDate = new Date(customDateRange.to);

    if (fromDate > toDate) {
      setNotification({
        type: 'error',
        message: 'From date cannot be after To date',
      });
      return;
    }

    // Apply custom date filter
    const newFilters = {
      ...filters,
      dateRange: 'Custom',
      customDateRange: customDateRange,
    };

    setFilters(newFilters);
    onFilterChange(newFilters);

    // Show success notification
    setNotification({
      type: 'success',
      message: 'Custom date range applied successfully',
    });
  };

  const handleClear = () => {
    setShowCustomDate(false);
    setCustomDateRange({ from: '', to: '' });
    setNotification(null);
    onClearFilters();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      {/* Alert Notification */}
      <AnimatePresence>
        {notification && (
          <Alert
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification(null)}
            autoClose={5000}
          />
        )}
      </AnimatePresence>

      {/* Filter Box */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="grid items-end grid-cols-2 gap-4 md:grid-cols-4">
          {/* Status */}
          <GlobalSelect
            label="Status"
            placeholder="Inbox"
            value={filters.status}
            onChange={(value) => handleChange('status', value)}
            options={statusOptions}
          />

          {/* Category */}
          <GlobalSelect
            label="Category"
            placeholder="All Categories"
            value={filters.category}
            onChange={(value) => handleChange('category', value)}
            options={categoryOptions}
          />

          {/* Date Range */}
          <GlobalSelect
            label="Date Range"
            placeholder="Select"
            value={filters.dateRange}
            onChange={(value) => handleChange('dateRange', value)}
            options={dateRangeOptions}
          />

          {/* Clear Button */}
          <div>
            <Button
              variant="primary"
              onClick={handleClear}
              size="default"
              className="w-full h-10 text-sm text-white bg-primary hover:bg-primary md:h-12"
            >
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Custom Date Range Inputs */}
        <AnimatePresence>
          {showCustomDate && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="pt-4 mt-4 border-t border-gray-200"
            >
              <div className="grid items-end grid-cols-1 gap-4 md:grid-cols-3">
                {/* From Date */}
                <GlobalInput
                  label="From"
                  type="date"
                  placeholder="mm/dd/yyyy"
                  value={customDateRange.from}
                  onChange={(e) => handleCustomDateChange('from', e.target.value)}
                />

                {/* To Date */}
                <GlobalInput
                  label="To"
                  type="date"
                  placeholder="mm/dd/yyyy"
                  value={customDateRange.to}
                  onChange={(e) => handleCustomDateChange('to', e.target.value)}
                  min={customDateRange.from}
                />

                {/* Apply Button */}
                <div>
                  <Button
                    variant="primary"
                    onClick={handleApplyCustomDate}
                    size="default"
                    className="w-full h-10 text-sm text-white bg-primary hover:bg-primary md:h-12"
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default MessageFilter;
