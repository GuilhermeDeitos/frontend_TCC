import React, { forwardRef } from "react";

export interface SelectFieldProps {
  id: string;
  name?: string;
  label?: string;
  required?: boolean;
  // Opcionais
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  (
    {
      id,
      name,
      label,
      required = false,
      value,
      onChange,
      onBlur,
      disabled = false,
      options,
      placeholder = 'Selecione uma opção',
      className,
    },
    ref // <-- Recebendo a ref aqui
  ) => {
    return (
      <div className={className}>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <select
          ref={ref} // <-- Repassando para o HTML nativo
          id={id}
          name={name}
          required={required}
          value={value}
          onChange={onChange}
          onBlur={onBlur} // <-- Repassando o onBlur
          disabled={disabled}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
);

SelectField.displayName = "SelectField";