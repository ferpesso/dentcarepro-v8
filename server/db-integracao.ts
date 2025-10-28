// @ts-nocheck
/**
 * Funções de Banco de Dados para Integração
 * DentCare PRO v8
 */

import { db } from "./db";
import type {
  ProcedimentoClinico,
  InsertProcedimentoClinico,
  HistoricoUtente,
  InsertHistoricoUtente,
  TabelaPreco,
  InsertTabelaPreco,
  Fatura,
  InsertFatura,
  Comissao,
  InsertComissao,
  ConfigComissao,
  InsertConfigComissao,
} from "../drizzle/schema-integracao";

// ========================================
// PROCEDIMENTOS CLÍNICOS
// ========================================

/**
 * Criar procedimento clínico
 */
export async function criarProcedimento(dados: InsertProcedimentoClinico): Promise<ProcedimentoClinico> {
  const id = `proc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const procedimento = {
    ...dados,
    id,
    faturado: 0,
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
  };
  
  // Inserir no banco
  // await db.insert(procedimentosClinicos).values(procedimento);
  
  // Registar no histórico do utente
  await registarEventoHistorico({
    utenteId: dados.utenteId,
    tipo: "procedimento",
    titulo: `Procedimento: ${dados.descricao}`,
    descricao: dados.observacoes || dados.descricao,
    data: dados.data,
    procedimentoId: id,
    valor: parseFloat(dados.valorProcedimento.toString()),
    dentistaId: dados.dentistaId,
    icone: "Stethoscope",
    cor: "blue",
  });
  
  return procedimento as ProcedimentoClinico;
}

/**
 * Listar procedimentos de um utente
 */
export async function listarProcedimentosUtente(utenteId: string): Promise<ProcedimentoClinico[]> {
  // return await db.query.procedimentosClinicos.findMany({
  //   where: (proc, { eq }) => eq(proc.utenteId, utenteId),
  //   orderBy: (proc, { desc }) => [desc(proc.data)],
  // });
  return [];
}

/**
 * Listar procedimentos de um dentista
 */
export async function listarProcedimentosDentista(
  dentistaId: string,
  dataInicio?: string,
  dataFim?: string
): Promise<ProcedimentoClinico[]> {
  // Implementar filtros de data
  return [];
}

/**
 * Marcar procedimento como faturado
 */
export async function marcarProcedimentoFaturado(procedimentoId: string, faturaId: string): Promise<void> {
  // await db.update(procedimentosClinicos)
  //   .set({ faturado: 1, faturaId, atualizadoEm: new Date().toISOString() })
  //   .where(eq(procedimentosClinicos.id, procedimentoId));
}

// ========================================
// HISTÓRICO UNIFICADO
// ========================================

/**
 * Registar evento no histórico do utente
 */
export async function registarEventoHistorico(dados: Omit<InsertHistoricoUtente, "id" | "criadoEm">): Promise<HistoricoUtente> {
  const id = `hist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const evento = {
    ...dados,
    id,
    criadoEm: new Date().toISOString(),
  };
  
  // await db.insert(historicoUtente).values(evento);
  
  return evento as HistoricoUtente;
}

/**
 * Obter histórico completo de um utente
 */
export async function obterHistoricoUtente(utenteId: string, limite?: number): Promise<HistoricoUtente[]> {
  // return await db.query.historicoUtente.findMany({
  //   where: (hist, { eq }) => eq(hist.utenteId, utenteId),
  //   orderBy: (hist, { desc }) => [desc(hist.data), desc(hist.criadoEm)],
  //   limit: limite || 100,
  // });
  return [];
}

// ========================================
// TABELA DE PREÇOS
// ========================================

/**
 * Criar/Atualizar preço na tabela
 */
