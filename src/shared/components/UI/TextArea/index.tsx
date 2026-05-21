import React, { forwardRef } from "react";
import type { ReactNode } from "react";

export interface TextareaFieldProps {
  id: string;
  name?: string; // Tornado opcional para maior flexibilidade
  label?: string;
  placeholder?: string;
  required?: boolean;
  value?: string; // Tornado opcional
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; // Tornado opcional
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void; // NOVO: Para o React Hook Form
  rows?: number;
  disabled?: boolean;
  helperText?: string | ReactNode;
  error?: string; // NOVO: Propriedade para erros
  className?: string; // Adicionado para manter padrão com InputField
}

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  (
    {
      id,
      name,
      label,
      placeholder,
      required = false,
      value,
      onChange,
      onBlur,
      rows = 4,
      disabled = false,
      helperText,
      error, // NOVO
      className
    },
    ref // NOVO: Recebendo a referência
  ) => {
    return (
      <div className={className}>
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <textarea
          ref={ref} // NOVO: Passando a ref pro textarea nativo
          id={id}
          name={name}
          required={required}
          rows={rows}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical disabled:bg-gray-100 disabled:cursor-not-allowed ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder={placeholder}
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

TextareaField.displayName = "TextareaField";