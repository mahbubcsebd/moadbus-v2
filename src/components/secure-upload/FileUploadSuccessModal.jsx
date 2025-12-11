import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CheckCircle, Mail, Printer } from 'lucide-react';
import { Button } from '../ui/button';

const FileUploadSuccessModal = ({ isOpen, onClose, data }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleEmail = () => {
    console.log('Email functionality will be implemented');
  };

  if (!data) return null;

  const displayData = [
    { label: 'Transaction Number', value: data.transactionNumber },
    { label: 'Transaction Date', value: data.transactionDate },
    { label: 'File Name', value: data.fileName },
    { label: 'Purpose', value: data.purpose },
    { label: 'Description', value: data.description },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-md w-full p-0 gap-0 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <DialogHeader className="relative p-6 border-b border-gray-200">
          <DialogTitle className="flex items-center gap-3 text-xl font-semibold text-gray-900">
            <span>Secure File Upload</span>
          </DialogTitle>
        </DialogHeader>

        {/* Success Icon */}
        <div className="flex flex-col items-center p-6 pt-4">
          <div className="flex items-center justify-center w-20 h-20 mb-4 bg-green-100 rounded-full">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Success</h2>
        </div>

        {/* Display Data */}
        <div className="px-6 pb-6 space-y-4">
          {displayData.map((item, index) => (
            <div
              key={index}
              className={`flex justify-between pb-1 text-sm ${
                index >= 1 ? 'font-medium' : 'font-semibold'
              }`}
            >
              <span className="text-gray-500">{item.label}</span>
              <span className="text-gray-900 max-w-[180px] truncate" title={item.value}>
                {item.value}
              </span>
            </div>
          ))}

          {/* Actions */}
          <div className="flex justify-center gap-6 pt-6 mt-4 border-t border-gray-200">
            <button
              onClick={handleEmail}
              className="flex flex-col items-center gap-2 text-gray-600 transition-colors hover:text-blue-600"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full hover:bg-blue-50">
                <Mail className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium">Email</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex flex-col items-center gap-2 text-gray-600 transition-colors hover:text-blue-600"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full hover:bg-blue-50">
                <Printer className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium">Print</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="p-6 border-t border-gray-200">
          <Button
            variant="primary"
            onClick={onClose}
            size="default"
            className="w-full text-sm text-white bg-primary hover:bg-primary"
            type="button"
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FileUploadSuccessModal;
