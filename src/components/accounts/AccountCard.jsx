import { motion } from 'framer-motion';
import {
  ArrowLeftRight,
  Clock,
  CreditCard,
  DollarSign,
  Eye,
  MoreHorizontal,
  Send,
} from 'lucide-react';
import { useNavigate } from 'react-router';

// --- 1. Enhanced Color System (Matching the Design) ---
const colorMap = {
  blue: {
    gradient: 'bg-gradient-to-br from-blue-400 to-blue-500 backdrop-blur-xl',
    iconBg: 'bg-blue-500/15 backdrop-blur-md',
    iconHover: 'hover:bg-blue-500/25',
    border: 'border-blue-400',
    leftBorder: 'border-l-blue-400',
    actionBg: 'bg-blue-50/80 backdrop-blur-md',
    actionHover: 'hover:bg-blue-100/80',
    actionIcon: 'text-blue-600',
  },
  green: {
    gradient: 'bg-gradient-to-br from-green-400 to-green-500 backdrop-blur-xl',
    iconBg: 'bg-green-500/15 backdrop-blur-md',
    iconHover: 'hover:bg-green-500/25',
    border: 'border-green-400',
    leftBorder: 'border-l-green-400',
    actionBg: 'bg-green-50/80 backdrop-blur-md',
    actionHover: 'hover:bg-green-100/80',
    actionIcon: 'text-green-600',
  },
  teal: {
    gradient: 'bg-gradient-to-br from-teal-400 to-teal-500 backdrop-blur-xl',
    iconBg: 'bg-teal-500/15 backdrop-blur-md',
    iconHover: 'hover:bg-teal-500/25',
    border: 'border-teal-400',
    leftBorder: 'border-l-teal-400',
    actionBg: 'bg-teal-50/80 backdrop-blur-md',
    actionHover: 'hover:bg-teal-100/80',
    actionIcon: 'text-teal-600',
  },
  purple: {
    gradient: 'bg-gradient-to-br from-purple-400 to-purple-500 backdrop-blur-xl',
    iconBg: 'bg-purple-500/15 backdrop-blur-md',
    iconHover: 'hover:bg-purple-500/25',
    border: 'border-purple-400',
    leftBorder: 'border-l-purple-400',
    actionBg: 'bg-purple-50/80 backdrop-blur-md',
    actionHover: 'hover:bg-purple-100/80',
    actionIcon: 'text-purple-600',
  },
  cyan: {
    gradient: 'bg-gradient-to-br from-cyan-400 to-cyan-500 backdrop-blur-xl',
    iconBg: 'bg-cyan-500/15 backdrop-blur-md',
    iconHover: 'hover:bg-cyan-500/25',
    border: 'border-cyan-400',
    leftBorder: 'border-l-cyan-400',
    actionBg: 'bg-cyan-50/80 backdrop-blur-md',
    actionHover: 'hover:bg-cyan-100/80',
    actionIcon: 'text-cyan-600',
  },
  pink: {
    gradient: 'bg-gradient-to-br from-pink-400 to-pink-500 backdrop-blur-xl',
    iconBg: 'bg-pink-500/15 backdrop-blur-md',
    iconHover: 'hover:bg-pink-500/25',
    border: 'border-pink-400',
    leftBorder: 'border-l-pink-400',
    actionBg: 'bg-pink-50/80 backdrop-blur-md',
    actionHover: 'hover:bg-pink-100/80',
    actionIcon: 'text-pink-600',
  },
  orange: {
    gradient: 'bg-gradient-to-br from-orange-400 to-primary/50 backdrop-blur-xl',
    iconBg: 'bg-primary/15 backdrop-blur-md',
    iconHover: 'hover:bg-primary/25',
    border: 'border-orange-400',
    leftBorder: 'border-l-orange-400',
    actionBg: 'bg-primary/5/80 backdrop-blur-md',
    actionHover: 'hover:bg-orange-100/80',
    actionIcon: 'text-primary',
  },
};

