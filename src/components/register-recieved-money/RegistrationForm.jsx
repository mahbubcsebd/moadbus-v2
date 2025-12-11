import Alert from '@/components/global/Alert';
import { useAccountsStore } from '@/store/accountsStore';
import { useP2PReceiveStore } from '@/store/p2pReceiveStore';
import { AnimatePresence, motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import GlobalInput from '../global/GlobalInput';
import GlobalSelect from '../global/GlobalSelect';
import { Button } from '../ui/button';

const contactOptions = [
  { value: 'email', label: 'Email Address' },
  { value: 'phone', label: 'Phone Number' },
];

const RegistrationForm = ({ onSubmit, isSubmitting = false }) => {
  const { accounts } = useAccountsStore();
  const {
    validateContact,
    isValidated,
    recipientFound,
    recipientDetails,
    validationError,
    validationSuccessMessage,
    resetValidation,
    loading: validating,
  } = useP2PReceiveStore();

  const [formData, setFormData] = useState({
    nickname: '',
    receiveAccount: '',
    contactType: 'email',
    contactValue: '',
    firstName: '',
    lastName: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isValidated || validationError) resetValidation();
    setFormData((prev) => ({ ...prev, firstName: '', lastName: '' }));
  }, [formData.contactType, formData.contactValue]);

  useEffect(() => {
    if (isValidated && recipientFound) {
      setFormData((prev) => ({
        ...prev,
        firstName: recipientDetails.firstName,
        lastName: recipientDetails.lastName,
      }));
    }
  }, [isValidated, recipientFound, recipientDetails]);

  const accountOptions = accounts.map((acc) => ({
    value: acc.id,
    label: acc.description,
  }));

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));

    if (field === 'contactValue' && (isValidated || validationError)) {
      resetValidation();
    }
  };

  const handleSearch = async () => {
    if (!formData.contactValue) {
      setErrors((prev) => ({ ...prev, contactValue: 'Please enter value' }));
      return;
    }
    await validateContact(formData.contactValue, formData.contactType);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nickname.trim()) newErrors.nickname = 'Nickname is required.';
    if (!formData.receiveAccount) newErrors.receiveAccount = 'Account is required.';
    if (!formData.contactValue.trim()) newErrors.contactValue = 'Required.';
    if (!isValidated) newErrors.contactValue = 'Please validate first.';

    // Validate names (Manual or Auto)
    if (!formData.firstName.trim()) newErrors.firstName = 'First Name is required.';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last Name is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate() && onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 mx-auto mb-8 bg-white border border-gray-200 rounded-lg shadow-sm"
    >
      <AnimatePresence>
        {validationError && (
          <div className="mb-6">
            <Alert type="error" message={validationError} onClose={resetValidation} />
          </div>
        )}
        {/* Show Success/Warning Message (e.g., "No Customer info...") */}
        {validationSuccessMessage && (
          <div className="mb-6">
            <Alert
              type={recipientFound ? 'success' : 'warning'}
              message={validationSuccessMessage}
              onClose={() => {}}
            />
          </div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <GlobalInput
            label="Nickname"
            required
            placeholder="Enter nickname"
            value={formData.nickname}
            onChange={(e) => handleChange('nickname', e.target.value)}
            error={errors.nickname}
          />
          <GlobalSelect
            label="Receiving Account"
            required
            placeholder="Select"
            value={formData.receiveAccount}
            onChange={(value) => handleChange('receiveAccount', value)}
            options={accountOptions}
            error={errors.receiveAccount}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <GlobalSelect
            label="Email/Phone"
            required
            placeholder="Select"
            value={formData.contactType}
            onChange={(value) => handleChange('contactType', value)}
            options={contactOptions}
          />

          <GlobalInput
            label={formData.contactType === 'email' ? 'Email Address' : 'Phone Number'}
            required
            type={formData.contactType === 'email' ? 'email' : 'tel'}
            placeholder={formData.contactType === 'email' ? 'Enter email' : 'Enter phone'}
            value={formData.contactValue}
            onChange={(e) => handleChange('contactValue', e.target.value)}
            error={errors.contactValue}
            disabled={false}
            rightElement={
              <button
                type="button"
                onClick={handleSearch}
                disabled={validating || !formData.contactValue}
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
        </div>

        <AnimatePresence>
          {isValidated && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="grid grid-cols-1 gap-6 overflow-hidden md:grid-cols-2"
            >
              <GlobalInput
                label="First Name"
                required
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                error={errors.firstName}
                isReadOnly={recipientFound}
              />
              <GlobalInput
                label="Last Name"
                required
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                error={errors.lastName}
                isReadOnly={recipientFound}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-center gap-4 pt-4 max-w-[400px] mx-auto">
          <Button
            variant="outline"
            type="button"
            onClick={() => window.history.back()}
            className="w-full text-blue-600 border-blue-600"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            loading={isSubmitting}
            className="w-full text-white bg-primary hover:bg-primary"
          >
            Register
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default RegistrationForm;
