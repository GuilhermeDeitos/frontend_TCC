import React, { forwardRef } from "react";

export interface InputFieldProps {
  id: string;
  name?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'month';
  label?: string;
  placeholder?: string;
  required?: boolean;
  // Opcionais agora para suportar tanto useState quanto React Hook Form
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
  step?: string | number;
  min?: string | number;
  max?: string | number;
  helperText?: string;
}

// Usamos forwardRef para repassar a "ref" do React Hook Form para o <input>
export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      id,
      name,
      type = 'text',
      label,
      placeholder,
      required = false,
      value,
      onChange,
      onBlur,
      disabled = false,
      className,
      step,
      min,
      max,
      helperText,
    },
    ref // <-- Recebendo a ref aqui
  ) => {
    return (
      <div className={className}>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
          ref={ref} // <-- Repassando para o HTML nativo
          type={type}
          id={id}
          name={name}
          required={required}
          value={value}
          onChange={onChange}
          onBlur={onBlur} // <-- Repassando o onBlur
          disabled={disabled}
          step={step}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
          placeholder={placeholder}
          min={min}
          max={max}
        />
        {helperText && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
      </div>
    );
  }
);

// Necessário para o DevTools do React não mostrar nomes estranhos ao usar forwardRef
InputField.displayName = "InputField";