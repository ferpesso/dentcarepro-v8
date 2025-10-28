import { pgTable, varchar, text, timestamp, integer, decimal, boolean, date } from "drizzle-orm/pg-core";

// ========================================
// USERS (Sistema de autenticação)
// ========================================
export const users = pgTable("users", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  passwordHash: varchar("password_hash", { length: 255 }),
  role: varchar("role", { length: 50 }).default('user').notNull(),
  status: varchar("status", { length: 50 }).default('active').notNull(),
  loginMethod: varchar("login_method", { length: 50 }),
  dentistaId: varchar("dentista_id", { length: 255 }),
  resetToken: varchar("reset_token", { length: 255 }),
  resetTokenExpires: timestamp("reset_token_expires"),
  telefone: varchar("telefone", { length: 50 }),
  especialidade: varchar("especialidade", { length: 100 }),
  numeroOrdem: varchar("numero_ordem", { length: 50 }),
  fotoUrl: varchar("foto_url", { length: 500 }),
  ativo: boolean("ativo").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ========================================
// USER SESSIONS
// ========================================
export const userSessions = pgTable("user_sessions", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  token: text("token").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type UserSession = typeof userSessions.$inferSelect;
export type InsertUserSession = typeof userSessions.$inferInsert;

// ========================================
// UTENTES (Pacientes)
// ========================================
export const utentes = pgTable("utentes", {
  id: varchar("id", { length: 255 }).primaryKey(),
  nome: varchar("nome", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  telefone: varchar("telefone", { length: 50 }),
  dataNascimento: date("data_nascimento"),
  nif: varchar("nif", { length: 50 }),
  morada: text("morada"),
  genero: varchar("genero", { length: 20 }),
  profissao: varchar("profissao", { length: 100 }),
  estadoCivil: varchar("estado_civil", { length: 50 }),
  contactoEmergencia: varchar("contacto_emergencia", { length: 255 }),
  telefoneEmergencia: varchar("telefone_emergencia", { length: 50 }),
  alergias: text("alergias"),
  medicamentosUso: text("medicamentos_uso"),
  observacoesMedicas: text("observacoes_medicas"),
  notas: text("notas"),
  ativo: boolean("ativo").default(true),
  fotoUrl: varchar("foto_url", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Utente = typeof utentes.$inferSelect;
export type InsertUtente = typeof utentes.$inferInsert;

// ========================================
// CONSULTAS
// ========================================
export const consultas = pgTable("consultas", {
  id: varchar("id", { length: 255 }).primaryKey(),
  utenteId: varchar("utente_id", { length: 255 }),
  dentistaId: varchar("dentista_id", { length: 255 }),
  dataHora: timestamp("data_hora").notNull(),
  duracao: integer("duracao").default(30),
  tipo: varchar("tipo", { length: 100 }),
  status: varchar("status", { length: 50 }).default('agendada'),
  notas: text("notas"),
  valor: decimal("valor", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Consulta = typeof consultas.$inferSelect;
export type InsertConsulta = typeof consultas.$inferInsert;

// ========================================
// TRATAMENTOS
// ========================================
export const tratamentos = pgTable("tratamentos", {
  id: varchar("id", { length: 255 }).primaryKey(),
  utenteId: varchar("utente_id", { length: 255 }),
  consultaId: varchar("consulta_id", { length: 255 }),
  dentistaId: varchar("dentista_id", { length: 255 }),
  tipo: varchar("tipo", { length: 100 }).notNull(),
  descricao: text("descricao"),
  dente: varchar("dente", { length: 10 }),
  faces: varchar("faces", { length: 50 }),
  valor: decimal("valor", { precision: 10, scale: 2 }),
  status: varchar("status", { length: 50 }).default('planejado'),
  dataPlanejamento: date("data_planejamento"),
  dataRealizacao: date("data_realizacao"),
  notas: text("notas"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Tratamento = typeof tratamentos.$inferSelect;
export type InsertTratamento = typeof tratamentos.$inferInsert;

// ========================================
// FATURAS
// ========================================
export const faturas = pgTable("faturas", {
  id: varchar("id", { length: 255 }).primaryKey(),
  utenteId: varchar("utente_id", { length: 255 }),
  consultaId: varchar("consulta_id", { length: 255 }),
  numeroFatura: varchar("numero_fatura", { length: 100 }),
  dataEmissao: date("data_emissao").notNull(),
  dataVencimento: date("data_vencimento"),
  valorTotal: decimal("valor_total", { precision: 10, scale: 2 }).notNull(),
  valorPago: decimal("valor_pago", { precision: 10, scale: 2 }).default('0'),
  desconto: decimal("desconto", { precision: 10, scale: 2 }).default('0'),
  status: varchar("status", { length: 50 }).default('pendente'),
  metodoPagamento: varchar("metodo_pagamento", { length: 50 }),
  observacoes: text("observacoes"),
  notas: text("notas"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Fatura = typeof faturas.$inferSelect;
export type InsertFatura = typeof faturas.$inferInsert;

// ========================================
// ITENS DE FATURA
// ========================================
export const itensFatura = pgTable("itens_fatura", {
  id: varchar("id", { length: 255 }).primaryKey(),
  faturaId: varchar("fatura_id", { length: 255 }),
  tratamentoId: varchar("tratamento_id", { length: 255 }),
  descricao: varchar("descricao", { length: 255 }).notNull(),
  quantidade: integer("quantidade").default(1),
  valorUnitario: decimal("valor_unitario", { precision: 10, scale: 2 }).notNull(),
  valorTotal: decimal("valor_total", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type ItemFatura = typeof itensFatura.$inferSelect;
export type InsertItemFatura = typeof itensFatura.$inferInsert;

// ========================================
// PAGAMENTOS
// ========================================
export const pagamentos = pgTable("pagamentos", {
  id: varchar("id", { length: 255 }).primaryKey(),
  faturaId: varchar("fatura_id", { length: 255 }),
  valor: decimal("valor", { precision: 10, scale: 2 }).notNull(),
  formaPagamento: varchar("forma_pagamento", { length: 50 }).notNull(),
  dataPagamento: date("data_pagamento").notNull(),
  referencia: varchar("referencia", { length: 100 }),
  notas: text("notas"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Pagamento = typeof pagamentos.$inferSelect;
export type InsertPagamento = typeof pagamentos.$inferInsert;

// ========================================
// PRESCRIÇÕES
// ========================================
export const prescricoes = pgTable("prescricoes", {
  id: varchar("id", { length: 255 }).primaryKey(),
  utenteId: varchar("utente_id", { length: 255 }),
  consultaId: varchar("consulta_id", { length: 255 }),
  dentistaId: varchar("dentista_id", { length: 255 }),
  medicamento: varchar("medicamento", { length: 255 }).notNull(),
  dosagem: varchar("dosagem", { length: 100 }),
  frequencia: varchar("frequencia", { length: 100 }),
  duracao: varchar("duracao", { length: 100 }),
  viaAdministracao: varchar("via_administracao", { length: 50 }),
  notas: text("notas"),
  dataPrescricao: date("data_prescricao"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Prescricao = typeof prescricoes.$inferSelect;
export type InsertPrescricao = typeof prescricoes.$inferInsert;

// ========================================
// COMISSÕES
// ========================================
export const comissoes = pgTable("comissoes", {
  id: varchar("id", { length: 255 }).primaryKey(),
  dentistaId: varchar("dentista_id", { length: 255 }),
  faturaId: varchar("fatura_id", { length: 255 }),
  valor: decimal("valor", { precision: 10, scale: 2 }).notNull(),
  percentagem: decimal("percentagem", { precision: 5, scale: 2 }),
  status: varchar("status", { length: 50 }).default('pendente'),
  dataPagamento: date("data_pagamento"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Comissao = typeof comissoes.$inferSelect;
export type InsertComissao = typeof comissoes.$inferInsert;

// ========================================
// CONFIGURAÇÃO DE COMISSÕES
// ========================================
export const configComissoes = pgTable("config_comissoes", {
  id: varchar("id", { length: 255 }).primaryKey(),
  dentistaId: varchar("dentista_id", { length: 255 }),
  percentagemPadrao: decimal("percentagem_padrao", { precision: 5, scale: 2 }),
  percentagemConsulta: decimal("percentagem_consulta", { precision: 5, scale: 2 }),
  percentagemTratamento: decimal("percentagem_tratamento", { precision: 5, scale: 2 }),
  ativo: boolean("ativo").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type ConfigComissao = typeof configComissoes.$inferSelect;
export type InsertConfigComissao = typeof configComissoes.$inferInsert;

// ========================================
// LABORATÓRIOS
// ========================================
export const laboratorios = pgTable("laboratorios", {
  id: varchar("id", { length: 255 }).primaryKey(),
  nome: varchar("nome", { length: 255 }).notNull(),
  contato: varchar("contato", { length: 255 }),
  telefone: varchar("telefone", { length: 50 }),
  email: varchar("email", { length: 255 }),
  morada: text("morada"),
  nif: varchar("nif", { length: 50 }),
  notas: text("notas"),
  ativo: boolean("ativo").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Laboratorio = typeof laboratorios.$inferSelect;
export type InsertLaboratorio = typeof laboratorios.$inferInsert;

// ========================================
// TRABALHOS DE LABORATÓRIO
// ========================================
export const trabalhosLaboratorio = pgTable("trabalhos_laboratorio", {
  id: varchar("id", { length: 255 }).primaryKey(),
  laboratorioId: varchar("laboratorio_id", { length: 255 }),
  utenteId: varchar("utente_id", { length: 255 }),
  consultaId: varchar("consulta_id", { length: 255 }),
  dentistaId: varchar("dentista_id", { length: 255 }),
  tipoTrabalho: varchar("tipo_trabalho", { length: 100 }).notNull(),
  descricao: text("descricao"),
  dentes: varchar("dentes", { length: 100 }),
  cor: varchar("cor", { length: 50 }),
  dataEnvio: date("data_envio"),
  dataPrevistaEntrega: date("data_prevista_entrega"),
  dataEntregaReal: date("data_entrega_real"),
  valor: decimal("valor", { precision: 10, scale: 2 }),
  status: varchar("status", { length: 50 }).default('enviado'),
  notas: text("notas"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type TrabalhoLaboratorio = typeof trabalhosLaboratorio.$inferSelect;
export type InsertTrabalhoLaboratorio = typeof trabalhosLaboratorio.$inferInsert;

// ========================================
// CONTAS A PAGAR
// ========================================
export const contasPagar = pgTable("contas_pagar", {
  id: varchar("id", { length: 255 }).primaryKey(),
  descricao: varchar("descricao", { length: 255 }).notNull(),
  fornecedor: varchar("fornecedor", { length: 255 }),
  categoria: varchar("categoria", { length: 100 }),
  valor: decimal("valor", { precision: 10, scale: 2 }).notNull(),
  dataVencimento: date("data_vencimento").notNull(),
  dataPagamento: date("data_pagamento"),
  formaPagamento: varchar("forma_pagamento", { length: 50 }),
  status: varchar("status", { length: 50 }).default('pendente'),
  notas: text("notas"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type ContaPagar = typeof contasPagar.$inferSelect;
export type InsertContaPagar = typeof contasPagar.$inferInsert;

// ========================================
// DENTISTAS
// ========================================
export const dentistas = pgTable("dentistas", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }),
  nome: varchar("nome", { length: 255 }).notNull(),
  especialidade: varchar("especialidade", { length: 100 }),
  numeroOrdem: varchar("numero_ordem", { length: 50 }),
  telefone: varchar("telefone", { length: 50 }),
  email: varchar("email", { length: 255 }),
  ativo: boolean("ativo").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Dentista = typeof dentistas.$inferSelect;
export type InsertDentista = typeof dentistas.$inferInsert;

// ========================================
// HISTÓRICO DO UTENTE
// ========================================
export const historicoUtente = pgTable("historico_utente", {
  id: varchar("id", { length: 255 }).primaryKey(),
  utenteId: varchar("utente_id", { length: 255 }),
  consultaId: varchar("consulta_id", { length: 255 }),
  tipo: varchar("tipo", { length: 100 }),
  descricao: text("descricao"),
  data: timestamp("data").defaultNow(),
  criadoPor: varchar("criado_por", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export type HistoricoUtente = typeof historicoUtente.$inferSelect;
export type InsertHistoricoUtente = typeof historicoUtente.$inferInsert;

// ========================================
// PROCEDIMENTOS CLÍNICOS
// ========================================
export const procedimentosClinicos = pgTable("procedimentos_clinicos", {
  id: varchar("id", { length: 255 }).primaryKey(),
  codigo: varchar("codigo", { length: 50 }),
  nome: varchar("nome", { length: 255 }).notNull(),
  descricao: text("descricao"),
  categoria: varchar("categoria", { length: 100 }),
  valorBase: decimal("valor_base", { precision: 10, scale: 2 }),
  duracaoEstimada: integer("duracao_estimada"),
  ativo: boolean("ativo").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type ProcedimentoClinico = typeof procedimentosClinicos.$inferSelect;
export type InsertProcedimentoClinico = typeof procedimentosClinicos.$inferInsert;

// ========================================
// TABELA DE PREÇOS
// ========================================
export const tabelaPrecos = pgTable("tabela_precos", {
  id: varchar("id", { length: 255 }).primaryKey(),
  procedimentoId: varchar("procedimento_id", { length: 255 }),
  nome: varchar("nome", { length: 255 }).notNull(),
  preco: decimal("preco", { precision: 10, scale: 2 }).notNull(),
  categoria: varchar("categoria", { length: 100 }),
  ativo: boolean("ativo").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type TabelaPreco = typeof tabelaPrecos.$inferSelect;
export type InsertTabelaPreco = typeof tabelaPrecos.$inferInsert;

// ========================================
// AUDIT LOG
// ========================================
export const auditLog = pgTable("audit_log", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }),
  acao: varchar("acao", { length: 100 }).notNull(),
  tabela: varchar("tabela", { length: 100 }),
  registroId: varchar("registro_id", { length: 255 }),
  dadosAntigos: text("dados_antigos"),
  dadosNovos: text("dados_novos"),
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
  userId: varchar("user_id", { length: 255 }),
  tipo: varchar("tipo", { length: 50 }),
  titulo: varchar("titulo", { length: 255 }),
  mensagem: text("mensagem"),
  lida: boolean("lida").default(false),
  link: varchar("link", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

// ========================================
// USER PERMISSIONS
// ========================================
export const userPermissions = pgTable("user_permissions", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }),
  permissao: varchar("permissao", { length: 100 }).notNull(),
  ativo: boolean("ativo").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export type UserPermission = typeof userPermissions.$inferSelect;
export type InsertUserPermission = typeof userPermissions.$inferInsert;

// ========================================
// CONFIGURAÇÃO DA CLÍNICA
// ========================================
export const configClinica = pgTable("config_clinica", {
  id: varchar("id", { length: 255 }).primaryKey(),
  nomeClinica: varchar("nome_clinica", { length: 255 }),
  nif: varchar("nif", { length: 50 }),
  morada: text("morada"),
  telefone: varchar("telefone", { length: 50 }),
  email: varchar("email", { length: 255 }),
  website: varchar("website", { length: 255 }),
  logo: text("logo"),
  horarioFuncionamento: text("horario_funcionamento"),
  configuracoes: text("configuracoes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type ConfigClinica = typeof configClinica.$inferSelect;
export type InsertConfigClinica = typeof configClinica.$inferInsert;
