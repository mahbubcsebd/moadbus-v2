import { getAccreditedBiller, getBillTempllates, payBill } from '@/api/endpoints';
import HeaderTop from '@/components/global/HeaderTop';
import { Input } from '@/components/ui/input';
import { usePopup } from '@/context/PopupContext';
import { globals } from '@/globals/appGlobals';
import { useAccountsStore } from '@/store/accountsStore';
import { useBillersStore } from '@/store/billersStore';
import { useSuccessModalStore } from '@/store/successModalStore';
import { useMetaDataStore } from '@/store/useMetaDataStore';
import { formatToMMDDYYYY } from '@/utils/formatDate';
import { validateTwoDecimal } from '@/utils/formHelpers';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import GlobalInput from '../global/GlobalInput';
import GlobalSelect from '../global/GlobalSelect';
import TransferPrecon from '../global/TransferPrecon';
import { Button } from '../ui/button';

// -------------------------------------------------------
// ZOD SCHEMA
// -------------------------------------------------------
const schema = z.object({
  accId: z.string().min(1, 'From account is required.'),
  payTo: z.string().min(1, 'To account is required.'),
  amount: z
    .string()
    .min(1, 'Amount is required.')
    .refine((v) => Number(v) > 0, 'Amount must be positive.')
    .refine((v) => /^\d+(\.\d{1,2})?$/.test(v), 'Max 2 decimals allowed.'),
  description: z.string().min(1, 'Description is required.'),
  transferType: z.enum(['immediate', 'scheduled']),
  refNo1: z.string().min(1, 'Reference Number is required.'),
  billTemplateName: z.string().optional(),
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

export default function BillPayment({ onSubmit, isSubmitting = false }) {
  const [loading, setLoading] = useState(false);
  const [showPrecon, setShowPrecon] = useState(false);
  const [previewData, setPreviewData] = useState({});
  const [feesData, setFeesData] = useState(null);
  const { showMsgPopup } = usePopup();
  const { showSuccess } = useSuccessModalStore.getState();

  const [selectedAccount, setSelectedAccount] = useState('');
  const [selectedBiller, setSelectedBiller] = useState({});
  const [billerOption, setBillerOption] = useState('');
  const [saveTemplate, setSaveTemplate] = useState(false);
  const [fromAccreditedBiller, setfromAccreditedBiller] = useState(false);
  const accounts = useAccountsStore((s) => s.accounts || []);

  const billers = useBillersStore((s) => s.billers || []);
  const templates = useBillersStore((s) => s.templates || []);
  const setBillers = useBillersStore((s) => s.setBillers);
  const setTemplate = useBillersStore((s) => s.setTemplates);
  const currency = useMetaDataStore((state) => state.tn.cList) || '';

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
      accId: '',
      payTo: '',
      amount: '',
      description: '',
      transferType: 'immediate',
      billTemplateName: '',
      refNo1: '',
      startDate: '',
      howOften: 'once',
      untilOption: 'furtherNotice',
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
    const loadBillers = async () => {
      try {
        const templatesRes = await getBillTempllates();
        const billersRes = await getAccreditedBiller();

        setTemplate(templatesRes?.rs.billers || []);
        setBillers(billersRes?.rs.billers || []);
      } catch (e) {
        console.error('Error loading billers:', e);
        setPaymetsList([]);
      }
    };

    loadBillers();
  }, []);

  // // Biller dropdown
  const buildBillerOptions = (templates, billers) => {
    let options = templates.map((template) => ({
      label: template.nickName,
      value: `${template.id}_template`,
    }));
    options.unshift({
      label: 'My Bill Templates',
      value: 'template_header',
    });
    options.push({
      label: 'Billers',
      value: 'biller_header',
    });
    let options1 = billers.map((biller) => ({
      label: biller.billerName,
      value: `${biller.billerId}_biller`,
    }));
    setBillerOption([...options, ...options1]);
  };

  const billerOptions = useMemo(() => buildBillerOptions(templates, billers), [templates, billers]);

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

    filteredData.code = 'BILL_PAY';
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
    filteredData.fromAccount = filteredData.accId;

    filteredData.billerName = selectedBiller.billerName;
    setPreviewData(filteredData);
    setShowPrecon(true);
  };

  const handleReset = () => reset();

  const handleConfirm = async () => {
    if (!previewData || !feesData) return;

    const keyMap = {
      payTo: 'to',
      description: 'desc',
      untilDate: 'Until',
    };
    const renamedData = Object.entries(previewData).reduce((acc, [key, value]) => {
      const newKey = keyMap[key] || key;
      acc[newKey] = value;
      return acc;
    }, {});

    let selAccount = accounts.filter((acc) => acc.accountNumber === selectedAccount);
    previewData.toCurrencyCode = selAccount[0].currency;
    // Merge fees
    console.log(previewData);
    let msgPayLoad = `${previewData.payTo.split('_')[0]}##${
      previewData.amount
    }##${encodeURIComponent(previewData.description)}##${previewData['payNow'] || ''}##${
      previewData['startDate'] || ''
    }##${previewData['howOften'] || ''}##${previewData['untilDay'] || ''}##${
      previewData['untilDate'] || ''
    }##${encodeURIComponent(previewData.billTemplateName)}##${previewData.refNo1} `;

    const payload = {
      ...renamedData,
      name: globals.bankName,
      endDate: previewData.untilDate,
      comm: feesData.comm,
      stamp: feesData.stamp,
      tax: feesData.tax,
      tca: feesData.tca,
      msgPayLoad: msgPayLoad,
      currency: selAccount[0].currency,
      currencyCode: selAccount[0].currency,
      saveAsBillTemplate: saveTemplate,
      fromAccreditedBiller: fromAccreditedBiller,
      paymentSourceCode: 41110,
    };

    try {
      setLoading(true);
      const res = await payBill(payload);

      if (res.rs.status === 'success') {
        showSuccess(res.rs, 'Pay Bills');
        reset();
      } else {
        showMsgPopup('error', res.rs.msg);
        console.error('Payment failed', res.rs.msg);
      }
    } catch (err) {
      console.error('Payment error', err);
      showMsgPopup('error', err);
    } finally {
      setLoading(false);
      setShowPrecon(false);
    }
  };

  // Currency dropdown
  let currency_arr = currency.split('|');
  const currencyOptions = useMemo(() => {
    return currency_arr.map((cur) => {
      let curr = cur.split('#');
      return {
        label: curr[1],
        value: curr[0],
      };
    });
  }, [currency_arr]);

  const getCurrency = (label) => {
    const item = currency_arr.find((cur) => {
      const curr = cur.split('#');
      return curr[1] === label;
    });

    return item ? item.split('#')[0] : '';
  };
  const filterBiller = (biller) => {
    if (biller === 'biller_header' || biller === 'template_header') return;
    let id = biller.split('_')[0];
    let type = biller.split('_')[1];
    let selected_biller = {};
    if (type == 'template') {
      selected_biller = templates.filter((temp) => temp.id == id);
      setSaveTemplate(true);
      setfromAccreditedBiller(false);
    }
    if (type == 'biller') {
      selected_biller = billers.filter((bill) => bill.billerId === id);
      setSaveTemplate(false);
      setfromAccreditedBiller(true);
    }
    setSelectedBiller(selected_biller[0]);
    if (selected_biller[0]?.refNumber) {
      setValue('refNo1', selected_biller[0].refNumber); // set value
    } else {
      setValue('refNo1', ''); // empty and editable
    }
    if (selected_biller[0]?.nickName) {
      setValue('billTemplateName', selected_biller[0].nickName); // set value
    } else {
      setValue('billTemplateName', ''); // empty and editable
    }
  };
  return (
    <>
      <div>
        <HeaderTop
          title="Pay Bills"
          text="Manage and pay your bills securely and conveniently"
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
                name="accId"
                control={control}
                render={({ field }) => (
                  <div>
                    <GlobalSelect
                      label="Pay From"
                      required
                      options={accountOptions}
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                        setSelectedAccount(value);
                      }}
                      error={errors.accId?.message}
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
                name="payTo"
                control={control}
                render={({ field }) => (
                  <GlobalSelect
                    label="Pay Bill"
                    required
                    options={billerOption}
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      filterBiller(value);
                    }}
                    error={errors.payTo?.message}
                  />
                )}
              />
            </div>
            {/* 2-nd row currency + amount */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                name="currency"
                control={control}
                render={({ field }) => (
                  <GlobalSelect
                    label="Currency"
                    required
                    options={currencyOptions}
                    value={selectedBiller.currency ? getCurrency(selectedBiller.currency) : ''}
                    onChange={field.onChange}
                    error={errors.currency?.message}
                    disabled={selectedBiller.currency}
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
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Description */}
              <GlobalInput
                label="Reference Number"
                type="number"
                required
                disabled={!!selectedBiller.refNumber}
                error={errors.refNo1?.message}
                {...register('refNo1')}
              />

              <GlobalInput
                label="Description"
                isTextarea
                rows={isScheduled ? 10 : 7}
                error={errors.description?.message}
                {...register('description')}
              />
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
                {/* Start Date - always mounted */}
                <div style={{ display: isScheduled ? 'block' : 'none' }}>
                  <GlobalInput
                    label="Start Date"
                    type="date"
                    error={errors.startDate?.message}
                    {...register('startDate')}
                  />
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
              <div className="flex  items-center justify-center mt-1">
                <Input
                  type="checkbox"
                  id="saveAsTemplate"
                  checked={saveTemplate}
                  onChange={(e) => {
                    setSaveTemplate(e.target.checked);
                  }}
                />
                <p className=" text-sm text-gray-500">Save as Bill Template</p>{' '}
              </div>
              {saveTemplate && (
                <GlobalInput
                  label="Bill Template Name"
                  placeholder="Enter Bill Template Name"
                  disabled={!!selectedBiller.nickName}
                  error={errors.billTemplateName?.message}
                  {...register('billTemplateName')}
                />
              )}
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