export async function salvarPreco(dados: InsertTabelaPreco): Promise<TabelaPreco> {
  const id = dados.id || `preco-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const preco = {
    ...dados,
    id,
    ativo: dados.ativo ?? 1,
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
  };
  
  // await db.insert(tabelaPrecos).values(preco)
  //   .onDuplicateKeyUpdate({ set: preco });
  
  return preco as TabelaPreco;
}

/**
 * Buscar preço por código
 */
export async function buscarPrecoPorCodigo(codigo: string): Promise<TabelaPreco | null> {
  // return await db.query.tabelaPrecos.findFirst({
  //   where: (preco, { eq, and }) => and(
  //     eq(preco.codigo, codigo),
  //     eq(preco.ativo, 1)
  //   ),
  // });
  return null;
}

/**
 * Listar todos os preços ativos
 */
export async function listarPrecos(categoria?: string): Promise<TabelaPreco[]> {
  // if (categoria) {
  //   return await db.query.tabelaPrecos.findMany({
  //     where: (preco, { eq, and }) => and(
  //       eq(preco.categoria, categoria),
  //       eq(preco.ativo, 1)
  //     ),
  //   });
  // }
  // return await db.query.tabelaPrecos.findMany({
  //   where: (preco, { eq }) => eq(preco.ativo, 1),
  // });
  return [];
}

// ========================================
// FATURAÇÃO AUTOMÁTICA
// ========================================

/**
 * Gerar fatura automaticamente a partir de procedimentos
 */
export async function gerarFaturaAutomatica(dados: {
  utenteId: string;
  utenteNome: string;
  utenteNif?: string;
  utenteMorada?: string;
  dentistaId: string;
  dentistaNome: string;
  consultaId?: string;
  procedimentos: ProcedimentoClinico[];
  dataVencimento: string;
}): Promise<Fatura> {
  const id = `fat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const numero = await gerarNumeroFatura();
  
  // Converter procedimentos em itens de fatura
  const itens = dados.procedimentos.map((proc) => ({
    id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    descricao: proc.descricao,
    quantidade: 1,
    precoUnitario: parseFloat(proc.valorProcedimento.toString()),
    desconto: 0,
    iva: 23,
    total: parseFloat(proc.valorProcedimento.toString()) * 1.23,
    categoria: proc.tipo,
  }));
  
  // Calcular totais
  const subtotal = itens.reduce((sum, item) => sum + item.precoUnitario * item.quantidade, 0);
  const descontoTotal = 0;
  const ivaTotal = subtotal * 0.23;
  const total = subtotal + ivaTotal;
  
  // Obter configuração de comissão do dentista
  const configComissao = await obterConfigComissao(dados.dentistaId);
  let dentistaComissao = 0;
  let dentistaPercentagem = 0;
  
  if (configComissao) {
    if (configComissao.tipo === "percentagem") {
      dentistaPercentagem = parseFloat(configComissao.percentagem?.toString() || "0");
      dentistaComissao = total * (dentistaPercentagem / 100);
    } else if (configComissao.tipo === "fixo") {
      dentistaComissao = parseFloat(configComissao.valorFixo?.toString() || "0");
    } else if (configComissao.tipo === "misto") {
      dentistaPercentagem = parseFloat(configComissao.percentagem?.toString() || "0");
      dentistaComissao = (total * (dentistaPercentagem / 100)) + parseFloat(configComissao.valorFixo?.toString() || "0");
    }
    
    // Aplicar limites
    if (configComissao.valorMinimo && dentistaComissao < parseFloat(configComissao.valorMinimo.toString())) {
      dentistaComissao = parseFloat(configComissao.valorMinimo.toString());
    }
    if (configComissao.valorMaximo && dentistaComissao > parseFloat(configComissao.valorMaximo.toString())) {
      dentistaComissao = parseFloat(configComissao.valorMaximo.toString());
    }
  }
  
  const valorClinica = total - dentistaComissao;
  
  const fatura: InsertFatura = {
    id,
    numero,
    serie: "FT",
    tipo: "fatura",
    data: new Date().toISOString().split("T")[0],
    dataVencimento: dados.dataVencimento,
    utenteId: dados.utenteId,
    utenteNome: dados.utenteNome,
    utenteNif: dados.utenteNif,
    utenteMorada: dados.utenteMorada,
    dentistaId: dados.dentistaId,
    dentistaNome: dados.dentistaNome,
    dentistaPercentagem: dentistaPercentagem.toString(),
    dentistaComissao: dentistaComissao.toString(),
    consultaId: dados.consultaId,
    itens: JSON.stringify(itens),
    subtotal: subtotal.toString(),
    descontoTotal: descontoTotal.toString(),
    ivaTotal: ivaTotal.toString(),
    total: total.toString(),
    valorClinica: valorClinica.toString(),
    estado: "pendente",
    pagamentos: JSON.stringify([]),
    valorPago: "0",
    valorEmDivida: total.toString(),
    criadoPor: dados.dentistaId,
  };
  
  // await db.insert(faturas).values(fatura);
  
  // Marcar procedimentos como faturados
  for (const proc of dados.procedimentos) {
    await marcarProcedimentoFaturado(proc.id, id);
  }
  
  // Registar no histórico
  await registarEventoHistorico({
    utenteId: dados.utenteId,
    tipo: "fatura",
    titulo: `Fatura ${numero} emitida`,
    descricao: `Fatura no valor de €${total.toFixed(2)}`,
    data: fatura.data,
    faturaId: id,
    valor: total,
    dentistaId: dados.dentistaId,
    dentistaNome: dados.dentistaNome,
    icone: "FileText",
    cor: "green",
  });
  
  return fatura as Fatura;
}

/**
 * Gerar número de fatura sequencial
 */
let proximoNumero = 1;
async function gerarNumeroFatura(): Promise<string> {
  const ano = new Date().getFullYear();
  const numero = String(proximoNumero).padStart(4, "0");
  proximoNumero++;
  return `${ano}/${numero}`;
}

// ========================================
// COMISSÕES
// ========================================

/**
 * Criar comissão automaticamente
 */
