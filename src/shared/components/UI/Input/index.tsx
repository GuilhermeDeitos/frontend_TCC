import React, { forwardRef } from "react";
import type { ReactNode } from "react";

export interface InputFieldProps {
  id: string;
  name?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'month';
  label?: string;
  placeholder?: string;
  required?: boolean;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
  step?: string | number;
  min?: string | number;
  max?: string | number;
  helperText?: string | ReactNode;
  error?: string; // NOVO: Propriedade para receber o erro de validação
}

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
      error, // NOVO
    },
    ref
  ) => {
    return (
      <div className={className}>
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          id={id}
          name={name}
          required={required}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          step={step}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder={placeholder}
          min={min}
          max={max}
        />
        {/* Renderiza o erro se existir; caso contrário, renderiza o helperText */}
        {error ? (
          <p className="mt-1 text-sm font-medium text-red-600">{error}</p>
        ) : helperText ? (
          <div className="mt-1 text-sm text-gray-500">{helperText}</div>
        ) : null}
      </div>
    );
  }
);

InputField.displayName = "InputField";