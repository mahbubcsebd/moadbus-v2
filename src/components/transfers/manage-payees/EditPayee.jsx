import { addPayee } from '@/api/endpoints';
import TransferPrecon from '@/components/global/TransferPrecon';
import { usePopup } from '@/context/PopupContext';
import { useSuccessModalStore } from '@/store/successModalStore';
import { useState } from 'react';
import { useLocation } from 'react-router';
import PayeeForm from './PayeeForm';

const EditPayee = () => {
  const [formData, setFormData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSuccess } = useSuccessModalStore.getState();
  const { state } = useLocation();
  let payee = state.payee;
  const { showMsgPopup } = usePopup();

  const handlePreview = (data) => {
    setFormData(data);
    setIsOpen(true);
  };

  const handleFinalSubmit = async () => {
    try {
      console.log(formData);
      setIsSubmitting(true);
      const res = await addPayee(formData);
      if (res?.rs?.status === 'success') {
        showSuccess(res.rs, 'Transfer to Other Moadbus Account');
        setIsOpen(false);
      } else {
        showMsgPopup('error', res?.rs?.msg);
      }
    } catch (err) {
      console.error('Payee creation failed:', err);
      alert('Payee creation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PayeeForm onPreview={handlePreview} mode="edit" payee={payee} />

      <TransferPrecon
        heading="Edit Payee"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        formData={formData}
        onConfirm={handleFinalSubmit}
        isSubmitting={isSubmitting}
        feesData={feesData}
        setFeesData={() => {}}
        skipCalculateFees
      />
    </>
  );
};

export default EditPayee;
