import { requiredField } from '@/utils/formHelpers';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router';
import { z } from 'zod';
import OTPForm from '../ui/otp-form';

import { activateUser, validateUser } from '@/api/endpoints';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import FormInput from '@/components/ui/form-input';

import { usePopup } from '@/context/PopupContext';
import useBrandStore from '@/store/brandStore';
import { useTranslation } from '@/utils/t';
import LanguageSelector from '../global/LanguageSelector';
import Logo from '../global/Logo';

// Validation Schema
const activateDeviceSchema = z.object({
  userId: requiredField('User ID'),
  accountNumber: requiredField('Account Number'),
  email: requiredField('Email'),
});

export default function ActivateDevice() {
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [altMobOptions, setAltMobOptions] = useState([]);
  const [selectedAltMob, setSelectedAltMob] = useState('');
  const [showOTPForm, setShowOTPForm] = useState(false);
  const brandConfig = useBrandStore((state) => state.brandConfig);

  const { showMsgPopup } = usePopup();
  const t = useTranslation();

  // Setup React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(activateDeviceSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const payload = {
        userId: data.userId,
        cardNo: data.accountNumber,
        phone: data.email,
      };

      const res = await validateUser(payload);
      const rs = res.rs || {};

      const [codeStr, msg] = (rs.ec || '').split(',');
      const responseCode = Number(codeStr);

      console.log('EC RESPONSE:', responseCode, msg);

      if (responseCode === 5) {
        // Popup then redirect
        showMsgPopup('info', msg, (navigate) => {
          navigate('/login');
        });
        return;
      }

      if (responseCode === 0 || responseCode === 3) {
        // Show OTP screen
        setShowOTPForm(true);
        return;
      }

      // Other error
      showMsgPopup('error', msg || 'Something went wrong');
    } catch (err) {
      console.log(err);
      showMsgPopup('error', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP Verification
  const handleOTPSubmit = async (otp) => {
    setLoading(true);

    try {
      const payload = {
        pin: otp,
        password: '',
        confirmPwd: '',
      };

      const res = await activateUser(payload);
      const rs = res.rs || {};

      const [codeStr, msg] = (rs.ec || '').split(',');
      const responseCode = Number(codeStr);

      if (responseCode === 0) {
        showMsgPopup('success', msg, (navigate) => {
          navigate('/');
        });
        return;
      }

      showMsgPopup('error', msg);
    } catch (err) {
      showMsgPopup('error', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="relative flex items-center justify-center min-h-screen p-4 overflow-hidden">
        <div
          className="absolute inset-0 bg-center bg-no-repeat bg-cover"
          style={{
            backgroundImage: "url('./images/login-bg.png')",
          }}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="z-10 w-full max-w-md"
        >
          <div className="p-5 border shadow-2xl bg-white/95 backdrop-blur-md rounded-2xl md:p-10 border-white/20">
            <div className="flex items-center justify-between mb-6">
              <Link
                to="/"
                className="flex items-center gap-2 text-gray-600 transition-colors hover:text-primary"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm font-medium">{t('back')}</span>
              </Link>
            </div>
            <div className="absolute right-3 top-3">
              <LanguageSelector />
            </div>
            <div className="mb-8 text-center">
              <div className="flex justify-center max-w-[150px] mx-auto py-5">
                <Logo src={brandConfig.logo} alt={brandConfig.name} />
              </div>
              <h2 className="mb-2 text-2xl font-semibold text-gray-800">Activate Device</h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <FormInput
                label="User ID"
                placeholder="Enter your user ID"
                {...register('userId')}
                error={errors.userId?.message}
                required
              />

              <FormInput
                label="Account Number"
                placeholder="Enter your Account Number"
                {...register('accountNumber')}
                error={errors.accountNumber?.message}
                required
              />

              <FormInput
                label="Email"
                placeholder="Enter your Email"
                {...register('email')}
                error={errors.email?.message}
                required
              />

              <div className="grid gap-3">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full font-medium text-white bg-primary hover:bg-primary"
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
      <Dialog open={showOTPForm} onOpenChange={setShowOTPForm}>
        <DialogContent className="gap-0 sm:max-w-md">
          <OTPForm
            onCancel={() => setShowOTPForm(false)}
            onGenerate={handleOTPSubmit}
            loading={loading}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
