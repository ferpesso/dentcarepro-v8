/**
 * Serviço de IA Financeira
 * DentCare PRO - Assistente Inteligente para Gestão Financeira
 * Usa Google Gemini API para análises e insights
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

// Inicializar Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

/**
 * Interface para dados financeiros
 */
interface DadosFinanceiros {
  receitas: any[];
  despesas: any[];
  contasPagar: any[];
  contasReceber: any[];
  comissoes: any[];
  periodo?: {
    inicio: string;
    fim: string;
  };
}

/**
 * Assistente Financeiro - Chatbot conversacional
 * Responde perguntas sobre finanças da clínica
 */
export async function assistenteFinanceiro(
  pergunta: string,
  dadosFinanceiros: DadosFinanceiros
): Promise<string> {
  try {
    const contexto = `
Você é um assistente financeiro especializado em clínicas odontológicas.
Você tem acesso aos seguintes dados financeiros da clínica:

RECEITAS (Faturas):
${JSON.stringify(dadosFinanceiros.receitas, null, 2)}

DESPESAS (Contas a Pagar):
${JSON.stringify(dadosFinanceiros.despesas, null, 2)}

CONTAS A PAGAR:
${JSON.stringify(dadosFinanceiros.contasPagar, null, 2)}

CONTAS A RECEBER:
${JSON.stringify(dadosFinanceiros.contasReceber, null, 2)}

COMISSÕES DOS DENTISTAS:
${JSON.stringify(dadosFinanceiros.comissoes, null, 2)}

PERÍODO: ${dadosFinanceiros.periodo?.inicio || 'Não especificado'} até ${dadosFinanceiros.periodo?.fim || 'Não especificado'}

INSTRUÇÕES:
1. Analise os dados fornecidos
2. Responda a pergunta do usuário de forma clara e objetiva
3. Use valores em euros (€) formatados corretamente
4. Se não houver dados suficientes, informe isso educadamente
5. Forneça insights adicionais quando relevante
6. Use linguagem profissional mas acessível
7. Seja conciso mas completo

PERGUNTA DO USUÁRIO:
${pergunta}
`;

    const result = await model.generateContent(contexto);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Erro no assistente financeiro:", error);
    return "Desculpe, ocorreu um erro ao processar sua pergunta. Por favor, tente novamente.";
  }
}

/**
 * Geração Automática de Insights
 * Analisa dados financeiros e gera relatório com insights inteligentes
 */
export async function gerarInsightsFinanceiros(
  dadosFinanceiros: DadosFinanceiros
): Promise<{
  resumo: string;
  insights: string[];
  alertas: string[];
  recomendacoes: string[];
  metricas: {
    receitaTotal: number;
    despesaTotal: number;
    lucroLiquido: number;
    margemLucro: number;
    ticketMedio: number;
  };
}> {
  try {
    const prompt = `
Você é um analista financeiro especializado em clínicas odontológicas.
Analise os dados financeiros abaixo e gere um relatório completo com insights acionáveis.

DADOS FINANCEIROS:

RECEITAS:
${JSON.stringify(dadosFinanceiros.receitas, null, 2)}

DESPESAS:
${JSON.stringify(dadosFinanceiros.despesas, null, 2)}

CONTAS A PAGAR:
${JSON.stringify(dadosFinanceiros.contasPagar, null, 2)}

CONTAS A RECEBER:
${JSON.stringify(dadosFinanceiros.contasReceber, null, 2)}

COMISSÕES:
${JSON.stringify(dadosFinanceiros.comissoes, null, 2)}

INSTRUÇÕES:
1. Calcule as principais métricas financeiras
2. Identifique tendências e padrões
3. Destaque pontos positivos e negativos
4. Gere alertas sobre problemas urgentes
5. Forneça recomendações práticas e acionáveis
6. Use linguagem profissional e objetiva

FORMATO DE RESPOSTA (JSON):
{
  "resumo": "Resumo executivo em 2-3 frases",
  "insights": ["Insight 1", "Insight 2", "Insight 3", ...],
  "alertas": ["Alerta 1", "Alerta 2", ...],
  "recomendacoes": ["Recomendação 1", "Recomendação 2", ...],
  "metricas": {
    "receitaTotal": 0,
    "despesaTotal": 0,
    "lucroLiquido": 0,
    "margemLucro": 0,
    "ticketMedio": 0
  }
}

IMPORTANTE: Retorne APENAS o JSON, sem texto adicional.
`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    // Extrair JSON da resposta
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // Fallback se não conseguir parsear
    return {
      resumo: "Análise financeira gerada com sucesso.",
      insights: ["Dados financeiros processados"],
      alertas: [],
      recomendacoes: ["Continue monitorando suas finanças"],
      metricas: {
        receitaTotal: 0,
        despesaTotal: 0,
        lucroLiquido: 0,
        margemLucro: 0,
        ticketMedio: 0,
      },
    };
  } catch (error) {
    console.error("Erro ao gerar insights:", error);
    throw new Error("Erro ao gerar insights financeiros");
  }
}

/**
 * Categorização Automática de Despesas
 * Sugere categoria para uma despesa baseado em descrição e histórico
 */
