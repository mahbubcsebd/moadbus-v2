import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { forwardRef, useState } from 'react';

const GlobalInput = forwardRef(
  (
    {
      label,
      type = 'text',
      placeholder = '',
      required = false,
      error,
      helperText,
      className = '',
      labelClassName = '',
      inputClassName = '',
      containerClassName = '',
      isTextarea = false,
      rows = 4,
      disabled = false,
      // NEW PROP: To render Search Icon or Loader inside input
      rightElement = null,
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn('w-full', containerClassName)}
      >
        {/* Label */}
        {label && (
          <label className={cn('block text-sm font-medium text-gray-700 mb-2', labelClassName)}>
            {label}
            {required && <span className="ml-1 text-primary">*</span>}
          </label>
        )}

        {/* Input/Textarea Container */}
        <div className="relative">
          {isTextarea ? (
            <textarea
              ref={ref}
              rows={rows}
              disabled={disabled}
              placeholder={placeholder}
              className={cn(
                'w-full px-4 py-3 bg-gray-50 border rounded-lg text-gray-900 placeholder-gray-400 transition-all duration-300 outline-none resize-none h-[150px]',
                error
                  ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                  : 'border-gray-200 hover:border-gray-300 focus:border-primary focus:ring-2 focus:ring-orange-100',
                disabled && 'bg-gray-100 cursor-not-allowed opacity-60',
                inputClassName,
              )}
              {...props}
            />
          ) : (
            <input
              ref={ref}
              type={inputType}
              disabled={disabled}
              placeholder={placeholder}
              className={cn(
                'w-full px-4 py-3 bg-gray-50 border rounded-lg text-gray-900 placeholder-gray-400 transition-all duration-300 outline-none',
                error
                  ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                  : 'border-gray-200 hover:border-gray-300 focus:border-primary focus:ring-2 focus:ring-orange-100',
                (isPassword || rightElement) && 'pr-12', // Add padding for right element
                disabled && 'bg-gray-100 cursor-not-allowed opacity-60',
                inputClassName,
              )}
              {...props}
            />
          )}

          {/* RENDER THE SEARCH BUTTON / LOADER HERE */}
          {rightElement && (
            <div className="absolute flex items-center -translate-y-1/2 right-3 top-1/2">
              {rightElement}
            </div>
          )}

          {/* Password Eye Icon (Only if no custom right element) */}
          {isPassword && !disabled && !rightElement && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute text-gray-400 transition-colors -translate-y-1/2 right-3 top-1/2 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          )}
        </div>

        {/* Helper Text or Error */}
        {(helperText || error) && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn('mt-1 text-sm', error ? 'text-red-500' : 'text-gray-500')}
          >
            {error || helperText}
          </motion.p>
        )}
      </motion.div>
    );
  },
);

GlobalInput.displayName = 'GlobalInput';

export default GlobalInput;
