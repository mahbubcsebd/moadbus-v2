'use client';

import RegistrationPrecon from '@/components/auth/PreConfirmation'; // Preview Modal
import Alert from '@/components/global/Alert';
import GlobalSuccess from '@/components/global/GlobalSuccess';
import HeaderTop from '@/components/global/HeaderTop';
import TransferForm from '@/components/transfer/TransferForm';
import { useTransferStore } from '@/store/transferStore';
import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useParams } from 'react-router';

export default function Transfer() {
  const { accountNumber } = useParams();
  const { calculateFees, submitTransfer, isSubmitting } = useTransferStore();

  const [showPreview, setShowPreview] = useState(false);
  const [feeDetails, setFeeDetails] = useState(null);
  const [formData, setFormData] = useState(null);
  const [pageError, setPageError] = useState(null);

  // Submit Form -> Calculate Fee
  const handleFormSubmit = async (data) => {
    setFormData(data);
    setPageError(null);

    const result = await calculateFees(data);

    if (result.success) {
      setFeeDetails(result.data); // Contains Amount, Commission, etc.
      setShowPreview(true);
    } else {
      setPageError(result.message || 'Fee calculation failed');
    }
  };

  // 2. Confirm Preview -> Submit Transfer
  const handleFinalSubmit = async () => {
    if (!formData || !feeDetails) return;

    const success = await submitTransfer(formData, feeDetails);

    if (success) {
      setShowPreview(false);
      // Success modal handles itself via store
    } else {
      setShowPreview(false);
      // Error will be shown in pageError via store or manual handling?
      // Store sets 'error', but we can also set local page error if submit returns false
      setPageError('Transaction failed. Please try again.');
    }
  };

  return (
    <div>
      <HeaderTop
        title="Transfer"
        text="Move money easily between your own accounts"
        link="/dashboard"
        linkText="Back to Dashboard"
      />

      <AnimatePresence>
        {pageError && (
          <div className="mb-6">
            <Alert type="error" message={pageError} onClose={() => setPageError(null)} />
          </div>
        )}
      </AnimatePresence>

      <TransferForm
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
        defaultAccount={accountNumber}
      />

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <RegistrationPrecon
            isOpen={showPreview}
            onClose={() => setShowPreview(false)}
            formData={feeDetails}
            onConfirm={handleFinalSubmit}
            isSubmitting={isSubmitting}
            warningText="Please review your transfer details carefully."
          />
        )}
      </AnimatePresence>

      {/* Global Success Modal */}
      <GlobalSuccess />
    </div>
  );
}
