import { makeAppointmentApi } from '@/api/endpoints';
import AppointmentSuccessModal from '@/components/appointments/AppointmentSuccessModal';
import StepContactInfo from '@/components/appointments/StepContactInfo';
import StepDayAndTime from '@/components/appointments/StepDayAndTime';
import StepDiscussionTopic from '@/components/appointments/StepDiscussionTopic';
import StepIndicator from '@/components/appointments/StepIndicator';
import StepLocation from '@/components/appointments/StepLocation';
import HeaderTop from '@/components/global/HeaderTop';
import { Button } from '@/components/ui/button';
import { parseReceipt } from '@/utils/appointmentHelpers';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useState } from 'react';

export default function AppointmentsPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showReviewModal, setShowReviewModal] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState({ msg: '', receipt: [] });

  // Form Data State
  const [appointmentData, setAppointmentData] = useState({
    branch: null,
    serviceId: '',
    serviceName: '',
    reason: '',
    date: '',
    time: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNo: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const steps = [
    { id: 1, name: 'Location' },
    { id: 2, name: 'Discussion Topic' },
    { id: 3, name: 'Day and Time' },
    { id: 4, name: 'Contact Information' },
  ];

  const handleLocationNext = (data) => {
    setAppointmentData((prev) => ({ ...prev, branch: data.location }));
    setCurrentStep(2);
  };
  const handleTopicNext = (data) => {
    setAppointmentData((prev) => ({ ...prev, ...data }));
    setCurrentStep(3);
  };
  const handleTimeNext = (data) => {
    setAppointmentData((prev) => ({
      ...prev,
      date: data.appointmentDate,
      time: data.appointmentTime,
    }));
    setCurrentStep(4);
  };
  const handleContactNext = (data) => {
    setAppointmentData((prev) => ({ ...prev, ...data }));
    setShowReviewModal(true);
  };
  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...appointmentData,
        branchId: appointmentData.branch?.id,
      };

      const res = await makeAppointmentApi(payload);
      const rs = res?.rs || res;

      if (rs?.status === 'success' || rs?.statusCode === 1) {
        // Parse Receipt Data
        const parsedReceipt = parseReceipt(rs.rcpt);

        setSuccessData({
          msg: rs.msg || 'Your appointment request has been received.',
          receipt: parsedReceipt,
        });

        // Close Review Modal & Open Success Modal
        setShowReviewModal(false);
        setShowSuccessModal(true);
      } else {
        alert(rs.msg || 'Failed to schedule appointment');
      }
    } catch (error) {
      console.error('Submission error', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    // Redirect to Dashboard or Reset
    window.location.href = '/dashboard';
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepLocation onNext={handleLocationNext} />;
      case 2:
        return (
          <StepDiscussionTopic
            onNext={handleTopicNext}
            onBack={handleBack}
            branchId={appointmentData.branch?.id}
          />
        );
      case 3:
        return (
          <StepDayAndTime
            onNext={handleTimeNext}
            onBack={handleBack}
            selectedLocation={appointmentData.branch}
          />
        );
      case 4:
        return <StepContactInfo onNext={handleContactNext} onBack={handleBack} />;
      default:
        return null;
    }
  };

  return (
    <div>
      <HeaderTop
        title="Schedule an Appointment"
        text="Meet with our banking specialists for personalized assistance"
        link="/dashboard"
        linkText="Back to Dashboard"
      />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <StepIndicator steps={steps} currentStep={currentStep} />
        {renderStep()}
      </motion.div>

      {/* REVIEW MODAL (Before Submit) */}
      <AnimatePresence>
        {showReviewModal && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900">Review Appointment</h3>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 space-y-3">
                <ReviewRow label="Where" value={`${appointmentData.branch?.name}`} />
                <ReviewRow label="Service" value={appointmentData.serviceName} />
                <ReviewRow label="Date" value={appointmentData.date} />
                <ReviewRow label="Time" value={appointmentData.time} />
                <ReviewRow label="Reason" value={appointmentData.reason} />
              </div>

              <div className="p-6 bg-gray-50 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowReviewModal(false)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleFinalSubmit}
                  loading={isSubmitting}
                  className="bg-primary hover:bg-primary text-white"
                >
                  Confirm & Submit
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SUCCESS MODAL (After Submit) */}
      <AppointmentSuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessClose}
        message={successData.msg}
        receiptData={successData.receipt}
      />
    </div>
  );
}

const ReviewRow = ({ label, value }) => (
  <div className="flex justify-between py-2 border-b border-gray-50 last:border-0">
    <span className="font-medium text-gray-600">{label}</span>
    <span className="text-gray-900 font-medium text-right">{value}</span>
  </div>
);
