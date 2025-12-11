import Alert from '@/components/global/Alert';
import ConfirmationModal from '@/components/global/ConfirmationModal';
import { useAccountOptionStore } from '@/store/accountOptionStore';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import GlobalInput from '../global/GlobalInput';
import { Button } from '../ui/button';

const AccountOptionsForm = ({ account }) => {
  const navigate = useNavigate();
  const { changeNickname, restoreNickname, isSubmitting, error } = useAccountOptionStore();

  // Local States
  const [newNickname, setNewNickname] = useState('');
  const [restoreModalOpen, setRestoreModalOpen] = useState(false);
  const [validationError, setValidationError] = useState(null);

  // NEW: Local Success Message State for Alert
  const [successMessage, setSuccessMessage] = useState(null);

  // Handle Submit (Change Name)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError(null);
    setSuccessMessage(null); // Clear previous success

    if (!newNickname.trim()) {
      setValidationError('Please enter a new account name.');
      return;
    }

    const success = await changeNickname(account.accountNumber, newNickname);

    if (success) {
      setTimeout(() => navigate('/dashboard/accounts'), 2000);
    }
  };

  // Handle Restore Click
  const handleRestoreClick = () => {
    setValidationError(null);
    setSuccessMessage(null);
    setRestoreModalOpen(true);
  };

  // Handle Confirm Restore
  const confirmRestore = async () => {
    // 1. Call API
    const result = await restoreNickname(account.accountNumber);

    // 2. Close Modal
    setRestoreModalOpen(false);

    if (result.success) {
      // 3. Show Success Alert
      setSuccessMessage(result.message);

      // 4. Redirect after a delay (so user can see the alert)
      setTimeout(() => {
        navigate('/dashboard/accounts');
      }, 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl p-8 mx-auto bg-white border border-gray-200 rounded-lg shadow-sm"
    >
      <h2 className="inline-block w-full pb-4 mx-auto mb-8 text-2xl font-semibold text-center text-gray-800 border-b border-primary">
        Change Account Name
      </h2>

      <AnimatePresence>
        {/* Success Alert (Green) */}
        {successMessage && (
          <div className="mb-6">
            <Alert
              type="success"
              message={successMessage}
              onClose={() => setSuccessMessage(null)}
            />
          </div>
        )}

        {/* Error Alert (Red) */}
        {(error || validationError) && (
          <div className="mb-6">
            <Alert
              type="error"
              message={error || validationError}
              onClose={() => {
                setValidationError(null);
              }}
            />
          </div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Current Account Info (Read Only) */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Current Account Name <span className="text-red-500">*</span>
          </label>
          <div className="p-3 text-gray-700 border border-gray-200 rounded-md bg-gray-50">
            {account.type || 'SAVINGS'}
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Displays as: {account.type} {account.accountNumber} {account.currency} {account.balance}
          </p>
        </div>

        {/* New Name Input */}
        <GlobalInput
          label="New Account Name"
          placeholder=""
          value={newNickname}
          onChange={(e) => setNewNickname(e.target.value)}
        />

        {/* Restore Button */}
        <button
          type="button"
          onClick={handleRestoreClick}
          disabled={isSubmitting}
          className="w-full py-3 text-sm font-medium text-blue-800 transition-colors bg-white border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50"
        >
          Restore Account Name
        </button>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <Button
            variant="outline"
            type="button"
            className="text-blue-600 border-blue-600"
            // onClick={() => navigate('/dashboard/activity')}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            loading={isSubmitting}
            className="text-white bg-primary hover:bg-primary"
          >
            Submit
          </Button>
        </div>
      </form>

      {/* Restore Confirmation Modal */}
      <ConfirmationModal
        isOpen={restoreModalOpen}
        onClose={() => setRestoreModalOpen(false)}
        onConfirm={confirmRestore}
        isLoading={isSubmitting}
        title="Restore Account Name"
        message={`Are you sure you want to restore the default nickname for account ${account.accountNumber}?`}
        confirmText="Yes, Restore"
        cancelText="Cancel"
      />
    </motion.div>
  );
};

export default AccountOptionsForm;
