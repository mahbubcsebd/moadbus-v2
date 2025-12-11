import { inquireCheckStatus } from '@/api/endpoints';
import HeaderTop from '@/components/global/HeaderTop';
import { usePopup } from '@/context/PopupContext';
import { useSuccessModalStore } from '@/store/successModalStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router';
import { z } from 'zod';
import GlobalInput from '../global/GlobalInput';
import { Button } from '../ui/button';

// -------------------------------------------------------
// ZOD SCHEMA
// -------------------------------------------------------
const schema = z.object({
  checkNumber: z.string().min(1, 'Pick up Branch is required.'),
});

export default function InquireCheckStatus({ onSubmit, isSubmitting = false }) {
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
    },
  });

  const [loading, setLoading] = useState(false);
  const [showPrecon, setShowPrecon] = useState(false);
  const [previewData, setPreviewData] = useState({});
  const [feesData, setFeesData] = useState(null);
  const { showMsgPopup } = usePopup();
  const { showSuccess } = useSuccessModalStore.getState();

  const handleReset = () => reset();

  const submitForm = async (data) => {
    const filteredData = { ...data };
    filteredData.code = 'ACC_OC';
    filteredData.accId = account.accountNumber;

    try {
      setLoading(true);
      const res = await inquireCheckStatus(filteredData);

      if (res.rs & (res.rs.status === 'success')) {
        showSuccess(res.rs, 'Inquire Check Status');
        reset();
        navigate('/dashboard');
      } else {
        showMsgPopup('error', res.rs.msg);
        console.error('Inquire Check Status failed', res.rs.msg);
      }
    } catch (err) {
      console.error('Inquire Check Status error', err);
      showMsgPopup('error', err);
    } finally {
      setLoading(false);
      reset();
      setShowPrecon(false);
    }
  };

  return (
    <>
      <HeaderTop
        title="Inquire Check Status"
        text="Check the status of your issued checks"
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
            <div>
              <GlobalInput
                label="Check Number"
                type="number"
                error={errors.checkNumber?.message}
                {...register('checkNumber')}
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
          </div>
        </form>
      </motion.div>
    </>
  );
}
