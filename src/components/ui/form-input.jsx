import { Input } from '@/components/ui/input';

export default function FormInput({ label, error, required, className = '', ...props }) {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-primary">*</span>}
        </label>
      )}

      <Input
        {...props}
        className={`${
          error
            ? 'border-red-500 focus-visible:ring-red-500'
            : 'border-gray-300 focus-visible:ring-primary/50'
        }`}
      />

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
