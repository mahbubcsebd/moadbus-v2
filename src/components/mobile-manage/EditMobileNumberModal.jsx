import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useEffect, useState } from 'react';
import GlobalInput from '../global/GlobalInput';
import GlobalSelect from '../global/GlobalSelect';
import { Button } from '../ui/button';

const carrierOptions = [
  { value: 'UTS', label: 'UTS' },
  { value: 'Digicel', label: 'Digicel' },
  { value: 'Chippie', label: 'Chippie' },
];

const EditMobileNumberModal = ({ isOpen, onClose, numberData, onEditSubmit }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (numberData) {
      setFormData({
        id: numberData.id,
        nickname: numberData.nickname || '',
        mobileCarrier: numberData.mobileCarrier || '',
        mobileNumber: numberData.mobileNumber || '',
      });
      setErrors({});
    }
  }, [numberData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nickname.trim()) newErrors.nickname = 'Required.';
    if (!formData.mobileCarrier) newErrors.mobileCarrier = 'Required.';
    if (!formData.mobileNumber.trim()) newErrors.mobileNumber = 'Required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true);
      await onEditSubmit(formData.id, formData);
      setLoading(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-md w-full p-0 gap-0">
        <DialogHeader className="p-6 border-b border-gray-200">
          <DialogTitle>Edit Mobile Number</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-5">
            <GlobalInput
              label="Nickname"
              required
              value={formData.nickname}
              onChange={(e) => handleChange('nickname', e.target.value)}
              error={errors.nickname}
            />
            <GlobalSelect
              label="Mobile Carrier"
              required
              value={formData.mobileCarrier}
              onChange={(value) => handleChange('mobileCarrier', value)}
              options={carrierOptions}
              error={errors.mobileCarrier}
            />
            <GlobalInput
              label="Mobile Number"
              required
              type="tel"
              value={formData.mobileNumber}
              onChange={(e) => handleChange('mobileNumber', e.target.value)}
              error={errors.mobileNumber}
            />
          </div>

          <DialogFooter className="p-6 border-t border-gray-200">
            <div className="flex w-full gap-4">
              <Button
                variant="outline"
                onClick={onClose}
                type="button"
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
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditMobileNumberModal;
