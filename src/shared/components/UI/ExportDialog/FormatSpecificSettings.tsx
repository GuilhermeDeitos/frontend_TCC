import type { ExportFormat } from "./types";

interface FormatSpecificSettingsProps {
  format: ExportFormat;
  orientation?: "portrait" | "landscape";
  onOrientationChange?: (value: "portrait" | "landscape") => void;
  jsonFormat?: "pretty" | "compact";
  onJsonFormatChange?: (value: "pretty" | "compact") => void;
}

export function FormatSpecificSettings({
  format,
  orientation,
  onOrientationChange,
  jsonFormat,
  onJsonFormatChange,
}: FormatSpecificSettingsProps) {
  if (format === "pdf" && orientation && onOrientationChange) {
    return (
      <div className="space-y-3 bg-red-50 rounded-xl p-4 border-2 border-red-200">
        <h4 className="font-medium text-sm text-gray-900 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Orientação do PDF
        </h4>

        <div className="flex gap-3">
          <label className="flex-1">
            <input
              type="radio"
              checked={orientation === "portrait"}
              onChange={() => onOrientationChange("portrait")}
              className="peer hidden"
            />
            <div className="flex items-center justify-center gap-2 p-3 rounded-lg border-2 border-gray-300 peer-checked:border-red-600 peer-checked:bg-red-50 cursor-pointer transition-all">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="text-sm font-medium">Retrato</span>
            </div>
          </label>

          <label className="flex-1">
            <input
              type="radio"
              checked={orientation === "landscape"}
              onChange={() => onOrientationChange("landscape")}
              className="peer hidden"
            />
            <div className="flex items-center justify-center gap-2 p-3 rounded-lg border-2 border-gray-300 peer-checked:border-red-600 peer-checked:bg-red-50 cursor-pointer transition-all">
              <svg
                className="w-5 h-5 transform rotate-90"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="text-sm font-medium">Paisagem</span>
            </div>
          </label>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-2">
          <svg
            className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div className="text-xs text-amber-800">
            <p className="font-medium mb-1">Dica importante</p>
            <p>
              Muitas colunas podem causar problemas de layout. Considere usar XLSX
              para muitos campos.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (format === "json" && jsonFormat && onJsonFormatChange) {
    return (
      <div className="space-y-3 bg-purple-50 rounded-xl p-4 border-2 border-purple-200">
        <h4 className="font-medium text-sm text-gray-900">Formato do JSON</h4>

        <div className="flex gap-3">
          <label className="flex-1">
            <input
              type="radio"
              checked={jsonFormat === "pretty"}
              onChange={() => onJsonFormatChange("pretty")}
              className="peer hidden"
            />
            <div className="flex items-center justify-center gap-2 p-3 rounded-lg border-2 border-gray-300 peer-checked:border-purple-600 peer-checked:bg-purple-50 cursor-pointer transition-all">
              <span className="text-sm font-medium">Formatado</span>
            </div>
          </label>

          <label className="flex-1">
            <input
              type="radio"
              checked={jsonFormat === "compact"}
              onChange={() => onJsonFormatChange("compact")}
              className="peer hidden"
            />
            <div className="flex items-center justify-center gap-2 p-3 rounded-lg border-2 border-gray-300 peer-checked:border-purple-600 peer-checked:bg-purple-50 cursor-pointer transition-all">
              <span className="text-sm font-medium">Compacto</span>
            </div>
          </label>
        </div>
      </div>
    );
  }

  return null;
}