import { motion } from 'framer-motion';
import { ArrowLeftRight, Clock, CreditCard, DollarSign, Eye, Send } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

// --- 1. STRICT DESIGN COLOR MAP (Extended with Cyan/Pink matching your style) ---
const colorMap = {
  blue: {
    active: 'bg-blue-500 text-white shadow-blue-200',
    inactive: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
    border: 'border-blue-200',
    accent: 'bg-blue-500',
    light: 'bg-blue-100', // Matches your "light" key
    icon: 'text-blue-600',
  },
  green: {
    active: 'bg-green-500 text-white shadow-green-200',
    inactive: 'bg-green-50 text-green-600 hover:bg-green-100',
    border: 'border-green-200',
    accent: 'bg-green-500',
    light: 'bg-green-100',
    icon: 'text-green-600',
  },
  teal: {
    active: 'bg-teal-500 text-white shadow-teal-200',
    inactive: 'bg-teal-50 text-teal-600 hover:bg-teal-100',
    border: 'border-teal-200',
    accent: 'bg-teal-500',
    light: 'bg-teal-100',
    icon: 'text-teal-600',
  },
  // Added Cyan matching your schema
  cyan: {
    active: 'bg-cyan-500 text-white shadow-cyan-200',
    inactive: 'bg-cyan-50 text-cyan-600 hover:bg-cyan-100',
    border: 'border-cyan-200',
    accent: 'bg-cyan-500',
    light: 'bg-cyan-100',
    icon: 'text-cyan-600',
  },
  purple: {
    active: 'bg-purple-500 text-white shadow-purple-200',
    inactive: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
    border: 'border-purple-200',
    accent: 'bg-purple-500',
    light: 'bg-purple-100',
    icon: 'text-purple-600',
  },
  // Added Pink matching your schema
  pink: {
    active: 'bg-pink-500 text-white shadow-pink-200',
    inactive: 'bg-pink-50 text-pink-600 hover:bg-pink-100',
    border: 'border-pink-200',
    accent: 'bg-pink-500',
    light: 'bg-pink-100',
    icon: 'text-pink-600',
  },
  orange: {
    active: 'bg-primary text-white shadow-orange-200',
    inactive: 'bg-primary/5 text-orange-700 hover:bg-orange-100',
    border: 'border-orange-200',
    accent: 'bg-primary',
    light: 'bg-orange-100',
    icon: 'text-orange-700',
  },
  red: {
    active: 'bg-red-500 text-white shadow-red-200',
    inactive: 'bg-red-50 text-red-600 hover:bg-red-100',
    border: 'border-red-200',
    accent: 'bg-red-500',
    light: 'bg-red-100',
    icon: 'text-red-600',
  },
  navy: {
    active: 'bg-slate-700 text-white shadow-slate-300',
    inactive: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
    border: 'border-slate-300',
    accent: 'bg-slate-700',
    light: 'bg-slate-200',
    icon: 'text-slate-700',
  },
  slate: {
    active: 'bg-slate-500 text-white shadow-slate-200',
    inactive: 'bg-slate-50 text-slate-600 hover:bg-slate-100',
    border: 'border-slate-300',
    accent: 'bg-slate-500',
    light: 'bg-slate-200',
    icon: 'text-slate-600',
  },
  amber: {
    active: 'bg-amber-500 text-white shadow-amber-200',
    inactive: 'bg-amber-50 text-amber-700 hover:bg-amber-100',
    border: 'border-amber-200',
    accent: 'bg-amber-500',
    light: 'bg-amber-100',
    icon: 'text-amber-700',
  },
  indigo: {
    active: 'bg-indigo-500 text-white shadow-indigo-200',
    inactive: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100',
    border: 'border-indigo-200',
    accent: 'bg-indigo-500',
    light: 'bg-indigo-100',
    icon: 'text-indigo-600',
  },
  sky: {
    active: 'bg-sky-500 text-white shadow-sky-200',
    inactive: 'bg-sky-50 text-sky-600 hover:bg-sky-100',
    border: 'border-sky-200',
    accent: 'bg-sky-500',
    light: 'bg-sky-100',
    icon: 'text-sky-600',
  },
};

