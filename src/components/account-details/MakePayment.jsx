import { makePayment } from '@/api/endpoints';
import HeaderTop from '@/components/global/HeaderTop';
import { usePopup } from '@/context/PopupContext';
import { globals } from '@/globals/appGlobals';
import { useTransactionHistory } from '@/hooks/useTransactionHistory';
import { useAccountsStore } from '@/store/accountsStore';
import { useSuccessModalStore } from '@/store/successModalStore';
import { formatToMMDDYYYY } from '@/utils/formatDate';
import { validateTwoDecimal } from '@/utils/formHelpers';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useLocation } from 'react-router';
import { z } from 'zod';
import GlobalInput from '../global/GlobalInput';
import GlobalSelect from '../global/GlobalSelect';
import TransferPrecon from '../global/TransferPrecon';
import { Button } from '../ui/button';

// -------------------------------------------------------
// ZOD SCHEMA
// -------------------------------------------------------
const schema = z.object({
  fromAccount: z.string().min(1, 'From account is required.'),
  amount: z
    .string()
    .min(1, 'Amount is required.')
    .refine((v) => Number(v) > 0, 'Amount must be positive.')
    .refine((v) => /^\d+(\.\d{1,2})?$/.test(v), 'Max 2 decimals allowed.'),
  description: z.string().min(1, 'Description is required.'),
  transferType: z.enum(['immediate', 'scheduled']),
  startDate: z.string().optional(),
  howOften: z.string(),
  untilOption: z.string(),
  untilDate: z.string().optional(),
});

const frequencyOptions = [
  { value: 'once', label: 'Once' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Bi-weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'halfyearly', label: 'Halfyearly' },
  { value: 'annual', label: 'Annual' },
];

const untilOptions = [
  { value: 'furtherNotice', label: 'Further Notice' },
  { value: 'specificDate', label: 'Specific Date' },
];

