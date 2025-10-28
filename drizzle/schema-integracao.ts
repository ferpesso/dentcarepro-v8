// @ts-nocheck
/**
 * Schema de Integração - DentCare PRO v8
 * Tabelas adicionais para integração entre módulos
 */

import { mysqlTable, varchar, text, decimal, int, timestamp, mysqlEnum } from "drizzle-orm/mysql-core";

// ========================================
// PROCEDIMENTOS CLÍNICOS
// ========================================

export const procedimentosClinicos = mysqlTable("procedimentos_clinicos", {
  id: varchar("id", { length: 64 }).primaryKey(),
  utenteId: varchar("utente_id", { length: 64 }).notNull(),
  dentistaId: varchar("dentista_id", { length: 64 }).notNull(),
  consultaId: varchar("consulta_id", { length: 64 }),
  
  // Tipo de procedimento
  tipo: mysqlEnum("tipo", [
    "odontograma",
    "periodontograma",
    "endodontia",
    "implante",
    "ortodontia",
    "limpeza",
    "restauracao",
    "extracao",
    "protese",
    "clareamento",
    "outro"
  ]).notNull(),
  
  // Dados específicos (JSON)
  dados: text("dados").notNull(), // JSON com dados específicos do procedimento
  
  // Descrição
  descricao: text("descricao").notNull(),
  observacoes: text("observacoes"),
  
  // Faturação
  valorProcedimento: decimal("valor_procedimento", { precision: 10, scale: 2 }).notNull(),
  faturaId: varchar("fatura_id", { length: 64 }),
  faturado: int("faturado").default(0), // 0 = não, 1 = sim
  
  // Datas
  data: varchar("data", { length: 10 }).notNull(), // YYYY-MM-DD
  
  // Auditoria
  criadoPor: varchar("criado_por", { length: 64 }).notNull(),
  criadoEm: timestamp("criado_em").defaultNow(),
  atualizadoEm: timestamp("atualizado_em").defaultNow().onUpdateNow(),
});

export type ProcedimentoClinico = typeof procedimentosClinicos.$inferSelect;
export type InsertProcedimentoClinico = typeof procedimentosClinicos.$inferInsert;

// ========================================
// HISTÓRICO UNIFICADO DO UTENTE
// ========================================

export const historicoUtente = mysqlTable("historico_utente", {
  id: varchar("id", { length: 64 }).primaryKey(),
  utenteId: varchar("utente_id", { length: 64 }).notNull(),
  
  // Tipo de evento
  tipo: mysqlEnum("tipo", [
    "consulta",
    "procedimento",
    "fatura",
    "pagamento",
    "observacao",
    "documento",
    "comunicacao"
  ]).notNull(),
  
  // Dados do evento
  titulo: varchar("titulo", { length: 255 }).notNull(),
  descricao: text("descricao").notNull(),
  data: varchar("data", { length: 10 }).notNull(), // YYYY-MM-DD
  
  // Ligações com outras entidades
  consultaId: varchar("consulta_id", { length: 64 }),
  procedimentoId: varchar("procedimento_id", { length: 64 }),
  faturaId: varchar("fatura_id", { length: 64 }),
  pagamentoId: varchar("pagamento_id", { length: 64 }),
  
  // Financeiro
  valor: decimal("valor", { precision: 10, scale: 2 }),
  
  // Responsável
  dentistaId: varchar("dentista_id", { length: 64 }),
  dentistaNome: varchar("dentista_nome", { length: 255 }),
  
  // UI
  icone: varchar("icone", { length: 50 }).notNull(), // Nome do ícone Lucide
  cor: varchar("cor", { length: 50 }).notNull(), // Cor para UI
  
  // Auditoria
  criadoEm: timestamp("criado_em").defaultNow(),
});

export type HistoricoUtente = typeof historicoUtente.$inferSelect;
export type InsertHistoricoUtente = typeof historicoUtente.$inferInsert;

// ========================================
// TABELA DE PREÇOS
// ========================================

export const tabelaPrecos = mysqlTable("tabela_precos", {
  id: varchar("id", { length: 64 }).primaryKey(),
  codigo: varchar("codigo", { length: 50 }).notNull().unique(),
  descricao: varchar("descricao", { length: 255 }).notNull(),
  categoria: mysqlEnum("categoria", [
    "consulta",
    "tratamento",
    "cirurgia",
    "protese",
    "ortodontia",
    "implante",
    "estetica",
    "urgencia",
    "material",
    "laboratorio",
    "outro"
  ]).notNull(),
  valor: decimal("valor", { precision: 10, scale: 2 }).notNull(),
  iva: decimal("iva", { precision: 5, scale: 2 }).default("23.00"),
  ativo: int("ativo").default(1), // 0 = inativo, 1 = ativo
  criadoEm: timestamp("criado_em").defaultNow(),
  atualizadoEm: timestamp("atualizado_em").defaultNow().onUpdateNow(),
});

export type TabelaPreco = typeof tabelaPrecos.$inferSelect;
export type InsertTabelaPreco = typeof tabelaPrecos.$inferInsert();

// ========================================
// FATURAS (Extensão)
// ========================================

