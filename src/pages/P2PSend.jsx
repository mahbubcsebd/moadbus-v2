import RegistrationPrecon from '@/components/auth/PreConfirmation';
import Alert from '@/components/global/Alert';
import GlobalSuccess from '@/components/global/GlobalSuccess';
import HeaderTop from '@/components/global/HeaderTop';
import ThirdPartyTransferForm from '@/components/p2p-send/ThirdPartyTransferForm';
import { useP2PStore } from '@/store/p2pStore';
import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function P2PSend() {
  const { calculateFees, submitPayment, isSubmitting } = useP2PStore();

  const [showPreview, setShowPreview] = useState(false);
  const [feeDetails, setFeeDetails] = useState(null);
  const [formData, setFormData] = useState(null);
  const [pageError, setPageError] = useState(null);

  const handleTransferSubmit = async (data) => {
    setFormData(data);
    setPageError(null);

    const result = await calculateFees(data);

    if (result.success) {
      setFeeDetails(result.data);
      setShowPreview(true);
    } else {
      setPageError(result.message || 'Fee calculation failed');
    }
  };

  const handleFinalConfirm = async () => {
    if (!formData || !feeDetails) return;

    // Check result of submission
    const result = await submitPayment(formData, feeDetails);

    if (result && result.success === false) {
      setShowPreview(false);
      setPageError(result.message || 'Transaction failed');
    } else {
      setShowPreview(false);
    }
  };

  return (
    <div>
      <HeaderTop
        title="Send Money to Third Party"
        text="Send money quickly and securely to friends, family, and contacts"
        link="/dashboard"
        linkText="Back to Dashboard"
      />

      <AnimatePresence>
        {pageError && (
          <div className="mb-4">
            <Alert type="error" message={pageError} onClose={() => setPageError(null)} />
          </div>
        )}
      </AnimatePresence>

      <ThirdPartyTransferForm onSubmit={handleTransferSubmit} isSubmitting={isSubmitting} />

      <AnimatePresence>
        {showPreview && (
          <RegistrationPrecon
            isOpen={showPreview}
            onClose={() => setShowPreview(false)}
            formData={feeDetails}
            onConfirm={handleFinalConfirm}
            isSubmitting={isSubmitting}
            warningText="Please review your payment details carefully. By confirming, you authorize this transaction."
          />
        )}
      </AnimatePresence>

      <GlobalSuccess />
    </div>
  );
}
