// components/secure-messages/NewSecureMessageModal.jsx
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useMessageStore } from '@/store/useMessageStore';
import { useEffect, useState } from 'react';
import GlobalInput from '../global/GlobalInput';
import GlobalSelect from '../global/GlobalSelect';
import { Button } from '../ui/button';

const NewSecureMessageModal = ({ isOpen, onClose, onSubmit, sending }) => {
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({});

  // Get subjects from store
  const { subjects, fetchSubjects } = useMessageStore();

  // Fetch subjects when modal opens
  useEffect(() => {
    if (isOpen && subjects.length === 0) {
      fetchSubjects();
    }
  }, [isOpen]);

  // Convert subjects to dropdown options
  const subjectOptions =
    subjects.length > 0
      ? subjects.map((sub) => ({ value: sub.value, label: sub.label }))
      : [
          { value: 'Account Inquiry', label: 'Account Inquiry' },
          { value: 'Transfer Help', label: 'Transfer Help' },
          { value: 'Technical Support', label: 'Technical Support' },
          { value: 'General Feedback', label: 'General Feedback' },
        ];

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.subject) {
      newErrors.subject = 'Subject is required.';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Message content is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      await onSubmit(formData);
      // Reset form on successful submit
      setFormData({ subject: '', message: '' });
      setErrors({});
    }
  };

  // Reset form when modal closes
  const handleClose = () => {
    setFormData({ subject: '', message: '' });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-md w-full p-0 gap-0">
        <DialogHeader className="relative p-6 border-b border-gray-200">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            New Secure Message
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-5">
            {/* Subject Select */}
            <GlobalSelect
              label="Subject"
              required
              placeholder="Select subject"
              value={formData.subject}
              onChange={(value) => handleChange('subject', value)}
              options={subjectOptions}
              error={errors.subject}
              disabled={sending}
            />

            {/* Message Textarea */}
            <GlobalInput
              label="Message"
              required
              placeholder="Type your message here..."
              isTextarea
              rows={6}
              value={formData.message}
              onChange={(e) => handleChange('message', e.target.value)}
              error={errors.message}
              disabled={sending}
            />
          </div>

          <DialogFooter className="p-6 border-t border-gray-200">
            <div className="flex w-full gap-4">
              <Button
                variant="outline"
                onClick={handleClose}
                size="default"
                className="w-full text-sm text-blue-600 border-blue-600 hover:bg-blue-50"
                type="button"
                disabled={sending}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={sending}
                size="default"
                className="w-full text-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {sending ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Sending...
                  </span>
                ) : (
                  'Send'
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewSecureMessageModal;
