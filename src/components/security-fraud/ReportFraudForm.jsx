import { useFraudStore } from '@/store/fraudStore';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import GlobalInput from '../global/GlobalInput';
import GlobalSelect from '../global/GlobalSelect';
import { Button } from '../ui/button';

const ReportFraudForm = ({ onSubmit, isSubmitting = false }) => {
  const { subjects, fetchSubjects, loading } = useFraudStore();

  const [formData, setFormData] = useState({
    reason: '',
    message: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.reason) newErrors.reason = 'Please select a reason for reporting.';
    if (!formData.message.trim()) newErrors.message = 'Please enter a detailed message.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate() && onSubmit) {
      // Find Label for the selected ID to show in Preview
      const selectedSubject = subjects.find((s) => s.value === formData.reason);

      onSubmit({
        ...formData,
        reasonLabel: selectedSubject ? selectedSubject.label : formData.reason, // Pass Label
      });
    }
  };

  // Optional: Reset logic if needed by parent
  // ...

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="max-w-xl p-6 mx-auto mb-8 bg-white border border-gray-200 rounded-lg shadow-sm"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <GlobalSelect
          label="Reason"
          required
          placeholder={loading ? 'Loading...' : 'Select'}
          value={formData.reason}
          onChange={(value) => handleChange('reason', value)}
          options={subjects}
          error={errors.reason}
        />

        <GlobalInput
          label="Message"
          required
          placeholder="Enter message"
          isTextarea
          rows={6}
          value={formData.message}
          onChange={(e) => handleChange('message', e.target.value)}
          error={errors.message}
        />

        <div className="flex justify-start max-w-xs gap-4 pt-4 mx-auto">
          <Button
            variant="outline"
            type="button"
            onClick={() => window.history.back()}
            className="w-full text-sm text-blue-600 border-blue-600"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            loading={isSubmitting}
            className="w-full text-sm text-white bg-primary hover:bg-primary"
          >
            Submit
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default ReportFraudForm;
