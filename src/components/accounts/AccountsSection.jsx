import { useAccountsStore } from '@/store/accountsStore';
import { AnimatePresence, motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import AccountCard from './AccountCard';

// ========================================================
// TODO: Need to implement/verify amount update after
// Making any transaction
// ========================================================

const AccountsSection = () => {
  const accounts = useAccountsStore((s) => s.accounts || []);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { id: 'all', label: 'All Accounts' },
    { id: 'current', label: 'Current' },
    { id: 'savings', label: 'Savings' },
    { id: 'time', label: 'Time Deposit' },
    { id: 'loan', label: 'Loans' },
  ];

  // Bulletproof type detection
  const getAccountType = (desc) => {
    if (!desc) return 'unknown';
    const d = desc.toLowerCase();
    if (d.includes('current')) return 'current';
    if (d.includes('savings')) return 'savings';
    if (d.includes('time')) return 'time';
    if (d.includes('loan')) return 'loan';
    return 'unknown';
  };

  // Filter accounts by tab + search
  const filteredAccounts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return accounts.filter((acc) => {
      const type = getAccountType(acc.description);

      const matchesTab = activeTab === 'all' || type === activeTab;

      const matchesSearch =
        query === '' ||
        (acc.accountNumber || '').toLowerCase().includes(query) ||
        (acc.description || '').toLowerCase().includes(query) ||
        type.includes(query);

      return matchesTab && matchesSearch;
    });
  }, [accounts, activeTab, searchQuery]);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">My Accounts</h2>
        <p className="text-sm text-gray-500">View and manage all your accounts</p>
      </div>

      {/* Tabs + Search */}
      <div className="mb-6 space-y-4 bg-white border border-gray-200 rounded-lg p-4">
        {/* Desktop Tabs */}
        <div className="hidden md:flex items-center gap-2 bg-gray-50 p-1 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Mobile Tabs */}
        <div className="md:hidden overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          <div className="flex gap-2 bg-gray-50 p-1 rounded-lg" style={{ width: 'max-content' }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2.5 px-4 rounded-lg font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id ? 'bg-primary text-white shadow-sm' : 'text-gray-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search accounts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      {/* Accounts Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab + searchQuery}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6"
        >
          {filteredAccounts.length > 0 ? (
            filteredAccounts.map((account, index) => (
              <AccountCard key={`${account.id}-${index}`} account={account} index={index} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No accounts found</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AccountsSection;
