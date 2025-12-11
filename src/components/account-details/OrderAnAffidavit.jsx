import { orderAnAffidavit } from '@/api/endpoints';
import GlobalSelect from '@/components/global/GlobalSelect';
import HeaderTop from '@/components/global/HeaderTop';
import { usePopup } from '@/context/PopupContext';
import { globals } from '@/globals/appGlobals';
import { useSuccessModalStore } from '@/store/successModalStore';
import { useMetaDataStore } from '@/store/useMetaDataStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router';
import { z } from 'zod';
import TransferPrecon from '../global/TransferPrecon';
import { Button } from '../ui/button';

// -------------------------------------------------------
// ZOD SCHEMA
// -------------------------------------------------------
const schema = z.object({
  branchId: z.string().min(1, 'Pick up Branch is required.'),
});

export default function OrderAnAffidavit({ onSubmit, isSubmitting = false }) {
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
      branchId: '',
    },
  });

  const [loading, setLoading] = useState(false);
  const [showPrecon, setShowPrecon] = useState(false);
  const [previewData, setPreviewData] = useState({});
  const [feesData, setFeesData] = useState(null);
  const { showMsgPopup } = usePopup();
  const { showSuccess } = useSuccessModalStore.getState();
  const branches = useMetaDataStore((state) => state.branches) || [];

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
      branchId: branches.find((item) => item.label == previewData.branchId).value,
    };

    try {
      setLoading(true);
      const res = await orderAnAffidavit(payload);

      if (res.rs.status === 'success') {
        showSuccess(res.rs, 'Order An Affidavit');
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
      filteredData.code = 'ACC_OAA';
      filteredData.fromAccount = account.accountNumber;
      filteredData.branchId = branches.find((item) => item.value == filteredData.branchId).label;

      setPreviewData(filteredData);
      setShowPrecon(true);
    } catch (error) {
      console.error('Failed to order an affidavit', error);
      showMsgPopup('error', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <HeaderTop
        title="Order An Affidavit"
        text="Request an official affidavit for your account"
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
              name="branchId"
              control={control}
              render={({ field }) => (
                <GlobalSelect
                  label="Pick up Branch"
                  placeholder="Pick up Branch"
                  options={branches}
                  value={field.value}
                  onChange={field.onChange}
                  required
                  error={errors.branchId?.message}
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
