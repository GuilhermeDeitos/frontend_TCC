import { useState, useEffect } from "react";
import api from "../../utils/api";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { Table } from "../../components/Table";
import { BlueTitleCard } from "../../components/BlueTitleCard";
import { ErrorPanel } from "../../components/ErrorPanel";

interface SerieIPCA {
  id: number;
  data: string;
  valor: number;
}

export function SeriesIPCAPage() {
  const [series, setSeries] = useState<SerieIPCA[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    api
      .get("/ipca")
      .then((response) => {
        const dadosIPCA = Object.entries(response.data.data).map(
          ([key, value], index) => {
            return {
              id: index,
              data: key,
              valor: Number(value),
            };
          }
        );

        console.log("Dados IPCA:", dadosIPCA);

        setSeries(dadosIPCA);
      })
      .catch((error) => {
        if (error.message === "Network Error") {
          setError("Servidor fora do ar");
        }
        setError("Erro ao buscar série histórica do IPCA");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const columnsKeyMap = {
    Data: "data",
    Valor: "valor",
  };

  const retryFetch = () => {
    setError(null);
    setLoading(true);
    api
      .get("/ipca")
      .then((response) => {
        const dadosIPCA = Object.entries(response.data.data).map(
          ([key, value], index) => {
            return {
              id: index,
              data: key,
              valor: Number(value),
            };
          }
        );

        console.log("Dados IPCA:", dadosIPCA);

        setSeries(dadosIPCA);
      })
      .catch((error) => {
        if (error.message === "Network Error") {
          setError("Servidor fora do ar");
        }
        setError("Erro ao buscar série histórica do IPCA");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (loading) {
    return (
      <div>
      <Header />
      <div className="flex items-center justify-center w-full min-h-[400px] px-4">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-blue-600 h-2 w-full"></div>
          <div className="p-6 flex flex-col items-center">
            <svg
              className="animate-spin h-10 w-10 text-blue-600 mb-4"
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
            <p className="text-gray-700">
              Carregando série histórica do IPCA...
            </p>
          </div>
        </div>
      </div>
      <Footer />
      </div>
    );
  }
  return (
    <div>
      <Header />
      {error ? (
        <ErrorPanel message={error} retry={retryFetch} />
      ) : (
        <>
          <BlueTitleCard
            title="Série Histórica do IPCA"
            subtitle="Consulte a tabela abaixo para visualizar a série histórica do IPCA."
          />
          <main className="flex items-center justify-center min-w-full p-2">
            <Table
              items={series.sort(
                (a, b) =>
                  new Date(`01/${b.data}`).getTime() -
                  new Date(`01/${a.data}`).getTime()
              )}
              columns={["Data", "Valor"]}
              tableType="geral"
              keyMap={columnsKeyMap}
            />
          </main>
        </>
      )}

      <Footer />
    </div>
  );
}
