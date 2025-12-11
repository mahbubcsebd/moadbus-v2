import { transferToOwnBank } from '@/api/endpoints';
import HeaderTop from '@/components/global/HeaderTop';
import { usePopup } from '@/context/PopupContext';
import { globals } from '@/globals/appGlobals';
import { useListOfPayees } from '@/hooks/useListOfPayees';
import { useTransactionHistory } from '@/hooks/useTransactionHistory';
import { useAccountsStore } from '@/store/accountsStore';
import { useSuccessModalStore } from '@/store/successModalStore';
import { useMetaDataStore } from '@/store/useMetaDataStore';
import { formatToMMDDYYYY } from '@/utils/formatDate';
import { parseCurrencyList, validateTwoDecimal } from '@/utils/formHelpers';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import GlobalInput from '../global/GlobalInput';
import GlobalSelect from '../global/GlobalSelect';
import TransferPrecon from '../global/TransferPrecon';
import { Button } from '../ui/button';
import RecentTransferHistory from './RecentTransferHistory';

// -------------------------------------------------------
// ZOD SCHEMA
// -------------------------------------------------------
const schema = z.object({
  fromAccount: z.string().min(1, 'From account is required.'),
  toAccount: z.string().min(1, 'To account is required.'),
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
  { value: 'once', label: 'Once', id: 1 },
  { value: 'weekly', label: 'Weekly', id: 2 },
  { value: 'biweekly', label: 'Bi-weekly', id: 3 },
  { value: 'monthly', label: 'Monthly', id: 4 },
  { value: 'quarterly', label: 'Quarterly', id: 5 },
  { value: 'halfyearly', label: 'Halfyearly', id: 6 },
  { value: 'annual', label: 'Annual', id: 7 },
];

const untilOptions = [
  { value: 'furtherNotice', label: 'Further Notice' },
  { value: 'specificDate', label: 'Specific Date' },
];

export default function BetweenLocalBank({ onSubmit, isSubmitting = false }) {
  const [loading, setLoading] = useState(false);
  const [showPrecon, setShowPrecon] = useState(false);
  const [previewData, setPreviewData] = useState({});
  const [feesData, setFeesData] = useState(null);
  const { showMsgPopup } = usePopup();
  const { showSuccess } = useSuccessModalStore.getState();

  const { history, refresh } = useTransactionHistory('TOB01');
  const { refreshPayees, payees } = useListOfPayees({
    binding: '1',
  });

  const accounts = useAccountsStore((s) => s.accounts || []);
  const currency = useMetaDataStore((state) => state.tn.cList) || '';
  const currencyOptions = parseCurrencyList(currency);

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
      toAccount: '',
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

  const toAccountOptions = payees.map((p) => ({
    label: p.name,
    value: p.accountNumber,
  }));

  const selectedPayeeId = watch('toAccount');

  const selectedPayee = useMemo(() => {
    return payees.find((p) => p.accountNumber === selectedPayeeId);
  }, [selectedPayeeId, payees]);

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

    filteredData.code = 'ACC_OB_XFR';
    filteredData.toCurrencyCode = selectedPayee.currency;

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

    setPreviewData(filteredData);
    setShowPrecon(true);
  };

  const handleReset = () => reset();

  const handleConfirm = async () => {
    if (!previewData || !feesData) return;

    const keyMap = {
      amount: 'amt',
      fromAccount: 'from',
      toAccount: 'to',
      description: 'desc',
      currency: 'currencyCode',
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
      bankName: globals.bankName,
      output: 2,
      action: 4,
      currencyCode: 'USD',
      accType: selectedPayee.accountType,
      accNo: selectedPayee.accountNumber,
      toCurrencyCode: selectedPayee.currency,
      routingNo: selectedPayee.routingNo,
      name: selectedPayee.nickName,
      endDate: previewData.untilDate,
      originalAmount: previewData.amount,
      payeeName: selectedPayee.name,
      paymentSourceCode: '41110',
      comm: feesData.comm,
      stamp: feesData.stamp,
      tax: feesData.tax,
      tca: feesData.tca,
      recurrence: frequencyOptions.find(
        (item) => item.value.toLowerCase() === previewData.howOften.toLowerCase(),
      )?.id,
    };
    try {
      setLoading(true);
      const res = await transferToOwnBank(payload);

      if (res.rs.status === 'success') {
        showSuccess(res.rs, 'Transfer to Other Local Banks');
        reset();
        refresh();
        refreshPayees();
      } else {
        showMsgPopup('error', res.rs.msg);
        console.error('Transfer failed', res.rs.msg);
      }
    } catch (err) {
      console.error('Transfer error', err);
      showMsgPopup('error', err);
    } finally {
      setLoading(false);
      setShowPrecon(false);
    }
  };
  const today = new Date().toISOString().split('T')[0];
  return (
    <>
      <div>
        <HeaderTop
          title="Transfer to Other Local Banks"
          text="Easily transfer money to accounts of other local banks"
          link="/dashboard"
          linkText="Back to Dashboard"
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 max-w-4xl mx-auto"
        >
          <form onSubmit={handleSubmit(submitForm)} className="space-y-6">
            {/* Row 1 - Accounts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* From */}
              <Controller
                name="fromAccount"
                control={control}
                render={({ field }) => (
                  <div>
                    <GlobalSelect
                      label="From Account"
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

              {/* To */}
              <Controller
                name="toAccount"
                control={control}
                render={({ field }) => (
                  <GlobalSelect
                    label="To Account"
                    required
                    options={toAccountOptions}
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.toAccount?.message}
                  />
                )}
              />
            </div>

            {selectedPayee && (
              <div className="mt-2 text-sm text-gray-600">
                <p>Bank: {selectedPayee.bankName}</p>
                <p>Account Number: {selectedPayee.accountNumber}</p>
                <p>Currency: {selectedPayee.currency}</p>
              </div>
            )}

            {/* Row 2 - Amount + Start Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                name="currency"
                control={control}
                render={({ field }) => (
                  <GlobalSelect
                    label="Currency"
                    required
                    options={currencyOptions}
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.currency?.message}
                  />
                )}
              />
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
                  min={today}
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
                      min={today}
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
        <RecentTransferHistory data={history} />
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
