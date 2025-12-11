import { motion } from 'framer-motion';
import {
  ArrowLeft,
  CreditCard,
  Download,
  FileCheck,
  FileText,
  Printer,
  RefreshCw,
  Send,
  Settings,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router';

const quickActions = [
  // { icon: Search, label: 'Search/Filter' },
  // { icon: FileText, label: 'Account Activity' },
  { icon: Send, label: 'Transfer', id: 3 },
  { icon: Printer, label: 'Order Print Statement', id: 5 },
  { icon: RefreshCw, label: 'Reorder Checkbook', id: 9 },
  { icon: CreditCard, label: 'Stop Check Payment', id: 11 },
  { icon: FileCheck, label: 'Order An Affidavit', id: 19 },
  { icon: FileText, label: 'Positive Pay', id: 20 },
  { icon: Settings, label: 'Inquire Check Status', id: 22 },
  { icon: Download, label: 'Order Cashier Check', id: 23 },
  { icon: Send, label: 'Make Payment', id: 12 },
];

const QuickActionsGrid = ({ account }) => {
  //   const { state } = useLocation();
  //  let account = state.account;
  return (
    <div className="space-y-4 mb-6">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 mb-6 text-gray-600 transition-colors hover:text-primary"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm font-medium">Back to Dashboard</span>
      </Link>
      <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2 md:gap-3 sm:gap-4 items-stretch">
        {quickActions.map(
          (action, index) =>
            account.available_functions[action.id] && (
              <ActionCard key={action.label} action={action} index={index} account={account} />
            ),
        )}
      </div>
    </div>
  );
};

const ActionCard = ({ action, index, account }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() =>
        navigate(`/dashboard/${action.label.replace(/\s+/g, '-').toLowerCase()}`, {
          state: { account: account },
        })
      }
      // to={}
      className="inline-block h-full"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          delay: index * 0.05,
          duration: 0.3,
          ease: [0.4, 0, 0.2, 1],
        }}
        whileHover={{
          y: -4,
          transition: { duration: 0.2, ease: 'easeOut' },
        }}
        whileTap={{ scale: 0.95 }}
        className="group relative bg-white rounded-md lg:rounded-xl p-4 sm:p-5 shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)] transition-all duration-300 h-full"
      >
        {/* Subtle hover effect */}
        <div className="absolute inset-0 bg-linear-to-br from-primary/5/0 to-primary/5/0 group-hover:from-primary/5/50 group-hover:to-primary/5/20 rounded-md lg:rounded-xl transition-all duration-300" />

        <div className="relative flex flex-col items-center gap-3 text-center">
          {/* Icon container */}
          <div className="">
            <action.icon
              className="w-6 h-6 sm:w-7 sm:h-7 text-primary transition-colors duration-300"
              strokeWidth={2}
            />
          </div>

          {/* Text */}
          <p className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-gray-900 leading-tight transition-colors">
            {action.label}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default QuickActionsGrid;
