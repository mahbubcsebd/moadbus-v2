import GlobalInput from '@/components/global/GlobalInput';
import GlobalSelect from '@/components/global/GlobalSelect';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';

const StepDiscussionTopic = ({ onNext, onBack, branchId }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    serviceId: '',
    serviceName: '',
    reason: '',
  });
  const [errors, setErrors] = useState({});

  const services = [
    { value: '2', label: 'Accounts' },
    { value: '1', label: 'Loans' },
    { value: '4', label: 'Others' },
    { value: '3', label: 'Times' },
  ];

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleServiceChange = (value) => {
    const selected = services.find((s) => s.value === value);
    setFormData((prev) => ({
      ...prev,
      serviceId: value,
      serviceName: selected?.label || '',
    }));
    setErrors((prev) => ({ ...prev, serviceId: '' }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.serviceId) newErrors.serviceId = 'Service selection is required.';
    if (!formData.reason.trim()) newErrors.reason = 'Reason is required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onNext({
      serviceId: formData.serviceId,
      serviceName: formData.serviceName,
      reason: formData.reason,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 p-4 pt-8"
    >
      <h3 className="text-lg font-semibold text-gray-800">Discussion Topic</h3>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <form onSubmit={handleNext} className="max-w-md space-y-6">
          <GlobalSelect
            label="Service"
            required
            placeholder="Select"
            value={formData.serviceId}
            onChange={handleServiceChange}
            options={services}
            error={errors.serviceId}
          />

          <GlobalInput
            label="Reason"
            required
            placeholder="Enter reason"
            value={formData.reason}
            onChange={(e) => handleChange('reason', e.target.value)}
            error={errors.reason}
            isTextarea
            rows={3}
          />

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={onBack} type="button">
              Back
            </Button>
            <Button
              variant="primary"
              type="submit"
              className="bg-primary hover:bg-primary text-white"
            >
              Next
            </Button>
          </div>
        </form>
      )}
    </motion.div>
  );
};

export default StepDiscussionTopic;
