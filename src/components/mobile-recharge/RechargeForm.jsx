import { useAccountsStore } from '@/store/accountsStore'; // Assuming this exists
import { useRechargeStore } from '@/store/rechargeStore';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import GlobalInput from '../global/GlobalInput';
import GlobalSelect from '../global/GlobalSelect';
import { Button } from '../ui/button';

// --- Sub-Component: Confirmation Modal ---
const ConfirmModal = ({ isOpen, onClose, onConfirm, data, loading, formData }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md overflow-hidden bg-white rounded-lg shadow-xl"
      >
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold text-center">Confirm Recharge</h3>
        </div>
        <div className="space-y-4 text-sm">
          <div className="flex justify-between pb-2 border-b">
            <span className="text-gray-500">From Account</span>
            <span className="font-medium text-right">{formData.fromAccount}</span>
          </div>
          <div className="flex justify-between pb-2 border-b">
            <span className="text-gray-500">Top-up Number</span>
            <span className="font-medium">{formData.topUpNumber}</span>
          </div>
          <div className="flex justify-between pb-2 border-b">
            <span className="text-gray-500">Amount</span>
            <span className="font-medium">
              {formData.currency} {formData.rechargeAmount}
            </span>
          </div>

          {/* Fees from API */}
          <div className="p-3 space-y-2 rounded-md bg-gray-50">
            <div className="flex justify-between">
              <span className="text-gray-500">Commission</span>
              <span>{data?.commission}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Stamp</span>
              <span>{data?.stamp}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Tax</span>
              <span>{data?.tax}</span>
            </div>
            <div className="flex justify-between pt-2 font-bold border-t">
              <span>Total Fees</span>
              <span>USD {data?.totalFee}</span>
            </div>
          </div>

          <div className="p-3 text-xs text-blue-800 rounded bg-blue-50">
            Please review details carefully. By confirming, you authorize the transaction.
          </div>
        </div>
        <div className="flex gap-3 p-4 bg-gray-50">
          <Button variant="outline" onClick={onClose} className="w-full">
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            loading={loading}
            className="w-full text-white bg-primary hover:bg-primary"
          >
            Confirm
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

// --- Sub-Component: Success Modal ---
const SuccessModal = ({ isOpen, onClose, receipt }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md overflow-hidden bg-white rounded-lg shadow-xl"
      >
        <div className="p-6 text-center border-b">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full">
            <span className="text-2xl text-green-600">✓</span>
          </div>
          <h3 className="text-xl font-bold text-gray-800">Recharge Successful</h3>
        </div>
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="space-y-3 text-sm">
            {receipt &&
              receipt.map((row, idx) => (
                <div
                  key={idx}
                  className="flex justify-between py-1 border-b border-gray-100 last:border-0"
                >
                  <span className="font-medium text-gray-500">{row.label}</span>
                  <span className="text-gray-800 font-semibold text-right max-w-[60%]">
                    {row.value}
                  </span>
                </div>
              ))}
          </div>
        </div>
        <div className="p-4 bg-gray-50">
          <Button onClick={onClose} className="w-full text-white bg-primary hover:bg-primary">
            Done
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

// --- Main Component ---
const RechargeForm = () => {
  const [formData, setFormData] = useState({
    fromAccount: '',
    topUpNumber: '',
    currency: '',
    rechargeAmount: '',
    comment: '',
  });
  const [errors, setErrors] = useState({});

  // Stores
  const accounts = useAccountsStore((s) => s.accounts || []); // Array of objects
  const {
    topUpList,
    fetchTopUpList,
    initiateRecharge,
    confirmRecharge,
    loading,
    submitting,
    feeDetails,
    receipt,
    showConfirmModal,
    showSuccessModal,
    closeModals,
  } = useRechargeStore();

  // Effects
  useEffect(() => {
    fetchTopUpList(); // Load numbers on mount
  }, []);

  // Derived State: Available Balance
  const selectedAccount = accounts.find((acc) => acc.id === formData.fromAccount);

  const accountOptions = accounts.map((acc) => ({
    value: acc.id,
    label: acc.description, // Using description from your object structure
  }));

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handlePlanSelect = (amount) => {
    handleChange('rechargeAmount', String(amount));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fromAccount) newErrors.fromAccount = 'Please select the account.';
    if (!formData.topUpNumber) newErrors.topUpNumber = 'Please select number.';
    if (!formData.currency) newErrors.currency = 'Required.';
    if (!formData.rechargeAmount || Number(formData.rechargeAmount) <= 0)
      newErrors.rechargeAmount = 'Enter valid amount.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      await initiateRecharge(formData); // Triggers Modal if success
    }
  };

  const handleFinalConfirm = async () => {
    await confirmRecharge(formData); // Triggers Success Modal if success
  };

  const handleSuccessClose = () => {
    closeModals();
    // Optional: Reset form here
    setFormData({
      fromAccount: '',
      topUpNumber: '',
      currency: 'USD',
      rechargeAmount: '',
      comment: '',
    });
  };

  const currencyOptions = [
    { value: 'USD', label: 'USD' },
    { value: 'EUR', label: 'EUR' },
  ];
  const popularPlans = [20, 30, 50, 100];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 mb-8 bg-white border border-gray-200 rounded-lg shadow-sm"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* From Account */}
            <div className="relative">
              <GlobalSelect
                label="From Account"
                required
                placeholder="Select Account"
                value={formData.fromAccount}
                onChange={(value) => handleChange('fromAccount', value)}
                options={accountOptions}
                error={errors.fromAccount}
              />
              {/* Dynamic Available Balance */}
              {selectedAccount && (
                <div className="p-3 mt-2 text-sm font-medium text-blue-800 border-l-4 border-primary rounded-md bg-blue-50 animate-in fade-in slide-in-from-top-1">
                  Available Balance: {selectedAccount.currency}{' '}
                  {selectedAccount.balance?.toLocaleString()}
                </div>
              )}
            </div>

            {/* Top-up Number (Dynamic from API) */}
            <GlobalSelect
              label="Top-up Number"
              required
              placeholder="Select Number"
              value={formData.topUpNumber}
              onChange={(value) => handleChange('topUpNumber', value)}
              options={topUpList} // From Store
              error={errors.topUpNumber}
            />

            {/* Currency */}
            <GlobalSelect
              label="Currency"
              required
              placeholder="Select"
              value={formData.currency}
              onChange={(value) => handleChange('currency', value)}
              options={currencyOptions}
              error={errors.currency}
            />

            {/* Recharge Amount */}
            <GlobalInput
              label="Recharge Amount"
              type="number"
              step="0.01"
              required
              placeholder="0.00"
              value={formData.rechargeAmount}
              onChange={(e) => handleChange('rechargeAmount', e.target.value)}
              error={errors.rechargeAmount}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <GlobalInput
              label="Comment"
              placeholder="Enter comment"
              isTextarea
              rows={4}
              value={formData.comment}
              onChange={(e) => handleChange('comment', e.target.value)}
            />

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Popular Recharge Plans
              </label>
              <div className="flex flex-wrap gap-2">
                {popularPlans.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => handlePlanSelect(amount)}
                    className={`px-4 py-2 text-sm font-medium rounded-full border transition-colors ${
                      Number(formData.rechargeAmount) === amount
                        ? 'bg-primary text-white border-primary'
                        : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {amount}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4 pt-4 max-w-[400px] mx-auto">
            <Button
              variant="outline"
              type="button"
              onClick={() => window.location.reload()}
              className="w-full text-blue-600 border-blue-600"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              className="w-full text-white bg-primary hover:bg-primary"
            >
              Submit
            </Button>
          </div>
        </form>
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {showConfirmModal && (
          <ConfirmModal
            isOpen={showConfirmModal}
            onClose={closeModals}
            onConfirm={handleFinalConfirm}
            loading={submitting}
            data={feeDetails}
            formData={formData}
          />
        )}
        {showSuccessModal && (
          <SuccessModal isOpen={showSuccessModal} onClose={handleSuccessClose} receipt={receipt} />
        )}
      </AnimatePresence>
    </>
  );
};

export default RechargeForm;
