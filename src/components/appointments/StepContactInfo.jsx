import GlobalInput from '@/components/global/GlobalInput';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '../ui/button';

const StepContactInfo = ({ onNext, onBack, isSubmitting }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    phoneNo: '',
    email: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First Name is required.';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last Name is required.';
    if (!formData.address1.trim()) newErrors.address1 = 'Address 1 is required.';
    if (!formData.city.trim()) newErrors.city = 'City is required.';
    if (!formData.state.trim()) newErrors.state = 'State is required.';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'Zip Code is required.';
    if (!formData.phoneNo.trim()) newErrors.phoneNo = 'Phone Number is required.';
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Valid Email is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onNext(formData);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 p-4 pt-8"
    >
      <h3 className="text-lg font-semibold text-gray-800">Contact Details</h3>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <GlobalInput
            label="First Name"
            required
            name="firstName"
            placeholder="Enter first name"
            value={formData.firstName}
            onChange={handleChange}
            error={errors.firstName}
          />
          {/* Last Name */}
          <GlobalInput
            label="Last Name"
            required
            name="lastName"
            placeholder="Enter last name"
            value={formData.lastName}
            onChange={handleChange}
            error={errors.lastName}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Address 1 */}
          <GlobalInput
            label="Address 1"
            required
            name="address1"
            placeholder="Enter address 1"
            value={formData.address1}
            onChange={handleChange}
            error={errors.address1}
          />
          {/* Address 2 (Optional field) */}
          <GlobalInput
            label="Address 2"
            name="address2"
            placeholder="Enter address 2"
            value={formData.address2}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* City */}
          <GlobalInput
            label="City"
            required
            name="city"
            placeholder="Enter city"
            value={formData.city}
            onChange={handleChange}
            error={errors.city}
          />
          {/* State */}
          <GlobalInput
            label="State"
            required
            name="state"
            placeholder="Enter state"
            value={formData.state}
            onChange={handleChange}
            error={errors.state}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Zip Code */}
          <GlobalInput
            label="Zip Code"
            required
            name="zipCode"
            placeholder="Enter zip code"
            value={formData.zipCode}
            onChange={handleChange}
            error={errors.zipCode}
          />
          {/* Phone No */}
          <GlobalInput
            label="Phone No"
            required
            name="phoneNo"
            type="tel"
            placeholder="Enter phone no"
            value={formData.phoneNo}
            onChange={handleChange}
            error={errors.phoneNo}
          />
        </div>

        {/* Email (Full Width) */}
        <GlobalInput
          label="Email"
          required
          name="email"
          type="email"
          placeholder="Enter email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
        />

        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={onBack}
            size="default"
            className="text-sm border-gray-300 text-gray-700 hover:bg-gray-50"
            type="button"
            disabled={isSubmitting}
          >
            Back
          </Button>
          <Button
            variant="primary"
            type="submit"
            loading={isSubmitting}
            size="default"
            className="text-sm bg-primary hover:bg-primary text-white"
          >
            Submit
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default StepContactInfo;
