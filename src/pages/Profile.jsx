'use client';

import RegistrationPrecon from '@/components/auth/PreConfirmation';
import HeaderTop from '@/components/global/HeaderTop';
import TransferSuccess from '@/components/global/TransferSuccess';
import ContactInfoForm from '@/components/profile/ContactInfoForm';
import { AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

import { useProfileStore } from '@/store/profileStore';

export default function ProfilePage() {
  const { profileData, fetchProfile, updateProfile, isSubmitting, loading } = useProfileStore();
  const [showPreview, setShowPreview] = useState(false);
  const [pendingData, setPendingData] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  // Handle Form Submit
  const handleFormSubmit = (formData) => {
    setPendingData(formData);
    setShowPreview(true);
  };

  // Handle Confirm
  const handleConfirmUpdate = async () => {
    if (!pendingData) return;

    const success = await updateProfile(pendingData);
    if (success) {
      setShowPreview(false);
      setPendingData(null);
    }
  };

  if (loading && !profileData) {
    return <div className="p-8 text-center text-gray-500">Loading Profile...</div>;
  }

  return (
    <div>
      <HeaderTop
        title="My Profile"
        text="Manage your personal information"
        link="/dashboard"
        linkText="Back to Dashboard"
      />

      {/* Profile Form */}
      {profileData && (
        <ContactInfoForm
          initialData={profileData}
          onSubmit={handleFormSubmit}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Preview / Confirmation Modal */}
      <AnimatePresence>
        {showPreview && (
          <RegistrationPrecon
            isOpen={showPreview}
            onClose={() => setShowPreview(false)}
            formData={pendingData}
            onConfirm={handleConfirmUpdate}
            isSubmitting={isSubmitting}
          />
        )}
      </AnimatePresence>

      {/* Global Success Modal */}
      <TransferSuccess />
    </div>
  );
}
