import type { ExportFormat } from "./types";

interface GeneralSettingsProps {
  filename: string;
  onFilenameChange: (value: string) => void;
  includeTitle: boolean;
  onIncludeTitleChange: (value: boolean) => void;
  customTitle: string;
  onCustomTitleChange: (value: string) => void;
  includeSubtitle: boolean;
  onIncludeSubtitleChange: (value: boolean) => void;
  customSubtitle: string;
  onCustomSubtitleChange: (value: string) => void;
  includeDate: boolean;
  onIncludeDateChange: (value: boolean) => void;
  format: ExportFormat;
  tableName: string;
}

export function GeneralSettings({
  filename,
  onFilenameChange,
  includeTitle,
  onIncludeTitleChange,
  customTitle,
  onCustomTitleChange,
  includeSubtitle,
  onIncludeSubtitleChange,
  customSubtitle,
  onCustomSubtitleChange,
  includeDate,
  onIncludeDateChange,
  format,
  tableName,
}: GeneralSettingsProps) {
  const getFileExtension = () => {
    const extensions: Record<ExportFormat, string> = {
      pdf: ".pdf",
      xlsx: ".xlsx",
      csv: ".csv",
      json: ".json",
    };
    return extensions[format];
  };

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
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        Configurações
      </h3>

      {/* Nome do arquivo */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nome do arquivo
        </label>
        <input
          type="text"
          value={filename}
          onChange={(e) => onFilenameChange(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder={tableName}
        />
        <p className="mt-2 text-sm text-gray-500 flex items-center gap-2">
          <svg
            className="w-4 h-4"
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
          <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
            {filename.trim() || tableName}
            {getFileExtension()}
          </span>
        </p>
      </div>

      {/* Configurações de conteúdo */}
      <div className="space-y-4 bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
        <h4 className="font-medium text-sm text-gray-900">
          Conteúdo do documento
        </h4>

        {/* Título */}
        <div>
          <label className="flex items-center cursor-pointer group">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                checked={includeTitle}
                onChange={(e) => onIncludeTitleChange(e.target.checked)}
                className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-gray-300 checked:border-blue-600 checked:bg-blue-600 transition-all duration-200"
              />
              <svg
                className="absolute w-4 h-4 text-white pointer-events-none hidden peer-checked:block left-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-gray-900">
              Incluir título
            </span>
          </label>

          {includeTitle && (
            <input
              type="text"
              value={customTitle}
              onChange={(e) => onCustomTitleChange(e.target.value)}
              className="mt-2 w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Digite um título para o documento"
            />
          )}
        </div>

        {/* Subtítulo */}
        <div>
          <label className="flex items-center cursor-pointer group">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                checked={includeSubtitle}
                onChange={(e) => onIncludeSubtitleChange(e.target.checked)}
                className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-gray-300 checked:border-blue-600 checked:bg-blue-600 transition-all duration-200"
              />
              <svg
                className="absolute w-4 h-4 text-white pointer-events-none hidden peer-checked:block left-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-gray-900">
              Incluir subtítulo
            </span>
          </label>

          {includeSubtitle && (
            <input
              type="text"
              value={customSubtitle}
              onChange={(e) => onCustomSubtitleChange(e.target.value)}
              className="mt-2 w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Digite um subtítulo para o documento"
            />
          )}
        </div>

        {/* Data */}
        <label className="flex items-center cursor-pointer group">
          <div className="relative flex items-center">
            <input
              type="checkbox"
              checked={includeDate}
              onChange={(e) => onIncludeDateChange(e.target.checked)}
              className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-gray-300 checked:border-blue-600 checked:bg-blue-600 transition-all duration-200"
            />
            <svg
              className="absolute w-4 h-4 text-white pointer-events-none hidden peer-checked:block left-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-gray-900">
            Incluir data e hora da exportação
          </span>
        </label>
      </div>
    </div>
  );
}