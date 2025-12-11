import { makeNativeRequest } from '@/api/api';
import { getAccountStatements } from '@/api/endpoints';
import GlobalSelect from '@/components/global/GlobalSelect';
import { usePopup } from '@/context/PopupContext';
import { useAccountsStore } from '@/store/accountsStore';
import { isDebugMode } from '@/utils/devDebug';
import { motion } from 'framer-motion';
import { Download, FileText } from 'lucide-react';
import { useMemo, useState } from 'react';

export default function Statements() {
  const [selectedAccount, setSelectedAccount] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [statements, setStatements] = useState([]);

  const accounts = useAccountsStore((s) => s.accounts || []);
  const { showMsgPopup, showConfirmPopup } = usePopup();

  // Account dropdown
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

  // Year dropdown
  const currentYear = new Date().getFullYear();
  const yearOptions = useMemo(() => {
    const years = [];
    for (let y = 2023; y <= currentYear; y++) {
      years.push({ label: y.toString(), value: y.toString() });
    }
    return years;
  }, [currentYear]);

  const parseStatements = (atsString) => {
    if (!atsString) return [];

    return atsString
      .split('|')
      .filter(Boolean)
      .map((item) => {
        const parts = item.split('#');

        const mmYY = parts[0];

        const year = 2000 + parseInt(mmYY.slice(0, 2), 10);
        const month = parseInt(mmYY.slice(2), 10) - 1;
        const dateObj = new Date(year, month);

        const lastSegment = parts[7] || '';
        const fileName = lastSegment.split('fileName=')[1] || '';

        if (isDebugMode()) {
          console.log('[DEBUG] Parsed Statement:', {
            raw: item,
            fileName,
            lastSegment,
          });
        }

        return {
          raw: item,
          fileName,
          monthLabel: dateObj.toLocaleString('default', {
            month: 'long',
            year: 'numeric',
          }),
        };
      });
  };

  const handleFilter = async () => {
    if (!selectedAccount || !selectedYear) return;

    try {
      const response = await getAccountStatements({
        accNo: selectedAccount,
        year: selectedYear,
      });

      if (isDebugMode()) alert('[DEBUG] API Response: ' + JSON.stringify(response));

      const formatted = response.rs;

      if (formatted.status === 'success' && formatted.ats) {
        const records = parseStatements(formatted.ats);
        setStatements(records);
      } else {
        showMsgPopup('error', formatted.msg);
        setStatements([]);
      }
    } catch (error) {
      console.error('Failed to fetch or parse statements', error);
    }
  };

  // Donwnload Confirmation
  const confirmDownload = (downloadPath, fType) => {
    if (isDebugMode()) {
      alert(`[DEBUG] confirmDownload\nfileName: ${downloadPath}\nfType: ${fType}`);
    }
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
    if (isDebugMode()) {
      alert(`[DEBUG] downloadFileFinal\nPath: ${downloadPath}\nType: ${fType}`);
    }

    try {
      const result = await makeNativeRequest('getFile', [downloadPath, fType], (response) => {
        if (isDebugMode()) alert('[DEBUG] getFile callback: ' + response);

        showMsgPopup('success', response || 'Download completed!');
      });

      if (isDebugMode()) {
        alert('[DEBUG] makeNativeRequest result: ' + JSON.stringify(result));
      }
    } catch (err) {
      if (isDebugMode()) alert('[DEBUG] Download error: ' + err);

      showMsgPopup('error', err || 'Download failed!');
    }
  };

  return (
    <>
      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-6 mb-6 bg-white border border-gray-100 rounded-xl"
      >
        <div className="grid items-end grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <GlobalSelect
              label="Select Account"
              placeholder="Select Account"
              options={accountOptions}
              value={selectedAccount}
              onChange={setSelectedAccount}
            />
          </div>

          <div>
            <GlobalSelect
              label="Select Year"
              placeholder="Select Year"
              options={yearOptions}
              value={selectedYear}
              onChange={setSelectedYear}
            />
          </div>

          <button
            type="button"
            onClick={handleFilter}
            className="px-6 py-3 font-medium text-white transition-colors rounded-lg bg-primary hover:bg-primary"
          >
            Filter
          </button>
        </div>
      </motion.div>

      {/* Statements */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6">
        {statements.length > 0 ? (
          statements.map((statement, index) => (
            <motion.div
              key={statement.fileName || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="p-6 transition-all bg-white border border-gray-100 rounded-xl hover:shadow-lg group"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="mb-1 text-xl font-bold text-gray-900">{statement.monthLabel}</h3>
                  <p className="text-sm text-gray-500">Account Statement</p>
                </div>
                <div className="p-3 transition-colors rounded-lg bg-blue-50 group-hover:bg-blue-100">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <button
                type="button"
                className="flex items-center justify-center w-full gap-2 px-4 py-3 font-medium text-white transition-all rounded-lg bg-linear-to-r from-primary/40 to-primary/50 hover:from-primary/50 hover:to-primary"
                onClick={() => confirmDownload(statement.fileName, 'pdf')}
              >
                <Download className="w-5 h-5" />
                <span>Download PDF</span>
              </button>
            </motion.div>
          ))
        ) : (
          <div className="py-12 text-center col-span-full">
            <p className="text-gray-500">No statements available</p>
          </div>
        )}
      </div>
    </>
  );
}
