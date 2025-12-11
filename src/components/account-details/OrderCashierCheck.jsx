import { orderCashierCheck } from '@/api/endpoints';
import GlobalSelect from '@/components/global/GlobalSelect';
import HeaderTop from '@/components/global/HeaderTop';
import { usePopup } from '@/context/PopupContext';
import { globals } from '@/globals/appGlobals';
import { useAccountsStore } from '@/store/accountsStore';
import { useSuccessModalStore } from '@/store/successModalStore';
import { useMetaDataStore } from '@/store/useMetaDataStore';
import { validateTwoDecimal } from '@/utils/formHelpers';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { z } from 'zod';
import GlobalInput from '../global/GlobalInput';
import TransferPrecon from '../global/TransferPrecon';
import { Button } from '../ui/button';

// -------------------------------------------------------
// ZOD SCHEMA
// -------------------------------------------------------
const schema = z.object({
  fromAccount: z.string().min(1, 'From Account is required.'),
  beneficiary: z.string().max(20, 'Beneficiary is required.'),
  address: z.string().optional(),
  type: z.number().min(1, 'Type is required.'),
  branchId: z.string().min(1, 'Pick up Branch is required.'),
  memo: z.string().min(1, 'Memo is required.'),
  amount: z
    .string()
    .min(1, 'Amount is required.')
    .refine((v) => Number(v) > 0, 'Amount must be positive.')
    .refine((v) => /^\d+(\.\d{1,2})?$/.test(v), 'Max 2 decimals allowed.'),
});

export default function OrderCashierCheck({ onSubmit, isSubmitting = false }) {
  const navigate = useNavigate();
  const branches = useMetaDataStore((state) => state.branches) || [];
  const accounts = useAccountsStore((s) => s.accounts || []);
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
      fromAccount: '',
      beneficiary: '',
      amount: '',
      address: '',
      type: '',
      branchId: '',
      memo: '',
    },
  });

  const typeOptions = [{ value: 1, label: 'Domestic' }];
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
      cashOrdCheck: payload,
      type: typeOptions.find((item) => item.label == previewData.type).value,
    };

    try {
      setLoading(true);
      const res = await orderCashierCheck(finalPayload);

      if (res.rs.status === 'success') {
        showSuccess(res.rs, 'Order Cashier Check');
        reset();
        navigate('/dashboard');
      } else {
        showMsgPopup('error', res.rs.msg);
        console.error('Order Cashier check failed', res.rs.msg);
      }
    } catch (err) {
      console.error('Order Cashier check error', err);
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
      filteredData.code = 'ACC_OCC';
      let currency = accounts.find(
        (item) => item.accountNumber == filteredData.fromAccount,
      ).currency;
      let cashOrdCheck = `${filteredData.fromAccount}##${filteredData.beneficiary}##${filteredData.amount}##${currency}##${filteredData.branchId}##${filteredData.memo}##${filteredData.address}`;
      setPayload(cashOrdCheck);
      filteredData.amount = currency + ' ' + Number(filteredData.amount).toFixed(2);
      filteredData.currencyCode = currency;
      filteredData.branchId = branches.find((item) => item.value == filteredData.branchId).label;
      filteredData.type = typeOptions.find((item) => item.value == filteredData.type).label;
      setPreviewData(filteredData);
      setShowPrecon(true);
    } catch (error) {
      console.error('Failed to order check', error);
      showMsgPopup('error', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <HeaderTop
        title="Order Cashier Check"
        text="Request a cashier check from your account"
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* check number */}
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
                </div>
              )}
            />
            {/* Beneficiary */}
            <GlobalInput
              label="Beneficiary"
              placeholder="Enter Beneficiary"
              type="text"
              required
              error={errors.beneficiary?.message}
              {...register('beneficiary')}
            />
          </div>
          <div className="grid grid-cols-1 ">
            <GlobalInput
              label="Address"
              type="text"
              placeholder="Enter Address"
              className="w-full flex"
              error={errors.address?.message}
              {...register('address')}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <GlobalSelect
                  label="Type"
                  placeholder="Select"
                  options={typeOptions}
                  value={field.value}
                  onChange={field.onChange}
                  required
                  error={errors.type?.message}
                />
              )}
            />
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
            <Controller
              name="branchId"
              control={control}
              render={({ field }) => (
                <GlobalSelect
                  label="Branch to Pick Up Check"
                  placeholder="Branch to Pick Up Check"
                  options={branches}
                  value={field.value}
                  onChange={field.onChange}
                  required
                  error={errors.branchId?.message}
                />
              )}
            />

            <GlobalInput
              label="Memo"
              type="text"
              placeholder="Enter Memo"
              error={errors.memo?.message}
              required
              {...register('memo')}
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
