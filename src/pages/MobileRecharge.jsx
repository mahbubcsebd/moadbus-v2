import HeaderTop from '@/components/global/HeaderTop';
import RechargeForm from '@/components/mobile-recharge/RechargeForm';
import { useState } from 'react';

export default function MobileRecharge() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRechargeSubmit = async (formData) => {
    setIsSubmitting(true);

    setIsSubmitting(false);
  };

  return (
    <div>
      <HeaderTop
        title="Mobile Recharge"
        text="Top-up any mobile number"
        link="/dashboard"
        linkText="Back to Dashboard"
      />

      {/* Recharge Form */}
      <RechargeForm onSubmit={handleRechargeSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}
