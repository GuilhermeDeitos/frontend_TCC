import { memo, useMemo } from "react";
import { motion } from "framer-motion";

interface UniversitySelectorProps {
  availableUniversities: string[];
  selectedUniversidades: string[];
  onSelectionChange: (universidades: string[]) => void;
}

export const UniversitySelector = memo(({
  availableUniversities,
  selectedUniversidades,
  onSelectionChange,
}: UniversitySelectorProps) => {
  const isAllSelected = selectedUniversidades.length === 0;

  const handleToggleUniversity = (university: string) => {
    if (selectedUniversidades.includes(university)) {
      onSelectionChange(selectedUniversidades.filter(u => u !== university));
    } else {
      onSelectionChange([...selectedUniversidades, university]);
    }
  };

  const handleSelectAll = () => {
    onSelectionChange([]);
  };

  const handleClearAll = () => {
    if (availableUniversities.length > 0) {
      onSelectionChange([availableUniversities[0]]);
    }
  };

  const sortedUniversities = useMemo(() => {
    return [...availableUniversities].sort((a, b) => a.localeCompare(b));
  }, [availableUniversities]);

  return (
    <div
      className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-xl p-4"
      data-tour="university-selector"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-purple-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          <h3 className="text-sm font-semibold text-gray-900">
            Selecionar Universidades
          </h3>
          <span className="text-xs text-gray-600 bg-white px-2 py-0.5 rounded-full">
            {isAllSelected ? 'Todas' : `${selectedUniversidades.length} selecionadas`}
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSelectAll}
            disabled={isAllSelected}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
              isAllSelected
                ? "bg-purple-600 text-white cursor-default"
                : "bg-white text-purple-600 hover:bg-purple-100 border border-purple-300"
            }`}
          >
            Todas
          </button>
          <button
            onClick={handleClearAll}
            disabled={selectedUniversidades.length === 1 && !isAllSelected}
            className="px-3 py-1 text-xs font-medium rounded-lg transition-colors bg-white text-gray-600 hover:bg-gray-100 border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Limpar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
        {sortedUniversities.map((university) => {
          const isSelected = isAllSelected || selectedUniversidades.includes(university);

          return (
            <button
              key={university}
              onClick={() => handleToggleUniversity(university)}
              className={`relative px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                isSelected
                  ? "bg-purple-600 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
              }`}
            >
              <span className="block truncate">{university}</span>
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center"
                >
                  <svg
                    className="w-3 h-3 text-white"
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
                </motion.div>
              )}
            </button>
          );
        })}
      </div>

      {!isAllSelected && selectedUniversidades.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 p-3 bg-white border border-purple-200 rounded-lg"
        >
          <p className="text-xs text-gray-600">
            <strong className="text-purple-700">
              {selectedUniversidades.length}
            </strong>{" "}
            universidade(s) selecionada(s) para comparação
          </p>
        </motion.div>
      )}
    </div>
  );
});

UniversitySelector.displayName = 'UniversitySelector';