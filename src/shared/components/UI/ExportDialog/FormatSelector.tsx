import type { JSX } from "react";
import type { ExportFormat } from "./types";

interface FormatSelectorProps {
  format: ExportFormat;
  onFormatChange: (format: ExportFormat) => void;
}

const formatIcons: Record<ExportFormat, JSX.Element> = {
  xlsx: (
    <svg className="w-7 h-7 text-green-700" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21.17 3.25H2.83c-.46 0-.83.37-.83.83v15.83c0 .46.37.84.83.84h18.34c.46 0 .83-.37.83-.84V4.08c0-.46-.37-.83-.83-.83zm-.83 16.67H3.67V4.92h16.67v15z" />
      <path d="M9.25 10.83h2.5v2.5h-2.5zM12.58 10.83h2.5v2.5h-2.5zM9.25 14.17h2.5v2.5h-2.5zM12.58 14.17h2.5v2.5h-2.5zM9.25 7.5h2.5V10h-2.5zM12.58 7.5h2.5V10h-2.5z" />
    </svg>
  ),
  pdf: (
    <svg className="w-7 h-7 text-red-600" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm12 6V9c0-.55-.45-1-1-1h-2v5h2c.55 0 1-.45 1-1zm-2-3h1v3h-1V9zm4 2h1v-1h-1V9h1V8h-2v5h1v-1zm-8 0h1c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1H9v5h1v-2z" />
    </svg>
  ),
  csv: (
    <svg className="w-7 h-7 text-emerald-600" viewBox="0 0 24 24" fill="currentColor">
      <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z" />
      <path d="M10.3 11.1c-.5 0-1 .2-1.3.5-.3.3-.5.8-.5 1.4 0 .5.2 1 .5 1.3.3.3.8.5 1.3.5.4 0 .8-.1 1.1-.4.1-.1.2-.3.3-.5H13c-.1.5-.4 1-.8 1.3-.4.3-.9.5-1.5.5-.8 0-1.5-.3-2-.8s-.8-1.2-.8-2.1.3-1.6.8-2.1c.5-.5 1.2-.8 2-.8.6 0 1.1.2 1.5.5.4.3.7.8.8 1.3h-1.3c-.1-.3-.3-.5-.5-.6-.2-.1-.5-.2-.7-.2zm7.2 3.8h-1.3l-1.2-2.1-1.2 2.1h-1.3l1.8-3-1.7-2.9h1.3l1.1 2 1.1-2h1.3l-1.7 2.9 1.8 3zM6.8 14.9h.9v-5.9h-.9v2.6h-1.3V9h-.9v5.9h.9v-2.7h1.3v2.7z" />
    </svg>
  ),
  json: (
    <svg className="w-7 h-7 text-purple-700" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 21V9l8-6 8 6v12h-6v-7h-4v7z" />
      <path d="M12 7c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1zM14.83 15c-.36 0-.7.18-.92.55l-.46.79c-.23.37-.58.55-.92.55-.55 0-1-.45-1-1v-4.07c.56-.46 1.38-1.07 1.38-2.32 0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5c0 .73.42 1.36 1.12 1.87v4.52c0 1.11.89 2 2 2 .7 0 1.38-.36 1.75-1.05l.46-.79c.23-.37.58-.55.92-.55h.58c.5 0 .92.37.98.87l.26 2.04c.07.59.57 1.04 1.17 1.04.69 0 1.21-.67 1.11-1.35l-.6-3.56c-.15-.89-.92-1.56-1.83-1.56h-2z" />
    </svg>
  ),
};

const formatDescriptions: Record<ExportFormat, string> = {
  xlsx: "Planilha do Excel com formatação e estilos",
  pdf: "Documento PDF formatado, ideal para impressão",
  csv: "Arquivo de texto simples, compatível com diversos sistemas",
  json: "Formato estruturado para APIs e desenvolvimento",
};

export function FormatSelector({ format, onFormatChange }: FormatSelectorProps) {
  const formats: ExportFormat[] = ["xlsx", "pdf", "csv", "json"];

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <svg
          className="w-5 h-5 text-blue-600"
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
        Formato de Exportação
      </h3>

      <div className="space-y-3">
        {formats.map((fmt) => (
          <div
            key={fmt}
            className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
              format === fmt
                ? "border-blue-500 bg-blue-50 shadow-sm"
                : "border-gray-200 hover:border-blue-200 hover:bg-gray-50"
            }`}
            onClick={() => onFormatChange(fmt)}
          >
            <input
              type="radio"
              id={`format-${fmt}`}
              name="format"
              checked={format === fmt}
              onChange={() => onFormatChange(fmt)}
              className="hidden"
            />
            <label
              htmlFor={`format-${fmt}`}
              className="flex items-center gap-3 cursor-pointer w-full"
            >
              <div className="shrink-0">{formatIcons[fmt]}</div>
              <div className="flex-grow">
                <p className="font-semibold text-gray-900">{fmt.toUpperCase()}</p>
                <p className="text-sm text-gray-600">{formatDescriptions[fmt]}</p>
              </div>
              {format === fmt && (
                <div className="shrink-0">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}