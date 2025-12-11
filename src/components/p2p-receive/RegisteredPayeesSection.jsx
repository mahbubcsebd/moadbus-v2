import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '../ui/button';

const RegisteredPayeesSection = ({
  data,
  selectedPayees,
  onToggleSelect,
  onRegister,
  onDelete,
  onCancel,
}) => {
  const isPayeeSelected = (id) => selectedPayees.includes(id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="p-6 mx-auto bg-white border border-gray-200 rounded-lg shadow-sm"
    >
      <Link to="/dashboard/register-recieved-money" className="flex justify-end mb-6">
        <Button
          variant="outline"
          onClick={onRegister}
          size="default"
          className="text-sm text-primary border-primary hover:bg-primary hover:text-white"
        >
          Register to receive money
        </Button>
      </Link>

      <div className="hidden md:grid grid-cols-[1.5fr_1.5fr_1fr_0.2fr] text-xs font-semibold text-gray-600 uppercase border-b pb-2 mb-2 px-1">
        <span>Nickname</span>
        <span>Email/Phone Number</span>
        <span>Receive Account</span>
        <span></span>
      </div>

      <div className="space-y-2">
        {data.map((payee, index) => (
          <motion.div
            key={payee.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.03 }}
            className={`grid grid-cols-[1fr_0.2fr] md:grid-cols-[1.5fr_1.5fr_1fr_0.2fr] items-center py-2 px-1 text-sm border-b md:border-b-0 last:border-b-0 transition-colors cursor-pointer
                            ${isPayeeSelected(payee.id) ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
            onClick={() => onToggleSelect(payee.id)}
          >
            <div className="col-span-1 md:col-span-1">
              <span className="font-semibold text-gray-900">{payee.nickname}</span>
              {/* Mobile Details Group */}
              <div className="md:hidden text-xs text-gray-600 mt-1 space-y-0.5">
                <p>
                  <span className="font-medium">Contact:</span> {payee.emailPhone}
                </p>
                <p>
                  <span className="font-medium">Account:</span> {payee.receiveAccount}
                </p>
              </div>
            </div>

            <span className="hidden text-gray-700 truncate md:block">{payee.emailPhone}</span>

            <span className="hidden text-gray-700 md:block">{payee.receiveAccount}</span>

            <div className="flex justify-end pr-2">
              {isPayeeSelected(payee.id) ? (
                <Check className="w-5 h-5 text-blue-600 bg-blue-100 rounded-full" />
              ) : (
                <div className="w-5 h-5 bg-white border border-gray-400 rounded-full"></div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center max-w-[400px] mx-auto gap-4 pt-8">
        <Button
          variant="outline"
          onClick={onCancel}
          size="default"
          className="w-full text-sm text-blue-600 border-blue-600 hover:bg-blue-50"
          type="button"
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={onDelete}
          size="default"
          disabled={selectedPayees.length === 0}
          className={`w-full text-sm ${
            selectedPayees.length === 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-red-500 hover:bg-red-600 text-white'
          }`}
          type="button"
        >
          Delete ({selectedPayees.length})
        </Button>
      </div>
    </motion.div>
  );
};

export default RegisteredPayeesSection;
