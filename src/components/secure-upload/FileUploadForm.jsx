import { motion } from 'framer-motion';
import { FileImage, FileSpreadsheet, FileText, Upload, X } from 'lucide-react';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import GlobalInput from '../global/GlobalInput';
import GlobalSelect from '../global/GlobalSelect';
import { Button } from '../ui/button';

// Accepted file types
const acceptedFileTypes = ['xlsx', 'csv', 'pdf', 'jpeg', 'png', 'jpg'];
const acceptedMimeTypes = {
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'text/csv': ['.csv'],
  'application/pdf': ['.pdf'],
  'image/jpeg': ['.jpeg', '.jpg'],
  'image/png': ['.png'],
};

// Dropzone text
const DROPZONE_TEXT = {
  dragActive: 'Drop the file here...',
  default: 'Drag and drop or click to browse file',
  acceptedTypes: `Accepted File Types: ${acceptedFileTypes
    .join(', ')
    .toUpperCase()}. Max Size: 5MB.`,
};

// Utility function to get file icon based on MIME type
const getFileIcon = (mimeType) => {
  if (mimeType.startsWith('image/')) return <FileImage className="w-6 h-6 text-primary" />;
  if (mimeType.includes('pdf')) return <FileText className="w-6 h-6 text-red-600" />;
  if (mimeType.includes('sheet') || mimeType.includes('csv'))
    return <FileSpreadsheet className="w-6 h-6 text-green-600" />;
  return <FileText className="w-6 h-6 text-gray-500" />;
};

