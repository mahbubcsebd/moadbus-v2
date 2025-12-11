import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, Mail, Printer, X } from 'lucide-react';
import { Button } from '../ui/button';

const AppointmentSuccessModal = ({ isOpen, onClose, receiptData = [], message }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleEmail = () => {
    console.log('Email triggered');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 print:p-0 print:bg-white print:static">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden relative print:shadow-none print:w-full print:max-w-none print:max-h-none"
          >
            <div className="bg-green-50 p-6 text-center border-b border-green-100 shrink-0 print:hidden">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 10, delay: 0.1 }}
                className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm"
              >
                <CheckCircle size={32} strokeWidth={3} />
              </motion.div>
              <h3 className="text-2xl font-bold text-green-800 tracking-tight">Success!</h3>
              <p className="text-green-700 mt-1 text-sm">{message}</p>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto flex-1 print:overflow-visible">
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 border-b pb-2 print:block">
                Appointment Receipt
              </h4>

              <div className="space-y-3">
                {receiptData && receiptData.length > 0 ? (
                  receiptData.map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row sm:justify-between text-sm py-2 border-b border-gray-50 last:border-0 gap-1 wrap-break-word print:border-gray-200"
                    >
                      <span className="font-medium text-gray-600 print:text-gray-800 shrink-0">
                        {item.label}:
                      </span>
                      <span className="font-semibold text-gray-900 text-right print:text-black">
                        {item.value}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No receipt data available.
                  </p>
                )}
              </div>
            </div>

            <div className="p-5 bg-gray-50 border-t border-gray-100 flex items-center gap-3 shrink-0 print:hidden">
              <Button
                variant="outline"
                onClick={handlePrint}
                className="w-12 h-12 rounded-lg border-gray-300 text-gray-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all p-0 flex items-center justify-center shrink-0"
                title="Print Receipt"
              >
                <Printer size={20} />
              </Button>

              {/* Mail Icon Button */}
              <Button
                variant="outline"
                onClick={handleEmail}
                className="w-12 h-12 rounded-lg border-gray-300 text-gray-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all p-0 flex items-center justify-center shrink-0"
                title="Email Receipt"
              >
                <Mail size={20} />
              </Button>

              {/* Main Done Button */}
              <Button
                variant="primary"
                onClick={onClose}
                className="flex-1 h-12 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base shadow-md shadow-blue-200 active:scale-[0.98] transition-transform"
              >
                Done
              </Button>
            </div>

            {/* Close X (Top right) */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors print:hidden focus:outline-none z-10"
            >
              <X size={20} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AppointmentSuccessModal;
