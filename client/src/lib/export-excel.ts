/**
 * Utilitário de Exportação Excel
 * DentCare PRO v8
 */

import * as XLSX from "xlsx";

// Formatar data para português
const formatarData = (data: string | Date): string => {
  const d = typeof data === "string" ? new Date(data) : data;
  return d.toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// Formatar moeda
const formatarMoeda = (valor: number): string => {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
  }).format(valor);
};

/**
 * Exportar Relatório do Dentista para Excel
 */
export const exportarRelatorioDentistaExcel = (dados: {
  dentistaNome: string;
  periodo: { inicio: string; fim: string };
  procedimentos: Array<{
    data: string;
    utente: string;
    tipo: string;
    valor: number;
  }>;
  comissoes: Array<{
    data: string;
    fatura: string;
    valor: number;
    percentagem: number;
    status: string;
  }>;
  estatisticas: {
    totalProcedimentos: number;
    totalFaturacao: number;
    totalComissoes: number;
    comissoesPagas: number;
    comissoesPendentes: number;
    ticketMedio: number;
  };
}) => {
  // Criar workbook
  const wb = XLSX.utils.book_new();

  // ========================================
  // ABA 1: Resumo
  // ========================================

  const resumoData = [
    ["DentCare PRO - Relatório do Dentista"],
    [],
    ["Dentista:", dados.dentistaNome],
    ["Período:", `${formatarData(dados.periodo.inicio)} a ${formatarData(dados.periodo.fim)}`],
    ["Data de Emissão:", formatarData(new Date())],
    [],
    ["RESUMO ESTATÍSTICO"],
    ["Métrica", "Valor"],
    ["Total de Procedimentos", dados.estatisticas.totalProcedimentos],
    ["Faturação Total", formatarMoeda(dados.estatisticas.totalFaturacao)],
    ["Total de Comissões", formatarMoeda(dados.estatisticas.totalComissoes)],
    ["Comissões Pagas", formatarMoeda(dados.estatisticas.comissoesPagas)],
    ["Comissões Pendentes", formatarMoeda(dados.estatisticas.comissoesPendentes)],
    ["Ticket Médio", formatarMoeda(dados.estatisticas.ticketMedio)],
  ];

  const wsResumo = XLSX.utils.aoa_to_sheet(resumoData);

  // Estilizar cabeçalho
  wsResumo["!cols"] = [{ wch: 30 }, { wch: 30 }];

  XLSX.utils.book_append_sheet(wb, wsResumo, "Resumo");

  // ========================================
  // ABA 2: Procedimentos
  // ========================================

  const procedimentosData = [
    ["PROCEDIMENTOS REALIZADOS"],
    [],
    ["Data", "Utente", "Tipo", "Valor"],
    ...dados.procedimentos.map((p) => [
      formatarData(p.data),
      p.utente,
      p.tipo,
      p.valor,
    ]),
    [],
    ["TOTAL", "", "", dados.estatisticas.totalFaturacao],
  ];

  const wsProcedimentos = XLSX.utils.aoa_to_sheet(procedimentosData);

  // Configurar colunas
  wsProcedimentos["!cols"] = [
    { wch: 12 },
    { wch: 30 },
    { wch: 25 },
    { wch: 15 },
  ];

  XLSX.utils.book_append_sheet(wb, wsProcedimentos, "Procedimentos");

  // ========================================
  // ABA 3: Comissões
  // ========================================

  const comissoesData = [
    ["COMISSÕES"],
    [],
    ["Data", "Fatura", "Percentagem", "Valor", "Status"],
    ...dados.comissoes.map((c) => [
      formatarData(c.data),
      c.fatura,
      `${c.percentagem}%`,
      c.valor,
      c.status,
    ]),
    [],
    ["TOTAL", "", "", dados.estatisticas.totalComissoes, ""],
  ];

  const wsComissoes = XLSX.utils.aoa_to_sheet(comissoesData);

  // Configurar colunas
  wsComissoes["!cols"] = [
    { wch: 12 },
    { wch: 20 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
  ];

  XLSX.utils.book_append_sheet(wb, wsComissoes, "Comissões");

  // Salvar arquivo
  const nomeArquivo = `relatorio_dentista_${dados.dentistaNome.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.xlsx`;
  XLSX.writeFile(wb, nomeArquivo);
};

/**
 * Exportar Relatório da Clínica para Excel
 */
export const exportarRelatorioClinicaExcel = (dados: {
  periodo: { inicio: string; fim: string };
  financeiro: {
    faturacaoTotal: number;
    custosTotais: number;
    lucroBruto: number;
    lucroLiquido: number;
    margemLucro: number;
  };
  custos: Array<{
    categoria: string;
    valor: number;
    percentagem: number;
  }>;
  dentistas: Array<{
    nome: string;
    procedimentos: number;
    faturacao: number;
    comissoes: number;
  }>;
  procedimentos: Array<{
    tipo: string;
    quantidade: number;
    faturacao: number;
  }>;
}) => {
  // Criar workbook
  const wb = XLSX.utils.book_new();

  // ========================================
  // ABA 1: Resumo Financeiro
  // ========================================

  const resumoData = [
    ["DentCare PRO - Relatório da Clínica"],
    [],
    ["Período:", `${formatarData(dados.periodo.inicio)} a ${formatarData(dados.periodo.fim)}`],
    ["Data de Emissão:", formatarData(new Date())],
    [],
    ["RESUMO FINANCEIRO"],
    ["Métrica", "Valor"],
    ["Faturação Total", formatarMoeda(dados.financeiro.faturacaoTotal)],
    ["Custos Totais", formatarMoeda(dados.financeiro.custosTotais)],
    ["Lucro Bruto", formatarMoeda(dados.financeiro.lucroBruto)],
    ["Lucro Líquido", formatarMoeda(dados.financeiro.lucroLiquido)],
    ["Margem de Lucro", `${dados.financeiro.margemLucro.toFixed(1)}%`],
  ];

  const wsResumo = XLSX.utils.aoa_to_sheet(resumoData);
  wsResumo["!cols"] = [{ wch: 30 }, { wch: 30 }];

  XLSX.utils.book_append_sheet(wb, wsResumo, "Resumo Financeiro");

  // ========================================
  // ABA 2: Detalhamento de Custos
  // ========================================

  const custosData = [
    ["DETALHAMENTO DE CUSTOS"],
    [],
    ["Categoria", "Valor", "% do Total"],
    ...dados.custos.map((c) => [
      c.categoria,
      c.valor,
      `${c.percentagem.toFixed(1)}%`,
    ]),
    [],
    ["TOTAL", dados.financeiro.custosTotais, "100.0%"],
  ];

  const wsCustos = XLSX.utils.aoa_to_sheet(custosData);
  wsCustos["!cols"] = [{ wch: 25 }, { wch: 15 }, { wch: 15 }];

  XLSX.utils.book_append_sheet(wb, wsCustos, "Custos");

  // ========================================
  // ABA 3: Performance por Dentista
  // ========================================

  const dentistasData = [
    ["PERFORMANCE POR DENTISTA"],
    [],
    ["Dentista", "Procedimentos", "Faturação", "Comissões"],
    ...dados.dentistas.map((d) => [
      d.nome,
      d.procedimentos,
      d.faturacao,
      d.comissoes,
    ]),
    [],
    [
      "TOTAL",
      dados.dentistas.reduce((sum, d) => sum + d.procedimentos, 0),
      dados.dentistas.reduce((sum, d) => sum + d.faturacao, 0),
      dados.dentistas.reduce((sum, d) => sum + d.comissoes, 0),
    ],
  ];

  const wsDentistas = XLSX.utils.aoa_to_sheet(dentistasData);
  wsDentistas["!cols"] = [
    { wch: 30 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
  ];

  XLSX.utils.book_append_sheet(wb, wsDentistas, "Dentistas");

  // ========================================
  // ABA 4: Faturação por Procedimento
  // ========================================

  const procedimentosData = [
    ["FATURAÇÃO POR PROCEDIMENTO"],
    [],
    ["Tipo", "Quantidade", "Faturação"],
    ...dados.procedimentos.map((p) => [p.tipo, p.quantidade, p.faturacao]),
    [],
    [
      "TOTAL",
      dados.procedimentos.reduce((sum, p) => sum + p.quantidade, 0),
      dados.procedimentos.reduce((sum, p) => sum + p.faturacao, 0),
    ],
  ];

  const wsProcedimentos = XLSX.utils.aoa_to_sheet(procedimentosData);
  wsProcedimentos["!cols"] = [{ wch: 30 }, { wch: 15 }, { wch: 15 }];

  XLSX.utils.book_append_sheet(wb, wsProcedimentos, "Procedimentos");

  // Salvar arquivo
  const nomeArquivo = `relatorio_clinica_${new Date().toISOString().split("T")[0]}.xlsx`;
  XLSX.writeFile(wb, nomeArquivo);
};

/**
 * Exportar Histórico do Utente para Excel
 */
export const exportarHistoricoExcel = (dados: {
  utenteNome: string;
  utenteNif: string;
  eventos: Array<{
    data: string;
    tipo: string;
    titulo: string;
    descricao: string;
    valor?: number;
    dentistaNome?: string;
  }>;
}) => {
  // Criar workbook
  const wb = XLSX.utils.book_new();

  // ========================================
  // ABA 1: Informações do Utente
  // ========================================

  const infoData = [
    ["DentCare PRO - Histórico do Utente"],
    [],
    ["Utente:", dados.utenteNome],
    ["NIF:", dados.utenteNif],
    ["Data de Emissão:", formatarData(new Date())],
    [],
    ["Total de Eventos:", dados.eventos.length],
  ];

  const wsInfo = XLSX.utils.aoa_to_sheet(infoData);
  wsInfo["!cols"] = [{ wch: 30 }, { wch: 30 }];

  XLSX.utils.book_append_sheet(wb, wsInfo, "Informações");

  // ========================================
  // ABA 2: Histórico Completo
  // ========================================

  const eventosData = [
    ["HISTÓRICO COMPLETO"],
    [],
    ["Data", "Tipo", "Título", "Descrição", "Dentista", "Valor"],
    ...dados.eventos.map((e) => [
      formatarData(e.data),
      e.tipo,
      e.titulo,
      e.descricao,
      e.dentistaNome || "-",
      e.valor || "-",
    ]),
  ];

  const wsEventos = XLSX.utils.aoa_to_sheet(eventosData);
  wsEventos["!cols"] = [
    { wch: 12 },
    { wch: 15 },
    { wch: 30 },
    { wch: 50 },
    { wch: 25 },
    { wch: 15 },
  ];

  XLSX.utils.book_append_sheet(wb, wsEventos, "Histórico");

  // ========================================
  // ABA 3: Resumo por Tipo
  // ========================================

  // Contar eventos por tipo
  const tipoCount: Record<string, number> = {};
  dados.eventos.forEach((e) => {
    tipoCount[e.tipo] = (tipoCount[e.tipo] || 0) + 1;
  });

  const resumoTipoData = [
    ["RESUMO POR TIPO DE EVENTO"],
    [],
    ["Tipo", "Quantidade"],
    ...Object.entries(tipoCount).map(([tipo, count]) => [tipo, count]),
  ];

  const wsResumoTipo = XLSX.utils.aoa_to_sheet(resumoTipoData);
  wsResumoTipo["!cols"] = [{ wch: 20 }, { wch: 15 }];

  XLSX.utils.book_append_sheet(wb, wsResumoTipo, "Resumo por Tipo");

  // Salvar arquivo
  const nomeArquivo = `historico_${dados.utenteNome.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.xlsx`;
  XLSX.writeFile(wb, nomeArquivo);
};

/**
 * Exportar dados genéricos para Excel
 */
export const exportarParaExcel = (
  dados: any[][],
  nomeArquivo: string,
  nomeAba: string = "Dados"
) => {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(dados);
  XLSX.utils.book_append_sheet(wb, ws, nomeAba);
  XLSX.writeFile(wb, `${nomeArquivo}.xlsx`);
};