// File Preview Component (Single File)
const FilePreview = ({ file, onDelete }) => {
  const isImage = file.type.startsWith('image/');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="relative p-4 transition-shadow bg-white border border-gray-200 rounded-lg shadow-sm"
    >
      <div className="flex items-center space-x-4">
        {/* Preview/Icon */}
        <div className="flex items-center justify-center w-16 h-16 p-2 rounded-md shrink-0 bg-gray-50">
          {isImage && file.preview ? (
            <img
              src={file.preview}
              alt={file.name}
              className="object-contain max-w-full max-h-full rounded"
              onLoad={() => URL.revokeObjectURL(file.preview)}
            />
          ) : (
            getFileIcon(file.type)
          )}
        </div>

        {/* Name and Size */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-800 truncate" title={file.name}>
            {file.name}
          </p>
          <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
        </div>

        {/* Delete Button */}
        <button
          type="button"
          onClick={() => onDelete()}
          className="p-2 text-red-600 transition-colors bg-red-100 rounded-full shrink-0 hover:bg-red-200"
          title="Remove file"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

// Main Form Component with forwardRef
const FileUploadForm = forwardRef(({ onSubmit, isSubmitting = false, purposes = [] }, ref) => {
  const [formData, setFormData] = useState({
    purpose: '',
    description: '',
    file: null,
    loginId: 'tester1',
  });

  const [errors, setErrors] = useState({});

  // Purpose options - use API data
  const purposeOptions = useMemo(() => {
    if (purposes.length > 0) {
      return purposes;
    }
    // Fallback options
    return [
      { value: '1', label: 'Account Opening' },
      { value: '2', label: 'Collections Departments' },
      { value: '3', label: 'Customer Support' },
      { value: '4', label: 'Insurance Department' },
      { value: '5', label: 'Loans' },
      { value: '6', label: 'Others' },
      { value: '7', label: 'Products' },
    ];
  }, [purposes]);

  // Dropzone Logic - Single File Only
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const fileWithPreview = Object.assign(file, {
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
      });

      setFormData((prev) => ({ ...prev, file: fileWithPreview }));
      setErrors((prev) => ({ ...prev, file: '' }));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    maxSize: 5242880, // 5MB limit
    accept: acceptedMimeTypes,
    multiple: false,
  });

  // Clean up preview URL
  useEffect(() => {
    return () => {
      if (formData.file?.preview) {
        URL.revokeObjectURL(formData.file.preview);
      }
    };
  }, [formData.file]);

  // Form Logic
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleFileDelete = () => {
    if (formData.file?.preview) {
      URL.revokeObjectURL(formData.file.preview);
    }
    setFormData((prev) => ({ ...prev, file: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.purpose) newErrors.purpose = 'Purpose is required.';
    if (!formData.description.trim()) newErrors.description = 'Description is required.';
    if (!formData.file) {
      newErrors.file = 'Please select a file to upload.';
    }

    if (fileRejections.length > 0) {
      newErrors.file = 'File was rejected. Check size (max 5MB) or type.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate() && onSubmit) {
      // Convert single file to array for API compatibility
      const submitData = {
        ...formData,
        files: [formData.file],
      };
      onSubmit(submitData);
    }
  };

  const handleReset = () => {
    // Clean up preview URL before reset
    if (formData.file?.preview) {
      URL.revokeObjectURL(formData.file.preview);
    }
    setFormData({
      purpose: '',
      description: '',
      file: null,
      loginId: formData.loginId,
    });
    setErrors({});
  };

  // Expose reset method to parent component
  useImperativeHandle(ref, () => ({
    resetForm: handleReset,
  }));

  const hasError = useMemo(
    () => errors.file || fileRejections.length > 0,
    [errors.file, fileRejections.length],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="max-w-xl p-6 mx-auto mb-8 bg-white border border-gray-200 rounded-lg shadow-sm"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Purpose */}
        <GlobalSelect
          label="Purpose"
          required
          placeholder="Select"
          value={formData.purpose}
          onChange={(value) => handleChange('purpose', value)}
          options={purposeOptions}
          error={errors.purpose}
          disabled={isSubmitting}
        />

        {/* Description */}
        <GlobalInput
          label="Description"
          required
          placeholder="Enter description"
          isTextarea
          rows={3}
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          error={errors.description}
          disabled={isSubmitting}
        />

        {/* Dropzone Area */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Secure File Upload *</label>

          {/* File Input/Drop Area - Show only if no file selected */}
          {!formData.file && (
            <div
              {...getRootProps()}
              className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg transition-colors min-h-40 cursor-pointer
                      ${
                        hasError
                          ? 'border-red-500 bg-red-50'
                          : isDragActive
                          ? 'border-primary bg-primary/5'
                          : 'border-primary/40 hover:border-primary hover:bg-primary/5'
                      }
                      ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <input {...getInputProps()} id="file-upload-input" disabled={isSubmitting} />
              <Upload className="w-8 h-8 mb-2 text-primary" />
              <span className="font-medium text-center text-gray-800">
                {isDragActive ? DROPZONE_TEXT.dragActive : DROPZONE_TEXT.default}
              </span>
            </div>
          )}

          {(errors.file || fileRejections.length > 0) && (
            <p className="mt-1 text-sm text-red-500">
              {errors.file || fileRejections[0]?.errors[0]?.message || 'File upload error.'}
            </p>
          )}

          <p className="pt-2 text-xs text-gray-500">{DROPZONE_TEXT.acceptedTypes}</p>
        </div>

        {/* File Preview - Show if file selected */}
        {formData.file && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-4 border-t border-gray-200"
          >
            <h4 className="mb-3 text-sm font-semibold text-gray-700">Selected File:</h4>
            <FilePreview file={formData.file} onDelete={handleFileDelete} />
          </motion.div>
        )}

        {/* Buttons (Cancel/Submit) */}
        <div className="flex justify-end gap-4 pt-4">
          <Button
            variant="outline"
            onClick={handleReset}
            size="default"
            className="w-full text-sm text-blue-600 border-blue-600 sm:w-auto hover:bg-blue-50"
            type="button"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={isSubmitting}
            size="default"
            className="font-medium text-white bg-primary hover:bg-primary"
          >
            {isSubmitting ? (
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
                Uploading...
              </span>
            ) : (
              'Submit'
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
});

// Set display name for debugging
FileUploadForm.displayName = 'FileUploadForm';

export default FileUploadForm;
