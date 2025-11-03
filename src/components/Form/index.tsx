import type { ReactNode } from "react";

interface FormProps {
  title: string;
  subtitle?: string | ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  children: ReactNode;
  submitButtonText?: string;
  isLoading?: boolean;
  className?: string;
}

export function Form({
  title,
  subtitle,
  onSubmit,
  children,
  submitButtonText = "Enviar",
  isLoading = false,
  className = "",
}: FormProps) {
  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 sm:p-8 ${className}`}>
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          {title}
        </h2>
        {subtitle && <p className="text-gray-600">{subtitle}</p>}
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {children}

        <div>
          <button
            type="submit"
            disabled={isLoading}
            data-tour="submit-button"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium text-lg cursor-pointer
            border-1 border-blue-600 hover:bg-transparent hover:text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center "
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Enviando...
              </>
            ) : (
              submitButtonText
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
