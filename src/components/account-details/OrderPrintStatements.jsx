import { orderPrintStatement } from '@/api/endpoints';
import GlobalSelect from '@/components/global/GlobalSelect';
import HeaderTop from '@/components/global/HeaderTop';
import { usePopup } from '@/context/PopupContext';
import { globals } from '@/globals/appGlobals';
import { useSuccessModalStore } from '@/store/successModalStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router';
import { z } from 'zod';
import TransferPrecon from '../global/TransferPrecon';
import { Button } from '../ui/button';

// -------------------------------------------------------
// ZOD SCHEMA
// -------------------------------------------------------
const schema = z.object({
  year: z.string().min(1, 'Year is required.'),
  month: z.string().min(1, 'Month is required.'),
});

export default function OrderPrintStatements({ onSubmit, isSubmitting = false }) {
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
      year: '',
      month: '',
    },
  });

  const [loading, setLoading] = useState(false);
  const [showPrecon, setShowPrecon] = useState(false);
  const [previewData, setPreviewData] = useState({});
  const [selectedMonth, setSelectedMonth] = useState('');
  const [feesData, setFeesData] = useState(null);
  const { showMsgPopup } = usePopup();
  const { showSuccess } = useSuccessModalStore.getState();

  // Year dropdown
  const currentYear = new Date().getFullYear();
  const yearOptions = useMemo(() => {
    const years = [];
    for (let y = currentYear - 1; y <= currentYear; y++) {
      years.push({ label: y.toString(), value: y.toString() });
    }
    return years;
  }, [currentYear]);

  // Month dropdown
  const currentMonth = new Date().getMonth();
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const monthOptions = useMemo(() => {
    const mOption = months.map((item, index) => ({
      label: item,
      value: String(index + 1),
    }));
    return mOption;
  }, [currentMonth]);

  const handleReset = () => reset();

  const handleConfirm = async () => {
    if (!previewData || !feesData) return;

    const payload = {
      ...previewData,
      name: globals.bankName,
      comm: feesData.comm,
      stamp: feesData.stamp,
      tax: feesData.tax,
      tca: feesData.tca,
      accId: account.accountNumber,
      month: selectedMonth,
    };

    try {
      setLoading(true);
      const res = await orderPrintStatement(payload);

      if (res.rs.status === 'success') {
        showSuccess(res.rs, 'Order An  Statement');
        reset();
        navigate('/dashboard');
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

  const submitForm = (data) => {
    try {
      setLoading(true);

      const filteredData = { ...data };

      filteredData.code = 'ACC_OPS';
      filteredData.fromAccount = account.accountNumber;
      setSelectedMonth(filteredData.month);
      filteredData.month = months[filteredData.month];

      setPreviewData(filteredData);
      setShowPrecon(true);
    } catch (error) {
      console.error('Failed to order print statements', error);
      showMsgPopup('error', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <HeaderTop
        title="Order Print Statement"
        text="Request a printed copy of your monthly account statement"
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
            <Controller
              name="year"
              control={control}
              render={({ field }) => (
                <GlobalSelect
                  label="Year"
                  placeholder="Year"
                  options={yearOptions}
                  value={field.value}
                  onChange={field.onChange}
                  required
                  error={errors.year?.message}
                />
              )}
            />
            <Controller
              name="month"
              control={control}
              render={({ field }) => (
                <GlobalSelect
                  label="Month"
                  placeholder="Month"
                  options={monthOptions}
                  value={field.value}
                  onChange={field.onChange}
                  required
                  error={errors.month?.message}
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
