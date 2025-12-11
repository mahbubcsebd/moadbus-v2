import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useSuccessModalStore } from '@/store/successModalStore';
import { motion } from 'framer-motion';
import { Check, Printer } from 'lucide-react';

export default function TransferSuccess() {
  const { isOpen, successData, title, hideSuccess } = useSuccessModalStore();

  if (!successData) return null;

  const receiptItems = successData.rcpt?.split('|')?.map((item) => {
    const [label, rawValue] = item.split('#');

    let value = rawValue;

    if (label.trim().toLowerCase() === 'description') {
      try {
        value = decodeURIComponent(decodeURIComponent(rawValue));
      } catch (e) {
        value = rawValue;
      }
    }

    return [label, value];
  });

  return (
    <Dialog open={isOpen} onOpenChange={hideSuccess}>
      <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-md w-full p-0 gap-0 max-h-[90vh] overflow-y-auto">
        <div className="p-4 text-center md:p-6 sm:p-8">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-green-100 rounded-full"
          >
            <Check className="w-8 h-8 text-green-600" strokeWidth={3} />
          </motion.div>

          <DialogTitle className="max-w-xs pb-3 mx-auto mb-4 text-xl font-bold text-gray-900 border-b sm:text-2xl">
            {title}
          </DialogTitle>

          {/* Main Details */}
          <div className="mb-6 space-y-3 text-sm font-semibold text-gray-700">
            {receiptItems?.map(([label, value], idx) => (
              <div key={idx} className="flex justify-between gap-10">
                <span className="text-sm text-left text-gray-500 whitespace-nowrap">{label}</span>
                <span className="text-sm text-right text-gray-900">{value}</span>
              </div>
            ))}
          </div>

          {/* Done Button and Print Icon */}
          <div className="flex items-center justify-center mt-6 space-x-4">
            <Button
              type="button"
              onClick={hideSuccess}
              variant="primary"
              className="w-40 text-white bg-primary hover:bg-primary"
            >
              Done
            </Button>
            <button className="text-gray-400 hover:text-blue-600">
              <Printer className="w-6 h-6" />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
