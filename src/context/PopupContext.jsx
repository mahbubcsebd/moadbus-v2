import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Check, CircleAlert } from 'lucide-react';
import { createContext, useCallback, useContext, useState } from 'react';
import { useNavigate } from 'react-router';

const PopupContext = createContext();

export const usePopup = () => useContext(PopupContext);

export const PopupProvider = ({ children }) => {
  const navigate = useNavigate();

  // Error/Success popup state
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState('success');
  const [message, setMessage] = useState('');
  const [onSuccessOk, setOnSuccessOk] = useState(null);

  // Confirmation popup state
  const [confirmConfig, setConfirmConfig] = useState(null);

  // Error/Success Popup
  const showMsgPopup = useCallback(
    (popupType, popupMessage, callback) => {
      setConfirmConfig(null);
      setType(popupType);
      setMessage(popupMessage);
      setOnSuccessOk(() => (callback ? () => callback(navigate) : null));
      setIsOpen(true);
    },
    [navigate],
  );

  // Confirmation Popup
  const showConfirmPopup = useCallback((config) => {
    setConfirmConfig({
      title: config.title || 'Are you sure?',
      description: config.description || '',
      body: config.body || '',
      confirmLabel: config.confirmLabel || 'Yes',
      cancelLabel: config.cancelLabel || 'Cancel',
      onConfirm: config.onConfirm || null,
      onCancel: config.onCancel || null,
    });

    setType('confirm');
    setIsOpen(true);
  }, []);

  const closePopup = useCallback(() => {
    setIsOpen(false);
    setMessage('');
    setOnSuccessOk(null);
    setConfirmConfig(null);
  }, []);

  const handleCancel = () => {
    if (confirmConfig?.onCancel) confirmConfig.onCancel();
    closePopup();
  };
  const handleOk = useCallback(() => {
    if (onSuccessOk) onSuccessOk();
    closePopup();
  }, [onSuccessOk, closePopup]);

  const handleConfirm = () => {
    if (confirmConfig?.onConfirm) confirmConfig.onConfirm();
    closePopup();
  };

  return (
    <PopupContext.Provider value={{ showMsgPopup, showConfirmPopup }}>
      {children}

      <GlobalPopup
        isOpen={isOpen}
        type={type}
        message={message}
        onClose={closePopup}
        onSuccessOk={handleOk}
        confirmConfig={confirmConfig}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </PopupContext.Provider>
  );
};

const GlobalPopup = ({
  isOpen,
  type,
  message,
  onClose,
  onSuccessOk,
  confirmConfig,
  onConfirm,
  onCancel,
}) => {
  const isSuccess = type === 'success';
  const isError = type === 'error';
  const isConfirm = type === 'confirm';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm sm:max-w-md p-6 text-center z-100">
        {/* ------------ Confirmation Popup Mode -------------- */}
        {isConfirm && confirmConfig ? (
          <div className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">{confirmConfig.title}</DialogTitle>
            </DialogHeader>

            {confirmConfig.description && (
              <p className="text-sm text-gray-600">{confirmConfig.description}</p>
            )}

            {confirmConfig.body && (
              <div className="text-sm text-gray-700">{confirmConfig.body}</div>
            )}

            <div className="flex gap-3 pt-4">
              <Button className="flex-1" variant="outline" onClick={onCancel}>
                {confirmConfig.cancelLabel}
              </Button>

              <Button className="flex-1 bg-primary text-white" onClick={onConfirm}>
                {confirmConfig.confirmLabel}
              </Button>
            </div>
          </div>
        ) : (
          /* ------------ Success/Error Popup  -------------- */
          <div className="flex flex-col items-center gap-4">
            {isSuccess ? (
              <div className="p-3 bg-green-50 rounded-full">
                <Check size={30} className="text-green-500" />
              </div>
            ) : (
              <div className="p-3 bg-red-50 rounded-full">
                <CircleAlert size={30} className="text-red-500" />
              </div>
            )}

            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">
                {isSuccess ? 'Success' : 'Error'}
              </DialogTitle>
            </DialogHeader>

            <p className="text-sm text-gray-700">{message}</p>

            <Button onClick={onSuccessOk} className="flex-1 bg-primary text-white py-2">
              OK
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
