interface InputFieldProps {
  id: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'month';
  label?: string;
  placeholder?: string;
  required?: boolean;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
  step?: string | number;
  min?: string | number;
  max?: string | number;
}


// Componente Input Field
export function InputField({
  id,
  name,
  type = 'text',
  label,
  placeholder,
  required = false,
  value,
  onChange,
  disabled = false,
  className,
  step,
  min,
  max
}: InputFieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        required={required}
        value={value}
        onChange={onChange}
        disabled={disabled}
        step={step}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
        placeholder={placeholder}
        min={min}
        max={max}
      />
    </div>
  );
}