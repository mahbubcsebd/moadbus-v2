'use client';

import RegistrationPrecon from '@/components/auth/PreConfirmation';
import HeaderTop from '@/components/global/HeaderTop';
import NumberManagementForm from '@/components/mobile-manage/NumberManagementForm';
import SavedNumbersTable from '@/components/mobile-manage/SavedNumbersTable';
import { Button } from '@/components/ui/button';
import { useMobileManageStore } from '@/store/mobileManageStore';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// Reusable Success Modal
const SuccessActionModal = ({ isOpen, onClose, title, data }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md overflow-hidden bg-white rounded-lg shadow-xl"
      >
        <div className="p-6 text-center border-b">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full">
            <span className="text-2xl text-green-600">✓</span>
          </div>
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        </div>
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="space-y-3 text-sm">
            {data &&
              data.map((row, idx) => (
                <div
                  key={idx}
                  className="flex justify-between py-1 border-b border-gray-100 last:border-0"
                >
                  <span className="font-medium text-gray-500">{row.label}</span>
                  <span className="text-gray-800 font-semibold text-right max-w-[60%]">
                    {row.value}
                  </span>
                </div>
              ))}
          </div>
        </div>
        <div className="p-4 bg-gray-50">
          <Button onClick={onClose} className="w-full text-white bg-primary hover:bg-primary">
            Done
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default function MobileManage() {
  const {
    savedNumbers,
    fetchSavedNumbers,
    addNumber,
    deleteNumber,
    updateNumber,
    isSubmitting,
    successModal,
    closeSuccessModal,
  } = useMobileManageStore();

  const [showAddConfirm, setShowAddConfirm] = useState(false);
  const [pendingAddData, setPendingAddData] = useState(null);
  const [shouldResetForm, setShouldResetForm] = useState(false);

  useEffect(() => {
    fetchSavedNumbers();
  }, []);

  const handleInitiateAdd = (formData) => {
    setPendingAddData(formData);
    setShowAddConfirm(true);
    setShouldResetForm(false);
  };

  // Confirmed from Modal
  const handleFinalConfirmAdd = async () => {
    if (!pendingAddData) return;

    const success = await addNumber(pendingAddData);
    if (success) {
      setShowAddConfirm(false);
      setPendingAddData(null);
      setShouldResetForm(true);
    }
  };

  // Delete Handler
  const handleDelete = async (id, fullData) => {
    await deleteNumber(id, fullData);
  };

  // Edit Handler
  const handleEdit = async (id, updatedData) => {
    await updateNumber(id, updatedData);
  };

  return (
    <div>
      <HeaderTop
        title="Manage Mobile Numbers"
        text="Add and manage your frequently used mobile numbers"
        link="/dashboard"
        linkText="Back to Dashboard"
      />

      <NumberManagementForm onSubmit={handleInitiateAdd} shouldReset={shouldResetForm} />

      <SavedNumbersTable data={savedNumbers} onDelete={handleDelete} onEdit={handleEdit} />

      <AnimatePresence>
        {showAddConfirm && (
          <RegistrationPrecon
            isOpen={showAddConfirm}
            onClose={() => setShowAddConfirm(false)}
            formData={pendingAddData}
            onConfirm={handleFinalConfirmAdd}
            isSubmitting={isSubmitting}
          />
        )}
      </AnimatePresence>

      {/* Global Success Modal */}
      <AnimatePresence>
        {successModal.isOpen && (
          <SuccessActionModal
            isOpen={successModal.isOpen}
            title={successModal.message}
            data={successModal.data}
            onClose={closeSuccessModal}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
