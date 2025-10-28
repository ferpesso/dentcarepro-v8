import { pgTable as mysqlTable, varchar, text, timestamp, pgEnum, integer as int, decimal, timestamp as datetime, boolean } from "drizzle-orm/pg-core";

// ========================================
// USERS (Sistema de autenticação)
// ========================================

export const users = mysqlTable("users", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: pgEnum("role", ["user", "admin"]).notNull().default("user"),
  createdAt: timestamp("createdAt").defaultNow(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ========================================
// UTENTES (Pacientes)
// ========================================

export const utentes = mysqlTable("utentes", {
  id: varchar("id", { length: 36 }).primaryKey(),
  numeroUtente: varchar("numeroUtente", { length: 20 }).notNull().unique(),
  nomeCompleto: varchar("nomeCompleto", { length: 200 }).notNull(),
  dataNascimento: varchar("dataNascimento", { length: 10 }).notNull(),
  genero: pgEnum("genero", ["M", "F", "Outro"]).notNull(),
  nif: varchar("nif", { length: 9 }),
  numUtenteSns: varchar("numUtenteSns", { length: 9 }),
  fotoPerfil: text("fotoPerfil"),
  contacto: text("contacto"),
  morada: text("morada"),
  infoMedica: text("infoMedica").notNull(),
  status: pgEnum("status", ["ativo", "inativo", "arquivado"]).notNull().default("ativo"),
  tags: text("tags"),
  criadoPor: varchar("criadoPor", { length: 64 }).notNull(),
  criadoEm: timestamp("criadoEm").defaultNow(),
  atualizadoEm: timestamp("atualizadoEm").defaultNow().onUpdateNow(),
});

export type Utente = typeof utentes.$inferSelect;
export type InsertUtente = typeof utentes.$inferInsert;

// ========================================
// CONSULTAS
// ========================================

export const consultas = mysqlTable("consultas", {
  id: varchar("id", { length: 255 }).primaryKey(),
  utenteId: varchar("utente_id", { length: 255 }).notNull(),
  medicoId: varchar("medico_id", { length: 255 }),
  dataHora: datetime("data_hora").notNull(),
  duracao: int("duracao").default(30),
  tipoConsulta: varchar("tipo_consulta", { length: 100 }),
  procedimento: text("procedimento"),
  status: pgEnum("status", ["agendada", "confirmada", "realizada", "cancelada", "faltou", "em_atendimento"]).default("agendada"),
  observacoes: text("observacoes"),
  valorEstimado: decimal("valor_estimado", { precision: 10, scale: 2 }),
  classificacaoRisco: varchar("classificacao_risco", { length: 10 }),
  criadoEm: timestamp("criado_em").defaultNow(),
  atualizadoEm: timestamp("atualizado_em").defaultNow().onUpdateNow(),
});

export type Consulta = typeof consultas.$inferSelect;
export type InsertConsulta = typeof consultas.$inferInsert;

// ========================================
// IMAGENS
// ========================================

export const imagens = mysqlTable("imagens", {
  id: varchar("id", { length: 64 }).primaryKey(),
  utenteId: varchar("utenteId", { length: 64 }).notNull(),
  tipo: pgEnum("tipo", ["raio_x", "fotografia", "tomografia", "scanner_3d", "outro"]).notNull(),
  categoria: varchar("categoria", { length: 100 }),
  url: text("url").notNull(),
  nomeArquivo: varchar("nomeArquivo", { length: 255 }).notNull(),
  tamanho: varchar("tamanho", { length: 50 }),
  dataImagem: varchar("dataImagem", { length: 10 }),
  descricao: text("descricao"),
  criadoEm: timestamp("criadoEm").defaultNow(),
});

export type Imagem = typeof imagens.$inferSelect;
export type InsertImagem = typeof imagens.$inferInsert;

// ========================================
// ODONTOGRAMA
// ========================================

export const odontograma = mysqlTable("odontograma", {
  id: varchar("id", { length: 64 }).primaryKey(),
  utenteId: varchar("utenteId", { length: 64 }).notNull(),
  numeroDente: varchar("numeroDente", { length: 10 }).notNull(),
  faces: text("faces"),
  condicao: varchar("condicao", { length: 100 }),
  tratamento: varchar("tratamento", { length: 100 }),
  observacoes: text("observacoes"),
  dataRegistro: varchar("dataRegistro", { length: 10 }),
  criadoEm: timestamp("criadoEm").defaultNow(),
});

export type Odontograma = typeof odontograma.$inferSelect;
export type InsertOdontograma = typeof odontograma.$inferInsert;

// ========================================
// ENDODONTIA
// ========================================

export const endodontia = mysqlTable("endodontia", {
  id: varchar("id", { length: 64 }).primaryKey(),
  utenteId: varchar("utenteId", { length: 64 }).notNull(),
  numeroDente: varchar("numeroDente", { length: 10 }).notNull(),
  numeroCanais: varchar("numeroCanais", { length: 10 }).notNull(),
  comprimentoTrabalho: text("comprimentoTrabalho"),
  tecnicaInstrumentacao: varchar("tecnicaInstrumentacao", { length: 100 }),
  materialObturacao: varchar("materialObturacao", { length: 100 }),
  dataInicio: varchar("dataInicio", { length: 10 }),
  dataFinalizacao: varchar("dataFinalizacao", { length: 10 }),
  status: pgEnum("status", ["em_andamento", "concluido", "retratamento"]).default("em_andamento"),
  observacoes: text("observacoes"),
  criadoEm: timestamp("criadoEm").defaultNow(),
});

export type Endodontia = typeof endodontia.$inferSelect;
export type InsertEndodontia = typeof endodontia.$inferInsert;

// ========================================
// IMPLANTES
// ========================================

export const implantes = mysqlTable("implantes", {
  id: varchar("id", { length: 64 }).primaryKey(),
  utenteId: varchar("utenteId", { length: 64 }).notNull(),
  posicao: varchar("posicao", { length: 10 }).notNull(),
  marca: varchar("marca", { length: 100 }),
  modelo: varchar("modelo", { length: 100 }),
  diametro: varchar("diametro", { length: 20 }),
  comprimento: varchar("comprimento", { length: 20 }),
  lote: varchar("lote", { length: 50 }),
  dataColocacao: varchar("dataColocacao", { length: 10 }),
  dataCarga: varchar("dataCarga", { length: 10 }),
  tipoProtese: varchar("tipoProtese", { length: 100 }),
  status: pgEnum("status", ["planejado", "colocado", "osseointegrado", "protese_instalada", "falha"]).default("planejado"),
  observacoes: text("observacoes"),
  criadoEm: timestamp("criadoEm").defaultNow(),
});

export type Implante = typeof implantes.$inferSelect;
export type InsertImplante = typeof implantes.$inferInsert;

// ========================================
// LABORATÓRIO
// ========================================

export const laboratorio = mysqlTable("laboratorio", {
  id: varchar("id", { length: 64 }).primaryKey(),
  utenteId: varchar("utenteId", { length: 64 }).notNull(),
  tipoTrabalho: varchar("tipoTrabalho", { length: 100 }).notNull(),
  dentes: varchar("dentes", { length: 255 }),
  laboratorioNome: varchar("laboratorioNome", { length: 200 }),
  cor: varchar("cor", { length: 50 }),
  material: varchar("material", { length: 100 }),
  dataEnvio: varchar("dataEnvio", { length: 10 }),
  dataPrevisao: varchar("dataPrevisao", { length: 10 }),
  dataRecepcao: varchar("dataRecepcao", { length: 10 }),
  dataInstalacao: varchar("dataInstalacao", { length: 10 }),
  custo: varchar("custo", { length: 20 }),
  status: pgEnum("status", ["pendente", "enviado", "em_producao", "recebido", "instalado", "ajuste_necessario"]).default("pendente"),
  observacoes: text("observacoes"),
  criadoEm: timestamp("criadoEm").defaultNow(),
});

export type Laboratorio = typeof laboratorio.$inferSelect;
export type InsertLaboratorio = typeof laboratorio.$inferInsert;

// ========================================
// ORTODONTIA
// ========================================

export const ortodontia = mysqlTable("ortodontia", {
  id: varchar("id", { length: 64 }).primaryKey(),
  utenteId: varchar("utenteId", { length: 64 }).notNull(),
  tipoAparelho: varchar("tipoAparelho", { length: 100 }),
  dataInicio: varchar("dataInicio", { length: 10 }),
  dataPrevisaoTermino: varchar("dataPrevisaoTermino", { length: 10 }),
  status: pgEnum("status", ["ativo", "concluido", "pausado"]).default("ativo"),
  observacoes: text("observacoes"),
  criadoEm: timestamp("criadoEm").defaultNow(),
});

export type Ortodontia = typeof ortodontia.$inferSelect;
export type InsertOrtodontia = typeof ortodontia.$inferInsert;

// ========================================
// ORTODONTIA CONSULTAS
// ========================================

export const ortodontiaConsultas = mysqlTable("ortodontia_consultas", {
  id: varchar("id", { length: 64 }).primaryKey(),
  ortodontiaId: varchar("ortodontiaId", { length: 64 }).notNull(),
  dataConsulta: varchar("dataConsulta", { length: 10 }).notNull(),
  procedimentos: text("procedimentos"),
  observacoes: text("observacoes"),
  proximaConsulta: varchar("proximaConsulta", { length: 10 }),
  criadoEm: timestamp("criadoEm").defaultNow(),
});

export type OrtodontiaConsulta = typeof ortodontiaConsultas.$inferSelect;
export type InsertOrtodontiaConsulta = typeof ortodontiaConsultas.$inferInsert;

// ========================================
// PERIODONTOGRAMA
// ========================================

export const periodontograma = mysqlTable("periodontograma", {
  id: varchar("id", { length: 64 }).primaryKey(),
  utenteId: varchar("utenteId", { length: 64 }).notNull(),
  numeroDente: varchar("numeroDente", { length: 10 }).notNull(),
  medicoes: text("medicoes").notNull(),
  dataAvaliacao: varchar("dataAvaliacao", { length: 10 }).notNull(),
  criadoEm: timestamp("criadoEm").defaultNow(),
});

export type Periodontograma = typeof periodontograma.$inferSelect;
export type InsertPeriodontograma = typeof periodontograma.$inferInsert;

// ========================================
// PRESCRIÇÕES
// ========================================

export const prescricoes = mysqlTable("prescricoes", {
  id: varchar("id", { length: 64 }).primaryKey(),
  utenteId: varchar("utenteId", { length: 64 }).notNull(),
  dataPrescricao: varchar("dataPrescricao", { length: 10 }).notNull(),
  medicamentos: text("medicamentos").notNull(),
  diagnostico: text("diagnostico"),
  observacoes: text("observacoes"),
  criadoEm: timestamp("criadoEm").defaultNow(),
});

export type Prescricao = typeof prescricoes.$inferSelect;
export type InsertPrescricao = typeof prescricoes.$inferInsert;


// ========================================
// DENTISTAS
// ========================================

export const dentistas = mysqlTable("dentistas", {
  id: varchar("id", { length: 64 }).primaryKey(),
  nome: varchar("nome", { length: 200 }).notNull(),
  nomeCompleto: varchar("nomeCompleto", { length: 200 }).notNull(),
  foto: text("foto"),
  
  // Documentos
  nif: varchar("nif", { length: 9 }).notNull(),
  numeroOrdem: varchar("numeroOrdem", { length: 20 }).notNull().unique(),
  especialidades: text("especialidades").notNull(), // JSON array
  
  // Contactos
  email: varchar("email", { length: 320 }).notNull(),
  telefone: varchar("telefone", { length: 20 }).notNull(),
  telemovel: varchar("telemovel", { length: 20 }),
  
  // Profissional
  dataAdmissao: varchar("dataAdmissao", { length: 10 }).notNull(),
  status: pgEnum("status", ["ativo", "inativo", "ferias", "licenca"]).notNull().default("ativo"),
  cargo: varchar("cargo", { length: 100 }),
  
  // Horário (JSON)
  horarioTrabalho: text("horarioTrabalho"),
  
  // Configurações
  corAgenda: varchar("corAgenda", { length: 7 }).default("#3b82f6"),
  permiteAgendamentoOnline: boolean("permiteAgendamentoOnline").default(true),
  tempoConsultaPadrao: int("tempoConsultaPadrao").default(30),
  
  // Observações
  observacoes: text("observacoes"),
  competencias: text("competencias"), // JSON array
  idiomas: text("idiomas"), // JSON array
  
  // Auditoria
  criadoEm: timestamp("criadoEm").defaultNow(),
  atualizadoEm: timestamp("atualizadoEm").defaultNow().onUpdateNow(),
});

export type Dentista = typeof dentistas.$inferSelect;
export type InsertDentista = typeof dentistas.$inferInsert;

// ========================================
// COMISSÕES DOS DENTISTAS
// ========================================

export const comissoes = mysqlTable("comissoes", {
  id: varchar("id", { length: 64 }).primaryKey(),
  
  // Referências
  dentistaId: varchar("dentistaId", { length: 64 }).notNull(),
  faturaId: varchar("faturaId", { length: 64 }),
  utenteId: varchar("utenteId", { length: 64 }),
  
  // Datas
  dataReferencia: varchar("dataReferencia", { length: 10 }).notNull(),
  dataPagamento: varchar("dataPagamento", { length: 10 }),
  
  // Valores
  valorBase: decimal("valorBase", { precision: 10, scale: 2 }).notNull(),
  valorComissao: decimal("valorComissao", { precision: 10, scale: 2 }).notNull(),
  bonificacao: decimal("bonificacao", { precision: 10, scale: 2 }).default("0"),
  valorTotal: decimal("valorTotal", { precision: 10, scale: 2 }).notNull(),
  
  // Status
  status: pgEnum("status", ["a_pagar", "pago", "cancelado"]).notNull().default("a_pagar"),
  
  // Detalhes
  tipoComissao: pgEnum("tipoComissao", ["percentagem", "fixo", "misto"]).notNull(),
  percentagemAplicada: decimal("percentagemAplicada", { precision: 5, scale: 2 }),
  observacoes: text("observacoes"),
  
  // Pagamento
  formaPagamento: varchar("formaPagamento", { length: 50 }),
  referenciaPagamento: varchar("referenciaPagamento", { length: 100 }),
  
  // Auditoria
  criadoEm: timestamp("criadoEm").defaultNow(),
  criadoPor: varchar("criadoPor", { length: 64 }),
  atualizadoEm: timestamp("atualizadoEm").defaultNow().onUpdateNow(),
});

export type Comissao = typeof comissoes.$inferSelect;
export type InsertComissao = typeof comissoes.$inferInsert;

// ========================================
// CONFIGURAÇÃO DE COMISSÃO POR DENTISTA
// ========================================

export const configComissoes = mysqlTable("config_comissoes", {
  id: varchar("id", { length: 64 }).primaryKey(),
  dentistaId: varchar("dentistaId", { length: 64 }).notNull().unique(),
  
  // Tipo de comissão
  tipo: pgEnum("tipo", ["percentagem", "fixo", "misto", "nenhum"]).notNull().default("percentagem"),
  
  // Configuração em JSON
  configuracao: text("configuracao").notNull(), // JSON com detalhes específicos
  
  // Pagamento
  pagarEm: pgEnum("pagarEm", ["semanal", "quinzenal", "mensal"]).default("mensal"),
  diasPagamento: text("diasPagamento"), // JSON array
  
  // Auditoria
  criadoEm: timestamp("criadoEm").defaultNow(),
  atualizadoEm: timestamp("atualizadoEm").defaultNow().onUpdateNow(),
});

export type ConfigComissao = typeof configComissoes.$inferSelect;
export type InsertConfigComissao = typeof configComissoes.$inferInsert;

// ========================================
// CONFIGURAÇÕES DA CLÍNICA
// ========================================

export const configClinica = mysqlTable("config_clinica", {
  id: varchar("id", { length: 64 }).primaryKey(),
  
  // Dados básicos
  nomeClinica: varchar("nomeClinica", { length: 200 }).notNull(),
  nomeFantasia: varchar("nomeFantasia", { length: 200 }),
  razaoSocial: varchar("razaoSocial", { length: 200 }).notNull(),
  
  // Documentos
  nif: varchar("nif", { length: 9 }).notNull(),
  numeroRegistro: varchar("numeroRegistro", { length: 50 }),
  
  // Contactos
  telefone: varchar("telefone", { length: 20 }).notNull(),
  telemovel: varchar("telemovel", { length: 20 }),
  email: varchar("email", { length: 320 }).notNull(),
  website: varchar("website", { length: 200 }),
  
  // Redes Sociais (JSON)
  redesSociais: text("redesSociais"),
  
  // Morada (JSON)
  morada: text("morada").notNull(),
  
  // Outros
  anoFundacao: int("anoFundacao"),
  numeroFuncionarios: int("numeroFuncionarios"),
  especialidades: text("especialidades"), // JSON array
  
  // Horário de funcionamento (JSON)
  horarioFuncionamento: text("horarioFuncionamento"),
  
  // Branding
  logoPrincipal: text("logoPrincipal"),
  logoSecundario: text("logoSecundario"),
  favicon: text("favicon"),
  paletaCores: text("paletaCores"), // JSON
  
  // Configurações de documentos
  papelTimbrado: text("papelTimbrado"), // JSON
  nomeSistema: varchar("nomeSistema", { length: 100 }),
  slogan: varchar("slogan", { length: 200 }),
  
  // Auditoria
  criadoEm: timestamp("criadoEm").defaultNow(),
  atualizadoEm: timestamp("atualizadoEm").defaultNow().onUpdateNow(),
});

export type ConfigClinica = typeof configClinica.$inferSelect;
export type InsertConfigClinica = typeof configClinica.$inferInsert;

// ========================================
// FORMAS DE PAGAMENTO
// ========================================

export const formasPagamento = mysqlTable("formas_pagamento", {
  id: varchar("id", { length: 64 }).primaryKey(),
  nome: varchar("nome", { length: 100 }).notNull(),
  tipo: varchar("tipo", { length: 50 }).notNull(),
  ativo: boolean("ativo").default(true),
  
  // Configurações
  icone: varchar("icone", { length: 50 }),
  cor: varchar("cor", { length: 7 }),
  ordem: int("ordem").default(0),
  
  // Taxas (JSON)
  taxa: text("taxa"),
  
  // Limites
  valorMinimo: decimal("valorMinimo", { precision: 10, scale: 2 }),
  valorMaximo: decimal("valorMaximo", { precision: 10, scale: 2 }),
  
  // Integração (JSON)
  integracao: text("integracao"),
  
  // Observações
  observacoes: text("observacoes"),
  requerReferencia: boolean("requerReferencia").default(false),
  
  // Auditoria
  criadoEm: timestamp("criadoEm").defaultNow(),
  atualizadoEm: timestamp("atualizadoEm").defaultNow().onUpdateNow(),
});

export type FormaPagamento = typeof formasPagamento.$inferSelect;
export type InsertFormaPagamento = typeof formasPagamento.$inferInsert;

// ========================================
// STAFF/FUNCIONÁRIOS
// ========================================

export const funcionarios = mysqlTable("funcionarios", {
  id: varchar("id", { length: 64 }).primaryKey(),
  nome: varchar("nome", { length: 200 }).notNull(),
  foto: text("foto"),
  
  // Documentos
  nif: varchar("nif", { length: 9 }).notNull(),
  numeroSegSocial: varchar("numeroSegSocial", { length: 20 }),
  
  // Contactos
  email: varchar("email", { length: 320 }).notNull(),
  telefone: varchar("telefone", { length: 20 }).notNull(),
  
  // Profissional
  cargo: varchar("cargo", { length: 100 }).notNull(),
  dataAdmissao: varchar("dataAdmissao", { length: 10 }).notNull(),
  status: pgEnum("status", ["ativo", "inativo", "ferias", "licenca"]).notNull().default("ativo"),
  
  // Horário (JSON)
  horarioTrabalho: text("horarioTrabalho"),
  
  // Financeiro (JSON)
  salario: text("salario"),
  
  // Acesso ao sistema (JSON)
  usuario: text("usuario"),
  
  // Auditoria
  criadoEm: timestamp("criadoEm").defaultNow(),
  atualizadoEm: timestamp("atualizadoEm").defaultNow().onUpdateNow(),
});

export type Funcionario = typeof funcionarios.$inferSelect;
export type InsertFuncionario = typeof funcionarios.$inferInsert;



// ========================================
// CADASTRO DE LABORATÓRIOS
// ========================================

export const cadastroLaboratorios = mysqlTable("cadastro_laboratorios", {
  id: varchar("id", { length: 64 }).primaryKey(),
  
  // Dados básicos
  nome: varchar("nome", { length: 200 }).notNull(),
  razaoSocial: varchar("razaoSocial", { length: 200 }),
  nif: varchar("nif", { length: 9 }),
  
  // Contactos
  telefone: varchar("telefone", { length: 20 }).notNull(),
  telemovel: varchar("telemovel", { length: 20 }),
  email: varchar("email", { length: 320 }),
  whatsapp: varchar("whatsapp", { length: 20 }),
  website: varchar("website", { length: 200 }),
  
  // Morada
  morada: text("morada"),
  cidade: varchar("cidade", { length: 100 }),
  codigoPostal: varchar("codigoPostal", { length: 10 }),
  pais: varchar("pais", { length: 50 }).default("Portugal"),
  
  // Informações profissionais
  responsavelTecnico: varchar("responsavelTecnico", { length: 200 }),
  especialidades: text("especialidades"), // JSON array: ["protese", "ortodontia", "implantes"]
  prazoMedioEntrega: int("prazoMedioEntrega").default(7), // dias
  
  // Financeiro
  formasPagamentoAceitas: text("formasPagamentoAceitas"), // JSON array
  condicoesPagamento: varchar("condicoesPagamento", { length: 200 }), // ex: "30 dias", "à vista"
  
  // Status e avaliação
  status: pgEnum("status", ["ativo", "inativo"]).notNull().default("ativo"),
  avaliacaoQualidade: int("avaliacaoQualidade").default(5), // 1-5 estrelas
  
  // Observações
  observacoes: text("observacoes"),
  
  // Auditoria
  criadoEm: timestamp("criadoEm").defaultNow(),
  criadoPor: varchar("criadoPor", { length: 64 }),
  atualizadoEm: timestamp("atualizadoEm").defaultNow().onUpdateNow(),
});

export type CadastroLaboratorio = typeof cadastroLaboratorios.$inferSelect;
export type InsertCadastroLaboratorio = typeof cadastroLaboratorios.$inferInsert;

// ========================================
// TRABALHOS DE LABORATÓRIO
// ========================================

export const trabalhosLaboratorio = mysqlTable("trabalhos_laboratorio", {
  id: varchar("id", { length: 64 }).primaryKey(),
  
  // Referências
  laboratorioId: varchar("laboratorioId", { length: 64 }).notNull(),
  utenteId: varchar("utenteId", { length: 64 }).notNull(),
  dentistaId: varchar("dentistaId", { length: 64 }).notNull(),
  consultaId: varchar("consultaId", { length: 64 }),
  
  // Detalhes do trabalho
  tipoTrabalho: varchar("tipoTrabalho", { length: 100 }).notNull(), // "coroa", "ponte", "protese", "aparelho"
  descricao: text("descricao").notNull(),
  dentes: varchar("dentes", { length: 255 }), // "11, 12, 13"
  cor: varchar("cor", { length: 50 }),
  material: varchar("material", { length: 100 }),
  
  // Datas
  dataEnvio: varchar("dataEnvio", { length: 10 }),
  dataPrevisaoEntrega: varchar("dataPrevisaoEntrega", { length: 10 }),
  dataEntregaReal: varchar("dataEntregaReal", { length: 10 }),
  dataInstalacao: varchar("dataInstalacao", { length: 10 }),
  
  // Financeiro
  custoLaboratorio: decimal("custoLaboratorio", { precision: 10, scale: 2 }).notNull(),
  valorCobradoUtente: decimal("valorCobradoUtente", { precision: 10, scale: 2 }),
  margemLucro: decimal("margemLucro", { precision: 10, scale: 2 }),
  
  // Status
  status: pgEnum("status", ["orcamento", "enviado", "em_producao", "recebido", "instalado", "ajuste_necessario", "cancelado"]).default("orcamento"),
  
  // Qualidade
  avaliacaoQualidade: int("avaliacaoQualidade"), // 1-5
  necessitouAjuste: boolean("necessitouAjuste").default(false),
  
  // Observações
  observacoes: text("observacoes"),
  observacoesInternas: text("observacoesInternas"),
  
  // Auditoria
  criadoEm: timestamp("criadoEm").defaultNow(),
  criadoPor: varchar("criadoPor", { length: 64 }),
  atualizadoEm: timestamp("atualizadoEm").defaultNow().onUpdateNow(),
});

export type TrabalhoLaboratorio = typeof trabalhosLaboratorio.$inferSelect;
export type InsertTrabalhoLaboratorio = typeof trabalhosLaboratorio.$inferInsert;

// ========================================
// CATEGORIAS DE DESPESAS
// ========================================

export const categoriasDespesa = mysqlTable("categorias_despesa", {
  id: varchar("id", { length: 64 }).primaryKey(),
  
  nome: varchar("nome", { length: 100 }).notNull(),
  descricao: text("descricao"),
  tipo: pgEnum("tipo", ["fixa", "variavel"]).notNull(),
  icone: varchar("icone", { length: 50 }),
  cor: varchar("cor", { length: 7 }),
  
  // Hierarquia
  categoriaPai: varchar("categoriaPai", { length: 64 }), // para subcategorias
  ordem: int("ordem").default(0),
  
  // Status
  ativo: boolean("ativo").default(true),
  
  // Auditoria
  criadoEm: timestamp("criadoEm").defaultNow(),
  atualizadoEm: timestamp("atualizadoEm").defaultNow().onUpdateNow(),
});

export type CategoriaDespesa = typeof categoriasDespesa.$inferSelect;
export type InsertCategoriaDespesa = typeof categoriasDespesa.$inferInsert;

// ========================================
// FORNECEDORES
// ========================================

export const fornecedores = mysqlTable("fornecedores", {
  id: varchar("id", { length: 64 }).primaryKey(),
  
  // Dados básicos
  nome: varchar("nome", { length: 200 }).notNull(),
  razaoSocial: varchar("razaoSocial", { length: 200 }),
  nif: varchar("nif", { length: 9 }),
  tipo: pgEnum("tipo", ["materiais", "equipamentos", "servicos", "laboratorio", "outros"]).notNull(),
  
  // Contactos
  telefone: varchar("telefone", { length: 20 }),
  email: varchar("email", { length: 320 }),
  website: varchar("website", { length: 200 }),
  
  // Morada
  morada: text("morada"),
  
  // Comercial
  nomeContato: varchar("nomeContato", { length: 200 }),
  telefoneContato: varchar("telefoneContato", { length: 20 }),
  emailContato: varchar("emailContato", { length: 320 }),
  
  // Financeiro
  condicoesPagamento: varchar("condicoesPagamento", { length: 200 }),
  
  // Status
  status: pgEnum("status", ["ativo", "inativo"]).notNull().default("ativo"),
  
  // Observações
  observacoes: text("observacoes"),
  
  // Auditoria
  criadoEm: timestamp("criadoEm").defaultNow(),
  atualizadoEm: timestamp("atualizadoEm").defaultNow().onUpdateNow(),
});

export type Fornecedor = typeof fornecedores.$inferSelect;
export type InsertFornecedor = typeof fornecedores.$inferInsert;

// ========================================
// CONTAS A PAGAR
// ========================================

export const contasPagar = mysqlTable("contas_pagar", {
  id: varchar("id", { length: 64 }).primaryKey(),
  
  // Referências
  fornecedorId: varchar("fornecedorId", { length: 64 }),
  categoriaId: varchar("categoriaId", { length: 64 }).notNull(),
  trabalhoLaboratorioId: varchar("trabalhoLaboratorioId", { length: 64 }), // se for despesa de laboratório
  
  // Dados da despesa
  descricao: varchar("descricao", { length: 255 }).notNull(),
  numeroDocumento: varchar("numeroDocumento", { length: 50 }), // número da fatura/recibo
  
  // Valores
  valor: decimal("valor", { precision: 10, scale: 2 }).notNull(),
  valorPago: decimal("valorPago", { precision: 10, scale: 2 }).default("0"),
  valorRestante: decimal("valorRestante", { precision: 10, scale: 2 }).notNull(),
  
  // Datas
  dataEmissao: varchar("dataEmissao", { length: 10 }).notNull(),
  dataVencimento: varchar("dataVencimento", { length: 10 }).notNull(),
  dataPagamento: varchar("dataPagamento", { length: 10 }),
  
  // Status
  status: pgEnum("status", ["pendente", "paga", "parcial", "vencida", "cancelada"]).notNull().default("pendente"),
  
  // Recorrência
  recorrente: boolean("recorrente").default(false),
  frequenciaRecorrencia: pgEnum("frequenciaRecorrencia", ["mensal", "trimestral", "semestral", "anual"]),
  
  // Anexos
  anexos: text("anexos"), // JSON array de URLs
  
  // Observações
  observacoes: text("observacoes"),
  
  // Auditoria
  criadoEm: timestamp("criadoEm").defaultNow(),
  criadoPor: varchar("criadoPor", { length: 64 }),
  atualizadoEm: timestamp("atualizadoEm").defaultNow().onUpdateNow(),
});

export type ContaPagar = typeof contasPagar.$inferSelect;
export type InsertContaPagar = typeof contasPagar.$inferInsert;

// ========================================
// PAGAMENTOS DE CONTAS A PAGAR
// ========================================

export const pagamentosContasPagar = mysqlTable("pagamentos_contas_pagar", {
  id: varchar("id", { length: 64 }).primaryKey(),
  
  contaPagarId: varchar("contaPagarId", { length: 64 }).notNull(),
  
  // Dados do pagamento
  valor: decimal("valor", { precision: 10, scale: 2 }).notNull(),
  dataPagamento: varchar("dataPagamento", { length: 10 }).notNull(),
  formaPagamento: varchar("formaPagamento", { length: 50 }).notNull(),
  
  // Referência
  referencia: varchar("referencia", { length: 100 }),
  comprovante: text("comprovante"), // URL do comprovante
  
  // Observações
  observacoes: text("observacoes"),
  
  // Auditoria
  criadoEm: timestamp("criadoEm").defaultNow(),
  criadoPor: varchar("criadoPor", { length: 64 }),
});

export type PagamentoContaPagar = typeof pagamentosContasPagar.$inferSelect;
export type InsertPagamentoContaPagar = typeof pagamentosContasPagar.$inferInsert;

// ========================================
// CONTAS A RECEBER (FATURAS/RECEBIMENTOS)
// ========================================

export const contasReceber = mysqlTable("contas_receber", {
  id: varchar("id", { length: 64 }).primaryKey(),
  
  // Referências
  utenteId: varchar("utenteId", { length: 64 }).notNull(),
  dentistaId: varchar("dentistaId", { length: 64 }),
  consultaId: varchar("consultaId", { length: 64 }),
  
  // Dados da fatura
  numeroFatura: varchar("numeroFatura", { length: 50 }).notNull().unique(),
  serie: varchar("serie", { length: 10 }).default("FT"),
  tipo: pgEnum("tipo", ["fatura", "recibo", "fatura_recibo", "nota_credito"]).notNull().default("fatura"),
  
  // Valores
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  descontoTotal: decimal("descontoTotal", { precision: 10, scale: 2 }).default("0"),
  ivaTotal: decimal("ivaTotal", { precision: 10, scale: 2 }).default("0"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  valorPago: decimal("valorPago", { precision: 10, scale: 2 }).default("0"),
  valorRestante: decimal("valorRestante", { precision: 10, scale: 2 }).notNull(),
  
  // Comissões do Dentista
  dentistaPercentagem: decimal("dentistaPercentagem", { precision: 5, scale: 2 }).default("0"),
  dentistaComissao: decimal("dentistaComissao", { precision: 10, scale: 2 }).default("0"),
  valorClinica: decimal("valorClinica", { precision: 10, scale: 2 }).default("0"),
  
  // Datas
  dataEmissao: varchar("dataEmissao", { length: 10 }).notNull(),
  dataVencimento: varchar("dataVencimento", { length: 10 }).notNull(),
  
  // Status
  status: pgEnum("status", ["pendente", "paga", "parcial", "vencida", "cancelada"]).notNull().default("pendente"),
  
  // Itens da fatura (JSON)
  itens: text("itens").notNull(), // JSON array de itens
  
  // Observações
  observacoes: text("observacoes"),
  
  // Auditoria
  criadoEm: timestamp("criadoEm").defaultNow(),
  criadoPor: varchar("criadoPor", { length: 64 }),
  atualizadoEm: timestamp("atualizadoEm").defaultNow().onUpdateNow(),
});

export type ContaReceber = typeof contasReceber.$inferSelect;
export type InsertContaReceber = typeof contasReceber.$inferInsert;

// ========================================
// PAGAMENTOS DE CONTAS A RECEBER
// ========================================

export const pagamentosContasReceber = mysqlTable("pagamentos_contas_receber", {
  id: varchar("id", { length: 64 }).primaryKey(),
  
  contaReceberId: varchar("contaReceberId", { length: 64 }).notNull(),
  
  // Dados do pagamento
  valor: decimal("valor", { precision: 10, scale: 2 }).notNull(),
  dataPagamento: varchar("dataPagamento", { length: 10 }).notNull(),
  formaPagamentoId: varchar("formaPagamentoId", { length: 64 }).notNull(),
  
  // Referência
  referencia: varchar("referencia", { length: 100 }),
  comprovante: text("comprovante"), // URL do comprovante
  
  // Taxas (para cartão de crédito, etc)
  taxaOperacao: decimal("taxaOperacao", { precision: 10, scale: 2 }).default("0"),
  valorLiquido: decimal("valorLiquido", { precision: 10, scale: 2 }).notNull(),
  
  // Observações
  observacoes: text("observacoes"),
  
  // Auditoria
  criadoEm: timestamp("criadoEm").defaultNow(),
  criadoPor: varchar("criadoPor", { length: 64 }),
});

export type PagamentoContaReceber = typeof pagamentosContasReceber.$inferSelect;
export type InsertPagamentoContaReceber = typeof pagamentosContasReceber.$inferInsert;

// ========================================
// MOVIMENTOS DE CAIXA
// ========================================

export const movimentosCaixa = mysqlTable("movimentos_caixa", {
  id: varchar("id", { length: 64 }).primaryKey(),
  
  // Tipo de movimento
  tipo: pgEnum("tipo", ["entrada", "saida", "abertura", "fechamento", "sangria", "reforco"]).notNull(),
  
  // Referências
  contaReceberId: varchar("contaReceberId", { length: 64 }),
  contaPagarId: varchar("contaPagarId", { length: 64 }),
  
  // Dados do movimento
  descricao: varchar("descricao", { length: 255 }).notNull(),
  valor: decimal("valor", { precision: 10, scale: 2 }).notNull(),
  formaPagamento: varchar("formaPagamento", { length: 50 }).notNull(),
  
  // Data e hora
  dataHora: datetime("dataHora").notNull(),
  
  // Saldos
  saldoAnterior: decimal("saldoAnterior", { precision: 10, scale: 2 }),
  saldoAtual: decimal("saldoAtual", { precision: 10, scale: 2 }),
  
  // Observações
  observacoes: text("observacoes"),
  
  // Auditoria
  criadoEm: timestamp("criadoEm").defaultNow(),
  criadoPor: varchar("criadoPor", { length: 64 }),
});

export type MovimentoCaixa = typeof movimentosCaixa.$inferSelect;
export type InsertMovimentoCaixa = typeof movimentosCaixa.$inferInsert;

