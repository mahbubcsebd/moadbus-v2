import { useAccountsStore } from '@/store/accountsStore';
import { motion } from 'framer-motion';
import { DollarSign, PiggyBank, TrendingUp, Wallet } from 'lucide-react';

// ========================================================
// TODO: Need to implement/verify amount update after
// Making any transaction
// ========================================================

function normalizeType(account) {
  const t = (account.type || '').toString().toLowerCase();

  if (t.includes('sav') || t.includes('saving')) return 'savings';
  if (t.includes('cur') || t.includes('current') || t.includes('checking')) return 'current';
  if (t.includes('time') || t.includes('term') || t.includes('fixed') || t.includes('investment'))
    return 'investment';
  if (t.includes('loan')) return 'loan';

  const desc = (account.description || '').toString().toLowerCase();

  if (desc.includes('saving')) return 'savings';
  if (desc.includes('current')) return 'current';
  if (desc.includes('time')) return 'investment';
  if (desc.includes('loan')) return 'loan';
  if (desc.includes('credit')) return 'credit';
  if (desc.includes('time')) return 'time';

  return 'other';
}

const SummaryCards = () => {
  const accounts = useAccountsStore((s) => s.accounts || []);

  const accountsWithBalance = accounts.map((a) => ({
    ...a,
    balance: Number(a.balance ?? 0),
  }));

  const totalCurrent = accountsWithBalance
    .filter((a) => normalizeType(a) === 'current')
    .reduce((sum, a) => sum + a.balance, 0);

  const totalSavings = accountsWithBalance
    .filter((a) => normalizeType(a) === 'savings')
    .reduce((sum, a) => sum + a.balance, 0);

  const totalTime = accountsWithBalance
    .filter((a) => normalizeType(a) === 'time' || normalizeType(a) === 'investment')
    .reduce((sum, a) => sum + a.balance, 0);

  const totalCreditUsed = accountsWithBalance
    .filter((a) => normalizeType(a) === 'credit')
    .reduce((sum, a) => sum + a.balance, 0);

  const totalLoans = accountsWithBalance
    .filter((a) => normalizeType(a) === 'loan')
    .reduce((sum, a) => sum + a.balance, 0);

  const totalBalance = accountsWithBalance.reduce((sum, a) => sum + a.balance, 0);

  const cards = [
    {
      title: 'Total Current',
      amount: totalCurrent,
      icon: Wallet,
      gradient: 'from-orange-400 to-primary/50',
    },
    {
      title: 'Total Savings',
      amount: totalSavings,
      icon: PiggyBank,
      gradient: 'from-purple-400 to-purple-500',
    },
    {
      title: 'Total Credit Used',
      amount: totalCreditUsed,
      icon: DollarSign,
      gradient: 'from-red-400 to-red-500',
    },
    {
      title: 'Total Time',
      amount: totalTime,
      icon: TrendingUp,
      gradient: 'from-teal-400 to-teal-500',
    },
    {
      title: 'Total Loans',
      amount: totalLoans,
      icon: DollarSign,
      gradient: 'from-blue-400 to-blue-500',
    },
  ];

  return (
    <div className="mb-6">
      {/* Mobile Scroll View */}
      <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
        <div className="flex gap-3" style={{ width: 'max-content' }}>
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-4 border border-gray-100 min-w-[160px]"
            >
              <div
                className={`p-2 rounded-lg bg-gradient-to-br ${card.gradient} inline-block mb-3`}
              >
                <card.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-xs text-gray-500 mb-1">{card.title}</p>
              <p className="text-lg font-bold text-gray-900">
                $
                {card.amount.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
