'use client';

import RegistrationPrecon from '@/components/auth/PreConfirmation'; // Using your existing Preview Modal
import GlobalSuccess from '@/components/global/GlobalSuccess';
import HeaderTop from '@/components/global/HeaderTop';
import ReportFraudForm from '@/components/security-fraud/ReportFraudForm';
import { useFraudStore } from '@/store/fraudStore';
import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function ReportFraud() {
  const { submitReport, isSubmitting } = useFraudStore();

  // State for Preview Modal
  const [showPreview, setShowPreview] = useState(false);
  const [pendingData, setPendingData] = useState(null);

  // 1. Triggered by Form Submit -> Open Preview
  const handleInitiateSubmit = (data) => {
    // Prepare data for preview (Use Label for Reason)
    const previewData = {
      Reason: data.reasonLabel,
      Message: data.message,
    };

    // Store original data for API call
    setPendingData({ apiData: data, previewData: previewData });
    setShowPreview(true);
  };

  // 2. Triggered by Modal Confirm -> Call API
  const handleFinalConfirm = async () => {
    if (!pendingData) return;

    const success = await submitReport(pendingData.apiData);
    if (success) {
      setShowPreview(false);
      setPendingData(null);
      // Optional: Reset form logic if needed
    }
  };

  return (
    <div>
      <HeaderTop
        title="Report Fraud"
        text="Protect yourself and others by reporting suspicious activity"
        link="/dashboard"
        linkText="Back to Dashboard"
      />

      <ReportFraudForm onSubmit={handleInitiateSubmit} isSubmitting={isSubmitting} />

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <RegistrationPrecon
            isOpen={showPreview}
            onClose={() => setShowPreview(false)}
            formData={pendingData?.previewData} // Show pretty data
            onConfirm={handleFinalConfirm}
            isSubmitting={isSubmitting}
            warningText="Please review your report details carefully before submitting."
          />
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <GlobalSuccess />
    </div>
  );
}
