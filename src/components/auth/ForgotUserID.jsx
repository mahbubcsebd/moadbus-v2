import { Button } from '@/components/ui/button';
import FormInput from '@/components/ui/form-input';
import FormSelect from '@/components/ui/form-select';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import FormDatePicker from '../ui/form-date-picker';

import { forgotUserID } from '@/api/endpoints';
import { usePopup } from '@/context/PopupContext';
import useBrandStore from '@/store/brandStore';
import { formatToMMDDYYYY } from '@/utils/formatDate';
import { requiredDateField, requiredField } from '@/utils/formHelpers';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import Logo from '../global/Logo';

// Validation Schema
const forgetUserIdSchema = z.object({
  customerNumber: requiredField('Customer Number'),
  emailAddress: requiredField('Email Address'),
  mobileNumber: requiredField('Mobile Number'),
  dateOfBirth: requiredDateField('Date of Birth'),
  identificationType: requiredField('Identification Type'),
  idNumber: requiredField('Identification Number'),
});

export default function ForgotUserID() {
  const { showMsgPopup } = usePopup();
  const brandConfig = useBrandStore((state) => state.brandConfig);

  const navigate = useNavigate();

  const {
    control,
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgetUserIdSchema),
    defaultValues: {
      dateOfBirth: null,
    },
  });

  const onSubmit = async (data) => {
    const identificationPayload = {
      [data.identificationType]: data.idNumber,
    };

    try {
      const payload = {
        accountNumber: data.customerNumber,
        accountType: '1',
        custType: '1',
        phoneNumber: data.mobileNumber,
        email: data.emailAddress,
        birthDate: formatToMMDDYYYY(data.dateOfBirth),
        ...identificationPayload,
      };

      const res = await forgotUserID(payload);

      if (res.rs.status === 'success') {
        showMsgPopup('success', res.rs.msg);
        navigate('/');
      } else {
        showMsgPopup('error', res.rs.msg || 'Invalid User ID or Date of Birth');
      }
    } catch (err) {
      console.error(err);
      showMsgPopup('error', 'Something went wrong. Please try again.');
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
              <span className="text-sm font-medium">Back</span>
            </Link>
          </div>

          <div className="flex justify-center mb-6 max-w-[150px] mx-auto">
            <Logo src={brandConfig.logo} alt={brandConfig.name} />
          </div>

          <div className="mb-6 text-center">
            <h2 className="mb-2 text-2xl font-bold text-gray-900">Forgot User ID</h2>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <FormInput
              numeric
              label="Customer Number"
              placeholder="Enter your customer number"
              {...register('customerNumber')}
              error={errors.customerNumber?.message}
              required
            />

            <FormInput
              type="text"
              numeric
              label="Mobile Number"
              placeholder="Enter your mobile number"
              {...register('mobileNumber')}
              error={errors.mobileNumber?.message}
              required
            />

            <FormInput
              type="email"
              label="Email"
              placeholder="Enter your email address"
              {...register('emailAddress')}
              error={errors.emailAddress?.message}
              required
            />

            <Controller
              name="dateOfBirth"
              control={control}
              render={({ field }) => (
                <FormDatePicker
                  label="Date of Birth"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.dateOfBirth?.message}
                />
              )}
            />

            <FormSelect
              label="Identification Type"
              name="identificationType"
              control={control}
              required
              options={[
                { label: 'Tax ID', value: 'ssn' },
                { label: 'National ID Number', value: 'nationalID' },
                { label: 'Passport Number', value: 'passportNumber' },
              ]}
            />

            <FormInput
              type="text"
              label="Identification Number"
              placeholder="Enter your identification number"
              {...register('idNumber')}
              error={errors.idNumber?.message}
              required
            />

            <div className="pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full text-white bg-primary hover:bg-primary"
                onClick={handleSubmit(onSubmit)}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
