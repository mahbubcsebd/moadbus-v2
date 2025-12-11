import { motion } from 'framer-motion';
import { useState } from 'react';
import GlobalInput from '../global/GlobalInput';
import GlobalSelect from '../global/GlobalSelect';
import { Button } from '../ui/button';

const carrierOptions = [
  { value: 'UTS', label: 'UTS' },
  { value: 'Digicel', label: 'Digicel' },
  { value: 'Chippie', label: 'Chippie' },
];

const NumberManagementForm = ({ onSubmit, isSubmitting = false }) => {
  const [formData, setFormData] = useState({
    nickname: '',
    mobileCarrier: '',
    mobileNumber: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nickname.trim()) newErrors.nickname = 'Nickname is required.';
    if (!formData.mobileCarrier) newErrors.mobileCarrier = 'Mobile Carrier is required.';
    if (!formData.mobileNumber.trim() || isNaN(formData.mobileNumber.trim()))
      newErrors.mobileNumber = 'Valid Mobile Number is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate() && onSubmit) {
      onSubmit(formData).then((success) => {
        if (success) {
          setFormData({ nickname: '', mobileCarrier: '', mobileNumber: '' });
        }
      });
    }
  };

  const handleReset = () => {
    setFormData({ nickname: '', mobileCarrier: '', mobileNumber: '' });
    setErrors({});
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="p-6 mx-auto mb-8 bg-white border border-gray-200 rounded-lg shadow-sm"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <GlobalInput
            label="Nickname"
            required
            placeholder="Enter nickname"
            value={formData.nickname}
            onChange={(e) => handleChange('nickname', e.target.value)}
            error={errors.nickname}
          />
          <GlobalSelect
            label="Mobile Carrier"
            required
            placeholder="Select"
            value={formData.mobileCarrier}
            onChange={(value) => handleChange('mobileCarrier', value)}
            options={carrierOptions}
            error={errors.mobileCarrier}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <GlobalInput
            label="Mobile Number"
            required
            placeholder="Enter mobile number"
            type="tel"
            value={formData.mobileNumber}
            onChange={(e) => handleChange('mobileNumber', e.target.value)}
            error={errors.mobileNumber}
          />
        </div>

        <div className="flex justify-center gap-4 pt-4 max-w-[400px] mx-auto">
          <Button
            variant="outline"
            onClick={handleReset}
            type="button"
            className="w-full text-blue-600 border-blue-600"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            loading={isSubmitting}
            className="w-full text-white bg-primary hover:bg-primary"
          >
            Submit
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default NumberManagementForm;
