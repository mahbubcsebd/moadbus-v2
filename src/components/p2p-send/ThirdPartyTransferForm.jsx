import Alert from '@/components/global/Alert';
import { useAccountsStore } from '@/store/accountsStore';
import { useP2PStore } from '@/store/p2pStore';
import { AnimatePresence, motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import GlobalInput from '../global/GlobalInput';
import GlobalSelect from '../global/GlobalSelect';
import { Button } from '../ui/button';

const recipientTypeOptions = [
  { value: 'email', label: 'Email Address' },
  { value: 'phone', label: 'Phone Number' },
];

const ThirdPartyTransferForm = ({ onSubmit, isSubmitting = false }) => {
  const { accounts } = useAccountsStore();
  const {
    validateRecipient,
    isValidated,
    recipientFound,
    recipientDetails,
    validationMessage,
    validationMessageType,
    resetValidation,
    loading: validating,
  } = useP2PStore();

  const [formData, setFormData] = useState({
    fromAccount: '',
    recipientType: 'email',
    recipientValue: '',
    firstName: '',
    lastName: '',
    amount: '',
    description: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isValidated || validationMessage) {
      resetValidation();
      setFormData((prev) => ({ ...prev, firstName: '', lastName: '' }));
    }
  }, [formData.recipientType, formData.recipientValue]);

  useEffect(() => {
    if (isValidated && recipientFound) {
      setFormData((prev) => ({
        ...prev,
        firstName: recipientDetails.firstName || '',
        lastName: recipientDetails.lastName || '',
      }));
    }
  }, [isValidated, recipientFound, recipientDetails.firstName, recipientDetails.lastName]);

  const selectedAccount = accounts.find((acc) => acc.id === formData.fromAccount);

  const accountOptions = accounts.map((acc) => ({
    value: acc.id,
    label: acc.description,
  }));

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));

    if (field === 'recipientValue' && (isValidated || validationMessage)) {
      resetValidation();
      setFormData((prev) => ({ ...prev, firstName: '', lastName: '' }));
    }
  };

  const handleSearch = async () => {
    if (!formData.recipientValue) {
      setErrors((prev) => ({ ...prev, recipientValue: 'Please enter a value' }));
      return;
    }

    const success = await validateRecipient(formData.recipientValue, formData.recipientType);

    if (success) {
      const currentStoreState = useP2PStore.getState();
      if (currentStoreState.recipientFound) {
        setFormData((prev) => ({
          ...prev,
          firstName: currentStoreState.recipientDetails.firstName || '',
          lastName: currentStoreState.recipientDetails.lastName || '',
        }));
      }
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fromAccount) newErrors.fromAccount = 'Please select an account.';
    if (!formData.recipientValue) newErrors.recipientValue = 'Required.';

    if (!isValidated) {
      newErrors.recipientValue = 'Please click the search icon to validate.';
    }

    if (!formData.firstName.trim()) newErrors.firstName = 'First Name is required.';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last Name is required.';
    if (!formData.amount || Number(formData.amount) <= 0) newErrors.amount = 'Invalid amount.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate() && onSubmit) {
      const accountLabel = selectedAccount?.description || formData.fromAccount;

      onSubmit({
        ...formData,
        fromAccountLabel: accountLabel,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 mx-auto mb-8 bg-white border border-gray-200 rounded-lg shadow-sm"
    >
      {/* Alert Message */}
      <AnimatePresence>
        {validationMessage && (
          <div className="mb-6">
            <Alert type={validationMessageType} message={validationMessage} onClose={() => {}} />
          </div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="relative">
            <GlobalSelect
              label="From Account"
              required
              placeholder="Select"
              value={formData.fromAccount}
              onChange={(value) => handleChange('fromAccount', value)}
              options={accountOptions}
              error={errors.fromAccount}
            />
            {selectedAccount && (
              <div className="p-3 mt-2 text-sm font-medium text-blue-800 border-l-4 border-primary rounded-md bg-blue-50 animate-in fade-in slide-in-from-top-1">
                Available Balance: {selectedAccount.currency}{' '}
                {selectedAccount.balance?.toLocaleString()}
              </div>
            )}
          </div>

          <GlobalSelect
            label="Email Address/Phone Number"
            required
            placeholder="Select Type"
            value={formData.recipientType}
            onChange={(value) => handleChange('recipientType', value)}
            options={recipientTypeOptions}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="relative">
            <GlobalInput
              label={formData.recipientType === 'email' ? 'Email Address' : 'Phone Number'}
              required
              type={formData.recipientType === 'email' ? 'email' : 'tel'}
              placeholder={
                formData.recipientType === 'email' ? 'Enter email' : 'Enter mobile number'
              }
              value={formData.recipientValue}
              onChange={(e) => handleChange('recipientValue', e.target.value)}
              error={errors.recipientValue}
              disabled={false}
              rightElement={
                <button
                  type="button"
                  onClick={handleSearch}
                  disabled={validating || !formData.recipientValue}
                  className={`p-1.5 rounded-md transition-colors ${
                    isValidated
                      ? 'bg-green-100 text-green-600 hover:bg-green-200'
                      : 'bg-gray-100 text-blue-600 hover:bg-gray-200'
                  }`}
                >
                  {validating ? (
                    <span className="block w-5 h-5 border-2 border-gray-500 rounded-full animate-spin border-t-transparent" />
                  ) : (
                    <Search className="w-5 h-5" />
                  )}
                </button>
              }
            />

            <p className="mt-1 text-xs italic text-gray-500">
              Click the search icon to validate recipient.
            </p>
          </div>
        </div>

        {/* Name Fields: Visible ONLY if isValidated is true */}
        <AnimatePresence>
          {isValidated && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 gap-6 overflow-hidden md:grid-cols-2"
            >
              <GlobalInput
                label="First Name"
                required
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                error={errors.firstName}
                // READ ONLY if User Found. EDITABLE if Not Found (Manual Entry).
                isReadOnly={recipientFound}
              />
              <GlobalInput
                label="Last Name"
                required
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                error={errors.lastName}
                // READ ONLY if User Found. EDITABLE if Not Found (Manual Entry).
                isReadOnly={recipientFound}
              />
            </motion.div>
          )}
        </AnimatePresence>

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
        </div>

        <div className="grid grid-cols-1">
          <GlobalInput
            label="Description"
            placeholder="Enter description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
          />
        </div>

        <div className="flex justify-center gap-4 pt-4 max-w-[400px] mx-auto">
          <Button
            variant="outline"
            type="button"
            onClick={() => window.location.reload()}
            className="w-full text-blue-600 border-blue-600 hover:bg-blue-50"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            loading={isSubmitting}
            className="w-full text-white bg-primary hover:bg-primary"
          >
            Submit
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default ThirdPartyTransferForm;
