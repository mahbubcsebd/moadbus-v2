'use client';

import { motion } from 'framer-motion';
import {
  Building2,
  Calendar,
  DollarSign,
  Eye,
  EyeOff,
  Shield,
  TrendingDown,
  TrendingUp,
  User,
} from 'lucide-react';
import { useState } from 'react';

const AccountBalanceCard = ({ account }) => {
  const [showBalance, setShowBalance] = useState(true);

  if (!account) return null;

  // Color mapping based on account color - matches AccountCard exactly
  const colorMap = {
    orange: {
      gradient: 'bg-gradient-to-br from-orange-400 to-primary/50',
      light: 'bg-primary/5',
      lightBorder: 'border-primary/10',
      text: 'text-orange-700',
      textDark: 'text-orange-900',
      lightText: 'text-orange-100',
      iconColor: 'text-primary',
      iconBg: 'bg-primary/5',
    },
    purple: {
      gradient: 'bg-gradient-to-br from-purple-400 to-purple-500',
      light: 'bg-purple-50',
      lightBorder: 'border-purple-100',
      text: 'text-purple-700',
      textDark: 'text-purple-900',
      lightText: 'text-purple-100',
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-50',
    },
    teal: {
      gradient: 'bg-gradient-to-br from-teal-400 to-teal-500',
      light: 'bg-teal-50',
      lightBorder: 'border-teal-100',
      text: 'text-teal-700',
      textDark: 'text-teal-900',
      lightText: 'text-teal-100',
      iconColor: 'text-teal-600',
      iconBg: 'bg-teal-50',
    },
    blue: {
      gradient: 'bg-gradient-to-br from-blue-400 to-blue-500',
      light: 'bg-blue-50',
      lightBorder: 'border-blue-100',
      text: 'text-blue-700',
      textDark: 'text-blue-900',
      lightText: 'text-blue-100',
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50',
    },
  };

  const colors = colorMap[account.color] || colorMap.orange;

  // Check if balances are different
  const showAvailableBalance = account.balance !== account.availableBalance;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`bg-white rounded-2xl shadow-md overflow-hidden border ${colors.lightBorder} mb-6`}
    >
      {/* Main Balance Section - Dynamic Gradient (matches AccountCard) */}
      <div className={`relative ${colors.gradient} p-6 sm:p-7 text-white`}>
        {/* Decorative circles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/10 rounded-full blur-xl" />
        </div>

        <div className="relative z-10">
          {/* Top Row: Account Type & Toggle */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <p className={`text-sm font-bold uppercase tracking-wider ${colors.lightText}`}>
                  {account.type} Account
                </p>
                <p className="text-[13px] text-white font-mono">{account.accountNumber}</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowBalance(!showBalance)}
              className="w-10 h-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors"
            >
              {showBalance ? (
                <Eye className="w-5 h-5 text-white" strokeWidth={2.5} />
              ) : (
                <EyeOff className="w-5 h-5 text-white" strokeWidth={2.5} />
              )}
            </motion.button>
          </div>

          {/* Balance Display */}
          <div className="space-y-1 lg:mb-6">
            <p className="text-xs text-white/90 font-medium uppercase tracking-wide">
              Current Balance
            </p>
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {showBalance ? (
                <h1 className="text-3xl md:text-3xl lg:text-5xl font-bold text-white tracking-tight">
                  <span className="text-xl sm:text-4xl font-semibold text-white/90">
                    {account.currency}
                  </span>{' '}
                  {account.balance.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </h1>
              ) : (
                <h1 className="text-5xl font-bold text-white/60">••••••••</h1>
              )}
            </motion.div>
          </div>

          {/* Account Holder & Branch Info */}
          <div className="hidden md:flex items-center justify-between pt-4 border-t border-white/20">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-white/90" strokeWidth={2.5} />
              <div>
                <p className="text-sm font-semibold text-white">
                  {account.accountName || 'Account Holder'}
                </p>
                <p className="text-[11px] text-white/80">
                  {account.accountTitle || 'Primary Account'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-white/90" strokeWidth={2.5} />
              <span className="text-sm font-medium text-white">
                {account.branch || 'Main Branch'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Available Balance - Only if different */}
      {showAvailableBalance && (
        <div className={`${colors.light} px-6 sm:px-7 py-4 border-b ${colors.lightBorder}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-xs ${colors.text} font-semibold uppercase tracking-wider mb-1`}>
                Available Balance
              </p>
              <p className={`text-2xl font-bold ${colors.textDark}`}>
                {showBalance
                  ? `${account.currency} ${account.availableBalance.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`
                  : '••••••••'}
              </p>
            </div>
            <div
              className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                account.status === 'Active'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {account.status || 'Active'}
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 bg-gradient-to-b from-white to-gray-50/50">
        <StatItem
          icon={TrendingUp}
          label="Monthly Income"
          value={`$${account.monthlyIncome?.toLocaleString() || '0'}`}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
          borderColor="border-emerald-100"
        />
        <StatItem
          icon={TrendingDown}
          label="Monthly Expenses"
          value={`$${account.monthlyExpenses?.toLocaleString() || '0'}`}
          iconColor="text-rose-600"
          iconBg="bg-rose-50"
          borderColor="border-rose-100"
        />
        <StatItem
          icon={Calendar}
          label="Account Opened"
          value={new Date(account.openedDate).toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric',
          })}
          iconColor={colors.iconColor}
          iconBg={colors.iconBg}
          borderColor={colors.lightBorder}
        />
        <StatItem
          icon={DollarSign}
          label="Interest Rate"
          value={account.interestRate || '0%'}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
          borderColor="border-blue-100"
        />
      </div>
    </motion.div>
  );
};

const StatItem = ({ icon: Icon, label, value, iconColor, iconBg, borderColor }) => {
  return (
    <div className="p-5 border-r border-gray-100 last:border-r-0 hover:bg-gray-50/50 transition-colors">
      <div className="flex flex-col items-center text-center space-y-2.5">
        <div
          className={`w-12 h-12 ${iconBg} ${borderColor} border rounded-xl flex items-center justify-center`}
        >
          <Icon className={`w-5 h-5 ${iconColor}`} strokeWidth={2.5} />
        </div>
        <div>
          <p className="text-[10px] text-gray-600 uppercase tracking-wider font-semibold mb-1">
            {label}
          </p>
          <p className="text-base font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default AccountBalanceCard;
