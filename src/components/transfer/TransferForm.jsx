import { useAccountsStore } from '@/store/accountsStore'; // Import Accounts Store
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import GlobalInput from '../global/GlobalInput';
import GlobalSelect from '../global/GlobalSelect';
import { Button } from '../ui/button';

const frequencyOptions = [
  { value: 'once', label: 'Once' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Bi-weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'halfyearly', label: 'Halfyearly' },
  { value: 'annual', label: 'Annual' },
];

const untilOptions = [
  { value: 'furtherNotice', label: 'Further Notice' },
  { value: 'specificDate', label: 'Specific Date' },
];

const TransferForm = ({ onSubmit, isSubmitting = false, defaultAccount }) => {
  // Get Accounts from Store
  const { accounts } = useAccountsStore();

  // Map accounts to options format
  const accountOptions = accounts.map((acc) => ({
    value: acc.id,
    label: acc.description, // e.g. "SAVINGS 1100... $5000"
    balance: acc.balance,
    currency: acc.currency,
  }));

  const [formData, setFormData] = useState({
    fromAccount: '',
    toAccount: '',
    amount: '',
    description: '',
    transferType: 'immediate',
    startDate: '',
    howOften: 'once',
    untilOption: 'furtherNotice',
    untilDate: '',
  });

  const [errors, setErrors] = useState({});

  // Set Default Account from URL if available
  useEffect(() => {
    if (defaultAccount && accountOptions.find((a) => a.value === defaultAccount)) {
      setFormData((prev) => ({ ...prev, fromAccount: defaultAccount }));
    }
  }, [defaultAccount, accounts]); // Re-run when accounts load

  const isScheduled = formData.transferType === 'scheduled';
  const isRecurring = isScheduled && formData.howOften !== 'once';

  // Derived: Selected Account for Balance Display
  const selectedFromAccount = accountOptions.find((opt) => opt.value === formData.fromAccount);

  // Filter To Accounts (Exclude selected From Account)
  const toAccountOptions = accountOptions.filter((option) => option.value !== formData.fromAccount);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleTransferTypeChange = (value) => {
    handleChange('transferType', value);
    if (value === 'immediate') {
      handleChange('startDate', '');
      handleChange('howOften', 'once');
      handleChange('untilOption', 'furtherNotice');
      handleChange('untilDate', '');
    }
  };

  const handleHowOftenChange = (value) => {
    handleChange('howOften', value);
    if (value === 'once') {
      handleChange('untilOption', 'furtherNotice');
      handleChange('untilDate', '');
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fromAccount) newErrors.fromAccount = 'From account is required.';
    if (!formData.toAccount) newErrors.toAccount = 'To account is required.';
    if (formData.fromAccount && formData.toAccount && formData.fromAccount === formData.toAccount)
      newErrors.toAccount = 'Accounts must be different.';
    if (!formData.amount) newErrors.amount = 'Amount is required.';
    else if (isNaN(formData.amount) || Number(formData.amount) <= 0)
      newErrors.amount = 'Amount must be positive.';
    if (!formData.description) newErrors.description = 'Description is required.';

    if (isScheduled) {
      if (!formData.startDate) newErrors.startDate = 'Start date is required.';
      if (isRecurring) {
        if (!formData.untilOption) newErrors.untilOption = 'Until condition is required.';
        if (formData.untilOption === 'specificDate' && !formData.untilDate) {
          newErrors.untilDate = 'A specific date is required.';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate() && onSubmit) {
      // Find Labels for Preview
      const fromLabel = selectedFromAccount?.label || formData.fromAccount;
      const toLabel =
        accountOptions.find((a) => a.value === formData.toAccount)?.label || formData.toAccount;

      onSubmit({
        ...formData,
        fromAccountLabel: fromLabel,
        toAccountLabel: toLabel,
      });
    }
  };

  const handleReset = () => {
    setFormData({
      fromAccount: defaultAccount || '', // Reset to default if exists
      toAccount: '',
      amount: '',
      description: '',
      transferType: 'immediate',
      startDate: '',
      howOften: 'once',
      untilOption: 'furtherNotice',
      untilDate: '',
    });
    setErrors({});
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="max-w-4xl p-6 mx-auto mb-8 bg-white border border-gray-200 rounded-lg shadow-sm"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Row 1: From & To Account */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <GlobalSelect
              label="From Account"
              required
              placeholder="Select account"
              value={formData.fromAccount}
              onChange={(value) => handleChange('fromAccount', value)}
              options={accountOptions}
              error={errors.fromAccount}
            />

            {/* Dynamic Balance Display */}
            {selectedFromAccount && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-3 mt-2 text-sm font-medium text-blue-800 border-l-4 border-primary rounded-md bg-blue-50"
              >
                Available Balance: {selectedFromAccount.currency}{' '}
                {selectedFromAccount.balance?.toLocaleString()}
              </motion.div>
            )}
          </div>

          <GlobalSelect
            label="To Account"
            required
            placeholder="Select account"
            value={formData.toAccount}
            onChange={(value) => handleChange('toAccount', value)}
            options={toAccountOptions}
            error={errors.toAccount}
          />
        </div>

        {/* Row 2: Amount & Start Date */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <GlobalInput
            label="Amount"
            type="number"
            step="0.01"
            required
            placeholder="0.00"
            value={formData.amount}
            onChange={(e) => handleChange('amount', e.target.value)}
            error={errors.amount}
          />

          {isScheduled ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <GlobalInput
                label="Start Date"
                name="startDate"
                type="date"
                required={isScheduled}
                value={formData.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
                error={errors.startDate}
              />
            </motion.div>
          ) : (
            <div className="hidden md:block"></div>
          )}
        </div>

        {/* Scheduled Options */}
        <div className="grid items-start grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="flex flex-col">
              <label className="block mb-2 text-sm font-medium text-gray-700">Transfer Type</label>
              <div className="flex justify-start gap-2 p-1 border border-gray-300 rounded-md bg-gray-50 max-w-[250px]">
                <button
                  type="button"
                  onClick={() => handleTransferTypeChange('immediate')}
                  className={`px-4 py-2 text-sm font-medium rounded transition-colors w-full ${
                    !isScheduled
                      ? 'bg-primary text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Immediate
                </button>
                <button
                  type="button"
                  onClick={() => handleTransferTypeChange('scheduled')}
                  className={`px-4 py-2 text-sm font-medium rounded transition-colors w-full ${
                    isScheduled
                      ? 'bg-primary text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Scheduled
                </button>
              </div>
            </div>

            {isScheduled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="pt-2 space-y-4"
              >
                <label className="block mb-3 text-sm font-medium text-gray-700">How Often</label>
                <div className="flex flex-wrap gap-4">
                  {frequencyOptions.map((option) => (
                    <label key={option.value} className="flex items-center cursor-pointer group">
                      <input
                        type="radio"
                        name="howOften"
                        value={option.value}
                        checked={formData.howOften === option.value}
                        onChange={(e) => handleHowOftenChange(e.target.value)}
                        className="w-4 h-4 text-primary border-gray-300 focus:ring-orange-100"
                      />
                      <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>

                {isRecurring && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="pt-4 space-y-4"
                  >
                    <GlobalSelect
                      label="Until"
                      required
                      placeholder="Select condition"
                      value={formData.untilOption}
                      onChange={(value) => handleChange('untilOption', value)}
                      options={untilOptions}
                      error={errors.untilOption}
                    />

                    {formData.untilOption === 'specificDate' && (
                      <GlobalInput
                        label="Specific Date"
                        type="date"
                        required
                        value={formData.untilDate}
                        onChange={(e) => handleChange('untilDate', e.target.value)}
                        error={errors.untilDate}
                      />
                    )}
                  </motion.div>
                )}
              </motion.div>
            )}
          </div>

          <GlobalInput
            label="Description"
            required
            placeholder="Enter description"
            isTextarea
            rows={isScheduled ? 10 : 7}
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            error={errors.description}
          />
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button
            variant="outline"
            onClick={handleReset}
            size="default"
            type="button"
            className="w-full text-blue-600 border-blue-600 sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            loading={isSubmitting}
            size="default"
            className="w-full text-white bg-primary sm:w-auto hover:bg-primary"
          >
            Submit
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default TransferForm;