export async function criarComissaoAutomatica(dados: {
  dentistaId: string;
  faturaId: string;
  valor: number;
  percentagem?: number;
  procedimentoId?: string;
}): Promise<Comissao> {
  const id = `com-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const mes = new Date().toISOString().slice(0, 7); // YYYY-MM
  
  const comissao: InsertComissao = {
    id,
    dentistaId: dados.dentistaId,
    faturaId: dados.faturaId,
    procedimentoId: dados.procedimentoId,
    valor: dados.valor.toString(),
    percentagem: dados.percentagem?.toString(),
    mes,
    status: "pendente",
    observacoes: `Comissão automática - Fatura ${dados.faturaId}`,
  };
  
  // await db.insert(comissoes).values(comissao);
  
  return comissao as Comissao;
}

/**
 * Listar comissões de um dentista
 */
export async function listarComissoesDentista(
  dentistaId: string,
  mes?: string,
  status?: string
): Promise<Comissao[]> {
  // Implementar filtros
  return [];
}

/**
 * Marcar comissão como paga
 */
export async function pagarComissao(
  comissaoId: string,
  formaPagamento: string,
  referencia?: string
): Promise<void> {
  // await db.update(comissoes)
  //   .set({
  //     status: "pago",
  //     dataPagamento: new Date().toISOString().split("T")[0],
  //     formaPagamento,
  //     referencia,
  //     atualizadoEm: new Date().toISOString(),
  //   })
  //   .where(eq(comissoes.id, comissaoId));
}

/**
 * Obter configuração de comissão do dentista
 */
export async function obterConfigComissao(dentistaId: string): Promise<ConfigComissao | null> {
  // return await db.query.configComissoes.findFirst({
  //   where: (config, { eq }) => eq(config.dentistaId, dentistaId),
  // });
  
  // Mock para desenvolvimento
  return {
    id: "config-1",
    dentistaId,
    tipo: "percentagem",
    percentagem: "30",
    valorFixo: null,
    valorMinimo: null,
    valorMaximo: null,
    observacoes: null,
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
  } as ConfigComissao;
}

/**
 * Salvar configuração de comissão
 */
export async function salvarConfigComissao(dados: Omit<InsertConfigComissao, "id">): Promise<ConfigComissao> {
  const id = `config-${dados.dentistaId}`;
  
  const config = {
    ...dados,
    id,
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
  };
  
  // await db.insert(configComissoes).values(config)
  //   .onDuplicateKeyUpdate({ set: config });
  
  return config as ConfigComissao;
}

// ========================================
// RELATÓRIOS
// ========================================

/**
 * Gerar relatório do dentista
 */
export async function gerarRelatorioDentista(
  dentistaId: string,
  dataInicio: string,
  dataFim: string
) {
  // Buscar procedimentos
  const procedimentos = await listarProcedimentosDentista(dentistaId, dataInicio, dataFim);
  
  // Buscar comissões
  const comissoes = await listarComissoesDentista(dentistaId);
  
  // Calcular totais
  const totalProcedimentos = procedimentos.length;
  const totalFaturado = procedimentos.reduce((sum, proc) => sum + parseFloat(proc.valorProcedimento.toString()), 0);
  const totalComissoes = comissoes.reduce((sum, com) => sum + parseFloat(com.valor.toString()), 0);
  const totalPago = comissoes
    .filter((com) => com.status === "pago")
    .reduce((sum, com) => sum + parseFloat(com.valor.toString()), 0);
  const totalPendente = comissoes
    .filter((com) => com.status === "pendente")
    .reduce((sum, com) => sum + parseFloat(com.valor.toString()), 0);
  
  return {
    dentistaId,
    periodo: { inicio: dataInicio, fim: dataFim },
    procedimentos: {
      total: totalProcedimentos,
      lista: procedimentos,
    },
    faturacao: {
      totalFaturado,
      totalRecebido: totalFaturado, // Simplificado
      totalPendente: 0,
    },
    comissoes: {
      totalComissoes,
      totalPago,
      totalPendente,
      lista: comissoes,
    },
    estatisticas: {
      mediaComissaoPorProcedimento: totalProcedimentos > 0 ? totalComissoes / totalProcedimentos : 0,
      procedimentoMaisRealizado: "Limpeza", // Implementar cálculo real
      ticketMedio: totalProcedimentos > 0 ? totalFaturado / totalProcedimentos : 0,
    },
  };
}

/**
 * Gerar relatório da clínica
 */
export async function gerarRelatorioClinica(dataInicio: string, dataFim: string) {
  // Implementar queries agregadas
  return {
    periodo: { inicio: dataInicio, fim: dataFim },
    faturacao: {
      totalFaturado: 0,
      totalRecebido: 0,
      totalPendente: 0,
      totalVencido: 0,
    },
    custos: {
      comissoesDentistas: 0,
      contasPagar: 0,
      laboratorios: 0,
      estoque: 0,
      outros: 0,
      total: 0,
    },
    lucro: {
      bruto: 0,
      liquido: 0,
      margem: 0,
    },
    porDentista: [],
    porProcedimento: [],
  };
}
