import { forgotPassword } from '@/api/endpoints';
import { Button } from '@/components/ui/button';
import FormInput from '@/components/ui/form-input';
import { usePopup } from '@/context/PopupContext';
import useBrandStore from '@/store/brandStore';
import { formatToMMDDYYYY } from '@/utils/formatDate';
import { requiredDateField, requiredField } from '@/utils/formHelpers';
import { useTranslation } from '@/utils/t';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { z } from 'zod';
import Logo from '../global/Logo';
import FormDatePicker from '../ui/form-date-picker';

// Validation Schema
const forgetPassSchema = z.object({
  userId: requiredField('User ID'),
  dateOfBirth: requiredDateField('Date Of Birth'),
});

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const brandConfig = useBrandStore((state) => state.brandConfig);

  const { showMsgPopup } = usePopup();
  const t = useTranslation();

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgetPassSchema),
    defaultValues: {
      userId: '',
      dateOfBirth: null,
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        userName: data.userId,
        birthDate: formatToMMDDYYYY(data.dateOfBirth),
      };

      const res = await forgotPassword(payload);

      if (res.rs.status === 'success') {
        showMsgPopup('success', res.rs.msg);
        navigate('/dashboard');
      } else {
        showMsgPopup('error', res.rs.msg || 'Invalid User ID or Date of Birth');
      }
    } catch (err) {
      console.error(err);
      showMsgPopup('error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div
        className="fixed inset-0 bg-center bg-no-repeat bg-cover"
        style={{
          backgroundImage: "url('./images/login-bg.png')",
        }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-2xl"
      >
        <div className="p-4 border shadow-2xl bg-white/95 backdrop-blur-md rounded-2xl border-white/20">
          <div className="flex items-center justify-between mb-6">
            <Link
              to="/"
              className="flex items-center gap-2 text-gray-600 transition-colors hover:text-primary"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">{t('back')}</span>
            </Link>
          </div>

          <div className="flex justify-center mb-6 max-w-[150px] mx-auto">
            <Logo src={brandConfig.logo} alt={brandConfig.name} />
          </div>

          <div className="mb-6 text-center">
            <h2 className="mb-2 text-2xl font-bold text-gray-900">
              {t('forgot_password.forgot_password')}
            </h2>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <FormInput
              label={t('activate_user.user_id')}
              placeholder="Enter your user ID"
              {...register('userId')}
              error={errors.userId?.message}
              required
            />

            <Controller
              name="dateOfBirth"
              control={control}
              render={({ field }) => (
                <FormDatePicker
                  label={t('forgetID.dob')}
                  {...field}
                  error={errors.dateOfBirth?.message}
                  required
                />
              )}
            />

            <div className="pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="w-full text-white bg-primary hover:bg-primary"
                loading={loading}
              >
                {t('global.submit')}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
