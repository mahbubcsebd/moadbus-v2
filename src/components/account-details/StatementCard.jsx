'use client';

import { Button } from '@/components/ui/button';
import { usePopup } from '@/context/PopupContext';
import { motion } from 'framer-motion';
import { Download, FileText } from 'lucide-react';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const StatementCard = ({ statement, index = 0 }) => {
  const { showMsgPopup, showConfirmPopup } = usePopup();

  // Donwnload Confirmation
  const confirmDownload = (downloadPath, fType) => {
    showConfirmPopup({
      title: 'Download Statement',
      description: 'Do you want to download this statement?',
      confirmLabel: 'Yes',
      cancelLabel: 'No',
      onConfirm: () => downloadFileFinal(downloadPath, fType),
    });
  };
  // Final Download call
  const downloadFileFinal = async (downloadPath, fType) => {

    try {
      const result = await makeNativeRequest('getFile', [downloadPath, fType], (response) => {


        showMsgPopup('success', response || 'Download completed!');
      });


    } catch (err) {

      showMsgPopup('error', err || 'Download failed!');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3, ease: 'easeOut' }}
      whileHover={{ scale: 1.005 }}
      className="group bg-white rounded-xl p-4 hover:bg-gray-50 transition-all border border-gray-100 hover:border-gray-200"
    >
      <div className="flex items-center justify-between gap-4">
        {/* Left: Icon and details */}
        <div className="flex items-center gap-3 flex-1">
          <div className="flex-shrink-0 w-11 h-11 bg-gray-100 group-hover:bg-gray-900 rounded-xl flex items-center justify-center transition-all duration-300">
            <FileText
              className="w-5 h-5 text-gray-700 group-hover:text-white transition-colors duration-300"
              strokeWidth={2.5}
            />
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-900 mb-0.5">
              20{statement.month.slice(0, 2)}
              {' '}{months[Number(statement.month.slice(2, 4))]}
            </p>
            <p className="text-xs text-gray-500">
              {statement.transactions} transactions
            </p>
          </div>
        </div>

        {/* Right: Balance and download */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">
              Closing Balance
            </p>
            <p className="text-sm font-bold text-gray-900">
              $
              {statement.balance.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>

          <Button
            size="icon"
            variant="ghost"
            className="h-9 w-9 hover:bg-gray-200"
            onClick={() => confirmDownload(statement.fileName, 'pdf')}
          >
            <Download className="w-4 h-4 text-gray-600" strokeWidth={2.5} />
          </Button>

          {/* <Button
            size="icon"
            variant="ghost"
            className="h-9 w-9 hover:bg-gray-200 sm:hidden"
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </Button> */}
        </div>
      </div>
    </motion.div>
  );
};

export default StatementCard;