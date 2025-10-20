import { pgTable, varchar, text, timestamp, serial, integer, decimal, boolean, date, jsonb } from "drizzle-orm/pg-core";

// ========================================
// USERS (Sistema de autenticação)
// ========================================

export const users = pgTable("users", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  login_method: varchar("login_method", { length: 64 }),
  role: varchar("role", { length: 20 }).notNull().default("user"),
  created_at: timestamp("created_at").defaultNow(),
  last_signed_in: timestamp("last_signed_in").defaultNow(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ========================================
// CONFIGURAÇÃO DA CLÍNICA
// ========================================

export const config_clinica = pgTable("config_clinica", {
  id: varchar("id", { length: 36 }).primaryKey(),
  nome_clinica: varchar("nome_clinica", { length: 200 }).notNull(),
  razao_social: varchar("razao_social", { length: 200 }),
  nif: varchar("nif", { length: 9 }),
  numero_registo: varchar("numero_registo", { length: 50 }),
  telefone: varchar("telefone", { length: 20 }),
  telemovel: varchar("telemovel", { length: 20 }),
  email: varchar("email", { length: 100 }),
  website: varchar("website", { length: 200 }),
  rua: varchar("rua", { length: 200 }),
  numero: varchar("numero", { length: 20 }),
  complemento: varchar("complemento", { length: 100 }),
  codigo_postal: varchar("codigo_postal", { length: 10 }),
  cidade: varchar("cidade", { length: 100 }),
  pais: varchar("pais", { length: 100 }).default("Portugal"),
  nome_fantasia: varchar("nome_fantasia", { length: 200 }),
  logotipo: text("logotipo"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export type ConfigClinica = typeof config_clinica.$inferSelect;
export type InsertConfigClinica = typeof config_clinica.$inferInsert;

// ========================================
// UTENTES (Pacientes)
// ========================================

export const utentes = pgTable("utentes", {
  id: varchar("id", { length: 36 }).primaryKey(),
  codigo: varchar("codigo", { length: 20 }).notNull().unique(),
  
  // Dados Pessoais
  nome: varchar("nome", { length: 200 }).notNull(),
  data_nascimento: date("data_nascimento").notNull(),
  genero: varchar("genero", { length: 10 }).notNull(), // M, F, Outro
  nif: varchar("nif", { length: 9 }),
  numero_sns: varchar("numero_sns", { length: 9 }), // OPCIONAL
  estado_civil: varchar("estado_civil", { length: 20 }),
  profissao: varchar("profissao", { length: 100 }),
  foto_perfil: text("foto_perfil"),
  
  // Contactos
  email: varchar("email", { length: 100 }),
  telefone: varchar("telefone", { length: 20 }),
  telemovel: varchar("telemovel", { length: 20 }),
  
  // Morada
  rua: varchar("rua", { length: 200 }),
  numero: varchar("numero", { length: 20 }),
  complemento: varchar("complemento", { length: 100 }),
  codigo_postal: varchar("codigo_postal", { length: 10 }),
  cidade: varchar("cidade", { length: 100 }),
  pais: varchar("pais", { length: 100 }).default("Portugal"),
  
  // Contacto de Emergência
  emergencia_nome: varchar("emergencia_nome", { length: 200 }),
  emergencia_parentesco: varchar("emergencia_parentesco", { length: 50 }),
  emergencia_telefone: varchar("emergencia_telefone", { length: 20 }),
  
  // Histórico Médico
  alergias: text("alergias"), // Armazenado como string separada por vírgulas
  medicamentos: text("medicamentos"), // Armazenado como string separada por vírgulas
  doencas_cronicas: text("doencas_cronicas"),
  cirurgias_anteriores: text("cirurgias_anteriores"),
  historico_medico: text("historico_medico"),
  
  // Outros
  estado: varchar("estado", { length: 20 }).notNull().default("ativo"), // ativo, inativo, arquivado
  observacoes: text("observacoes"),
  consentimento_rgpd: boolean("consentimento_rgpd").default(false),
  
  // Timestamps
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export type Utente = typeof utentes.$inferSelect;
export type InsertUtente = typeof utentes.$inferInsert;

// ========================================
// CONSULTAS
// ========================================

export const consultas = pgTable("consultas", {
  id: varchar("id", { length: 36 }).primaryKey(),
  utente_id: varchar("utente_id", { length: 36 }).notNull().references(() => utentes.id),
  dentista_id: varchar("dentista_id", { length: 36 }),
  
  // Data e Hora
  data_hora: timestamp("data_hora").notNull(),
  duracao: integer("duracao").default(30), // em minutos
  
  // Detalhes
  tipo_consulta: varchar("tipo_consulta", { length: 100 }), // primeira_consulta, revisao, tratamento, urgencia
  procedimento: text("procedimento"),
  sala: varchar("sala", { length: 50 }),
  
  // Status
  status: varchar("status", { length: 20 }).notNull().default("agendada"), 
  // agendada, confirmada, em_curso, concluida, cancelada, faltou
  
  // Observações
  observacoes: text("observacoes"),
  observacoes_internas: text("observacoes_internas"),
  
  // Financeiro
  valor_estimado: decimal("valor_estimado", { precision: 10, scale: 2 }),
  valor_final: decimal("valor_final", { precision: 10, scale: 2 }),
  
  // Timestamps
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export type Consulta = typeof consultas.$inferSelect;
export type InsertConsulta = typeof consultas.$inferInsert;

// ========================================
// DENTISTAS
// ========================================

export const dentistas = pgTable("dentistas", {
  id: varchar("id", { length: 36 }).primaryKey(),
  codigo: varchar("codigo", { length: 20 }).notNull().unique(),
  
  // Dados Pessoais
  nome: varchar("nome", { length: 200 }).notNull(),
  nif: varchar("nif", { length: 9 }),
  numero_ordem: varchar("numero_ordem", { length: 20 }),
  especialidade: varchar("especialidade", { length: 100 }),
  
  // Contactos
  email: varchar("email", { length: 100 }),
  telefone: varchar("telefone", { length: 20 }),
  telemovel: varchar("telemovel", { length: 20 }),
  
  // Configurações
  cor_agenda: varchar("cor_agenda", { length: 7 }).default("#3B82F6"),
  ativo: boolean("ativo").default(true),
  
  // Timestamps
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export type Dentista = typeof dentistas.$inferSelect;
export type InsertDentista = typeof dentistas.$inferInsert;

// ========================================
// DOCUMENTOS
// ========================================

export const documentos = pgTable("documentos", {
  id: varchar("id", { length: 36 }).primaryKey(),
  utente_id: varchar("utente_id", { length: 36 }).notNull().references(() => utentes.id),
  
  // Informações do Documento
  tipo: varchar("tipo", { length: 50 }).notNull(), // cartao_cidadao, seguro, exame, raio_x, etc
  nome: varchar("nome", { length: 200 }).notNull(),
  descricao: text("descricao"),
  
  // Arquivo
  url: text("url").notNull(),
  nome_arquivo: varchar("nome_arquivo", { length: 255 }).notNull(),
  tamanho: integer("tamanho"), // em bytes
  tipo_mime: varchar("tipo_mime", { length: 100 }),
  
  // Timestamps
  created_at: timestamp("created_at").defaultNow(),
});

export type Documento = typeof documentos.$inferSelect;
export type InsertDocumento = typeof documentos.$inferInsert;

