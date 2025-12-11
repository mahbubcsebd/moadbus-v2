import { enrollPersonalUser } from '@/api/endpoints';
import GlobalInput from '@/components/global/GlobalInput';
import GlobalSelect from '@/components/global/GlobalSelect';
import { usePopup } from '@/context/PopupContext';
import { useInitialFetch } from '@/hooks/useInitialFetch';
import useBrandStore from '@/store/brandStore';
import { useMetaDataStore } from '@/store/useMetaDataStore';
import { formatToMMDDYYYY } from '@/utils/formatDate';
import { buildSchema } from '@/utils/formHelpers';
import { useTranslation } from '@/utils/t';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { ArrowLeft, BarChart3, Lock, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link } from 'react-router';
import Logo from '../global/Logo';
import { Button } from '../ui/button';
import FormInput from '../ui/form-input';
import RegistrationPrecon from './PreConfirmation';

// ----------------------
// VALIDATION SCHEMA
// ----------------------
const registrationSchema = buildSchema({
  customerNumber: { label: 'Customer Number', required: true },
  userId: { label: 'User ID', min: 5, required: true },
  firstName: { label: 'First Name', required: true },
  lastName: { label: 'Last Name', required: true },
  dateOfBirth: { label: 'Date of Birth', required: true },
  idNumber: { label: 'ID Number', required: true },
  email: { label: 'Email Address', email: true, required: true },
  branchId: { label: 'Branch ID', required: false },

  mobile: {
    label: 'Mobile Number',
    required: true,
    regex: /^[0-9]{11}$/,
    regexMessage: 'Mobile number must be 11 digits',
  },

  question_1: { label: 'Security Question 1', required: true },
  answer_1: { label: 'Answer 1', required: true },
  question_2: { label: 'Security Question 2', required: true },
  answer_2: { label: 'Answer 2', required: true },
  question_3: { label: 'Security Question 3', required: true },
  answer_3: { label: 'Answer 3', required: true },
  question_4: { label: 'Security Question 4' },
  answer_4: { label: 'Answer 4' },
  question_5: { label: 'Security Question 5' },
  answer_5: { label: 'Answer 5' },
});

