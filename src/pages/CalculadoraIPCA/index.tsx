// Exemplo de uso em uma calculadora de IPCA
import { useEffect, useState } from "react";
import { Form } from "../../components/Form";
import { InputField } from "../../components/Input";
import { SelectField } from "../../components/Select";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import {InputGroup} from "../../components/InputGroup";
import apiIpca from "../../utils/api";
import Swal from "sweetalert2";
import {BlueTitleCard} from "../../components/BlueTitleCard";
import { ErrorPanel } from "../../components/ErrorPanel";
import api from "../../utils/api";

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

export function CalculadoraIPCAPage() {
  const [formData, setFormData] = useState({
    valor: "",
    mesInicial: "",
    anoInicial: "",
    mesFinal: "",
    anoFinal: ""
  });

  const [error, setError] = useState<string | null>(null);

  //Verificar se a API está ok
  const checkApiStatus = async () => {
    try {
      await api.get("/ipca");
    } catch (error) {
      setError("Erro ao verificar status da API");
      console.error("Erro ao verificar status da API:", error);
    }
  };  
  // Chamar a verificação de status ao montar o componente
  useEffect(() => {
    checkApiStatus();
  }, []);

  const [resultado, setResultado] = useState({
    indice_ipca_final:0,
    indice_ipca_inicial:0,
    valor_corrigido:0,
    valor_inicial:0
  });

  const mesAtual = new Date().getMonth() + 1;
  const anoAtual = new Date().getFullYear();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações para entrada do usuário
    const validateInput = () => {
      // Validar valor monetário
      if (isNaN(Number(formData.valor)) || Number(formData.valor) <= 0) {
        return {
          isValid: false,
          message: "Por favor, insira um valor válido."
        };
      }
      
      // Validar preenchimento de todos os campos
      if (!formData.mesInicial || !formData.anoInicial || !formData.mesFinal || !formData.anoFinal) {
        return {
          isValid: false,
          message: "Por favor, preencha todos os campos."
        };
      }
      
      // Validar restrição de dezembro de 1979
      if((formData.anoFinal === '1979' && formData.mesFinal !== '12') || 
         (formData.anoInicial === '1979' && formData.mesInicial !== '12')) {
        return {
          isValid: false,
          message: "Apenas o mês de dezembro de 1979 é permitido como mês final."
        };
      }
      
      // Validar disponibilidade de IPCA para meses recentes
      if((formData.anoInicial === anoAtual.toString() && parseInt(formData.mesInicial) > mesAtual - 2) || 
         (formData.anoFinal === anoAtual.toString() && parseInt(formData.mesFinal) > mesAtual - 2)) {
        return {
          isValid: false,
          message: "Ainda não foi disponibilizado o IPCA para esses meses."
        };
      }
      
      return { isValid: true };
    };

    // Executar validações
    const validation = validateInput();
    if (!validation.isValid) {
      Swal.fire({
        icon: "error",
        title: "Atenção",
        text: validation.message
      });
      return;
    }

    apiIpca.get("/ipca/corrigir?", {
      params: {
        mes_inicial: formData.mesInicial,
        ano_inicial: formData.anoInicial,
        mes_final: formData.mesFinal,
        ano_final: formData.anoFinal,
        valor: formData.valor,
      },
    })
    .then((response) => {
      setResultado(response.data);
      if(response.data.valor_corrigido > 0) {
        Swal.fire({
        icon: "success",
        title: "Sucesso",
        text: `Valor corrigido: R$ ${response.data.valor_corrigido.toFixed(2)}\n`
      });

    } else {
      Swal.fire({
        icon: "info",
        title: "Atenção",
        text: "O valor corrigido é negativo ou igual a zero.",
      });
    }
          })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Ocorreu um erro ao calcular a correção monetária.",
      });
      console.error("Erro ao calcular a correção monetária:", error);
    });
  };


  return (
    <div>
      <Header />
      {error ? (<ErrorPanel message={error} />):(
        <>
        <BlueTitleCard
        title="Calculadora de Correção Monetária"
        subtitle="Calcule a correção de valores pelo IPCA de Dezembro de 1979 até dois meses antes da data atual."
      />
      <main
        className="bg-gray-50 flex flex-col items-center justify-center"
      >
        <Form
          title="Calculadora de Correção Monetária"
          subtitle={
            <div className="flex flex-col items-center space-y-2">
              <span>Utilize a fórmula de correção monetária para atualizar valores</span>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 mt-2">
                <div className="flex items-center justify-center space-x-2 text-blue-500 font-mono text-sm sm:text-base">
                  <span className="text-green-500">Valor Corrigido</span>
                  <span>=</span>
                  <span className="text-green-500">Valor Inicial</span>
                  <span>×</span>
                  <div className="flex flex-col items-center">
                    <span className="text-orange-500 text-xs border-b border-blue-300 px-1">IPCA Final</span>
                    <span className="text-purple-500 text-xs px-1">IPCA Inicial</span>
                  </div>
                </div>
              </div>
              <span className="text-xs text-blue-400 opacity-80">
                * Índices baseados no IBGE
              </span>
            </div>
          }
          onSubmit={handleSubmit}
          submitButtonText="Calcular Correção"
        >
          <div>
            {resultado.valor_corrigido > 0 && (
              <div className="text-justify flex flex-col">
                <p><strong>Valor Corrigido:</strong> R$ {resultado.valor_corrigido.toFixed(2)}</p>
                <p><strong>Taxa IPCA aproximada:</strong> {(resultado.indice_ipca_final/resultado.indice_ipca_inicial).toFixed(5)}%</p>
              </div>
            )}
          </div>
          <InputField
            id="valor"
            name="valor"
            type="number"
            label="Valor Original"
            placeholder="1000.00"
            required
            value={formData.valor}
            onChange={handleChange}
          />
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
            options={Array.from({ length: 47 }, (_, i) => {
              const year = anoAtual - i;
              return { value: year.toString(), label: year.toString() };
            })}
          />
          
          </InputGroup>
          

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
            options={Array.from({ length: 47 }, (_, i) => {
              const year = 2025 - i;
              return { value: year.toString(), label: year.toString() };
            })}
          />
        </InputGroup>
      </Form>
      </main>
      </>
      )}
      
      <Footer />
    </div>
  );
}
