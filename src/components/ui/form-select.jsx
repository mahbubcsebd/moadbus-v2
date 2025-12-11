import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Controller } from 'react-hook-form';

export default function FormSelect({
  label,
  name,
  options,
  control,
  required = false,
  placeholder = 'Select',
  className,
}) {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      rules={{ required: required ? `${label} is required` : false }}
      render={({ field, fieldState }) => (
        <div className={cn('w-full space-y-1', className)}>
          <label className="block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-primary"> *</span>}
          </label>

          <Select
            value={field.value} // bind current value
            onValueChange={field.onChange} // update react-hook-form state
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                {options.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {fieldState.error && <p className="text-sm text-red-500">{fieldState.error.message}</p>}
        </div>
      )}
    />
  );
}