// --- 2. LOGIC CONFIGURATION ---
const typeConfig = {
  1: {
    // Savings
    name: 'Savings',
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
    name: 'Current',
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
    name: 'Loan',
    color: 'teal',
    icon: DollarSign,
    actions: [
      {
        icon: ArrowLeftRight,
        label: 'Payment',
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
    name: 'Time',
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

export default function AccountTabView({ accounts }) {
  const [selectedAccount, setSelectedAccount] = useState(accounts[0] || null);
  const navigate = useNavigate();

  if (!selectedAccount) return null;

  // Configuration Resolution
  const config = typeConfig[selectedAccount.accountType] || typeConfig[1];
  const colors = colorMap[config.color] || colorMap.orange;
  const IconComponent = config.icon;

  const handleViewAccount = (account) => {
    navigate('/dashboard/account-options', { state: { account: account } });
  };

  const handleActionClick = (route, account) => {
    const path = typeof route === 'function' ? route(selectedAccount) : route;
    navigate(path, { state: { account: account } });
  };

  return (
    <div className="space-y-0">
      {/* Tabs - EXACT Design from your code */}
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-10 gap-x-0">
        {accounts.map((account, index) => {
          // Resolve config per tab
          const tabConfig = typeConfig[account.accountType] || typeConfig[1];
          const tabColors = colorMap[tabConfig.color] || colorMap.orange;
          const isActive = selectedAccount.accountNumber === account.accountNumber;

          return (
            <motion.button
              key={index}
              onClick={() => setSelectedAccount(account)}
              whileHover={{ scale: isActive ? 1 : 1.02, y: isActive ? 0 : -2 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03, duration: 0.2 }}
              style={{
                zIndex: isActive ? 20 : 10 - index,
                marginLeft: index === 0 ? '0px' : undefined,
              }}
              className={`
                relative w-full px-2 py-2.5 text-xs font-semibold
                transition-all duration-200
                border border-b-0 rounded-t-xl
                ${
                  isActive
                    ? tabColors.active + ' shadow-lg border-transparent translate-y-0'
                    : tabColors.inactive + ' ' + tabColors.border + ' opacity-90'
                }
                ${index !== 0 ? '-ml-2' : ''}

                /* Mobile (3 columns) logic */
                nth-[3n+1]:ml-0
                /* Medium (4 columns) logic */
                md:nth-[4n+1]:ml-0
                /* Large (6 columns) logic */
                lg:nth-[6n+1]:ml-0
                /* Extra Large (10 columns) logic */
                xl:nth-[10n+1]:ml-0
              `}
            >
              {/* Account Name and Number side by side */}
              <div className="flex items-center justify-center gap-1">
                <span className="capitalize text-[10px] sm:text-[11px] font-bold">
                  {account.accountName}
                </span>
                <span
                  className={`text-[9px] sm:text-[10px] font-medium shrink-0 ${
                    isActive ? 'opacity-90' : 'opacity-70'
                  }`}
                >
                  {account.accountNumber.slice(-4)}
                </span>
              </div>

              {/* Bottom connector for active tab */}
              {isActive && (
                <div
                  className={`absolute -bottom-px left-0 right-0 h-px ${
                    tabColors.active.split(' ')[0]
                  }`}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Account Details Card - EXACT Design from your code */}
      <motion.div
        key={selectedAccount.accountNumber}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative z-30 overflow-hidden bg-white border border-gray-100 rounded-tl-none shadow-lg rounded-2xl"
        onClick={() => handleViewAccount(selectedAccount)}
      >
        {/* Top Section - Balance */}
        <div className={`${colors.light} p-4 md:p-5 border-b border-gray-100/50`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 md:w-12 md:h-12 ${colors.accent} rounded-xl flex items-center justify-center shadow-sm`}
              >
                <IconComponent className="w-5 h-5 text-white md:w-6 md:h-6" strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 capitalize md:text-base">
                  {config.name}
                </h3>
                <p className="font-mono text-xs font-medium text-gray-600">
                  {selectedAccount.accountNumber}
                </p>
              </div>
            </div>

            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                handleViewAccount(selectedAccount);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 transition-colors bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50"
            >
              <Eye className="w-4 h-4 text-gray-600" strokeWidth={2} />
            </motion.button>
          </div>

          <div>
            <p className="mb-1 text-xs font-bold tracking-wider text-gray-600 uppercase opacity-80">
              Available Balance
            </p>
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 md:text-3xl">
              $
              {selectedAccount.balance.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </h2>
          </div>
        </div>

        {/* Bottom Section - Dynamic Actions */}
        <div className="p-4 md:p-5">
          <div className="flex gap-4">
            {config.actions.map((action, idx) => (
              <ActionButton
                key={idx}
                icon={action.icon}
                label={action.label}
                colorClass={colors.icon}
                onClick={() => handleActionClick(action.route, selectedAccount)}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Helper Component for Buttons - Preserved Style
function ActionButton({ icon: Icon, label, colorClass, onClick }) {
  return (
    <motion.button
      onClick={(e) => {
        e.stopPropagation();
        if (onClick) onClick();
      }}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      className="flex flex-col items-center justify-center flex-1 h-full gap-2 p-3 transition-all border border-gray-100 shadow-sm rounded-xl bg-gray-50 hover:bg-gray-100 hover:shadow"
    >
      <Icon className={`w-5 h-5 ${colorClass}`} strokeWidth={2} />
      <span className="text-[10px] font-semibold text-gray-700 text-center leading-tight">
        {label}
      </span>
    </motion.button>
  );
}
