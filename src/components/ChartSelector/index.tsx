import type { TipoGrafico } from "../../types/consulta";

interface ChartSelectorProps {
  tipoGrafico: TipoGrafico;
  onChange: (tipo: TipoGrafico) => void;
}

export function ChartSelector({ tipoGrafico, onChange }: ChartSelectorProps) {
  return (
    <div className="flex gap-2 mb-4 justify-center" data-tour="chart-type-selector">
      <button
        onClick={() => onChange('barras')}
        className={`px-3 py-1 rounded text-sm ${
          tipoGrafico === 'barras' 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-200 text-gray-700'
        } cursor-pointer`}
      >
        Barras
      </button>
      <button
        onClick={() => onChange('linhas')}
        className={`px-3 py-1 rounded text-sm ${
          tipoGrafico === 'linhas' 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-200 text-gray-700'
        } cursor-pointer`}
      >
        Linhas
      </button>
      <button
        onClick={() => onChange('pizza')}
        className={`px-3 py-1 rounded text-sm ${
          tipoGrafico === 'pizza' 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-200 text-gray-700'
        } cursor-pointer`}
      >
        Pizza
      </button>
      <button
        onClick={() => onChange('area')}
        className={`px-3 py-1 rounded text-sm ${
          tipoGrafico === 'area' 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-200 text-gray-700'
        } cursor-pointer`}
      >
        Área
      </button>
    </div>
  );
}