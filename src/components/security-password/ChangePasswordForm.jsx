import Alert from '@/components/global/Alert';
import ConfirmationModal from '@/components/global/ConfirmationModal';
import { useSecurityStore } from '@/store/securityStore';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import GlobalInput from '../global/GlobalInput';
import { Button } from '../ui/button';

const ChangePasswordForm = () => {
  const {
    changePassword,
    isSubmitting,
    error,
    successMessage,
    clearError,
    clearSuccess,
    resetStore,
  } = useSecurityStore();

  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    reEnterPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    return () => resetStore();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));

    if (error) clearError();
    if (successMessage) clearSuccess();
  };

  const validatePassword = (password) => {
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*()_+]/.test(password);
    const validLength = password.length >= 8 && password.length <= 15;

    if (!validLength) return 'Password must be 8-15 characters.';
    if (!hasLower) return 'Must contain a lowercase letter.';
    if (!hasUpper) return 'Must contain an uppercase letter.';
    if (!hasNumber) return 'Must contain a number.';
    if (!hasSpecial) return 'Must contain a special character (!@#$%^&*()_+).';

    return null;
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.oldPassword) newErrors.oldPassword = 'Current password is required.';

    // --- NEW VALIDATION: Old and New Password cannot be same ---
    if (
      formData.oldPassword &&
      formData.newPassword &&
      formData.oldPassword === formData.newPassword
    ) {
      newErrors.newPassword = 'New password cannot be the same as the old password.';
    }

    // Complexity Check
    const passError = validatePassword(formData.newPassword);
    if (passError && !newErrors.newPassword) {
      // Only show complexity error if not same as old
      newErrors.newPassword = passError;
    }

    if (!formData.reEnterPassword) {
      newErrors.reEnterPassword = 'Please re-enter the new password.';
    } else if (formData.newPassword !== formData.reEnterPassword) {
      newErrors.reEnterPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInitiateSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setShowConfirmModal(true);
    }
  };

  const handleConfirmSubmit = async () => {
    const success = await changePassword(formData);
    setShowConfirmModal(false);

    if (success) {
      setFormData({ oldPassword: '', newPassword: '', reEnterPassword: '' });
    }
  };

  const handleCancel = () => {
    setFormData({ oldPassword: '', newPassword: '', reEnterPassword: '' });
    setErrors({});
    resetStore();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="max-w-lg p-6 mx-auto mb-8 bg-white border border-gray-200 rounded-lg shadow-sm"
    >
      <AnimatePresence>
        {error && (
          <div className="mb-6">
            <Alert type="error" message={error} onClose={clearError} />
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {successMessage && (
          <div className="mb-6">
            <Alert type="success" message={successMessage} onClose={clearSuccess} />
          </div>
        )}
      </AnimatePresence>

      <form onSubmit={handleInitiateSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <GlobalInput
            label="Old Password"
            name="oldPassword"
            type="password"
            required
            placeholder="Enter old password"
            value={formData.oldPassword}
            onChange={handleChange}
            error={errors.oldPassword}
          />

          <GlobalInput
            label="New Password"
            name="newPassword"
            type="password"
            required
            placeholder="Enter new password"
            value={formData.newPassword}
            onChange={handleChange}
            error={errors.newPassword}
            helperText="8-15 chars, 1 Upper, 1 Lower, 1 Number, 1 Special Char"
          />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <GlobalInput
            label="Re-enter New Password"
            name="reEnterPassword"
            type="password"
            required
            placeholder="Re-enter new password"
            value={formData.reEnterPassword}
            onChange={handleChange}
            error={errors.reEnterPassword}
          />
        </div>

        <div className="flex justify-start gap-4 pt-4 max-w-[400px] mx-auto">
          <Button
            variant="outline"
            onClick={handleCancel}
            size="default"
            className="w-full text-blue-600 border-blue-600"
            type="button"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            loading={isSubmitting}
            size="default"
            className="w-full text-white"
          >
            Submit
          </Button>
        </div>
      </form>

      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmSubmit}
        title="Confirmation Dialog"
        message="Are you sure you want to submit?"
        confirmText="OK"
        cancelText="Cancel"
        isLoading={isSubmitting}
      />
    </motion.div>
  );
};

export default ChangePasswordForm;
