import { generateOTP } from '@/api/endpoints';
import { Button } from '@/components/ui/button';
import { DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { usePopup } from '@/context/PopupContext';
import { parseOtpResponse } from '@/utils/globalResponseParser';
import { useTranslation } from '@/utils/t';

import { useState } from 'react';

export default function OTPForm({ onCancel, onGenerate, loading, setLoading }) {
  const [otp, setOtp] = useState('');
  const [regenerating, setRegenerating] = useState(false);
  const { showMsgPopup } = usePopup();
  const t = useTranslation();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp.length === 6) onGenerate(otp);
  };

  const handleRegenerateToken = async () => {
    setLoading(true);
    setRegenerating(true);
    try {
      const response = await generateOTP({});

      const { type, message } = parseOtpResponse(response);

      showMsgPopup(type, message);

      if (type === 'success') {
        setOtp('');
      }
    } catch (error) {
      console.error('Error regenerating token:', error);
      showMsgPopup('error', 'Failed to regenerate token. Please try again.');
    } finally {
      setRegenerating(false);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <DialogHeader className="mb-3">
        <DialogTitle className="text-lg font-semibold text-left sm:text-xl">
          OTP Confirmation
        </DialogTitle>
      </DialogHeader>
      <div>
        <p className="text-sm text-gray-600">{t('otp.text3')}</p>
      </div>

      <div className="flex justify-center">
        <InputOTP
          maxLength={6}
          value={otp}
          onChange={(val) => setOtp(val)}
          className="flex justify-center"
          autoFocus
        >
          <InputOTPGroup>
            {[...Array(6)].map((_, i) => (
              <InputOTPSlot key={i} index={i} />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          {t('otp.question1')} {''}
          <button
            type="button"
            onClick={handleRegenerateToken}
            disabled={regenerating}
            className="font-medium underline transition-colors text-primary hover:text-primary/80 disabled:opacity-50 disabled:cursor-not-allowed"
            loading={loading}
          >
            {t('otp.generateToken')}
          </button>
        </p>
      </div>

      <DialogFooter className="">
        <div className="flex justify-end gap-2 min-w-xs">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1 py-2 text-sm text-primary border-primary hover:bg-accent/20 sm:text-base sm:py-3"
          >
            {t('cancel')}
          </Button>
          <Button
            type="submit"
            className="flex-1 py-2 text-sm text-white bg-primary hover:bg-primary/90 sm:text-base sm:py-3"
            disabled={loading || otp.length !== 6}
            loading={loading}
          >
            {t('otp.verifyOTP')}
          </Button>
        </div>
      </DialogFooter>
    </form>
  );
}
