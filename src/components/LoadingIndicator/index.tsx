import React from "react";

interface LoadingIndicatorProps {
  message?: string;
}

export function LoadingIndicator({ message = "Consultando dados..." }: LoadingIndicatorProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-12 text-center">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {message}
        </h3>
        <p className="text-gray-600">Isso pode levar alguns minutos para períodos extensos</p>
      </div>
    </div>
  );
}