export async function categorizarDespesa(
  descricao: string,
  valor: number,
  fornecedor?: string,
  historicoCategorizacoes?: Array<{
    descricao: string;
    categoria: string;
    fornecedor?: string;
  }>
): Promise<{
  categoriaSugerida: string;
  confianca: number;
  explicacao: string;
}> {
  try {
    const prompt = `
Você é um especialista em categorização de despesas para clínicas odontológicas.

CATEGORIAS DISPONÍVEIS:
- Materiais Odontológicos
- Equipamentos
- Laboratório
- Aluguel
- Energia e Água
- Internet e Telefone
- Salários e Comissões
- Marketing
- Limpeza e Manutenção
- Impostos e Taxas
- Seguros
- Formação e Capacitação
- Outras Despesas

HISTÓRICO DE CATEGORIZAÇÕES:
${JSON.stringify(historicoCategorizacoes || [], null, 2)}

NOVA DESPESA:
Descrição: ${descricao}
Valor: €${valor}
Fornecedor: ${fornecedor || "Não informado"}

INSTRUÇÕES:
1. Analise a descrição e o histórico
2. Sugira a categoria mais apropriada
3. Indique o nível de confiança (0-100)
4. Explique brevemente o motivo

FORMATO DE RESPOSTA (JSON):
{
  "categoriaSugerida": "Nome da Categoria",
  "confianca": 85,
  "explicacao": "Breve explicação"
}

IMPORTANTE: Retorne APENAS o JSON, sem texto adicional.
`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    // Extrair JSON da resposta
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // Fallback
    return {
      categoriaSugerida: "Outras Despesas",
      confianca: 50,
      explicacao: "Categorização padrão aplicada",
    };
  } catch (error) {
    console.error("Erro ao categorizar despesa:", error);
    return {
      categoriaSugerida: "Outras Despesas",
      confianca: 0,
      explicacao: "Erro ao processar categorização",
    };
  }
}

/**
 * Análise de Tendências
 * Identifica tendências financeiras ao longo do tempo
 */
export async function analisarTendencias(
  dadosHistoricos: Array<{
    periodo: string;
    receitas: number;
    despesas: number;
    lucro: number;
  }>
): Promise<{
  tendenciaReceitas: "crescente" | "estavel" | "decrescente";
  tendenciaDespesas: "crescente" | "estavel" | "decrescente";
  tendenciaLucro: "crescente" | "estavel" | "decrescente";
  previsaoProximoMes: {
    receitas: number;
    despesas: number;
    lucro: number;
  };
  analise: string;
}> {
  try {
    const prompt = `
Você é um analista financeiro especializado em previsões e tendências.

DADOS HISTÓRICOS:
${JSON.stringify(dadosHistoricos, null, 2)}

INSTRUÇÕES:
1. Analise as tendências de receitas, despesas e lucro
2. Identifique se estão crescentes, estáveis ou decrescentes
3. Faça uma previsão para o próximo mês
4. Forneça uma análise detalhada

FORMATO DE RESPOSTA (JSON):
{
  "tendenciaReceitas": "crescente" | "estavel" | "decrescente",
  "tendenciaDespesas": "crescente" | "estavel" | "decrescente",
  "tendenciaLucro": "crescente" | "estavel" | "decrescente",
  "previsaoProximoMes": {
    "receitas": 0,
    "despesas": 0,
    "lucro": 0
  },
  "analise": "Análise detalhada das tendências"
}

IMPORTANTE: Retorne APENAS o JSON, sem texto adicional.
`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    // Extrair JSON da resposta
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // Fallback
    return {
      tendenciaReceitas: "estavel",
      tendenciaDespesas: "estavel",
      tendenciaLucro: "estavel",
      previsaoProximoMes: {
        receitas: 0,
        despesas: 0,
        lucro: 0,
      },
      analise: "Dados insuficientes para análise de tendências",
    };
  } catch (error) {
    console.error("Erro ao analisar tendências:", error);
    throw new Error("Erro ao analisar tendências");
  }
}

/**
 * Sugestões de Economia
 * Identifica oportunidades de redução de custos
 */
export async function sugerirEconomias(
  despesas: any[],
  periodo: { inicio: string; fim: string }
): Promise<{
  economiasPossiveis: Array<{
    categoria: string;
    valorAtual: number;
    economiaEstimada: number;
    sugestao: string;
  }>;
  totalEconomia: number;
}> {
  try {
    const prompt = `
Você é um consultor financeiro especializado em otimização de custos para clínicas odontológicas.

DESPESAS DO PERÍODO (${periodo.inicio} até ${periodo.fim}):
${JSON.stringify(despesas, null, 2)}

INSTRUÇÕES:
1. Analise as despesas e identifique oportunidades de economia
2. Sugira ações práticas para reduzir custos
3. Estime o valor de economia possível
4. Priorize sugestões realistas e acionáveis

FORMATO DE RESPOSTA (JSON):
{
  "economiasPossiveis": [
    {
      "categoria": "Nome da Categoria",
      "valorAtual": 1000,
      "economiaEstimada": 150,
      "sugestao": "Descrição da sugestão"
    }
  ],
  "totalEconomia": 0
}

IMPORTANTE: Retorne APENAS o JSON, sem texto adicional.
`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    // Extrair JSON da resposta
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // Fallback
    return {
      economiasPossiveis: [],
      totalEconomia: 0,
    };
  } catch (error) {
    console.error("Erro ao sugerir economias:", error);
    throw new Error("Erro ao sugerir economias");
  }
}

