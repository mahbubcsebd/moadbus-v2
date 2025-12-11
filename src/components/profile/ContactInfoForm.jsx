import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import GlobalInput from '../global/GlobalInput';
import { Button } from '../ui/button';
// import Button from '../ui/Button';

const ContactInfoForm = ({ initialData, onSubmit, isSubmitting = false }) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Ensure initial data loads correctly
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First Name is required.';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last Name is required.';
    if (!formData.address1.trim()) newErrors.address1 = 'Address is required.';
    if (!formData.city.trim()) newErrors.city = 'City is required.';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'Zip Code is required.';
    if (!formData.mobileNumber.trim()) newErrors.mobileNumber = 'Mobile Number is required.';
    else if (!/^\d+$/.test(formData.mobileNumber))
      newErrors.mobileNumber = 'Invalid mobile number format.';

    if (!formData.emailAddress.trim()) newErrors.emailAddress = 'Email Address is required.';
    else if (!/^\S+@\S+\.\S+$/.test(formData.emailAddress))
      newErrors.emailAddress = 'Invalid email address format.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate() && onSubmit) {
      onSubmit(formData);
    }
  };

  const handleCancel = () => {
    setFormData(initialData);
    setErrors({});
    console.log('Form cancelled/reset.');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="p-6 mx-auto mb-8 bg-white border border-gray-200 rounded-lg shadow-sm"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Row 1: First Name & Last Name */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <GlobalInput
            label="First Name"
            name="firstName"
            placeholder="Marvin"
            value={formData.firstName}
            onChange={handleChange}
            error={errors.firstName}
            isReadOnly={true} // Assuming name might be read-only
          />
          <GlobalInput
            label="Last Name"
            name="lastName"
            placeholder="Higgins"
            value={formData.lastName}
            onChange={handleChange}
            error={errors.lastName}
            isReadOnly={true} // Assuming name might be read-only
          />
        </div>

        {/* Row 2: Address 1 & Address 2 */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <GlobalInput
            label="Address 1"
            name="address1"
            placeholder="44 Main St"
            value={formData.address1}
            onChange={handleChange}
            error={errors.address1}
          />
          <GlobalInput
            label="Address 2"
            name="address2"
            placeholder="Enter address 2"
            value={formData.address2}
            onChange={handleChange}
            error={errors.address2}
          />
        </div>

        {/* Row 3: City & Mobile Number */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <GlobalInput
            label="City"
            name="city"
            placeholder="Enter city"
            value={formData.city}
            onChange={handleChange}
            error={errors.city}
          />
          <GlobalInput
            label="Mobile Number"
            name="mobileNumber"
            type="tel"
            placeholder="2138751267"
            value={formData.mobileNumber}
            onChange={handleChange}
            error={errors.mobileNumber}
          />
        </div>

        {/* Row 4: Zip Code & Email Address */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <GlobalInput
            label="Zip Code"
            name="zipCode"
            placeholder="35332"
            value={formData.zipCode}
            onChange={handleChange}
            error={errors.zipCode}
          />
          <GlobalInput
            label="Email Address"
            name="emailAddress"
            type="email"
            placeholder="tester2@moadbusglobal.com"
            value={formData.emailAddress}
            onChange={handleChange}
            error={errors.emailAddress}
          />
        </div>

        {/* Buttons (Cancel/Submit) */}
        <div className="flex justify-center gap-4 pt-4 max-w-[400px] mx-auto">
          <Button
            variant="outline"
            onClick={handleCancel}
            size="default"
            className="w-full text-sm text-blue-600 border-blue-600 hover:bg-blue-50"
            type="button"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            loading={isSubmitting}
            size="default"
            className="w-full text-sm text-white bg-primary hover:bg-primary"
          >
            Submit
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default ContactInfoForm;