export default function () {
  const [loading, setLoading] = useState(false);
  const [isPreOpen, setIsPreOpen] = useState(false);
  const [reviewData, setReviewData] = useState(null);

  useInitialFetch();
  const { showMsgPopup } = usePopup();
  const questions = useMetaDataStore((state) => state.questions) || [];
  const branches = useMetaDataStore((state) => state.branches) || [];
  const t = useTranslation();
  const brandConfig = useBrandStore((state) => state.brandConfig);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registrationSchema),
  });

  const onSubmit = (data) => {
    const processedData = { ...data };

    if (processedData.dateOfBirth) {
      processedData.birthDate = formatToMMDDYYYY(processedData.dateOfBirth);

      delete processedData.dateOfBirth;
    }

    setReviewData(data);
    setIsPreOpen(true);
  };

  const handleFinalSubmit = async () => {
    setLoading(true);

    try {
      let challenge_payload = '';

      for (let i = 1; i <= 5; i++) {
        const question = reviewData[`question_${i}`];
        const answer = reviewData[`answer_${i}`];

        if (answer && answer.trim() !== '') {
          if (challenge_payload) challenge_payload += '|';
          challenge_payload += `${question}#${answer}`;
        }
      }

      challenge_payload = encodeURIComponent(challenge_payload);

      const payload = {
        userId: reviewData.userId,
        phone: reviewData.mobile,
        branchId: reviewData.branchId,
        email: reviewData.email,
        accNo: reviewData.customerNumber,
        custNumber: reviewData.customerNumber,
        firstName: reviewData.firstName,
        lastName: reviewData.lastName,
        birthDate: reviewData.dateOfBirth,
        snId: reviewData.idNumber,
        challenge: challenge_payload,
      };

      const res = await enrollPersonalUser(payload);
      const rs = res.rs || {};

      if (res.status === 'success') {
        showMsgPopup('success', rs.msg);
      } else {
        showMsgPopup('error', rs.msg);
      }
    } catch (err) {
      console.log(err);
      showMsgPopup('error', 'Something went wrong');
    } finally {
      setIsPreOpen(false);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen p-4 overflow-hidden">
        <div
          className="fixed inset-0 bg-center bg-no-repeat bg-cover"
          style={{ backgroundImage: 'url("./images/login-bg.png")' }}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="z-10 w-full max-w-4xl"
        >
          <div className="p-6 border shadow-2xl bg-white/95 backdrop-blur-md rounded-2xl sm:p-8 md:p-10 border-white/20">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <Link
                to="/"
                className="flex items-center gap-2 text-gray-600 transition-colors hover:text-primary"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm font-medium">{t('back')}</span>
              </Link>
            </div>

            <div className="flex justify-center mb-6">
              <Logo src={brandConfig.logo} alt={brandConfig.name} />
            </div>

            <div className="mb-8 text-center">
              <h2 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl">
                {t('beforeLogin.registerToPersonalBanking')}
              </h2>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <p className="font-semibold text-gray-700">Member Details:</p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                <FormInput
                  label={t('register.customer_number')}
                  {...register('customerNumber')}
                  error={errors.customerNumber?.message}
                  required
                />

                <FormInput
                  label={t('register.user_id')}
                  {...register('userId')}
                  error={errors.userId?.message}
                  required
                />

                <FormInput
                  label={t('register.first_name')}
                  {...register('firstName')}
                  error={errors.firstName?.message}
                  required
                />
                <FormInput
                  label={t('register.last_name')}
                  {...register('lastName')}
                  error={errors.lastName?.message}
                  required
                />

                <FormInput
                  type="date"
                  label={t('register.date_of_birth')}
                  {...register('dateOfBirth')}
                  error={errors.dateOfBirth?.message}
                  required
                />

                <FormInput
                  label={t('createUser.IDNumber')}
                  {...register('idNumber')}
                  error={errors.idNumber?.message}
                  required
                />
              </div>

              {/* Contact Info */}
              <p className="pt-3 font-semibold text-gray-700">Contact Information:</p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                <FormInput
                  label={t('beneficiary.phone.number')}
                  type="tel"
                  {...register('mobile')}
                  error={errors.mobile?.message}
                  required
                />

                <FormInput
                  label={t('forgetID.mailId')}
                  type="email"
                  {...register('email')}
                  error={errors.email?.message}
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                <Controller
                  name="branchId"
                  control={control}
                  render={({ field }) => (
                    <GlobalSelect
                      label={t('pick_up_location')}
                      placeholder="Select"
                      options={branches}
                      value={field.value}
                      onChange={(val) => field.onChange(val)}
                    />
                  )}
                />
              </div>

              {/* Security Questions */}
              <div className="pt-3">
                <p className="font-semibold text-gray-700">
                  Security Questions{' '}
                  <span className="text-xs text-gray-500">(Select at least 3)</span>
                </p>

                <div className="mt-3 space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                      <Controller
                        name={`question_${i + 1}`}
                        control={control}
                        render={({ field }) => (
                          <GlobalSelect
                            label={`Security Question ${i + 1}`}
                            placeholder="Select"
                            options={questions}
                            value={field.value}
                            onChange={(val) => field.onChange(val)}
                          />
                        )}
                      />

                      <GlobalInput
                        label="Answer"
                        {...register(`answer_${i + 1}`)}
                        error={errors[`answer_${i + 1}`]?.message}
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-3 pt-6 sm:flex-row">
                <Button type="button" variant="outline" className="flex-1">
                  {t('cancel')}
                </Button>

                <Button type="submit" variant="primary" className="flex-1" loading={loading}>
                  {t('buttons.register')}
                </Button>
              </div>
            </form>

            {/* Benefits */}
            <div className="p-5 mt-10 border border-gray-100 bg-gray-50 rounded-xl sm:p-6">
              <h3 className="mb-4 text-lg font-bold text-gray-800">Exclusive Moadbus Benefits:</h3>

              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-blue-500" />
                  <span>24/7 secure access to your accounts</span>
                </li>
                <li className="flex items-start gap-3">
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                  <span>Advanced financial insights and planning tools</span>
                </li>
                <li className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-blue-500" />
                  <span>Military-grade encryption and fraud protection</span>
                </li>
              </ul>
            </div>

            {/* Footer */}
            <div className="pt-6 mt-8 border-t border-gray-100">
              <p className="text-xs font-medium text-center text-gray-400">
                COPYRIGHT © 2025 FINXACT
              </p>
            </div>
          </div>
        </motion.div>
      </div>
      <RegistrationPrecon
        isOpen={isPreOpen}
        onClose={() => setIsPreOpen(false)}
        formData={reviewData}
        onConfirm={handleFinalSubmit}
        isSubmitting={loading}
      />
    </>
  );
}