export default function MakePayment({ onSubmit, isSubmitting = false }) {
  const [loading, setLoading] = useState(false);
  const [showPrecon, setShowPrecon] = useState(false);
  const [previewData, setPreviewData] = useState({});
  const [feesData, setFeesData] = useState(null);
  const { showMsgPopup } = usePopup();
  const { showSuccess } = useSuccessModalStore.getState();

  const { history, refresh } = useTransactionHistory('TMA01');
  const accounts = useAccountsStore((s) => s.accounts || []);

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
      fromAccount: '',
      amount: '',
      description: '',
      transferType: 'immediate',
      startDate: '',
      howOften: 'once',
      untilOption: 'further Notice',
      untilDate: '',
    },
  });

  const accountOptions = useMemo(
    () =>
      accounts
        .filter((acc) => {
          const desc = acc.description?.toLowerCase() || '';
          return desc.includes('current') || desc.includes('savings');
        })
        .map((acc) => ({
          label: acc.description,
          value: acc.accountNumber,
        })),
    [accounts],
  );

  const transferType = watch('transferType');
  const howOften = watch('howOften');
  const untilOptionWatcher = watch('untilOption');
  const fromAccount = watch('fromAccount');

  const isScheduled = transferType === 'scheduled';
  const isRecurring = isScheduled && howOften !== 'once';

  const selectedFromAccount = accountOptions.find((opt) => opt.value === fromAccount);
  const availableBalance = selectedFromAccount?.balance ?? null;

  useEffect(() => {
    if (transferType === 'immediate') {
      reset((prev) => ({
        ...prev,
        startDate: '',
        howOften: 'once',
        untilOption: 'furtherNotice',
        untilDate: '',
      }));
    }
  }, [transferType]);

  useEffect(() => {
    if (howOften === 'once') {
      reset((prev) => ({
        ...prev,
        untilOption: 'furtherNotice',
        untilDate: '',
      }));
    }
  }, [howOften]);

  const submitForm = (data) => {
    const filteredData = { ...data };

    filteredData.code = 'LOAN_PAYMENT';
    if (data.transferType === 'immediate') {
      delete filteredData.howOften;
      delete filteredData.startDate;
      delete filteredData.untilOption;
      delete filteredData.untilDate;
      filteredData.payNow = 'Y';
    } else {
      if (data.untilOption !== 'specificDate') {
        delete filteredData.untilDate;
        filteredData.untilDay = 'N';
      } else {
        filteredData.untilDate = formatToMMDDYYYY(filteredData.untilDate);
        delete filteredData.untilDay;
      }
      filteredData.howOften = filteredData.howOften;
      filteredData.startDate = formatToMMDDYYYY(filteredData.startDate);
      filteredData.payNow = 'N';
      filteredData.untilDay = 'Y';
    }
    let currency = accounts.find((item) => item.accountNumber == filteredData.fromAccount).currency;
    filteredData.amount = currency + ' ' + Number(filteredData.amount).toFixed(2);

    setPreviewData(filteredData);
    setShowPrecon(true);
  };

  const handleReset = () => reset();

  const handleConfirm = async () => {
    if (!previewData || !feesData) return;

    const keyMap = {
      fromAccount: 'accId',
      description: 'desc',
      untilDate: 'until',
    };

    const renamedData = Object.entries(previewData).reduce((acc, [key, value]) => {
      const newKey = keyMap[key] || key;
      acc[newKey] = value;
      return acc;
    }, {});

    // Merge fees
    const payload = {
      ...renamedData,
      name: globals.bankName,
      curr: account.currency,
      endDate: previewData.untilDate,
      comm: feesData.comm,
      stamp: feesData.stamp,
      tax: feesData.tax,
      tca: feesData.tca,
      cardNo: account.accountNumber,
    };

    try {
      setLoading(true);
      const res = await makePayment(payload);

      if (res.rs.status === 'success') {
        showSuccess(res.rs, 'Make Payment');
        reset();
        refresh();
      } else {
        showMsgPopup('error', res.rs.msg);
        console.error('Make Payment failed', res.rs.msg);
      }
    } catch (err) {
      console.error('Make Payment error', err);
      showMsgPopup('error', err);
    } finally {
      setLoading(false);
      setShowPrecon(false);
    }
  };

  return (
    <>
      <div>
        <HeaderTop title="Make Payment" link="/dashboard" linkText="Back to Dashboard" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 max-w-4xl mx-auto"
        >
          <form onSubmit={handleSubmit(submitForm)} className="space-y-6">
            <div className="block text-sm font-medium text-gray-700 mb-2"> Loan Account Nuber</div>
            <div className="text-base font-semibold text-gray-900 uppercase">
              {' '}
              {account.description}{' '}
            </div>
            {/* Row 1 - Accounts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* From */}
              <Controller
                name="fromAccount"
                control={control}
                render={({ field }) => (
                  <div>
                    <GlobalSelect
                      label="Pay From"
                      required
                      options={accountOptions}
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.fromAccount?.message}
                    />

                    {availableBalance && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm text-gray-500 mt-1"
                      >
                        Current Available Balance: {availableBalance}
                      </motion.p>
                    )}
                  </div>
                )}
              />
            </div>

            {/* Row 2 - Amount + Start Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    setValue('amount', fixed, { shouldValidate: true });
                  },
                })}
              />

              {/* Start Date - always mounted */}
              <div style={{ display: isScheduled ? 'block' : 'none' }}>
                <GlobalInput
                  label="Start Date"
                  type="date"
                  error={errors.startDate?.message}
                  {...register('startDate')}
                />
              </div>
            </div>

            {/* Transfer Type + How Often + Until + Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-start">
              {/* Left column */}
              <div className="space-y-4">
                {/* Transfer Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transfer Type
                  </label>

                  <div className="flex gap-2 p-1 border border-gray-300 rounded-md bg-gray-50 max-w-[250px]">
                    <button
                      type="button"
                      onClick={() => setValue('transferType', 'immediate')}
                      className={`px-4 py-2 text-sm rounded w-full ${
                        !isScheduled ? 'bg-primary text-white shadow-md' : 'bg-transparent'
                      }`}
                    >
                      Immediate
                    </button>

                    <button
                      type="button"
                      onClick={() => setValue('transferType', 'scheduled')}
                      className={`px-4 py-2 text-sm rounded w-full ${
                        isScheduled ? 'bg-primary text-white shadow-md' : 'bg-transparent'
                      }`}
                    >
                      Scheduled
                    </button>
                  </div>
                </div>

                {/* How Often — always mounted */}
                <div style={{ display: isScheduled ? 'block' : 'none' }}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">How Often</label>
                  <div className="flex flex-wrap gap-4">
                    {frequencyOptions.map((opt) => (
                      <label key={opt.value} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          value={opt.value}
                          {...register('howOften')}
                          className="w-4 h-4 text-primary"
                        />
                        <span className="ml-2 text-sm">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Until — always mounted */}
                <div style={{ display: isRecurring ? 'block' : 'none' }}>
                  <Controller
                    name="untilOption"
                    control={control}
                    render={({ field }) => (
                      <GlobalSelect
                        label="Untill"
                        required
                        options={untilOptions}
                        value={field.value}
                        onChange={field.onChange}
                        error={errors.untilOption?.message}
                      />
                    )}
                  />

                  {/* Specific Date */}
                  <div
                    style={{ display: untilOptionWatcher === 'specificDate' ? 'block' : 'none' }}
                    className="mt-4"
                  >
                    <GlobalInput
                      label="Specific Date"
                      type="date"
                      error={errors.untilDate?.message}
                      {...register('untilDate')}
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <GlobalInput
                label="Description"
                isTextarea
                rows={isScheduled ? 10 : 7}
                required
                error={errors.description?.message}
                {...register('description')}
              />
            </div>

            {/* Buttons */}
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
      </div>
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