// --- 2. Logic Configuration (From your React Project) ---
const typeConfig = {
  1: {
    // Savings
    name: 'Savings Account',
    color: 'cyan',
    icon: CreditCard,
    actions: [
      {
        icon: ArrowLeftRight,
        label: 'Transfer',
        route: (a) =>
          `/dashboard/transfers/transfer-between-own-acccounts?account=${a.accountNumber}`,
      },
      { icon: Send, label: 'Pay', route: '/dashboard/bill-payments-pay' },
      {
        icon: Clock,
        label: 'Activity',
        route: (a) => `/dashboard/activity/${a.accountNumber}`,
      },
    ],
  },
  6: {
    // Current / Checking
    name: 'Current Account',
    color: 'blue',
    icon: CreditCard,
    actions: [
      {
        icon: ArrowLeftRight,
        label: 'Transfer',
        route: (a) =>
          `/dashboard/transfers/transfer-between-own-acccounts?account=${a.accountNumber}`,
      },
      { icon: Send, label: 'Pay', route: '/dashboard/bill-payments-pay' },
      {
        icon: Clock,
        label: 'Activity',
        route: (a) => `/dashboard/activity/${a.accountNumber}`,
      },
    ],
  },
  7: {
    // Credit Card
    name: 'Credit Card',
    color: 'purple',
    icon: CreditCard,
    actions: [
      {
        icon: Send,
        label: 'Pay',
        route: '/dashboard/credit-card/bill-payments-pay',
      },
      {
        icon: Clock,
        label: 'Activity',
        route: (a) => `/dashboard/activity/${a.accountNumber}`,
      },
    ],
  },
  5: {
    // Loan
    name: 'Loan Account',
    color: 'teal',
    icon: DollarSign,
    actions: [
      {
        icon: ArrowLeftRight,
        label: 'Make a Payment',
        route: '/dashboard/make-payment',
      },
      {
        icon: Clock,
        label: 'Activity',
        route: (a) => `/dashboard/activity/${a.accountNumber}`,
      },
    ],
  },
  3: {
    // Time Deposit
    name: 'Time Account',
    color: 'pink',
    icon: Clock,
    actions: [
      {
        icon: Clock,
        label: 'Activity',
        route: (a) => `/dashboard/activity/${a.accountNumber}`,
      },
    ],
  },
};

