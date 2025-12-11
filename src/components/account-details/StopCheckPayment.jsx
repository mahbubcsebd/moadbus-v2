import { stopCheckPayment } from '@/api/endpoints';
import GlobalSelect from '@/components/global/GlobalSelect';
import HeaderTop from '@/components/global/HeaderTop';
import { usePopup } from '@/context/PopupContext';
import { globals } from '@/globals/appGlobals';
import { useAccountsStore } from '@/store/accountsStore';
import { useSuccessModalStore } from '@/store/successModalStore';
import { validateTwoDecimal } from '@/utils/formHelpers';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router';
import { z } from 'zod';
import GlobalInput from '../global/GlobalInput';
import TransferPrecon from '../global/TransferPrecon';
import { Button } from '../ui/button';

// -------------------------------------------------------
// ZOD SCHEMA
// -------------------------------------------------------
const schema = z.object({
  checkNumber: z.string().max(6, 'Check Number is required.'),
  amount: z
    .string()
    .min(1, 'Amount is required.')
    .refine((v) => Number(v) > 0, 'Amount must be positive.')
    .refine((v) => /^\d+(\.\d{1,2})?$/.test(v), 'Max 2 decimals allowed.'),
  reason: z.string().min(1, 'Reason is required.'),
});

export default function StopCheckPayment({ onSubmit, isSubmitting = false }) {
  const navigate = useNavigate();
  const { state } = useLocation();
  let account = state.account;
  const tn = useAccountsStore.getState().tn;
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
      amount: '',
      reason: '',
    },
  });

  const [loading, setLoading] = useState(false);
  const [showPrecon, setShowPrecon] = useState(false);
  const [previewData, setPreviewData] = useState({});
  const [feesData, setFeesData] = useState(null);
  const { showMsgPopup } = usePopup();
  const { showSuccess } = useSuccessModalStore.getState();

  const handleReset = () => reset();
  let reasonOptions = useMemo(() => {
    return tn.rn.split('|').map((item) => ({
      label: item.split('#')[0],
      value: item.split('#')[0],
    }));
  }, []);

  const handleConfirm = async () => {
    if (!previewData || !feesData) return;

    previewData.amt = previewData.amount.split(' ')[1];

    const payload = {
      ...previewData,
      name: globals.bankName,
      comm: feesData.comm,
      stamp: feesData.stamp,
      tax: feesData.tax,
      tca: feesData.tca,
      accId: account.accountNumber,
    };

    try {
      setLoading(true);
      const res = await stopCheckPayment(payload);

      if (res.rs.status === 'success') {
        showSuccess(res.rs, 'Stop Check Payment');
        reset();
        navigate('/dashboard');
      } else {
        showMsgPopup('error', res.rs.msg);
        console.error('Spot check failed', res.rs.msg);
      }
    } catch (err) {
      console.error('Stop Check error', err);
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
      filteredData.code = 'ACC_SC';
      filteredData.fromAccount = account.accountNumber;
      filteredData.amount = account.currency + ' ' + Number(filteredData.amount).toFixed(2);
      setPreviewData(filteredData);
      setShowPrecon(true);
    } catch (error) {
      console.error('Failed to reorder checkbook', error);
      showMsgPopup('error', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <HeaderTop
        title="Stop Check Payment"
        text="Request to stop payment on an issued check"
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
          <div className="block text-sm font-medium text-gray-700 mb-2"> From Account </div>
          <div className="text-base font-semibold text-gray-900 uppercase">
            {' '}
            {account.description}{' '}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* check number */}
              <div>
                <GlobalInput
                  label="Check Number"
                  type="number"
                  error={errors.checkNumber?.message}
                  {...register('checkNumber')}
                />
              </div>
              {/* Amount */}
              <GlobalInput
                label="Amount"
                type="text"
                required
                placeholder="0.00"
                error={errors.amount?.message}
                {...register('amount', {
                  onChange: (e) => {
                    const fixed = validateTwoDecimal(e.target.value);
                    setValue('amount', fixed.toFixed(2), { shouldValidate: true });
                  },
                })}
              />
            </div>

            <Controller
              name="reason"
              control={control}
              render={({ field }) => (
                <GlobalSelect
                  label="Reason"
                  placeholder="Reason"
                  options={reasonOptions}
                  value={field.value}
                  onChange={field.onChange}
                  required
                  error={errors.reason?.message}
                />
              )}
            />
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
