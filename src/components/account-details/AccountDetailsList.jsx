'use client';

import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

const AccountDetailsList = ({ account }) => {
  if (!account) return null;

  const details = [
    { label: 'Account Number', value: account.accountNumber },
    { label: 'Account Type', value: account.type },
    { label: 'Account Name', value: account.description },
    // {
    //   label: 'Status',
    //   value: account.status,
    //   isStatus: true,
    // },
    { label: 'Currency', value: account.currency },
    // { label: 'Branch', value: account.branch },
    // {
    //   label: 'Opened Date',
    //   value: new Date(account.openedDate).toLocaleDateString('en-US', {
    //     year: 'numeric',
    //     month: 'long',
    //     day: 'numeric',
    //   }),
    // },
    // { label: 'Interest Rate', value: account.interestRate },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-1"
    >
      {details.map((detail, index) => (
        <DetailRow key={detail.label} detail={detail} index={index} />
      ))}
    </motion.div>
  );
};

const DetailRow = ({ detail, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="flex items-center justify-between py-3.5 px-4 rounded-lg hover:bg-gray-50 transition-colors group"
    >
      <p className="text-sm text-gray-600 font-medium">{detail.label}</p>
      {detail.isStatus ? (
        <Badge
          variant={detail.value === 'Active' ? 'default' : 'secondary'}
          className={`${detail.value === 'Active'
              ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
              : 'bg-gray-100 text-gray-700'
            }`}
        >
          {detail.value}
        </Badge>
      ) : (
        <p className="text-sm font-semibold text-gray-900 group-hover:text-gray-950 transition-colors">
          {detail.value}
        </p>
      )}
    </motion.div>
  );
};

export default AccountDetailsList;