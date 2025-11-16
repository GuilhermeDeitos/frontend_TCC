import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";

import { Header } from "@shared/components/Layout/Header";
import { Footer } from "@shared/components/Layout/Footer";
import { BlueTitleCard } from "@shared/components/UI/BlueTitleCard";
import { ErrorPanel } from "@shared/components/Feedback/ErrorPanel";
import { TourGuide } from "@shared/components/tour/TourGuide";
import { TourRestartButton } from "@shared/components/tour/TourRestartButton";

import { FilterPanel } from "../../components/SeriesIPCA/FilterPanel";
import { StatsPanel } from "../../components/SeriesIPCA/StatsPanel";

import { useSeriesIPCATour } from "../../hooks/useSeriesIPCATour";

import type { FilterState, SerieIPCA } from "../../types/series";

import api from "@/shared/utils/api";
import { Table } from "@/shared/components/UI/Table";

const INITIAL_FILTER_STATE: FilterState = {
  type: "all",
  year: "",
  month: "",
};

export function SeriesIPCAPage() {
  const [series, setSeries] = useState<SerieIPCA[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterState, setFilterState] = useState<FilterState>(INITIAL_FILTER_STATE);
  
  const tour = useSeriesIPCATour();

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get("/ipca");
      const dadosIPCA = Object.entries(response.data.data).map(
        ([key, value], index) => ({
          id: index,
          data: key,
          valor: Number(value),
        })
      );

      setSeries(dadosIPCA);

      if (!tour.isTourCompleted && !tour.isActive) {
        setTimeout(() => tour.startTour(), 1000);
      }
    } catch (error: any) {
      const errorMessage =
        error.message === "Network Error"
          ? "Servidor fora do ar"
          : "Erro ao buscar série histórica do IPCA";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtrar dados
  const filteredSeries = useMemo(() => {
    if (filterState.type === "all") {
      return series;
    }

    return series.filter((item) => {
      const [mes, ano] = item.data.split("/");

      if (filterState.type === "year") {
        return !filterState.year || ano === filterState.year;
      }

      if (filterState.type === "month") {
        const matchYear = !filterState.year || ano === filterState.year;
        const matchMonth = !filterState.month || mes === filterState.month;
        return matchYear && matchMonth;
      }

      return true;
    });
  }, [series, filterState]);

  // Anos disponíveis para filtro
  const availableYears = useMemo(() => {
    const years = Array.from(
      new Set(series.map((item) => item.data.split("/")[1]))
    );
    return years.sort((a, b) => parseInt(b) - parseInt(a));
  }, [series]);

  const handleFilterChange = (newState: Partial<FilterState>) => {
    setFilterState((prev) => ({ ...prev, ...newState }));
  };

  const columnsKeyMap = {
    Data: "data",
    Valor: "valor",
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center px-4 bg-gray-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 h-2 w-full"></div>
            <div className="p-8 flex flex-col items-center">
              <div className="relative">
                <svg
                  className="animate-spin h-16 w-16 text-blue-600"
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
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">
                Carregando dados do IPCA
              </h3>
              <p className="text-gray-600 text-center">
                Aguarde enquanto buscamos a série histórica completa...
              </p>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {error ? (
        <ErrorPanel message={error} retry={fetchData} />
      ) : (
        <>
          <div data-tour="title-section">
            <BlueTitleCard
              title="Série Histórica do IPCA"
              subtitle="Índices oficiais do IBGE desde dezembro de 1979, atualizados mensalmente"
            />
          </div>

          <main className="flex-grow bg-gray-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <StatsPanel series={filteredSeries} />
                <FilterPanel
                  filterState={filterState}
                  onFilterChange={handleFilterChange}
                  availableYears={availableYears}
                />

                <div className="bg-white border-2 border-gray-200 rounded-xl shadow-sm overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-1">
                          Tabela de Índices
                        </h2>
                        <p className="text-blue-100 text-sm">
                          {filteredSeries.length} registro(s) encontrado(s)
                        </p>
                      </div>
                      {filterState.type !== "all" && (
                        <button
                          onClick={() => setFilterState(INITIAL_FILTER_STATE)}
                          className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Limpar Filtros
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="p-6">
                    <Table
                      items={filteredSeries.sort(
                        (a, b) =>
                          new Date(`01/${b.data}`).getTime() -
                          new Date(`01/${a.data}`).getTime()
                      )}
                      columns={["Data", "Valor"]}
                      tableType="geral"
                      keyMap={columnsKeyMap}
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </main>
        </>
      )}

      <Footer />

      {!loading && !error && (
        <>
          <TourGuide
            isActive={tour.isActive}
            currentStep={tour.currentStep}
            totalSteps={tour.totalSteps}
            currentStepData={tour.currentStepData}
            onNext={tour.nextStep}
            onPrev={tour.prevStep}
            onSkip={tour.skipTour}
            onClose={tour.closeTour}
            onCancel={tour.cancelTour}
            onSkipAll={tour.skipAllTours}
          />

          <TourRestartButton
            onRestartTour={tour.restartTour}
            onRestartAllTours={tour.restartAllTours}
            tourKey="seriesIPCA"
            completedTours={tour.completedTours}
            completedToursCount={tour.completedToursCount}
            isFirstTimeUser={tour.isFirstTimeUser}
          />
        </>
      )}
    </div>
  );
}