export default function AccountCard({ account, index, viewMode = 'grid' }) {
  const navigate = useNavigate();

  if (!account) return null;

  // Configuration Logic
  const config = typeConfig[account.accountType] || typeConfig[1];
  const colors = colorMap[config.color] || colorMap.orange;
  const IconComponent = config.icon;

  const handleActionClick = (e, action) => {
    e.stopPropagation();
    const path = typeof action.route === 'function' ? action.route(account) : action.route;
    navigate(path, { state: { account: account } });
  };

  const handleViewAccount = () => {
    navigate('/dashboard/account-options', { state: { account: account } });
  };

  // --- GRID VIEW ---
  if (viewMode === 'grid') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.3 }}
        whileHover={{ y: -4 }}
        className={`${colors.gradient} rounded-lg p-4 md:p-6 text-white relative overflow-hidden shadow-lg border border-white/20`}
        onClick={handleViewAccount}
      >
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <div className="absolute top-0 right-0 w-40 h-40 translate-x-1/2 -translate-y-1/2 bg-white rounded-full" />
          <div className="absolute bottom-0 left-0 w-32 h-32 -translate-x-1/2 translate-y-1/2 bg-white rounded-full" />
        </div>

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="mb-1 text-xs font-semibold tracking-wider uppercase md:text-sm opacity-90">
                {account.accountName}
              </p>
              <p className="text-[11px] opacity-80">{account.accountNumber}</p>
            </div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex flex-col items-center gap-0.5"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewAccount();
                }}
                className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          </div>
          <div className="mb-4">
            <motion.h3 className="text-2xl md:text-3xl font-bold mb-0.5">
              $
              {account.balance.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </motion.h3>
            <p className="text-[10px] opacity-75">{account.currency}</p>
          </div>

          {/* Dynamic Actions Row */}
          <div className="flex items-center gap-2">
            {config.actions.map((action, idx) => {
              const ActionIcon = action.icon;
              return (
                <button
                  key={idx}
                  onClick={(e) => handleActionClick(e, action)}
                  className={`p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm ${
                    idx === config.actions.length - 1 ? 'ml-auto' : ''
                  }`}
                  title={action.label}
                >
                  <ActionIcon className="w-3.5 h-3.5" />
                </button>
              );
            })}
            {/* Fallback if no actions, show 'More' to maintain layout */}
            {config.actions.length === 0 && (
              <button className="p-2 ml-auto transition-colors rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm">
                <MoreHorizontal className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // --- LIST VIEW ---
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        delay: index * 0.05,
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
      }}
      whileHover={{
        scale: 1.002,
        transition: { duration: 0.3, ease: 'easeOut' },
      }}
      className="relative w-full"
      onClick={handleViewAccount}
    >
      <div className="relative bg-white/70 backdrop-blur-xl h-[120px] overflow-hidden w-full rounded-r-full shadow-sm border border-white/50">
        {/* Left colored accent bar */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-1.5 ${colors.gradient} rounded-l-2xl z-20`}
        />

        {/* Content Section */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-5 z-20 max-w-[65%] lg:max-w-[55%]">
          {/* Main Icon */}
          <motion.div
            whileHover={{ scale: 1.05, rotate: 3 }}
            className="relative shrink-0"
            onClick={handleViewAccount}
          >
            <div
              className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl ${colors.gradient} flex items-center justify-center text-white shadow-md relative overflow-hidden border border-white/30 cursor-pointer`}
            >
              <div className="absolute inset-0 opacity-50 bg-gradient-to-tr from-white/20 to-transparent" />
              <IconComponent className="relative z-10 w-7 h-7 md:w-8 md:h-8" strokeWidth={1.5} />
            </div>
          </motion.div>

          {/* Divider */}
          <div className="hidden w-px h-16 bg-gray-200/60 shrink-0 md:block" />

          {/* Text Info */}
          <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-6">
            <div className="flex flex-col gap-0.5 min-w-[106px]">
              <p className="text-[11px] md:text-xs font-bold text-gray-800 uppercase tracking-wide">
                {account.accountName}
              </p>
              <p className="text-[10px] text-gray-500 font-medium font-mono tracking-tight">
                {account.accountNumber}
              </p>
            </div>

            <div className="flex flex-col font-medium md:border-l md:border-gray-200/60 md:pl-6">
              <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider hidden md:block mb-0.5">
                Available
              </p>
              <h3 className="flex items-baseline text-xl font-extrabold tracking-tight text-gray-900 md:text-2xl">
                <span className="text-sm md:text-lg mr-0.5 opacity-70">$</span>
                {account.balance.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </h3>
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS (Dynamic) */}
        <div className="absolute top-1/2 -translate-y-1/2 right-10 lg:right-12 z-30 flex flex-col gap-1.5">
          {/* Always show Eye/View button first */}
          <motion.button
            onClick={handleViewAccount}
            whileHover={{ scale: 1.05, x: -1 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center justify-center p-1.5 w-7 h-7 md:w-8 md:h-8 rounded-lg shadow-sm transition-all duration-200 ${colors.actionBg} ${colors.actionHover} border border-white/40`}
            title="View Details"
          >
            <Eye className={`w-4 h-4 ${colors.actionIcon}`} strokeWidth={2} />
          </motion.button>

          {/* Map through logic actions */}
          {config.actions.map((action, idx) => {
            const ActionIcon = action.icon;
            // Limit to 2 extra actions in list view to prevent overflow, or show all if you have space
            if (idx > 1) return null;

            return (
              <motion.button
                key={idx}
                onClick={(e) => handleActionClick(e, action)}
                whileHover={{ scale: 1.05, x: -1 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center justify-center p-1.5 w-7 h-7 md:w-8 md:h-8 rounded-lg shadow-sm transition-all duration-200 ${colors.actionBg} ${colors.actionHover} border border-white/40`}
                title={action.label}
              >
                <ActionIcon className={`w-4 h-4 ${colors.actionIcon}`} strokeWidth={2} />
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
