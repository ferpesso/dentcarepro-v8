/**
 * Utilitário de Exportação PDF
 * DentCare PRO v8
 */

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Configuração de fonte para suportar caracteres portugueses
const configurarFonte = (doc: jsPDF) => {
  // jsPDF já suporta caracteres UTF-8 por padrão
  doc.setFont("helvetica");
};

// Formatar data para português
const formatarData = (data: string | Date): string => {
  const d = typeof data === "string" ? new Date(data) : data;
  return d.toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "long",
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
 * Exportar Relatório do Dentista para PDF
 */
export const exportarRelatorioDentistaPDF = (dados: {
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
  const doc = new jsPDF();
  configurarFonte(doc);

  let yPos = 20;

  // Cabeçalho
  doc.setFontSize(20);
  doc.setTextColor(37, 99, 235); // blue-600
  doc.text("DentCare PRO", 20, yPos);

  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  yPos += 10;
  doc.text("Relatório do Dentista", 20, yPos);

  // Informações do dentista
  doc.setFontSize(12);
  yPos += 10;
  doc.text(`Dentista: ${dados.dentistaNome}`, 20, yPos);
  yPos += 7;
  doc.text(
    `Período: ${formatarData(dados.periodo.inicio)} a ${formatarData(dados.periodo.fim)}`,
    20,
    yPos
  );
  yPos += 7;
  doc.text(`Data de Emissão: ${formatarData(new Date())}`, 20, yPos);

  // Linha separadora
  yPos += 5;
  doc.setDrawColor(200, 200, 200);
  doc.line(20, yPos, 190, yPos);
  yPos += 10;

  // Resumo Estatístico
  doc.setFontSize(14);
  doc.setTextColor(37, 99, 235);
  doc.text("Resumo Estatístico", 20, yPos);
  yPos += 10;

  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);

  const estatisticas = [
    ["Total de Procedimentos", dados.estatisticas.totalProcedimentos.toString()],
    ["Faturação Total", formatarMoeda(dados.estatisticas.totalFaturacao)],
    ["Total de Comissões", formatarMoeda(dados.estatisticas.totalComissoes)],
    ["Comissões Pagas", formatarMoeda(dados.estatisticas.comissoesPagas)],
    ["Comissões Pendentes", formatarMoeda(dados.estatisticas.comissoesPendentes)],
    ["Ticket Médio", formatarMoeda(dados.estatisticas.ticketMedio)],
  ];

  autoTable(doc, {
    startY: yPos,
    head: [["Métrica", "Valor"]],
    body: estatisticas,
    theme: "striped",
    headStyles: { fillColor: [37, 99, 235] },
    margin: { left: 20, right: 20 },
  });

  yPos = (doc as any).lastAutoTable.finalY + 15;

  // Nova página se necessário
  if (yPos > 250) {
    doc.addPage();
    yPos = 20;
  }

  // Procedimentos Realizados
  doc.setFontSize(14);
  doc.setTextColor(37, 99, 235);
  doc.text("Procedimentos Realizados", 20, yPos);
  yPos += 10;

  const procedimentosData = dados.procedimentos.map((p) => [
    formatarData(p.data),
    p.utente,
    p.tipo,
    formatarMoeda(p.valor),
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [["Data", "Utente", "Tipo", "Valor"]],
    body: procedimentosData,
    theme: "striped",
    headStyles: { fillColor: [37, 99, 235] },
    margin: { left: 20, right: 20 },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 60 },
      2: { cellWidth: 50 },
      3: { cellWidth: 30, halign: "right" },
    },
  });

  yPos = (doc as any).lastAutoTable.finalY + 15;

  // Nova página se necessário
  if (yPos > 250) {
    doc.addPage();
    yPos = 20;
  }

  // Comissões
  doc.setFontSize(14);
  doc.setTextColor(37, 99, 235);
  doc.text("Comissões", 20, yPos);
  yPos += 10;

  const comissoesData = dados.comissoes.map((c) => [
    formatarData(c.data),
    c.fatura,
    `${c.percentagem}%`,
    formatarMoeda(c.valor),
    c.status,
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [["Data", "Fatura", "%", "Valor", "Status"]],
    body: comissoesData,
    theme: "striped",
    headStyles: { fillColor: [37, 99, 235] },
    margin: { left: 20, right: 20 },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 40 },
      2: { cellWidth: 20, halign: "center" },
      3: { cellWidth: 30, halign: "right" },
      4: { cellWidth: 30 },
    },
  });

  // Rodapé
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Página ${i} de ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
  }

  // Salvar
  const nomeArquivo = `relatorio_dentista_${dados.dentistaNome.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`;
  doc.save(nomeArquivo);
};

/**
 * Exportar Relatório da Clínica para PDF
 */
