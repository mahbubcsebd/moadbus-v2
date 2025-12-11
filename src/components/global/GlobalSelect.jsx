import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { forwardRef, useEffect, useRef, useState } from 'react';

const GlobalSelect = forwardRef(
  (
    {
      label,
      placeholder = 'Select',
      required = false,
      error,
      helperText,
      options = [],
      className = '',
      labelClassName = '',
      selectClassName = '',
      containerClassName = '',
      disabled = false,
      value,
      onChange,
      ...props
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const dropdownRef = useRef(null);
    const triggerRef = useRef(null);

    // Find selected option
    useEffect(() => {
      const option = options.find((opt) => opt.value === value);
      setSelectedOption(option || null);
    }, [value, options]);

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target) &&
          triggerRef.current &&
          !triggerRef.current.contains(event.target)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (option) => {
      setSelectedOption(option);
      setIsOpen(false);
      if (onChange) {
        onChange(option.value);
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn('w-full relative', containerClassName)}
      >
        {/* Label */}
        {label && (
          <label className={cn('block text-sm font-medium text-gray-700 mb-2', labelClassName)}>
            {label}
            {required && <span className="ml-1 text-primary">*</span>}
          </label>
        )}

        {/* Select Trigger */}
        <div className="relative">
          <button
            ref={triggerRef}
            type="button"
            disabled={disabled}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            className={cn(
              'w-full h-12 px-4 bg-gray-50 border rounded-lg text-gray-900 transition-all duration-300 outline-none flex items-center justify-between',
              error
                ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                : 'border-gray-200 hover:border-gray-300 focus:border-primary focus:ring-2 focus:ring-orange-100',
              disabled && 'bg-gray-100 cursor-not-allowed opacity-60',
              selectClassName,
            )}
            {...props}
          >
            <span
              className={cn(
                'text-sm truncate overflow-hidden whitespace-nowrap text-ellipsis text-left',
                selectedOption ? 'text-gray-900' : 'text-gray-400',
              )}
            >
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <ChevronDown
              className={cn(
                'w-5 h-5 text-gray-400 transition-transform duration-200',
                isOpen && 'transform rotate-180',
              )}
            />
          </button>

          {/* Dropdown */}
          {isOpen && !disabled && (
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute z-50 w-full mt-2 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg max-h-60"
            >
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={cn(
                    'w-full px-4 py-3 text-left text-sm transition-colors duration-150 hover:bg-primary/5 focus:bg-primary/5 focus:outline-none',
                    selectedOption?.value === option.value &&
                      'bg-primary/5 text-primary font-medium',
                  )}
                >
                  {option.label}
                </button>
              ))}
              {options.length === 0 && (
                <div className="px-4 py-3 text-sm text-center text-gray-400">
                  No options available
                </div>
              )}
            </motion.div>
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

GlobalSelect.displayName = 'GlobalSelect';

export default GlobalSelect;
