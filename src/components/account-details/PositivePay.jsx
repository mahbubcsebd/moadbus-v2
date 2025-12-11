import { positivePay } from '@/api/endpoints';
import HeaderTop from '@/components/global/HeaderTop';
import { usePopup } from '@/context/PopupContext';
import { globals } from '@/globals/appGlobals';
import { useSuccessModalStore } from '@/store/successModalStore';
import { formatToMMDDYYYY } from '@/utils/formatDate';
import { validateTwoDecimal } from '@/utils/formHelpers';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router';
import { z } from 'zod';
import GlobalInput from '../global/GlobalInput';
import TransferPrecon from '../global/TransferPrecon';
import { Button } from '../ui/button';

// -------------------------------------------------------
// ZOD SCHEMA
// -------------------------------------------------------
const schema = z.object({
  checkNumber: z.string().min(1, 'Check Number is required.'),
  beneficiary: z.string().max(50, 'Beneficiary Name is required.'),
  date: z.string().optional(),
  comment: z.string().max(50, 'Comment is required.'),
  amount: z
    .string()
    .min(1, 'Amount is required.')
    .refine((v) => Number(v) > 0, 'Amount must be positive.')
    .refine((v) => /^\d+(\.\d{1,2})?$/.test(v), 'Max 2 decimals allowed.'),
});

export default function PositivePay({ onSubmit, isSubmitting = false }) {
  const navigate = useNavigate();
  const { state } = useLocation();
  let account = state.account;

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      checkNumber: '',
      beneficiary: '',
      amount: '',
      date: '',
      comment: '',
    },
  });

  const [loading, setLoading] = useState(false);
  const [showPrecon, setShowPrecon] = useState(false);
  const [previewData, setPreviewData] = useState({});
  const [feesData, setFeesData] = useState(null);
  const [payload, setPayload] = useState('');
  const { showMsgPopup } = usePopup();
  const { showSuccess } = useSuccessModalStore.getState();

  const handleReset = () => reset();

  const handleConfirm = async () => {
    if (!previewData || !feesData) return;

    previewData.amount = previewData.amount.split(' ')[1];
    delete previewData.memo;
    delete previewData.branchId;
    delete previewData.address;
    const finalPayload = {
      ...previewData,
      name: globals.bankName,
      comm: feesData.comm,
      stamp: feesData.stamp,
      tax: feesData.tax,
      tca: feesData.tca,
      payPositive: payload,
    };

    try {
      setLoading(true);
      const res = await positivePay(finalPayload);

      if (res.rs.status === 'success') {
        showSuccess(res.rs, 'Positive Pay');
        reset();
        navigate('/dashboard');
      } else {
        showMsgPopup('error', res.rs.msg);
        console.error('Positive Pay  failed', res.rs.msg);
      }
    } catch (err) {
      console.error('Positive Pay  error', err);
      showMsgPopup('error', err);
    } finally {
      setLoading(false);
      setShowPrecon(false);
    }
  };

  const submitForm = (data) => {
    try {
      setLoading(true);

      const filteredData = { ...data };
      filteredData.payNow = 'N';
      filteredData.code = 'PSP_PAY';
      filteredData.date = formatToMMDDYYYY(filteredData.date);
      filteredData.fromAccount = account.accountNumber;
      let payPositive = `${filteredData.fromAccount}##${filteredData.beneficiary}##${
        filteredData.checkNumber
      }##${filteredData.date}##${filteredData.comment}##${filteredData.amount}##${Math.floor(
        Math.random() * 10000 + 1,
      ).toString()}`;
      setPayload(payPositive);
      filteredData.amount = account.currency + ' ' + Number(filteredData.amount).toFixed(2);
      setPreviewData(filteredData);
      setShowPrecon(true);
    } catch (error) {
      console.error('Failed to positiv pay', error);
      showMsgPopup('error', error);
    } finally {
      setLoading(false);
    }
  };
  const today = new Date().toISOString().split('T')[0];
  return (
    <>
      <HeaderTop
        title="Positive Pay"
        text="Protect yourself and others by reporting suspicious activity"
        link="/dashboard"
        linkText="Back to Dashboard"
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl p-6 mb-6 border border-gray-100"
      >
        <form onSubmit={handleSubmit(submitForm)} className="space-y-6">
          <div className="block text-sm font-medium text-gray-700 mb-2"> Account Number</div>
          <div className="text-base font-semibold text-gray-900 uppercase">
            {' '}
            {account.description}{' '}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* check number */}
            <GlobalInput
              label="Check Number"
              placeholder="Enter Check Number"
              type="text"
              required
              error={errors.checkNumber?.message}
              {...register('checkNumber')}
            />
            <GlobalInput
              label="Check Issued Date"
              type="date"
              required
              error={errors.data?.message}
              max={today}
              {...register('date')}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GlobalInput
              label="Amount"
              type="text"
              required
              placeholder="0.00"
              error={errors.amount?.message}
              {...register('amount', {
                onChange: (e) => {
                  const fixed = validateTwoDecimal(e.target.value);
                  setValue('amount', fixed, { shouldValidate: true });
                },
              })}
            />
            {/* Beneficiary */}
            <GlobalInput
              label="Beneficiary Name"
              placeholder=" Enter Beneficiary Name"
              type="text"
              required
              error={errors.beneficiary?.message}
              {...register('beneficiary')}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GlobalInput
              label="Comment"
              type="text"
              required
              placeholder="Enter Comment"
              error={errors.comment?.message}
              {...register('comment')}
            />
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <Button
              variant="outline"
              onClick={handleReset}
              className="w-full sm:w-auto text-sm border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
              loading={isSubmitting}
              className="w-full sm:w-auto text-sm bg-primary hover:bg-primary text-white"
            >
              Submit
            </Button>
          </div>
        </form>
      </motion.div>
      <TransferPrecon
        isOpen={showPrecon && Object.keys(previewData).length > 0}
        onClose={() => setShowPrecon(false)}
        formData={previewData}
        feesData={feesData}
        setFeesData={setFeesData}
        onConfirm={handleConfirm}
        isSubmitting={isSubmitting}
      />
    </>
  );
}
