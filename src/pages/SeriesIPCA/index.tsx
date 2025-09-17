import { useState, useEffect } from "react";
import api from "../../utils/api";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { Table } from "../../components/Table";
import { BlueTitleCard } from "../../components/BlueTitleCard";
export function SeriesIPCAPage() {

  interface SerieIPCA {
    id: number;
    data: string;
    valor: number;
  }

  const [series, setSeries] = useState<SerieIPCA[]>([]);

  useEffect(() => {
    api.get("/ipca")
      .then((response) => {
        const dadosIPCA = Object.entries(response.data.data).map(([key, value], index) => {
          return {
            id: index,
            data: key,
            valor: Number(value)
          };
        });

        console.log("Dados IPCA:", dadosIPCA);

        setSeries(dadosIPCA);

      })
      .catch((error) => {
        console.error("Erro ao buscar série histórica do IPCA:", error);
      });
  }, []);

  return (
    <div>
      <Header />
      <BlueTitleCard
        title="Série Histórica do IPCA"
        subtitle="Consulte a tabela abaixo para visualizar a série histórica do IPCA."
      />
      <main className="flex items-center justify-center min-w-full p-2">
        <Table items={series.sort((a, b) => new Date(`01/${b.data}`).getTime() - new Date(`01/${a.data}`).getTime())} columns={["Data", "Valor"]} />
      </main>
      
      <Footer />
    </div>
  );
}