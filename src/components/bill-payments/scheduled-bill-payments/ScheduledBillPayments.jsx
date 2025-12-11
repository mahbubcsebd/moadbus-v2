import HeaderTop from '@/components/global/HeaderTop';

import { scheduledBillPayments } from '@/api/endpoints';
import { motion } from 'framer-motion';
import { ChevronRight, Eye, History, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import PaymentViewModal from './PaymentViewModal';
import PaymentsHistory from './PaymentsHistory';

const getStatusColor = (status) => {
  switch (status) {
    case 'Active':
      return 'text-green-600 bg-green-50';
    case 'Expired':
      return 'text-gray-500 bg-gray-100';
    case 'Cancelled':
      return 'text-red-600 bg-red-50';
    default:
      return 'text-gray-500 bg-gray-100';
  }
};

const ScheduledBillPayments = () => {
  const [paymetsList, setPaymetsList] = useState([]);
  // State for modal management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [action, setAction] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  const handleAction = (action, payment) => {
    console.log(`${action} action triggered for payment ID: ${payment.id}`);

    setSelectedPayment(payment);
    setAction(action);
    if (action === 'History') setShowHistory(true);
    else setIsModalOpen(true);
  };
  const getPaymentList = async () => {
    try {
      let result = await scheduledBillPayments();
      let result_arr = [];
      result = result.rs.p && result.rs.p.split('|');
      result.map((item) => {
        let current = item.split(';');
        result_arr.push({
          code: current[0],
          payFrom: current[17],
          payTo: current[23],
          date: current[8],
          billerName: current[24],
          currency: current[4],
          amount: current[5],
          status: current[13],
          referenceNo: current[22],
          until: current[11],
          frequency: current[9],
          // id:current[0],
        });
        // console.log(current)
      });
      setPaymetsList(result_arr);
    } catch (e) {
      console.error('Error loading payments:', e);
      setPaymetsList([]);
    }
  };

  useMemo(() => {
    getPaymentList();
  }, []);
  return (
    <>
      {!showHistory && (
        <HeaderTop
          title="Scheduled Bill Payments"
          text="View and track all your payments"
          link="/dashboard"
          linkText="Back to Dashboard"
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="space-y-3"
      >
        {/* 🌟 Payment Details Modal 🌟 */}
        <PaymentViewModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          paymentData={selectedPayment}
          action={action}
          updateList={getPaymentList}
        />
        {paymetsList.length === 0 ? (
          <div className="p-8 text-center bg-white border border-gray-200 rounded-lg shadow-sm">
            <p className="text-gray-500">No scheduled payments found matching your filters.</p>
          </div>
        ) : !showHistory ? (
          paymetsList.map((payment, index) => (
            <motion.div
              key={payment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="p-4 transition-shadow bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md"
            >
              {/* Desktop/Tablet View (md:flex) */}
              <div className="items-center justify-between hidden md:flex">
                {/* Payment Info */}
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center space-x-2 text-base font-semibold text-gray-900">
                    <span>{payment.payFrom}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                    <span>{payment.payTo}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">{payment.date}</div>
                </div>

                {/* Amount and Status */}
                <div className="flex items-center space-x-6 shrink-0">
                  <div className="w-24 font-bold text-right text-gray-900">
                    {payment.currency} {payment.amount}
                  </div>
                  <div
                    className={`text-xs font-medium px-2 py-1 rounded-full w-20 text-center ${getStatusColor(
                      payment.status,
                    )}`}
                  >
                    {payment.status}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <button
                      onClick={() => handleAction('View', payment)}
                      className="flex items-center space-x-1 hover:text-blue-600"
                    >
                      <Eye className="w-4 h-4" /> <span>View</span>
                    </button>
                    <button
                      onClick={() => handleAction('History', payment)}
                      className="flex items-center space-x-1 hover:text-blue-600"
                    >
                      <History className="w-4 h-4" /> <span>History</span>
                    </button>
                    {payment.status === 'Active' && (
                      <button
                        onClick={() => handleAction('Cancel', payment)}
                        className="flex items-center space-x-1 hover:text-red-600"
                      >
                        <X className="w-4 h-4" /> <span>Cancel</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Mobile Card View (md:hidden) */}
              <div className="space-y-3 md:hidden">
                {/* Top Row: From/To, Amount, Status */}
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="text-sm font-semibold text-gray-900 truncate">
                      {payment.payFrom} <ChevronRight className="inline w-3 h-3 text-gray-400" />{' '}
                      {payment.payTo}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">{payment.date}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-base font-bold text-gray-900">
                      {payment.currency} {payment.amount}
                    </div>
                    <div
                      className={`text-xs font-medium px-2 py-0.5 rounded-full mt-1 ${getStatusColor(
                        payment.status,
                      )}`}
                    >
                      {payment.status}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between pt-3 border-t border-gray-100">
                  <button
                    onClick={() => handleAction('View', payment)}
                    className="flex items-center space-x-1 text-sm text-blue-600 hover:underline"
                  >
                    <Eye className="w-4 h-4" /> <span>View</span>
                  </button>
                  <button
                    onClick={() => handleAction('History', payment)}
                    className="flex items-center space-x-1 text-sm text-blue-600 hover:underline"
                  >
                    <History className="w-4 h-4" /> <span>History</span>
                  </button>
                  {payment.status === 'Active' && (
                    <button
                      onClick={() => handleAction('Cancel', payment)}
                      className="flex items-center space-x-1 text-sm text-red-600 hover:underline"
                    >
                      <X className="w-4 h-4" /> <span>Cancel</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <PaymentsHistory onClose={() => setShowHistory(false)} paymentData={selectedPayment} />
        )}
      </motion.div>
    </>
  );
};

export default ScheduledBillPayments;
