import { pgTable, varchar, text, timestamp, integer, decimal, boolean } from "drizzle-orm/pg-core";

// ========================================
// USERS (Sistema de autenticação)
// ========================================

export const users = pgTable("users", {
  id: varchar("id", { length: 50 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  loginMethod: varchar("login_method", { length: 50 }),
  role: varchar("role", { length: 50 }).default('user'),
  lastSignedIn: timestamp("last_signed_in"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  passwordHash: varchar("password_hash", { length: 255 }),
  status: varchar("status", { length: 20 }).default('ativo'),
  dentistaId: varchar("dentista_id", { length: 64 }),
  resetToken: varchar("reset_token", { length: 255 }),
  resetTokenExpires: timestamp("reset_token_expires"),
  emailVerified: integer("email_verified").default(0),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ========================================
// USER SESSIONS
// ========================================

export const userSessions = pgTable("user_sessions", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 50 }).notNull(),
  token: text("token").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
});

export type UserSession = typeof userSessions.$inferSelect;
export type InsertUserSession = typeof userSessions.$inferInsert;

// ========================================
// UTENTES (Pacientes)
// ========================================

export const utentes = pgTable("utentes", {
  id: varchar("id", { length: 36 }).primaryKey(),
  numeroUtente: varchar("numero_utente", { length: 20 }).notNull().unique(),
  nomeCompleto: varchar("nome_completo", { length: 200 }).notNull(),
  dataNascimento: varchar("data_nascimento", { length: 10 }).notNull(),
  genero: varchar("genero", { length: 10 }).notNull(),
  nif: varchar("nif", { length: 9 }),
  numUtenteSns: varchar("num_utente_sns", { length: 9 }),
  fotoPerfil: text("foto_perfil"),
  contacto: text("contacto"),
  morada: text("morada"),
  infoMedica: text("info_medica").notNull(),
  status: varchar("status", { length: 20 }).notNull().default('ativo'),
  tags: text("tags"),
  criadoPor: varchar("criado_por", { length: 64 }).notNull(),
  criadoEm: timestamp("criado_em").defaultNow(),
  atualizadoEm: timestamp("atualizado_em").defaultNow(),
});

export type Utente = typeof utentes.$inferSelect;
export type InsertUtente = typeof utentes.$inferInsert;

// ========================================
// CONSULTAS
// ========================================

export const consultas = pgTable("consultas", {
  id: varchar("id", { length: 255 }).primaryKey(),
  utenteId: varchar("utente_id", { length: 255 }).notNull(),
  medicoId: varchar("medico_id", { length: 255 }),
  dataHora: timestamp("data_hora").notNull(),
  duracao: integer("duracao").default(30),
  tipoConsulta: varchar("tipo_consulta", { length: 100 }),
  procedimento: text("procedimento"),
  status: varchar("status", { length: 50 }).default('agendada'),
  observacoes: text("observacoes"),
  valorEstimado: decimal("valor_estimado", { precision: 10, scale: 2 }),
  classificacaoRisco: varchar("classificacao_risco", { length: 10 }),
  criadoEm: timestamp("criado_em").defaultNow(),
  atualizadoEm: timestamp("atualizado_em").defaultNow(),
});

export type Consulta = typeof consultas.$inferSelect;
export type InsertConsulta = typeof consultas.$inferInsert;

// ========================================
// FATURAS
// ========================================

export const faturas = pgTable("faturas", {
  id: varchar("id", { length: 255 }).primaryKey(),
  numero: varchar("numero", { length: 50 }).notNull().unique(),
  utenteId: varchar("utente_id", { length: 255 }).notNull(),
  data: timestamp("data").notNull(),
  valorTotal: decimal("valor_total", { precision: 10, scale: 2 }).notNull(),
  valorPago: decimal("valor_pago", { precision: 10, scale: 2 }).default('0'),
  status: varchar("status", { length: 50 }).default('pendente'),
  metodoPagamento: varchar("metodo_pagamento", { length: 50 }),
  observacoes: text("observacoes"),
  criadoEm: timestamp("criado_em").defaultNow(),
  atualizadoEm: timestamp("atualizado_em").defaultNow(),
});

export type Fatura = typeof faturas.$inferSelect;
export type InsertFatura = typeof faturas.$inferInsert;

// ========================================
// DENTISTAS
// ========================================

export const dentistas = pgTable("dentistas", {
  id: varchar("id", { length: 255 }).primaryKey(),
  nome: varchar("nome", { length: 255 }).notNull(),
  especialidade: varchar("especialidade", { length: 100 }),
  numeroOrdem: varchar("numero_ordem", { length: 50 }),
  contacto: text("contacto"),
  ativo: boolean("ativo").default(true),
  criadoEm: timestamp("criado_em").defaultNow(),
});

export type Dentista = typeof dentistas.$inferSelect;
export type InsertDentista = typeof dentistas.$inferInsert;

// ========================================
// COMISSÕES
// ========================================

export const comissoes = pgTable("comissoes", {
  id: varchar("id", { length: 255 }).primaryKey(),
  dentistaId: varchar("dentista_id", { length: 255 }).notNull(),
  faturaId: varchar("fatura_id", { length: 255 }),
  valor: decimal("valor", { precision: 10, scale: 2 }).notNull(),
  percentual: decimal("percentual", { precision: 5, scale: 2 }),
  status: varchar("status", { length: 50 }).default('pendente'),
  dataCriacao: timestamp("data_criacao").defaultNow(),
  dataPagamento: timestamp("data_pagamento"),
  formaPagamento: varchar("forma_pagamento", { length: 50 }),
  observacoes: text("observacoes"),
});

export type Comissao = typeof comissoes.$inferSelect;
export type InsertComissao = typeof comissoes.$inferInsert;

// ========================================
// CONFIG COMISSÕES
// ========================================

export const configComissoes = pgTable("config_comissoes", {
  id: varchar("id", { length: 255 }).primaryKey(),
  dentistaId: varchar("dentista_id", { length: 255 }).notNull().unique(),
  percentualPadrao: decimal("percentual_padrao", { precision: 5, scale: 2 }).default('30'),
  tipoCalculo: varchar("tipo_calculo", { length: 50 }).default('percentual'),
  ativo: boolean("ativo").default(true),
  criadoEm: timestamp("criado_em").defaultNow(),
  atualizadoEm: timestamp("atualizado_em").defaultNow(),
});

export type ConfigComissao = typeof configComissoes.$inferSelect;
export type InsertConfigComissao = typeof configComissoes.$inferInsert;

// ========================================
// HISTÓRICO UTENTE
// ========================================

export const historicoUtente = pgTable("historico_utente", {
  id: varchar("id", { length: 255 }).primaryKey(),
  utenteId: varchar("utente_id", { length: 255 }).notNull(),
  tipo: varchar("tipo", { length: 50 }).notNull(),
  descricao: text("descricao").notNull(),
  data: timestamp("data").notNull(),
  criadoPor: varchar("criado_por", { length: 64 }).notNull(),
  criadoEm: timestamp("criado_em").defaultNow(),
});

export type HistoricoUtente = typeof historicoUtente.$inferSelect;
export type InsertHistoricoUtente = typeof historicoUtente.$inferInsert;

// ========================================
// PROCEDIMENTOS CLÍNICOS
// ========================================

export const procedimentosClinicos = pgTable("procedimentos_clinicos", {
  id: varchar("id", { length: 255 }).primaryKey(),
  codigo: varchar("codigo", { length: 50 }).notNull().unique(),
  nome: varchar("nome", { length: 255 }).notNull(),
  descricao: text("descricao"),
  categoria: varchar("categoria", { length: 100 }),
  preco: decimal("preco", { precision: 10, scale: 2 }),
  ativo: boolean("ativo").default(true),
  criadoEm: timestamp("criado_em").defaultNow(),
});

export type ProcedimentoClinico = typeof procedimentosClinicos.$inferSelect;
export type InsertProcedimentoClinico = typeof procedimentosClinicos.$inferInsert;

// ========================================
// TABELA DE PREÇOS
// ========================================

export const tabelaPrecos = pgTable("tabela_precos", {
  id: varchar("id", { length: 255 }).primaryKey(),
  procedimentoId: varchar("procedimento_id", { length: 255 }).notNull(),
  nome: varchar("nome", { length: 255 }).notNull(),
  preco: decimal("preco", { precision: 10, scale: 2 }).notNull(),
  ativo: boolean("ativo").default(true),
  criadoEm: timestamp("criado_em").defaultNow(),
});

export type TabelaPreco = typeof tabelaPrecos.$inferSelect;
export type InsertTabelaPreco = typeof tabelaPrecos.$inferInsert;

// ========================================
// AUDIT LOG
// ========================================

export const auditLog = pgTable("audit_log", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 50 }),
  action: varchar("action", { length: 100 }).notNull(),
  entity: varchar("entity", { length: 100 }),
  entityId: varchar("entity_id", { length: 255 }),
  changes: text("changes"),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type AuditLog = typeof auditLog.$inferSelect;
export type InsertAuditLog = typeof auditLog.$inferInsert;

// ========================================
// NOTIFICATIONS
// ========================================

export const notifications = pgTable("notifications", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 50 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

// ========================================
// USER PERMISSIONS
// ========================================

export const userPermissions = pgTable("user_permissions", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 50 }).notNull(),
  permission: varchar("permission", { length: 100 }).notNull(),
  granted: boolean("granted").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export type UserPermission = typeof userPermissions.$inferSelect;
export type InsertUserPermission = typeof userPermissions.$inferInsert;

// ========================================
// CONFIG CLÍNICA
// ========================================

export const configClinica = pgTable("config_clinica", {
  id: varchar("id", { length: 255 }).primaryKey(),
  chave: varchar("chave", { length: 100 }).notNull().unique(),
  valor: text("valor"),
  tipo: varchar("tipo", { length: 50 }),
  descricao: text("descricao"),
  atualizadoEm: timestamp("atualizado_em").defaultNow(),
});

export type ConfigClinica = typeof configClinica.$inferSelect;
export type InsertConfigClinica = typeof configClinica.$inferInsert;
