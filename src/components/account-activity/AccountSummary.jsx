import { motion } from 'framer-motion';
import { Link } from 'react-router';

const AccountSummary = ({ data }) => {
  if (!data) return <div className="py-8 text-center text-gray-500">No summary available.</div>;

  // Define which fields to show and in what order
  const fields = [
    { label: 'Current Balance', value: data['Current Balance'], isCurrency: true },
    { label: 'Available Balance', value: data['Available Balance'], isCurrency: true },
    { label: 'Account Number', value: data['Account Number'] },
    { label: 'Account Type', value: data['Account Type'] },
    { label: 'Currency', value: data['Currency'] },
    { label: 'Status', value: data['Status'] },
    { label: 'Opening Date', value: data['Opening Date'] },
  ];

  const accountNumber = data['Account Number'];

  return (
    <div className="overflow-hidden bg-white border border-gray-200 rounded-lg">
      {fields.map((item, index) =>
        item.value ? (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center justify-between p-4 transition-colors border-b border-gray-100 last:border-0 hover:bg-gray-50"
          >
            <span className="text-sm font-medium text-gray-500">{item.label}</span>
            <span className="text-base font-semibold text-gray-900">
              {item.isCurrency && data['Currency'] ? `${data['Currency']} ` : ''}
              {item.value}
            </span>
          </motion.div>
        ) : null,
      )}

      {/* Create/Edit Nickname Link */}
      <div className="p-4 bg-gray-50/50">
        {accountNumber ? (
          <Link
            to={`/dashboard/change-account/${accountNumber}`}
            className="text-sm font-medium underline text-primary hover:text-primary decoration-primary/30 underline-offset-4"
          >
            Create/Edit nickname
          </Link>
        ) : (
          <span className="text-sm text-gray-400 cursor-not-allowed">Create/Edit nickname</span>
        )}
      </div>
    </div>
  );
};

export default AccountSummary;
