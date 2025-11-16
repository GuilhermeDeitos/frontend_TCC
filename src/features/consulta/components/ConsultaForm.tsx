import React, { useState, useEffect } from "react";
import { Form } from "@shared/components/UI/Form";
import { SelectField } from "@shared/components/UI/Select";
import { InputGroup } from "@shared/components/UI/InputGroup";
import type { FormData } from "../types/consulta";
import Swal from "sweetalert2";

const meses = [
  { value: "01", label: "Janeiro" },
  { value: "02", label: "Fevereiro" },
  { value: "03", label: "Março" },
  { value: "04", label: "Abril" },
  { value: "05", label: "Maio" },
  { value: "06", label: "Junho" },
  { value: "07", label: "Julho" },
  { value: "08", label: "Agosto" },
  { value: "09", label: "Setembro" },
  { value: "10", label: "Outubro" },
  { value: "11", label: "Novembro" },
  { value: "12", label: "Dezembro" },
];

interface ConsultaFormProps {
  onSubmit: (formData: FormData) => void;
  isLoading: boolean;
  listaIPCA: { value: string; label: string }[];
  listaIPCAAnual: { value: string; label: string }[];
  carregarMediasAnuais: () => void;
}

export function ConsultaForm({
  onSubmit,
  isLoading,
  listaIPCA,
  listaIPCAAnual,
  carregarMediasAnuais,
}: ConsultaFormProps) {
  const [formData, setFormData] = useState<FormData>({
    tipoCorrecao: "",
    ipcaReferencia: "",
    mesInicial: "",
    anoInicial: "",
    mesFinal: "",
    anoFinal: "",
  });

  // Quando tipo de correção mudar, carregar médias anuais se necessário
  useEffect(() => {
    if (formData.tipoCorrecao === "anual") {
      carregarMediasAnuais();
    }
  }, [formData.tipoCorrecao, carregarMediasAnuais]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Se mudou o tipo de correção, limpar a referência IPCA
    if (name === "tipoCorrecao" && value !== formData.tipoCorrecao) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        ipcaReferencia: "", // Limpar seleção anterior
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validações básicas
    if (
      !formData.tipoCorrecao ||
      !formData.ipcaReferencia ||
      !formData.mesInicial ||
      !formData.anoInicial ||
      !formData.mesFinal ||
      !formData.anoFinal
    ) {
      Swal.fire({
        icon: "error",
        title: "Atenção",
        text: "Por favor, preencha todos os campos.",
      });
      return;
    }

    const anoInicialNum = parseInt(formData.anoInicial);
    const anoFinalNum = parseInt(formData.anoFinal);
    const mesInicialNum = parseInt(formData.mesInicial);
    const mesFinalNum = parseInt(formData.mesFinal);

    // Validação: ano final não pode ser menor que ano inicial
    if (anoFinalNum < anoInicialNum) {
      Swal.fire({
        icon: "error",
        title: "Atenção",
        text: "O ano final não pode ser anterior ao ano inicial.",
      });
      return;
    }

    // Validação: se mesmo ano, mês final não pode ser menor que mês inicial
    if (anoInicialNum === anoFinalNum && mesFinalNum < mesInicialNum) {
      Swal.fire({
        icon: "error",
        title: "Atenção",
        text: "O mês final não pode ser anterior ao mês inicial no mesmo ano.",
      });
      return;
    }

    // Validação: período deve estar entre 2002 e 2023 para dados de transparência
    if (anoInicialNum < 2002 || anoFinalNum > 2023) {
      Swal.fire({
        icon: "error",
        title: "Atenção",
        text: "O período de consulta deve estar entre 2002 e 2023.",
      });
      return;
    }

    onSubmit(formData);
  };

  return (
    <Form
      title="Parâmetros da Consulta"
      subtitle={
        <>
          Configure os filtros para buscar os dados desejados.
          <br />
          <span className="text-sm text-gray-500">
            Período de dados disponível: 2002 a 2023
          </span>
        </>
      }
      onSubmit={handleSubmit}
      submitButtonText="Consultar Dados"
      isLoading={isLoading}
      className="mb-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div data-tour="tipo-correcao">
          <SelectField
            id="tipoCorrecao"
            name="tipoCorrecao"
            label="Tipo de Correção"
            required
            value={formData.tipoCorrecao}
            onChange={handleChange}
            options={[
              { value: "mensal", label: "IPCA Mensal" },
              { value: "anual", label: "IPCA Anual (Média)" },
            ]}
          />
        </div>
        <div data-tour="ipca-referencia">
          <SelectField
            id="ipcaReferencia"
            name="ipcaReferencia"
            label="IPCA de Referência"
            required
            value={formData.ipcaReferencia}
            onChange={handleChange}
            options={
              formData.tipoCorrecao === "anual" ? listaIPCAAnual : listaIPCA
            }
            placeholder={
              formData.tipoCorrecao === "anual"
                ? "Selecione o ano de referência"
                : "Selecione o período de referência"
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div data-tour="periodo-inicial">
          <InputGroup>
            <SelectField
              id="mesInicial"
              name="mesInicial"
              label="Mês Inicial"
              required
              value={formData.mesInicial}
              onChange={handleChange}
              options={meses}
            />
            <SelectField
              id="anoInicial"
              name="anoInicial"
              label="Ano Inicial"
              required
              value={formData.anoInicial}
              onChange={handleChange}
              options={Array.from({ length: 22 }, (_, i) => {
                const year = 2002 + i;
                return { value: year.toString(), label: year.toString() };
              })}
            />
          </InputGroup>
        </div>
        <div data-tour="periodo-final">
          <InputGroup>
            <SelectField
              id="mesFinal"
              name="mesFinal"
              label="Mês Final"
              required
              value={formData.mesFinal}
              onChange={handleChange}
              options={meses}
            />
            <SelectField
              id="anoFinal"
              name="anoFinal"
              label="Ano Final"
              required
              value={formData.anoFinal}
              onChange={handleChange}
              options={Array.from({ length: 22 }, (_, i) => {
                const year = 2002 + i;
                return { value: year.toString(), label: year.toString() };
              })}
            />
          </InputGroup>
        </div>
      </div>
    </Form>
  );
}