export const exportarRelatorioClinicaPDF = (dados: {
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
  const doc = new jsPDF();
  configurarFonte(doc);

  let yPos = 20;

  // Cabeçalho
  doc.setFontSize(20);
  doc.setTextColor(37, 99, 235);
  doc.text("DentCare PRO", 20, yPos);

  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  yPos += 10;
  doc.text("Relatório da Clínica", 20, yPos);

  // Período
  doc.setFontSize(12);
  yPos += 10;
  doc.text(
    `Período: ${formatarData(dados.periodo.inicio)} a ${formatarData(dados.periodo.fim)}`,
    20,
    yPos
  );
  yPos += 7;
  doc.text(`Data de Emissão: ${formatarData(new Date())}`, 20, yPos);

  // Linha separadora
  yPos += 5;
  doc.setDrawColor(200, 200, 200);
  doc.line(20, yPos, 190, yPos);
  yPos += 10;

  // Resumo Financeiro
  doc.setFontSize(14);
  doc.setTextColor(37, 99, 235);
  doc.text("Resumo Financeiro", 20, yPos);
  yPos += 10;

  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);

  const financeiro = [
    ["Faturação Total", formatarMoeda(dados.financeiro.faturacaoTotal)],
    ["Custos Totais", formatarMoeda(dados.financeiro.custosTotais)],
    ["Lucro Bruto", formatarMoeda(dados.financeiro.lucroBruto)],
    ["Lucro Líquido", formatarMoeda(dados.financeiro.lucroLiquido)],
    ["Margem de Lucro", `${dados.financeiro.margemLucro.toFixed(1)}%`],
  ];

  autoTable(doc, {
    startY: yPos,
    head: [["Métrica", "Valor"]],
    body: financeiro,
    theme: "striped",
    headStyles: { fillColor: [37, 99, 235] },
    margin: { left: 20, right: 20 },
  });

  yPos = (doc as any).lastAutoTable.finalY + 15;

  // Detalhamento de Custos
  doc.setFontSize(14);
  doc.setTextColor(37, 99, 235);
  doc.text("Detalhamento de Custos", 20, yPos);
  yPos += 10;

  const custosData = dados.custos.map((c) => [
    c.categoria,
    formatarMoeda(c.valor),
    `${c.percentagem.toFixed(1)}%`,
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [["Categoria", "Valor", "% do Total"]],
    body: custosData,
    theme: "striped",
    headStyles: { fillColor: [37, 99, 235] },
    margin: { left: 20, right: 20 },
    columnStyles: {
      1: { halign: "right" },
      2: { halign: "center" },
    },
  });

  yPos = (doc as any).lastAutoTable.finalY + 15;

  // Nova página se necessário
  if (yPos > 250) {
    doc.addPage();
    yPos = 20;
  }

  // Performance por Dentista
  doc.setFontSize(14);
  doc.setTextColor(37, 99, 235);
  doc.text("Performance por Dentista", 20, yPos);
  yPos += 10;

  const dentistasData = dados.dentistas.map((d) => [
    d.nome,
    d.procedimentos.toString(),
    formatarMoeda(d.faturacao),
    formatarMoeda(d.comissoes),
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [["Dentista", "Procedimentos", "Faturação", "Comissões"]],
    body: dentistasData,
    theme: "striped",
    headStyles: { fillColor: [37, 99, 235] },
    margin: { left: 20, right: 20 },
    columnStyles: {
      1: { halign: "center" },
      2: { halign: "right" },
      3: { halign: "right" },
    },
  });

  yPos = (doc as any).lastAutoTable.finalY + 15;

  // Nova página se necessário
  if (yPos > 250) {
    doc.addPage();
    yPos = 20;
  }

  // Faturação por Procedimento
  doc.setFontSize(14);
  doc.setTextColor(37, 99, 235);
  doc.text("Faturação por Procedimento", 20, yPos);
  yPos += 10;

  const procedimentosData = dados.procedimentos.map((p) => [
    p.tipo,
    p.quantidade.toString(),
    formatarMoeda(p.faturacao),
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [["Tipo", "Quantidade", "Faturação"]],
    body: procedimentosData,
    theme: "striped",
    headStyles: { fillColor: [37, 99, 235] },
    margin: { left: 20, right: 20 },
    columnStyles: {
      1: { halign: "center" },
      2: { halign: "right" },
    },
  });

  // Rodapé
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Página ${i} de ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
  }

  // Salvar
  const nomeArquivo = `relatorio_clinica_${new Date().toISOString().split("T")[0]}.pdf`;
  doc.save(nomeArquivo);
};

/**
 * Exportar Histórico do Utente para PDF
 */
export const exportarHistoricoPDF = (dados: {
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
  const doc = new jsPDF();
  configurarFonte(doc);

  let yPos = 20;

  // Cabeçalho
  doc.setFontSize(20);
  doc.setTextColor(37, 99, 235);
  doc.text("DentCare PRO", 20, yPos);

  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  yPos += 10;
  doc.text("Histórico do Utente", 20, yPos);

  // Informações do utente
  doc.setFontSize(12);
  yPos += 10;
  doc.text(`Utente: ${dados.utenteNome}`, 20, yPos);
  yPos += 7;
  doc.text(`NIF: ${dados.utenteNif}`, 20, yPos);
  yPos += 7;
  doc.text(`Data de Emissão: ${formatarData(new Date())}`, 20, yPos);

  // Linha separadora
  yPos += 5;
  doc.setDrawColor(200, 200, 200);
  doc.line(20, yPos, 190, yPos);
  yPos += 10;

  // Eventos
  doc.setFontSize(14);
  doc.setTextColor(37, 99, 235);
  doc.text("Eventos", 20, yPos);
  yPos += 10;

  const eventosData = dados.eventos.map((e) => [
    formatarData(e.data),
    e.tipo,
    e.titulo,
    e.dentistaNome || "-",
    e.valor ? formatarMoeda(e.valor) : "-",
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [["Data", "Tipo", "Título", "Dentista", "Valor"]],
    body: eventosData,
    theme: "striped",
    headStyles: { fillColor: [37, 99, 235] },
    margin: { left: 20, right: 20 },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 30 },
      2: { cellWidth: 60 },
      3: { cellWidth: 35 },
      4: { cellWidth: 25, halign: "right" },
    },
  });

  // Rodapé
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Página ${i} de ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
  }

  // Salvar
  const nomeArquivo = `historico_${dados.utenteNome.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`;
  doc.save(nomeArquivo);
};