export const faturas = mysqlTable("faturas", {
  id: varchar("id", { length: 64 }).primaryKey(),
  numero: varchar("numero", { length: 50 }).notNull().unique(),
  serie: varchar("serie", { length: 10 }).notNull().default("FT"),
  tipo: mysqlEnum("tipo", ["fatura", "fatura_recibo", "recibo", "nota_credito"]).notNull().default("fatura"),
  
  // Datas
  data: varchar("data", { length: 10 }).notNull(),
  dataVencimento: varchar("data_vencimento", { length: 10 }).notNull(),
  
  // Cliente (Utente)
  utenteId: varchar("utente_id", { length: 64 }).notNull(),
  utenteNome: varchar("utente_nome", { length: 255 }).notNull(),
  utenteNif: varchar("utente_nif", { length: 9 }),
  utenteMorada: text("utente_morada"),
  
  // Dentista
  dentistaId: varchar("dentista_id", { length: 64 }).notNull(),
  dentistaNome: varchar("dentista_nome", { length: 255 }),
  dentistaPercentagem: decimal("dentista_percentagem", { precision: 5, scale: 2 }).default("0.00"),
  dentistaComissao: decimal("dentista_comissao", { precision: 10, scale: 2 }).default("0.00"),
  
  // Ligações
  consultaId: varchar("consulta_id", { length: 64 }),
  comissaoId: varchar("comissao_id", { length: 64 }),
  
  // Itens (JSON)
  itens: text("itens").notNull(), // JSON array de ItemFatura
  
  // Totais
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  descontoTotal: decimal("desconto_total", { precision: 10, scale: 2 }).default("0.00"),
  ivaTotal: decimal("iva_total", { precision: 10, scale: 2 }).notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  
  // Valores da clínica
  valorClinica: decimal("valor_clinica", { precision: 10, scale: 2 }).default("0.00"),
  
  // Estado
  estado: mysqlEnum("estado", ["pendente", "paga", "parcial", "vencida", "anulada"]).notNull().default("pendente"),
  
  // Pagamentos (JSON)
  pagamentos: text("pagamentos"), // JSON array de Pagamento
  valorPago: decimal("valor_pago", { precision: 10, scale: 2 }).default("0.00"),
  valorEmDivida: decimal("valor_em_divida", { precision: 10, scale: 2 }).default("0.00"),
  
  // Observações
  observacoes: text("observacoes"),
  
  // Auditoria
  criadoPor: varchar("criado_por", { length: 64 }).notNull(),
  criadoEm: timestamp("criado_em").defaultNow(),
  atualizadoEm: timestamp("atualizado_em").defaultNow().onUpdateNow(),
});

export type Fatura = typeof faturas.$inferSelect;
export type InsertFatura = typeof faturas.$inferInsert;

// ========================================
// COMISSÕES (Extensão)
// ========================================

export const comissoes = mysqlTable("comissoes", {
  id: varchar("id", { length: 64 }).primaryKey(),
  dentistaId: varchar("dentista_id", { length: 64 }).notNull(),
  faturaId: varchar("fatura_id", { length: 64 }).notNull(),
  procedimentoId: varchar("procedimento_id", { length: 64 }),
  
  // Valores
  valor: decimal("valor", { precision: 10, scale: 2 }).notNull(),
  percentagem: decimal("percentagem", { precision: 5, scale: 2 }),
  
  // Período
  mes: varchar("mes", { length: 7 }).notNull(), // YYYY-MM
  
  // Estado
  status: mysqlEnum("status", ["pendente", "pago", "cancelado"]).notNull().default("pendente"),
  
  // Pagamento
  dataPagamento: varchar("data_pagamento", { length: 10 }),
  formaPagamento: varchar("forma_pagamento", { length: 50 }),
  referencia: varchar("referencia", { length: 100 }),
  
  // Observações
  observacoes: text("observacoes"),
  
  // Auditoria
  criadoEm: timestamp("criado_em").defaultNow(),
  atualizadoEm: timestamp("atualizado_em").defaultNow().onUpdateNow(),
});

export type Comissao = typeof comissoes.$inferSelect;
export type InsertComissao = typeof comissoes.$inferInsert;

// ========================================
// CONFIGURAÇÃO DE COMISSÕES
// ========================================

export const configComissoes = mysqlTable("config_comissoes", {
  id: varchar("id", { length: 64 }).primaryKey(),
  dentistaId: varchar("dentista_id", { length: 64 }).notNull().unique(),
  
  // Tipo de comissão
  tipo: mysqlEnum("tipo", ["percentagem", "fixo", "misto"]).notNull().default("percentagem"),
  
  // Valores
  percentagem: decimal("percentagem", { precision: 5, scale: 2 }),
  valorFixo: decimal("valor_fixo", { precision: 10, scale: 2 }),
  
  // Limites
  valorMinimo: decimal("valor_minimo", { precision: 10, scale: 2 }),
  valorMaximo: decimal("valor_maximo", { precision: 10, scale: 2 }),
  
  // Observações
  observacoes: text("observacoes"),
  
  // Auditoria
  criadoEm: timestamp("criado_em").defaultNow(),
  atualizadoEm: timestamp("atualizado_em").defaultNow().onUpdateNow(),
});

export type ConfigComissao = typeof configComissoes.$inferSelect;
export type InsertConfigComissao = typeof configComissoes.$inferInsert;

// ========================================
// DENTISTAS (se não existir)
// ========================================

export const dentistas = mysqlTable("dentistas", {
  id: varchar("id", { length: 64 }).primaryKey(),
  nome: varchar("nome", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  telefone: varchar("telefone", { length: 20 }),
  nif: varchar("nif", { length: 9 }),
  numeroOrdem: varchar("numero_ordem", { length: 20 }),
  especialidade: varchar("especialidade", { length: 100 }),
  ativo: int("ativo").default(1),
  criadoEm: timestamp("criado_em").defaultNow(),
  atualizadoEm: timestamp("atualizado_em").defaultNow().onUpdateNow(),
});

export type Dentista = typeof dentistas.$inferSelect;
export type InsertDentista = typeof dentistas.$inferInsert;
