import { scheduledTransferHistory } from '@/api/endpoints';
import HeaderTop from '@/components/global/HeaderTop';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';

const ScheduledTransferHistory = ({ onClose, paymentData }) => {
  const [history, setHistory] = useState([]);
  const { state } = useLocation();
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
  const getTransferHistory = async () => {
    try {
      let payload = { scheduleId: state.id };
      let result = await scheduledTransferHistory(payload);

      if (!result?.rs?.p) {
        setHistory([]);
        return;
      }

      const items = result.rs.p.slice(0, -1).split('|');

      const list = items.map((item, index) => {
        const current = item.split(';');

        return {
          payFrom: current[3],
          payTo: current[4],
          amount: current[2],
          currency: current[5],
          date: current[1],
          status: current[0],
        };
      });

      setHistory(list);
    } catch (e) {
      console.error('Error loading payments:', e);
      setHistory([]);
    }
  };

  useEffect(() => {
    getTransferHistory();
  }, []);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="space-y-3"
      >
        <HeaderTop title="History" text="" link="/dashboard" linkText="Back to Dashboard" />
        {history.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <p className="text-gray-500">List is empty.</p>
          </div>
        ) : (
          history.map((payment, index) => (
            <motion.div
              key={payment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Place your payment card info here */}
              <div className="text-sm flex flex-col gap-1">
                {/* Payment Info */}
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center  space-x-2 text-base font-semibold text-gray-900">
                    <span>{payment.payFrom}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                    <span>{payment.payTo}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">{payment.date}</div>
                </div>
                <div className="flex items-center justify-between space-x-6 shrink-0">
                  <div className=" font-bold text-gray-900 w-24">
                    {payment.currency} {payment.amount}
                  </div>
                  <div
                    className={`text-xs font-medium px-2 py-1 rounded-full w-20 text-center ${getStatusColor(
                      payment.status,
                    )}`}
                  >
                    {payment.status}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
        <Link to="/dashboard/transfers/schedule-transfers">
          <Button
            type="button"
            onClick={() => onClose()}
            className="px-4 py-2 text-sm rounded ml-auto mr-auto block mt-2  bg-primary text-white"
          >
            Back
          </Button>
        </Link>
      </motion.div>
    </>
  );
};

export default ScheduledTransferHistory;
