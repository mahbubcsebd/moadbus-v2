// pages/SecureFileUpload.jsx
import { getFileUploadPurposes, uploadSecureFile } from '@/api/endpoints';
import Alert from '@/components/global/Alert';
import HeaderTop from '@/components/global/HeaderTop';
import FileUploadForm from '@/components/secure-upload/FileUploadForm';
import FileUploadSuccessModal from '@/components/secure-upload/FileUploadSuccessModal';
import { parseFileUploadPurposes, parseFileUploadResponse } from '@/utils/fileUploadHelpers';
import { AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export default function SecureFileUpload() {
  const [purposes, setPurposes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [uploadData, setUploadData] = useState(null);
  const formRef = useRef(null); // ✅ Ref to access form reset

  // Fetch purposes on mount
  useEffect(() => {
    fetchPurposes();
  }, []);

  const fetchPurposes = async () => {
    try {
      const response = await getFileUploadPurposes();
      const parsedPurposes = parseFileUploadPurposes(response);

      if (parsedPurposes.length > 0) {
        setPurposes(parsedPurposes);
      }
    } catch (error) {
      console.error('Fetch purposes error:', error);
    }
  };

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setNotification(null);

    try {
      console.log('Uploading file...', formData);

      const response = await uploadSecureFile(formData);
      console.log('Upload Response:', response);

      const result = parseFileUploadResponse(response);
      console.log('Parsed Result:', result);

      if (result.success) {
        // Show success modal with data
        setUploadData(result.data);
        setSuccessModalOpen(true);

        // Show success notification
        setNotification({
          type: 'success',
          message: result.message || 'File uploaded successfully!',
        });

        // ✅ Reset form after successful upload
        if (formRef.current) {
          formRef.current.resetForm();
        }
      } else {
        // Show error notification
        setNotification({
          type: 'error',
          message: result.message || 'Failed to upload file',
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      setNotification({
        type: 'error',
        message: error.message || 'Failed to upload file',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessModalClose = () => {
    setSuccessModalOpen(false);
    setUploadData(null);
  };

  return (
    <div>
      <HeaderTop
        title="Secure File Upload"
        text="Securely upload documents and files to the bank"
        link="/dashboard"
        linkText="Back to Dashboard"
      />

      {/* Alert Notification */}
      <AnimatePresence>
        {notification && (
          <Alert
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification(null)}
            autoClose={5000}
          />
        )}
      </AnimatePresence>

      {/* File Upload Form */}
      <FileUploadForm
        ref={formRef} // ✅ Pass ref to form
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        purposes={purposes}
      />

      {/* Success Modal */}
      <FileUploadSuccessModal
        isOpen={successModalOpen}
        onClose={handleSuccessModalClose}
        data={uploadData}
      />
    </div>
  );
}
