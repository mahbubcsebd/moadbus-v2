'use client';

import GlobalSuccess from '@/components/global/GlobalSuccess'; // Add this
import HeaderTop from '@/components/global/HeaderTop';
import ChangePasswordForm from '@/components/security-password/ChangePasswordForm';

export default function ChangePassword() {
  return (
    <div>
      <HeaderTop
        title="Change Password"
        text="Update your account password securely"
        link="/dashboard/settings"
        linkText="Back to Settings"
      />

      <ChangePasswordForm />

      {/* Global Modal for Success Message */}
      <GlobalSuccess />
    </div>
  );
}
