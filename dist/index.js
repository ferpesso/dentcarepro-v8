var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// drizzle/schema.ts
var schema_exports = {};
__export(schema_exports, {
  auditLog: () => auditLog,
  comissoes: () => comissoes,
  configClinica: () => configClinica,
  configComissoes: () => configComissoes,
  consultas: () => consultas,
  contasPagar: () => contasPagar,
  dentistas: () => dentistas,
  faturas: () => faturas,
  historicoUtente: () => historicoUtente,
  itensFatura: () => itensFatura,
  laboratorios: () => laboratorios,
  notifications: () => notifications,
  pagamentos: () => pagamentos,
  prescricoes: () => prescricoes,
  procedimentosClinicos: () => procedimentosClinicos,
  tabelaPrecos: () => tabelaPrecos,
  trabalhosLaboratorio: () => trabalhosLaboratorio,
  tratamentos: () => tratamentos,
  userPermissions: () => userPermissions,
  userSessions: () => userSessions,
  users: () => users,
  utentes: () => utentes
});
import { pgTable, varchar, text, timestamp, integer, decimal, boolean, date } from "drizzle-orm/pg-core";
var users, userSessions, utentes, consultas, tratamentos, faturas, itensFatura, pagamentos, prescricoes, comissoes, configComissoes, laboratorios, trabalhosLaboratorio, contasPagar, dentistas, historicoUtente, procedimentosClinicos, tabelaPrecos, auditLog, notifications, userPermissions, configClinica;
var init_schema = __esm({
  "drizzle/schema.ts"() {
    "use strict";
    users = pgTable("users", {
      id: varchar("id", { length: 255 }).primaryKey(),
      name: varchar("name", { length: 255 }).notNull(),
      email: varchar("email", { length: 255 }).notNull(),
      passwordHash: varchar("password_hash", { length: 255 }),
      role: varchar("role", { length: 50 }).default("user").notNull(),
      status: varchar("status", { length: 50 }).default("active").notNull(),
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
      updatedAt: timestamp("updated_at").defaultNow()
    });
    userSessions = pgTable("user_sessions", {
      id: varchar("id", { length: 255 }).primaryKey(),
      userId: varchar("user_id", { length: 255 }).notNull(),
      token: text("token").notNull(),
      expiresAt: timestamp("expires_at").notNull(),
      createdAt: timestamp("created_at").defaultNow()
    });
    utentes = pgTable("utentes", {
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
      updatedAt: timestamp("updated_at").defaultNow()
    });
    consultas = pgTable("consultas", {
      id: varchar("id", { length: 255 }).primaryKey(),
      utenteId: varchar("utente_id", { length: 255 }),
      dentistaId: varchar("dentista_id", { length: 255 }),
      dataHora: timestamp("data_hora").notNull(),
      duracao: integer("duracao").default(30),
      tipo: varchar("tipo", { length: 100 }),
      status: varchar("status", { length: 50 }).default("agendada"),
      notas: text("notas"),
      valor: decimal("valor", { precision: 10, scale: 2 }),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    tratamentos = pgTable("tratamentos", {
      id: varchar("id", { length: 255 }).primaryKey(),
      utenteId: varchar("utente_id", { length: 255 }),
      consultaId: varchar("consulta_id", { length: 255 }),
      dentistaId: varchar("dentista_id", { length: 255 }),
      tipo: varchar("tipo", { length: 100 }).notNull(),
      descricao: text("descricao"),
      dente: varchar("dente", { length: 10 }),
      faces: varchar("faces", { length: 50 }),
      valor: decimal("valor", { precision: 10, scale: 2 }),
      status: varchar("status", { length: 50 }).default("planejado"),
      dataPlanejamento: date("data_planejamento"),
      dataRealizacao: date("data_realizacao"),
      notas: text("notas"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    faturas = pgTable("faturas", {
      id: varchar("id", { length: 255 }).primaryKey(),
      utenteId: varchar("utente_id", { length: 255 }),
      consultaId: varchar("consulta_id", { length: 255 }),
      numeroFatura: varchar("numero_fatura", { length: 100 }),
      dataEmissao: date("data_emissao").notNull(),
      dataVencimento: date("data_vencimento"),
      valorTotal: decimal("valor_total", { precision: 10, scale: 2 }).notNull(),
      valorPago: decimal("valor_pago", { precision: 10, scale: 2 }).default("0"),
      desconto: decimal("desconto", { precision: 10, scale: 2 }).default("0"),
      status: varchar("status", { length: 50 }).default("pendente"),
      metodoPagamento: varchar("metodo_pagamento", { length: 50 }),
      observacoes: text("observacoes"),
      notas: text("notas"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    itensFatura = pgTable("itens_fatura", {
      id: varchar("id", { length: 255 }).primaryKey(),
      faturaId: varchar("fatura_id", { length: 255 }),
      tratamentoId: varchar("tratamento_id", { length: 255 }),
      descricao: varchar("descricao", { length: 255 }).notNull(),
      quantidade: integer("quantidade").default(1),
      valorUnitario: decimal("valor_unitario", { precision: 10, scale: 2 }).notNull(),
      valorTotal: decimal("valor_total", { precision: 10, scale: 2 }).notNull(),
      createdAt: timestamp("created_at").defaultNow()
    });
    pagamentos = pgTable("pagamentos", {
      id: varchar("id", { length: 255 }).primaryKey(),
      faturaId: varchar("fatura_id", { length: 255 }),
      valor: decimal("valor", { precision: 10, scale: 2 }).notNull(),
      formaPagamento: varchar("forma_pagamento", { length: 50 }).notNull(),
      dataPagamento: date("data_pagamento").notNull(),
      referencia: varchar("referencia", { length: 100 }),
      notas: text("notas"),
      createdAt: timestamp("created_at").defaultNow()
    });
    prescricoes = pgTable("prescricoes", {
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
      createdAt: timestamp("created_at").defaultNow()
    });
    comissoes = pgTable("comissoes", {
      id: varchar("id", { length: 255 }).primaryKey(),
      dentistaId: varchar("dentista_id", { length: 255 }),
      faturaId: varchar("fatura_id", { length: 255 }),
      valor: decimal("valor", { precision: 10, scale: 2 }).notNull(),
      percentagem: decimal("percentagem", { precision: 5, scale: 2 }),
      status: varchar("status", { length: 50 }).default("pendente"),
      dataPagamento: date("data_pagamento"),
      createdAt: timestamp("created_at").defaultNow()
    });
    configComissoes = pgTable("config_comissoes", {
      id: varchar("id", { length: 255 }).primaryKey(),
      dentistaId: varchar("dentista_id", { length: 255 }),
      percentagemPadrao: decimal("percentagem_padrao", { precision: 5, scale: 2 }),
      percentagemConsulta: decimal("percentagem_consulta", { precision: 5, scale: 2 }),
      percentagemTratamento: decimal("percentagem_tratamento", { precision: 5, scale: 2 }),
      ativo: boolean("ativo").default(true),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    laboratorios = pgTable("laboratorios", {
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
      updatedAt: timestamp("updated_at").defaultNow()
    });
    trabalhosLaboratorio = pgTable("trabalhos_laboratorio", {
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
      status: varchar("status", { length: 50 }).default("enviado"),
      notas: text("notas"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    contasPagar = pgTable("contas_pagar", {
      id: varchar("id", { length: 255 }).primaryKey(),
      descricao: varchar("descricao", { length: 255 }).notNull(),
      fornecedor: varchar("fornecedor", { length: 255 }),
      categoria: varchar("categoria", { length: 100 }),
      valor: decimal("valor", { precision: 10, scale: 2 }).notNull(),
      dataVencimento: date("data_vencimento").notNull(),
      dataPagamento: date("data_pagamento"),
      formaPagamento: varchar("forma_pagamento", { length: 50 }),
      status: varchar("status", { length: 50 }).default("pendente"),
      notas: text("notas"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    dentistas = pgTable("dentistas", {
      id: varchar("id", { length: 255 }).primaryKey(),
      userId: varchar("user_id", { length: 255 }),
      nome: varchar("nome", { length: 255 }).notNull(),
      especialidade: varchar("especialidade", { length: 100 }),
      numeroOrdem: varchar("numero_ordem", { length: 50 }),
      telefone: varchar("telefone", { length: 50 }),
      email: varchar("email", { length: 255 }),
      ativo: boolean("ativo").default(true),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    historicoUtente = pgTable("historico_utente", {
      id: varchar("id", { length: 255 }).primaryKey(),
      utenteId: varchar("utente_id", { length: 255 }),
      consultaId: varchar("consulta_id", { length: 255 }),
      tipo: varchar("tipo", { length: 100 }),
      descricao: text("descricao"),
      data: timestamp("data").defaultNow(),
      criadoPor: varchar("criado_por", { length: 255 }),
      createdAt: timestamp("created_at").defaultNow()
    });
    procedimentosClinicos = pgTable("procedimentos_clinicos", {
      id: varchar("id", { length: 255 }).primaryKey(),
      codigo: varchar("codigo", { length: 50 }),
      nome: varchar("nome", { length: 255 }).notNull(),
      descricao: text("descricao"),
      categoria: varchar("categoria", { length: 100 }),
      valorBase: decimal("valor_base", { precision: 10, scale: 2 }),
      duracaoEstimada: integer("duracao_estimada"),
      ativo: boolean("ativo").default(true),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    tabelaPrecos = pgTable("tabela_precos", {
      id: varchar("id", { length: 255 }).primaryKey(),
      procedimentoId: varchar("procedimento_id", { length: 255 }),
      nome: varchar("nome", { length: 255 }).notNull(),
      preco: decimal("preco", { precision: 10, scale: 2 }).notNull(),
      categoria: varchar("categoria", { length: 100 }),
      ativo: boolean("ativo").default(true),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    auditLog = pgTable("audit_log", {
      id: varchar("id", { length: 255 }).primaryKey(),
      userId: varchar("user_id", { length: 255 }),
      acao: varchar("acao", { length: 100 }).notNull(),
      tabela: varchar("tabela", { length: 100 }),
      registroId: varchar("registro_id", { length: 255 }),
      dadosAntigos: text("dados_antigos"),
      dadosNovos: text("dados_novos"),
      ipAddress: varchar("ip_address", { length: 45 }),
      userAgent: text("user_agent"),
      createdAt: timestamp("created_at").defaultNow()
    });
    notifications = pgTable("notifications", {
      id: varchar("id", { length: 255 }).primaryKey(),
      userId: varchar("user_id", { length: 255 }),
      tipo: varchar("tipo", { length: 50 }),
      titulo: varchar("titulo", { length: 255 }),
      mensagem: text("mensagem"),
      lida: boolean("lida").default(false),
      link: varchar("link", { length: 500 }),
      createdAt: timestamp("created_at").defaultNow()
    });
    userPermissions = pgTable("user_permissions", {
      id: varchar("id", { length: 255 }).primaryKey(),
      userId: varchar("user_id", { length: 255 }),
      permissao: varchar("permissao", { length: 100 }).notNull(),
      ativo: boolean("ativo").default(true),
      createdAt: timestamp("created_at").defaultNow()
    });
    configClinica = pgTable("config_clinica", {
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
      updatedAt: timestamp("updated_at").defaultNow()
    });
  }
});

// server/db-mock.ts
async function getUser(userId) {
  return mockUsers.get(userId) || null;
}
async function upsertUser(user) {
  if (!user.id) {
    throw new Error("User ID is required for upsert");
  }
  const existing = mockUsers.get(user.id);
  mockUsers.set(user.id, {
    ...existing,
    ...user,
    lastSignedIn: user.lastSignedIn || (/* @__PURE__ */ new Date()).toISOString()
  });
}
async function removerUtente(id) {
  mockUtentes.delete(id);
  return { sucesso: true };
}
var mockUsers, mockUtentes, demoUtentes;
var init_db_mock = __esm({
  "server/db-mock.ts"() {
    "use strict";
    mockUsers = /* @__PURE__ */ new Map();
    mockUtentes = /* @__PURE__ */ new Map();
    mockUsers.set("demo-user-001", {
      id: "demo-user-001",
      name: "Utilizador de Desenvolvimento",
      email: "demo@dentcarepro.local",
      loginMethod: "demo",
      lastSignedIn: (/* @__PURE__ */ new Date()).toISOString()
    });
    demoUtentes = [
      {
        id: "utente-001",
        codigo: "U001",
        nome: "Maria Silva Santos",
        dataNascimento: "1983-05-15",
        sexo: "F",
        nif: "912345678",
        numeroSNS: "123456789",
        telefone: "912345678",
        email: "maria.silva@email.pt",
        morada: "Rua das Flores, 123",
        codigoPostal: "1000-100",
        localidade: "Lisboa",
        estadoCivil: "Casado(a)",
        profissao: "Professora",
        observacoes: "Alergia a penicilina",
        consentimentoRGPD: true,
        estado: "ativo",
        criadoEm: (/* @__PURE__ */ new Date()).toISOString(),
        atualizadoEm: (/* @__PURE__ */ new Date()).toISOString()
      },
      {
        id: "utente-002",
        codigo: "U002",
        nome: "Jo\xE3o Pedro Costa",
        dataNascimento: "1990-08-22",
        sexo: "M",
        nif: "923456789",
        numeroSNS: "234567890",
        telefone: "923456789",
        email: "joao.costa@email.pt",
        morada: "Av. da Liberdade, 456",
        codigoPostal: "1200-200",
        localidade: "Porto",
        estadoCivil: "Solteiro(a)",
        profissao: "Engenheiro",
        observacoes: "",
        consentimentoRGPD: true,
        estado: "ativo",
        criadoEm: (/* @__PURE__ */ new Date()).toISOString(),
        atualizadoEm: (/* @__PURE__ */ new Date()).toISOString()
      },
      {
        id: "utente-003",
        codigo: "U003",
        nome: "Ana Rita Ferreira",
        dataNascimento: "1978-12-03",
        sexo: "F",
        nif: "934567890",
        numeroSNS: "345678901",
        telefone: "934567890",
        email: "ana.ferreira@email.pt",
        morada: "Pra\xE7a do Com\xE9rcio, 789",
        codigoPostal: "1300-300",
        localidade: "Coimbra",
        estadoCivil: "Divorciado(a)",
        profissao: "M\xE9dica",
        observacoes: "Prefer\xEAncia por consultas de manh\xE3",
        consentimentoRGPD: true,
        estado: "ativo",
        criadoEm: (/* @__PURE__ */ new Date()).toISOString(),
        atualizadoEm: (/* @__PURE__ */ new Date()).toISOString()
      },
      {
        id: "utente-004",
        codigo: "U004",
        nome: "Carlos Manuel Oliveira",
        dataNascimento: "1965-03-18",
        sexo: "M",
        nif: "945678901",
        numeroSNS: "456789012",
        telefone: "945678901",
        email: "carlos.oliveira@email.pt",
        morada: "Rua do Norte, 321",
        codigoPostal: "1400-400",
        localidade: "Braga",
        estadoCivil: "Casado(a)",
        profissao: "Empres\xE1rio",
        observacoes: "",
        consentimentoRGPD: true,
        estado: "ativo",
        criadoEm: (/* @__PURE__ */ new Date()).toISOString(),
        atualizadoEm: (/* @__PURE__ */ new Date()).toISOString()
      },
      {
        id: "utente-005",
        codigo: "U005",
        nome: "Sofia Marques Rodrigues",
        dataNascimento: "2000-07-25",
        sexo: "F",
        nif: "956789012",
        numeroSNS: "567890123",
        telefone: "956789012",
        email: "sofia.rodrigues@email.pt",
        morada: "Alameda dos Oceanos, 654",
        codigoPostal: "1500-500",
        localidade: "Faro",
        estadoCivil: "Solteiro(a)",
        profissao: "Estudante",
        observacoes: "Tratamento ortod\xF4ntico em curso",
        consentimentoRGPD: true,
        estado: "ativo",
        criadoEm: (/* @__PURE__ */ new Date()).toISOString(),
        atualizadoEm: (/* @__PURE__ */ new Date()).toISOString()
      }
    ];
    demoUtentes.forEach((utente) => mockUtentes.set(utente.id, utente));
  }
});

// server/db.ts
var db_exports = {};
__export(db_exports, {
  atualizarConsulta: () => atualizarConsulta,
  atualizarLaboratorio: () => atualizarLaboratorio,
  atualizarUtente: () => atualizarUtente,
  criarComissao: () => criarComissao,
  criarConsulta: () => criarConsulta,
  criarLaboratorio: () => criarLaboratorio,
  criarUtente: () => criarUtente,
  db: () => db,
  excluirLaboratorio: () => excluirLaboratorio,
  getDb: () => getDb,
  getUser: () => getUser2,
  getUtente: () => getUtente2,
  getUtentes: () => getUtentes2,
  getUtentesStats: () => getUtentesStats2,
  listarComissoesDentista: () => listarComissoesDentista,
  listarConsultas: () => listarConsultas,
  listarConsultasPorData: () => listarConsultasPorData,
  listarConsultasPorMedico: () => listarConsultasPorMedico,
  listarConsultasPorPeriodo: () => listarConsultasPorPeriodo,
  listarLaboratorios: () => listarLaboratorios,
  listarUtentes: () => listarUtentes,
  obterConfigComissao: () => obterConfigComissao,
  obterConsulta: () => obterConsulta,
  obterEstatisticasConsultas: () => obterEstatisticasConsultas,
  obterEstatisticasUtentes: () => obterEstatisticasUtentes,
  obterLaboratorio: () => obterLaboratorio,
  obterUtente: () => obterUtente,
  pagarComissao: () => pagarComissao,
  pesquisarUtentes: () => pesquisarUtentes,
  removerConsulta: () => removerConsulta,
  removerLaboratorio: () => removerLaboratorio,
  removerUtente: () => removerUtente2,
  salvarConfigComissao: () => salvarConfigComissao,
  schema: () => schema_exports,
  upsertUser: () => upsertUser2,
  verificarConflito: () => verificarConflito
});
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { eq, sql } from "drizzle-orm";
async function getUser2(userId) {
  if (useMockData) return getUser(userId);
  return db.query.users.findFirst({ where: (users2, { eq: eq2 }) => eq2(users2.id, userId) });
}
async function upsertUser2(user) {
  if (useMockData) return upsertUser(user);
  return db.insert(users).values(user).onConflictDoUpdate({ target: users.id, set: user });
}
async function getUtentes2() {
  if (useMockData) return (void 0)();
  return db.query.utentes.findMany();
}
async function listarUtentes() {
  if (useMockData) return (void 0)();
  return db.query.utentes.findMany({
    orderBy: (utentes2, { desc }) => [desc(utentes2.criadoEm)]
  });
}
async function getUtente2(id) {
  if (useMockData) return (void 0)(id);
  return db.query.utentes.findFirst({ where: (utentes2, { eq: eq2 }) => eq2(utentes2.id, id) });
}
async function obterUtente(id) {
  return getUtente2(id);
}
async function pesquisarUtentes(termo) {
  if (useMockData) return [];
  try {
    const result = await db.query.utentes.findMany({
      where: (utentes2, { or, like: like2 }) => or(
        like2(utentes2.nomeCompleto, `%${termo}%`),
        like2(utentes2.nif, `%${termo}%`),
        like2(utentes2.numeroUtente, `%${termo}%`)
      ),
      limit: 50
    });
    return result;
  } catch (error) {
    console.error("[DB] Erro ao pesquisar utentes:", error);
    return [];
  }
}
async function criarUtente(dados) {
  if (useMockData) return { id: "mock-utente-id", ...dados };
  try {
    const id = `utente-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const numeroUtente = `U${Date.now().toString().substr(-8)}`;
    const dadosInsert = {
      id,
      numeroUtente,
      nomeCompleto: dados.nomeCompleto,
      dataNascimento: dados.dataNascimento,
      genero: dados.genero,
      nif: dados.nif || null,
      numUtenteSns: dados.numUtenteSns || null,
      fotoPerfil: dados.fotoPerfil || null,
      contacto: JSON.stringify(dados.contacto),
      morada: dados.morada ? JSON.stringify(dados.morada) : null,
      infoMedica: JSON.stringify(dados.infoMedica),
      status: dados.status || "ativo",
      tags: dados.tags ? JSON.stringify(dados.tags) : null,
      criadoPor: dados.criadoPor
    };
    await db.insert(utentes).values(dadosInsert);
    return { id, numeroUtente, ...dadosInsert };
  } catch (error) {
    console.error("[DB] Erro ao criar utente:", error);
    throw error;
  }
}
async function atualizarUtente(id, dados) {
  if (useMockData) return { id, ...dados };
  try {
    await db.update(utentes).set({
      ...dados,
      atualizadoEm: /* @__PURE__ */ new Date()
    }).where(eq(utentes.id, id));
    return { id, ...dados };
  } catch (error) {
    console.error("[DB] Erro ao atualizar utente:", error);
    throw error;
  }
}
async function removerUtente2(id) {
  if (useMockData) return removerUtente(id);
  try {
    await db.update(utentes).set({ status: "arquivado" }).where(eq(utentes.id, id));
    return { success: true };
  } catch (error) {
    console.error("[DB] Erro ao remover utente:", error);
    throw error;
  }
}
async function getUtentesStats2() {
  if (useMockData) return (void 0)();
  try {
    const result = await db.select({
      total: sql`count(*)`,
      ativos: sql`sum(case when status = 'ativo' then 1 else 0 end)`,
      inativos: sql`sum(case when status = 'inativo' then 1 else 0 end)`,
      arquivados: sql`sum(case when status = 'arquivado' then 1 else 0 end)`
    }).from(utentes);
    return {
      total: Number(result[0].total) || 0,
      ativos: Number(result[0].ativos) || 0,
      inativos: Number(result[0].inativos) || 0,
      arquivados: Number(result[0].arquivados) || 0
    };
  } catch (error) {
    console.error("[DB] Erro ao obter estat\xEDsticas de utentes:", error);
    return { total: 0, ativos: 0, inativos: 0, arquivados: 0 };
  }
}
async function obterEstatisticasUtentes() {
  return getUtentesStats2();
}
async function criarConsulta(dados) {
  if (useMockData) return { id: "mock-consulta-id", ...dados };
  try {
    const id = `consulta-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const dadosInsert = {
      id,
      utenteId: dados.utenteId,
      medicoId: dados.medicoId || null,
      dataHora: new Date(dados.dataHora),
      duracao: dados.duracao || 30,
      tipoConsulta: dados.tipoConsulta || null,
      procedimento: dados.procedimento || null,
      status: dados.status || "agendada",
      observacoes: dados.observacoes || null,
      valorEstimado: dados.valorEstimado || null,
      classificacaoRisco: dados.classificacaoRisco || null
    };
    await db.insert(consultas).values(dadosInsert);
    return { id, ...dadosInsert };
  } catch (error) {
    console.error("[DB] Erro ao criar consulta:", error);
    throw error;
  }
}
async function listarConsultas() {
  if (useMockData) return [];
  try {
    return db.query.consultas.findMany({
      orderBy: (consultas2, { desc }) => [desc(consultas2.dataHora)]
    });
  } catch (error) {
    console.error("[DB] Erro ao listar consultas:", error);
    return [];
  }
}
async function listarConsultasPorData(data) {
  if (useMockData) return [];
  try {
    const dataInicio = new Date(data);
    dataInicio.setHours(0, 0, 0, 0);
    const dataFim = new Date(data);
    dataFim.setHours(23, 59, 59, 999);
    return db.query.consultas.findMany({
      where: (consultas2, { and: and2, gte: gte2, lte: lte2 }) => and2(
        gte2(consultas2.dataHora, dataInicio),
        lte2(consultas2.dataHora, dataFim)
      ),
      orderBy: (consultas2, { asc }) => [asc(consultas2.dataHora)]
    });
  } catch (error) {
    console.error("[DB] Erro ao listar consultas por data:", error);
    return [];
  }
}
async function listarConsultasPorMedico(medicoId) {
  if (useMockData) return [];
  try {
    return db.query.consultas.findMany({
      where: (consultas2, { eq: eq2 }) => eq2(consultas2.medicoId, medicoId),
      orderBy: (consultas2, { desc }) => [desc(consultas2.dataHora)]
    });
  } catch (error) {
    console.error("[DB] Erro ao listar consultas por m\xE9dico:", error);
    return [];
  }
}
async function listarConsultasPorPeriodo(dataInicio, dataFim) {
  if (useMockData) return [];
  try {
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);
    return db.query.consultas.findMany({
      where: (consultas2, { and: and2, gte: gte2, lte: lte2 }) => and2(
        gte2(consultas2.dataHora, inicio),
        lte2(consultas2.dataHora, fim)
      ),
      orderBy: (consultas2, { asc }) => [asc(consultas2.dataHora)]
    });
  } catch (error) {
    console.error("[DB] Erro ao listar consultas por per\xEDodo:", error);
    return [];
  }
}
async function obterConsulta(id) {
  if (useMockData) return null;
  try {
    return db.query.consultas.findFirst({
      where: (consultas2, { eq: eq2 }) => eq2(consultas2.id, id)
    });
  } catch (error) {
    console.error("[DB] Erro ao obter consulta:", error);
    return null;
  }
}
async function atualizarConsulta(id, dados) {
  if (useMockData) return { id, ...dados };
  try {
    await db.update(consultas).set({
      ...dados,
      atualizadoEm: /* @__PURE__ */ new Date()
    }).where(eq(consultas.id, id));
    return { id, ...dados };
  } catch (error) {
    console.error("[DB] Erro ao atualizar consulta:", error);
    throw error;
  }
}
async function removerConsulta(id) {
  if (useMockData) return { success: true };
  try {
    await db.delete(consultas).where(eq(consultas.id, id));
    return { success: true };
  } catch (error) {
    console.error("[DB] Erro ao remover consulta:", error);
    throw error;
  }
}
async function verificarConflito(medicoId, dataHora, duracao = 30) {
  if (useMockData) return false;
  try {
    const dataInicio = new Date(dataHora);
    const dataFim = new Date(dataHora);
    dataFim.setMinutes(dataFim.getMinutes() + duracao);
    const consultas2 = await db.query.consultas.findMany({
      where: (consultas3, { and: and2, eq: eq2, gte: gte2, lte: lte2, or }) => and2(
        eq2(consultas3.medicoId, medicoId),
        or(
          and2(
            gte2(consultas3.dataHora, dataInicio),
            lte2(consultas3.dataHora, dataFim)
          )
        )
      )
    });
    return consultas2.length > 0;
  } catch (error) {
    console.error("[DB] Erro ao verificar conflito:", error);
    return false;
  }
}
async function obterEstatisticasConsultas() {
  if (useMockData) return { total: 0, agendadas: 0, realizadas: 0, canceladas: 0 };
  try {
    const result = await db.select({
      total: sql`count(*)`,
      agendadas: sql`sum(case when status = 'agendada' then 1 else 0 end)`,
      confirmadas: sql`sum(case when status = 'confirmada' then 1 else 0 end)`,
      realizadas: sql`sum(case when status = 'realizada' then 1 else 0 end)`,
      canceladas: sql`sum(case when status = 'cancelada' then 1 else 0 end)`,
      faltou: sql`sum(case when status = 'faltou' then 1 else 0 end)`
    }).from(consultas);
    return {
      total: Number(result[0].total) || 0,
      agendadas: Number(result[0].agendadas) || 0,
      confirmadas: Number(result[0].confirmadas) || 0,
      realizadas: Number(result[0].realizadas) || 0,
      canceladas: Number(result[0].canceladas) || 0,
      faltou: Number(result[0].faltou) || 0
    };
  } catch (error) {
    console.error("[DB] Erro ao obter estat\xEDsticas de consultas:", error);
    return { total: 0, agendadas: 0, confirmadas: 0, realizadas: 0, canceladas: 0, faltou: 0 };
  }
}
async function obterConfigComissao(dentistaId) {
  if (useMockData) return null;
  try {
    if (!configComissoes) {
      console.warn("[DB] Tabela config_comissoes n\xE3o encontrada no schema");
      return {
        dentistaId,
        percentualPadrao: 30,
        tipoCalculo: "percentual"
      };
    }
    return db.query.configComissoes.findFirst({
      where: (config, { eq: eq2 }) => eq2(config.dentistaId, dentistaId)
    });
  } catch (error) {
    console.error("[DB] Erro ao obter config de comiss\xE3o:", error);
    return {
      dentistaId,
      percentualPadrao: 30,
      tipoCalculo: "percentual"
    };
  }
}
async function criarComissao(dados) {
  if (useMockData) return { id: "mock-comissao-id", ...dados };
  try {
    if (!comissoes) {
      console.warn("[DB] Tabela comissoes n\xE3o encontrada no schema");
      return { id: "temp-comissao-id", ...dados };
    }
    const id = `comissao-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const dadosInsert = {
      id,
      dentistaId: dados.dentistaId,
      faturaId: dados.faturaId || null,
      valor: dados.valor,
      percentual: dados.percentual || null,
      status: dados.status || "pendente",
      dataCriacao: /* @__PURE__ */ new Date(),
      dataPagamento: dados.dataPagamento || null,
      observacoes: dados.observacoes || null
    };
    await db.insert(comissoes).values(dadosInsert);
    return { id, ...dadosInsert };
  } catch (error) {
    console.error("[DB] Erro ao criar comiss\xE3o:", error);
    throw error;
  }
}
async function listarComissoesDentista(dentistaId, mes) {
  if (useMockData) return [];
  try {
    if (!comissoes) {
      console.warn("[DB] Tabela comissoes n\xE3o encontrada no schema");
      return [];
    }
    if (mes) {
      const [ano, mesNum] = mes.split("-");
      const dataInicio = new Date(parseInt(ano), parseInt(mesNum) - 1, 1);
      const dataFim = new Date(parseInt(ano), parseInt(mesNum), 0, 23, 59, 59);
      return db.query.comissoes.findMany({
        where: (comissoes2, { and: and2, eq: eq2, gte: gte2, lte: lte2 }) => and2(
          eq2(comissoes2.dentistaId, dentistaId),
          gte2(comissoes2.dataCriacao, dataInicio),
          lte2(comissoes2.dataCriacao, dataFim)
        ),
        orderBy: (comissoes2, { desc }) => [desc(comissoes2.dataCriacao)]
      });
    } else {
      return db.query.comissoes.findMany({
        where: (comissoes2, { eq: eq2 }) => eq2(comissoes2.dentistaId, dentistaId),
        orderBy: (comissoes2, { desc }) => [desc(comissoes2.dataCriacao)]
      });
    }
  } catch (error) {
    console.error("[DB] Erro ao listar comiss\xF5es do dentista:", error);
    return [];
  }
}
async function getDb() {
  if (useMockData) {
    console.warn("[DB] getDb chamado em modo MOCK. Retornando null.");
    return null;
  }
  return pool;
}
async function pagarComissao(id, formaPagamento, dataPagamento) {
  if (useMockData) return { id, status: "pago" };
  try {
    if (!comissoes) {
      console.warn("[DB] Tabela comissoes n\xE3o encontrada no schema");
      return { id, status: "pago" };
    }
    await db.update(comissoes).set({
      status: "pago",
      dataPagamento: dataPagamento || /* @__PURE__ */ new Date(),
      formaPagamento
    }).where(eq(comissoes.id, id));
    return { id, status: "pago" };
  } catch (error) {
    console.error("[DB] Erro ao pagar comiss\xE3o:", error);
    throw error;
  }
}
async function salvarConfigComissao(dados) {
  if (useMockData) return { id: "mock-config-id", ...dados };
  try {
    if (!configComissoes) {
      console.warn("[DB] Tabela config_comissoes n\xE3o encontrada no schema");
      return { id: "temp-config-id", ...dados };
    }
    const id = dados.id || `config-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const dadosInsert = {
      id,
      dentistaId: dados.dentistaId,
      percentualPadrao: dados.percentualPadrao || 30,
      tipoCalculo: dados.tipoCalculo || "percentual",
      ativo: dados.ativo !== void 0 ? dados.ativo : true
    };
    await db.insert(configComissoes).values(dadosInsert).onConflictDoUpdate({
      target: configComissoes.dentistaId,
      set: dadosInsert
    });
    return { id, ...dadosInsert };
  } catch (error) {
    console.error("[DB] Erro ao salvar config de comiss\xE3o:", error);
    throw error;
  }
}
async function listarLaboratorios() {
  if (useMockData) return [];
  try {
    if (!laboratorios) {
      console.warn("[DB] Tabela laboratorios n\xE3o encontrada no schema");
      return [];
    }
    return db.query.laboratorios.findMany({
      orderBy: (laboratorios2, { asc }) => [asc(laboratorios2.nome)]
    });
  } catch (error) {
    console.error("[DB] Erro ao listar laborat\xF3rios:", error);
    return [];
  }
}
async function criarLaboratorio(dados) {
  if (useMockData) return { id: "mock-lab-id", ...dados };
  try {
    if (!laboratorios) {
      console.warn("[DB] Tabela laboratorios n\xE3o encontrada no schema");
      return { id: "temp-lab-id", ...dados };
    }
    const id = `lab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const dadosInsert = {
      id,
      nome: dados.nome,
      contacto: dados.contacto ? JSON.stringify(dados.contacto) : null,
      morada: dados.morada ? JSON.stringify(dados.morada) : null,
      especialidades: dados.especialidades ? JSON.stringify(dados.especialidades) : null,
      observacoes: dados.observacoes || null,
      ativo: dados.ativo !== void 0 ? dados.ativo : true
    };
    await db.insert(laboratorios).values(dadosInsert);
    return { id, ...dadosInsert };
  } catch (error) {
    console.error("[DB] Erro ao criar laborat\xF3rio:", error);
    throw error;
  }
}
async function atualizarLaboratorio(id, dados) {
  if (useMockData) return { id, ...dados };
  try {
    if (!laboratorios) {
      console.warn("[DB] Tabela laboratorios n\xE3o encontrada no schema");
      return { id, ...dados };
    }
    await db.update(laboratorios).set(dados).where(eq(laboratorios.id, id));
    return { id, ...dados };
  } catch (error) {
    console.error("[DB] Erro ao atualizar laborat\xF3rio:", error);
    throw error;
  }
}
async function removerLaboratorio(id) {
  if (useMockData) return { success: true };
  try {
    if (!laboratorios) {
      console.warn("[DB] Tabela laboratorios n\xE3o encontrada no schema");
      return { success: true };
    }
    await db.update(laboratorios).set({ ativo: false }).where(eq(laboratorios.id, id));
    return { success: true };
  } catch (error) {
    console.error("[DB] Erro ao remover laborat\xF3rio:", error);
    throw error;
  }
}
async function obterLaboratorio(id) {
  if (useMockData) return null;
  try {
    if (!laboratorios) {
      console.warn("[DB] Tabela laboratorios n\xE3o encontrada no schema");
      return null;
    }
    return db.query.laboratorios.findFirst({
      where: (laboratorios2, { eq: eq2 }) => eq2(laboratorios2.id, id)
    });
  } catch (error) {
    console.error("[DB] Erro ao obter laborat\xF3rio:", error);
    return null;
  }
}
async function excluirLaboratorio(id) {
  if (useMockData) return { success: true };
  try {
    if (!laboratorios) {
      console.warn("[DB] Tabela laboratorios n\xE3o encontrada no schema");
      return { success: true };
    }
    await db.update(laboratorios).set({ ativo: false }).where(eq(laboratorios.id, id));
    return { success: true };
  } catch (error) {
    console.error("[DB] Erro ao excluir laborat\xF3rio:", error);
    throw error;
  }
}
var Pool, pool, db, useMockData;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    init_schema();
    init_db_mock();
    ({ Pool } = pg);
    pool = null;
    db = null;
    if (process.env.DATABASE_URL) {
      try {
        pool = new Pool({
          connectionString: process.env.DATABASE_URL,
          max: 20,
          idleTimeoutMillis: 3e4,
          connectionTimeoutMillis: 1e4,
          ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
        });
        pool.on("connect", () => {
          console.log("[PostgreSQL] Connected to database");
        });
        pool.on("error", (err) => {
          console.error("[PostgreSQL] Unexpected error:", err);
          pool = null;
        });
        db = drizzle(pool, { schema: schema_exports });
        if (db) {
          db.schema = schema_exports;
        }
      } catch (error) {
        console.error("[PostgreSQL] Failed to create connection pool:", error);
        pool = null;
      }
    } else {
      console.warn("[DB] DATABASE_URL n\xE3o definida. A usar MOCK DATA.");
    }
    useMockData = !pool;
  }
});

// server/_core/env.ts
var ENV;
var init_env = __esm({
  "server/_core/env.ts"() {
    "use strict";
    ENV = {
      appId: process.env.VITE_APP_ID ?? "",
      cookieSecret: process.env.JWT_SECRET ?? "",
      databaseUrl: process.env.DATABASE_URL ?? "",
      oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
      ownerId: process.env.OWNER_OPEN_ID ?? "",
      isProduction: process.env.NODE_ENV === "production",
      forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
      forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? ""
    };
  }
});

// server/_core/llm.ts
async function invokeLLM(params) {
  assertApiKey();
  const {
    messages,
    tools,
    toolChoice,
    tool_choice,
    outputSchema,
    output_schema,
    responseFormat,
    response_format
  } = params;
  const payload = {
    model: "gemini-2.5-flash",
    messages: messages.map(normalizeMessage)
  };
  if (tools && tools.length > 0) {
    payload.tools = tools;
  }
  const normalizedToolChoice = normalizeToolChoice(
    toolChoice || tool_choice,
    tools
  );
  if (normalizedToolChoice) {
    payload.tool_choice = normalizedToolChoice;
  }
  payload.max_tokens = 32768;
  payload.thinking = {
    "budget_tokens": 128
  };
  const normalizedResponseFormat = normalizeResponseFormat({
    responseFormat,
    response_format,
    outputSchema,
    output_schema
  });
  if (normalizedResponseFormat) {
    payload.response_format = normalizedResponseFormat;
  }
  const response = await fetch(resolveApiUrl(), {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${ENV.forgeApiKey}`
    },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `LLM invoke failed: ${response.status} ${response.statusText} \u2013 ${errorText}`
    );
  }
  return await response.json();
}
var ensureArray, normalizeContentPart, normalizeMessage, normalizeToolChoice, resolveApiUrl, assertApiKey, normalizeResponseFormat;
var init_llm = __esm({
  "server/_core/llm.ts"() {
    "use strict";
    init_env();
    ensureArray = (value) => Array.isArray(value) ? value : [value];
    normalizeContentPart = (part) => {
      if (typeof part === "string") {
        return { type: "text", text: part };
      }
      if (part.type === "text") {
        return part;
      }
      if (part.type === "image_url") {
        return part;
      }
      if (part.type === "file_url") {
        return part;
      }
      throw new Error("Unsupported message content part");
    };
    normalizeMessage = (message) => {
      const { role, name, tool_call_id } = message;
      if (role === "tool" || role === "function") {
        const content = ensureArray(message.content).map((part) => typeof part === "string" ? part : JSON.stringify(part)).join("\n");
        return {
          role,
          name,
          tool_call_id,
          content
        };
      }
      const contentParts = ensureArray(message.content).map(normalizeContentPart);
      if (contentParts.length === 1 && contentParts[0].type === "text") {
        return {
          role,
          name,
          content: contentParts[0].text
        };
      }
      return {
        role,
        name,
        content: contentParts
      };
    };
    normalizeToolChoice = (toolChoice, tools) => {
      if (!toolChoice) return void 0;
      if (toolChoice === "none" || toolChoice === "auto") {
        return toolChoice;
      }
      if (toolChoice === "required") {
        if (!tools || tools.length === 0) {
          throw new Error(
            "tool_choice 'required' was provided but no tools were configured"
          );
        }
        if (tools.length > 1) {
          throw new Error(
            "tool_choice 'required' needs a single tool or specify the tool name explicitly"
          );
        }
        return {
          type: "function",
          function: { name: tools[0].function.name }
        };
      }
      if ("name" in toolChoice) {
        return {
          type: "function",
          function: { name: toolChoice.name }
        };
      }
      return toolChoice;
    };
    resolveApiUrl = () => ENV.forgeApiUrl && ENV.forgeApiUrl.trim().length > 0 ? `${ENV.forgeApiUrl.replace(/\/$/, "")}/v1/chat/completions` : "https://forge.manus.im/v1/chat/completions";
    assertApiKey = () => {
      if (!ENV.forgeApiKey) {
        throw new Error("OPENAI_API_KEY is not configured");
      }
    };
    normalizeResponseFormat = ({
      responseFormat,
      response_format,
      outputSchema,
      output_schema
    }) => {
      const explicitFormat = responseFormat || response_format;
      if (explicitFormat) {
        if (explicitFormat.type === "json_schema" && !explicitFormat.json_schema?.schema) {
          throw new Error(
            "responseFormat json_schema requires a defined schema object"
          );
        }
        return explicitFormat;
      }
      const schema = outputSchema || output_schema;
      if (!schema) return void 0;
      if (!schema.name || !schema.schema) {
        throw new Error("outputSchema requires both name and schema");
      }
      return {
        type: "json_schema",
        json_schema: {
          name: schema.name,
          schema: schema.schema,
          ...typeof schema.strict === "boolean" ? { strict: schema.strict } : {}
        }
      };
    };
  }
});

// server/ai-helper.ts
var ai_helper_exports = {};
__export(ai_helper_exports, {
  analisarImagemDentaria: () => analisarImagemDentaria,
  analisarRiscoPaciente: () => analisarRiscoPaciente,
  analisarSintomas: () => analisarSintomas,
  assistenteVirtual: () => assistenteVirtual,
  gerarResumoConsulta: () => gerarResumoConsulta,
  verificarMedicamento: () => verificarMedicamento
});
async function analisarSintomas(dados) {
  const prompt = `Voc\xEA \xE9 um assistente de diagn\xF3stico dent\xE1rio especializado. Analise os seguintes dados do paciente e sugira poss\xEDveis diagn\xF3sticos:

**Sintomas relatados:** ${dados.sintomas}
**Idade:** ${dados.idade} anos
**G\xE9nero:** ${dados.genero}
${dados.historicoMedico ? `**Hist\xF3rico m\xE9dico:** ${dados.historicoMedico}` : ""}
${dados.alergias?.length ? `**Alergias:** ${dados.alergias.join(", ")}` : ""}
${dados.medicamentos?.length ? `**Medicamentos atuais:** ${dados.medicamentos.join(", ")}` : ""}

Forne\xE7a 2-3 diagn\xF3sticos prov\xE1veis em formato JSON seguindo este schema:
{
  "diagnosticos": [
    {
      "diagnostico": "nome do diagn\xF3stico",
      "probabilidade": "alta|media|baixa",
      "fundamentacao": "explica\xE7\xE3o baseada nos sintomas",
      "tratamentosRecomendados": ["tratamento 1", "tratamento 2"],
      "alertas": ["alerta importante se houver"]
    }
  ]
}`;
  const response = await invokeLLM({
    messages: [
      { role: "system", content: "Voc\xEA \xE9 um assistente m\xE9dico dent\xE1rio especializado. Sempre responda em portugu\xEAs de Portugal." },
      { role: "user", content: prompt }
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "diagnostico_analise",
        strict: true,
        schema: {
          type: "object",
          properties: {
            diagnosticos: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  diagnostico: { type: "string" },
                  probabilidade: { type: "string", enum: ["alta", "media", "baixa"] },
                  fundamentacao: { type: "string" },
                  tratamentosRecomendados: {
                    type: "array",
                    items: { type: "string" }
                  },
                  alertas: {
                    type: "array",
                    items: { type: "string" }
                  }
                },
                required: ["diagnostico", "probabilidade", "fundamentacao", "tratamentosRecomendados"],
                additionalProperties: false
              }
            }
          },
          required: ["diagnosticos"],
          additionalProperties: false
        }
      }
    }
  });
  const result = JSON.parse(response.choices[0].message.content);
  return result.diagnosticos;
}
async function verificarMedicamento(dados) {
  const prompt = `Voc\xEA \xE9 um farmac\xEAutico especializado. Verifique a seguran\xE7a deste medicamento:

**Medicamento:** ${dados.medicamento} ${dados.dosagem}
**Idade do paciente:** ${dados.idade} anos
${dados.peso ? `**Peso:** ${dados.peso} kg` : ""}
**Alergias conhecidas:** ${dados.alergias.join(", ") || "Nenhuma"}
**Medicamentos atuais:** ${dados.medicamentosAtuais.join(", ") || "Nenhum"}
**Condi\xE7\xF5es m\xE9dicas:** ${dados.condicoesMedicas.join(", ") || "Nenhuma"}

Analise:
1. Intera\xE7\xF5es medicamentosas perigosas
2. Contraindica\xE7\xF5es com alergias
3. Contraindica\xE7\xF5es com condi\xE7\xF5es m\xE9dicas
4. Dosagem apropriada para idade/peso
5. Medicamentos alternativos se houver problemas

Responda em JSON seguindo este schema:
{
  "seguro": true/false,
  "alertas": ["lista de alertas"],
  "alternativas": ["medicamentos alternativos se n\xE3o for seguro"],
  "ajusteDosagem": "sugest\xE3o de ajuste se necess\xE1rio"
}`;
  const response = await invokeLLM({
    messages: [
      { role: "system", content: "Voc\xEA \xE9 um farmac\xEAutico especializado. Sempre responda em portugu\xEAs de Portugal." },
      { role: "user", content: prompt }
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "verificacao_medicamento",
        strict: true,
        schema: {
          type: "object",
          properties: {
            seguro: { type: "boolean" },
            alertas: {
              type: "array",
              items: { type: "string" }
            },
            alternativas: {
              type: "array",
              items: { type: "string" }
            },
            ajusteDosagem: { type: "string" }
          },
          required: ["seguro", "alertas"],
          additionalProperties: false
        }
      }
    }
  });
  const result = JSON.parse(response.choices[0].message.content);
  return result;
}
async function gerarResumoConsulta(dados) {
  const prompt = `Voc\xEA \xE9 um assistente m\xE9dico. Crie um resumo profissional desta consulta dent\xE1ria:

**Notas da consulta:**
${dados.notasConsulta}

${dados.tratamentosRealizados?.length ? `**Tratamentos realizados:** ${dados.tratamentosRealizados.join(", ")}` : ""}
${dados.proximaConsulta ? `**Pr\xF3xima consulta:** ${dados.proximaConsulta}` : ""}

Crie um resumo estruturado em JSON:
{
  "resumo": "resumo conciso da consulta (2-3 frases)",
  "pontosChave": ["ponto importante 1", "ponto importante 2"],
  "proximosPassos": ["a\xE7\xE3o recomendada 1", "a\xE7\xE3o recomendada 2"]
}`;
  const response = await invokeLLM({
    messages: [
      { role: "system", content: "Voc\xEA \xE9 um assistente m\xE9dico especializado. Sempre responda em portugu\xEAs de Portugal." },
      { role: "user", content: prompt }
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "resumo_consulta",
        strict: true,
        schema: {
          type: "object",
          properties: {
            resumo: { type: "string" },
            pontosChave: {
              type: "array",
              items: { type: "string" }
            },
            proximosPassos: {
              type: "array",
              items: { type: "string" }
            }
          },
          required: ["resumo", "pontosChave", "proximosPassos"],
          additionalProperties: false
        }
      }
    }
  });
  const result = JSON.parse(response.choices[0].message.content);
  return result;
}
async function analisarRiscoPaciente(dados) {
  const prompt = `Voc\xEA \xE9 um analista de sa\xFAde dent\xE1ria. Avalie o n\xEDvel de risco deste paciente:

**Idade:** ${dados.idade} anos
**Hist\xF3rico m\xE9dico:** ${dados.historicoMedico}
**Condi\xE7\xF5es m\xE9dicas:** ${dados.condicoesMedicas.join(", ") || "Nenhuma"}
${dados.ultimaConsulta ? `**\xDAltima consulta:** ${dados.ultimaConsulta}` : ""}
${dados.tratamentosPendentes?.length ? `**Tratamentos pendentes:** ${dados.tratamentosPendentes.join(", ")}` : ""}

Analise:
1. Risco de complica\xE7\xF5es dent\xE1rias
2. Necessidade de acompanhamento
3. Fatores de risco identificados

Responda em JSON:
{
  "nivelRisco": "baixo|medio|alto",
  "fatores": ["fator de risco 1", "fator de risco 2"],
  "recomendacoes": ["recomenda\xE7\xE3o 1", "recomenda\xE7\xE3o 2"]
}`;
  const response = await invokeLLM({
    messages: [
      { role: "system", content: "Voc\xEA \xE9 um analista de sa\xFAde especializado. Sempre responda em portugu\xEAs de Portugal." },
      { role: "user", content: prompt }
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "analise_risco",
        strict: true,
        schema: {
          type: "object",
          properties: {
            nivelRisco: { type: "string", enum: ["baixo", "medio", "alto"] },
            fatores: {
              type: "array",
              items: { type: "string" }
            },
            recomendacoes: {
              type: "array",
              items: { type: "string" }
            }
          },
          required: ["nivelRisco", "fatores", "recomendacoes"],
          additionalProperties: false
        }
      }
    }
  });
  const result = JSON.parse(response.choices[0].message.content);
  return result;
}
async function assistenteVirtual(dados) {
  const contexto = `
**Paciente:** ${dados.contextoUtente.nome}, ${dados.contextoUtente.idade} anos
${dados.contextoUtente.historicoMedico ? `**Hist\xF3rico:** ${dados.contextoUtente.historicoMedico}` : ""}
${dados.contextoUtente.alergias?.length ? `**Alergias:** ${dados.contextoUtente.alergias.join(", ")}` : ""}
${dados.contextoUtente.medicamentos?.length ? `**Medicamentos:** ${dados.contextoUtente.medicamentos.join(", ")}` : ""}
${dados.contextoUtente.condicoesMedicas?.length ? `**Condi\xE7\xF5es:** ${dados.contextoUtente.condicoesMedicas.join(", ")}` : ""}
`;
  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content: "Voc\xEA \xE9 um assistente virtual de uma cl\xEDnica dent\xE1ria. Responda perguntas sobre pacientes de forma profissional e \xFAtil. Sempre responda em portugu\xEAs de Portugal."
      },
      {
        role: "user",
        content: `Contexto do paciente:
${contexto}

Pergunta: ${dados.pergunta}`
      }
    ]
  });
  return response.choices[0].message.content;
}
async function analisarImagemDentaria(dados) {
  console.log("\u{1F52C} [AI-Helper] Iniciando analisarImagemDentaria...");
  console.log("\u{1F4CA} [AI-Helper] Tipo:", dados.tipoImagem);
  console.log("\u{1F4CA} [AI-Helper] Tamanho base64:", dados.imagemBase64.length);
  const prompt = `Voc\xEA \xE9 um especialista em radiologia dent\xE1ria e an\xE1lise de imagens odontol\xF3gicas. Analise esta imagem dent\xE1ria em detalhes.

**Tipo de imagem:** ${dados.tipoImagem}
${dados.contexto ? `**Contexto:** ${dados.contexto}` : ""}

Por favor, forne\xE7a uma an\xE1lise completa incluindo:

1. **Identifica\xE7\xE3o do tipo de imagem** (raio-X periapical, panor\xE2mica, bite-wing, foto intraoral, etc.)
2. **Avalia\xE7\xE3o da qualidade** da imagem (excelente, boa, regular, ruim)
3. **Problemas detectados** (c\xE1ries, fraturas, infec\xE7\xF5es, perda \xF3ssea, restaura\xE7\xF5es defeituosas, etc.)
4. **Observa\xE7\xF5es gerais** sobre a sa\xFAde bucal vis\xEDvel
5. **Recomenda\xE7\xF5es** de tratamento ou exames adicionais
6. **N\xEDvel de urg\xEAncia** (baixo, m\xE9dio, alto)
7. **Relat\xF3rio completo** em formato narrativo

Responda em JSON estruturado com as seguintes chaves:
- tipoImagem: string
- qualidade: string
- problemasDetectados: array de strings
- observacoes: array de strings
- recomendacoes: array de strings
- nivelUrgencia: "baixo" | "medio" | "alto"
- relatorioCompleto: string (relat\xF3rio narrativo completo)

IMPORTANTE: Seja espec\xEDfico e t\xE9cnico, mas tamb\xE9m claro. Se n\xE3o conseguir identificar algo com certeza, mencione isso. Sempre indique que esta \xE9 uma an\xE1lise preliminar e que um profissional deve fazer o diagn\xF3stico final.`;
  let base64Data = dados.imagemBase64;
  if (base64Data.includes(",")) {
    base64Data = base64Data.split(",")[1];
  }
  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content: "Voc\xEA \xE9 um especialista em radiologia dent\xE1ria e an\xE1lise de imagens odontol\xF3gicas. Sempre responda em portugu\xEAs de Portugal com terminologia t\xE9cnica apropriada."
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: prompt
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${base64Data}`
            }
          }
        ]
      }
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "analise_imagem",
        strict: true,
        schema: {
          type: "object",
          properties: {
            tipoImagem: { type: "string" },
            qualidade: { type: "string" },
            problemasDetectados: {
              type: "array",
              items: { type: "string" }
            },
            observacoes: {
              type: "array",
              items: { type: "string" }
            },
            recomendacoes: {
              type: "array",
              items: { type: "string" }
            },
            nivelUrgencia: {
              type: "string",
              enum: ["baixo", "medio", "alto"]
            },
            relatorioCompleto: { type: "string" }
          },
          required: [
            "tipoImagem",
            "qualidade",
            "problemasDetectados",
            "observacoes",
            "recomendacoes",
            "nivelUrgencia",
            "relatorioCompleto"
          ],
          additionalProperties: false
        }
      }
    }
  });
  console.log("\u2705 [AI-Helper] Resposta recebida do LLM");
  const content = response.choices[0].message.content;
  console.log("\u{1F4CA} [AI-Helper] Tamanho conte\xFAdo:", content?.length || 0);
  const resultado = JSON.parse(content);
  console.log("\u2705 [AI-Helper] An\xE1lise conclu\xEDda e JSON parseado");
  return resultado;
}
var init_ai_helper = __esm({
  "server/ai-helper.ts"() {
    "use strict";
    init_llm();
  }
});

// server/gemini-image-helper.ts
var gemini_image_helper_exports = {};
__export(gemini_image_helper_exports, {
  analisarImagemComGemini: () => analisarImagemComGemini
});
import { GoogleGenerativeAI as GoogleGenerativeAI2 } from "@google/generative-ai";
async function analisarImagemComGemini(dados) {
  console.log("\u{1F916} [Gemini] Iniciando an\xE1lise de imagem...");
  console.log("\u{1F4CA} [Gemini] Tipo:", dados.tipoImagem);
  console.log("\u{1F4CA} [Gemini] Tamanho base64:", dados.imagemBase64.length);
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY n\xE3o est\xE1 configurada");
  }
  console.log("\u2705 [Gemini] API Key encontrada");
  const genAI2 = new GoogleGenerativeAI2(apiKey);
  const model2 = genAI2.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
    generationConfig: {
      temperature: 0.4,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
      responseMimeType: "application/json"
    }
  });
  console.log("\u2705 [Gemini] Modelo inicializado");
  const prompt = `Voc\xEA \xE9 um especialista em radiologia dent\xE1ria e an\xE1lise de imagens odontol\xF3gicas. Analise esta imagem dent\xE1ria em detalhes.

**Tipo de imagem:** ${dados.tipoImagem}
${dados.contexto ? `**Contexto:** ${dados.contexto}` : ""}

Por favor, forne\xE7a uma an\xE1lise completa incluindo:

1. **Identifica\xE7\xE3o do tipo de imagem** (raio-X periapical, panor\xE2mica, bite-wing, foto intraoral, etc.)
2. **Avalia\xE7\xE3o da qualidade** da imagem (excelente, boa, regular, ruim)
3. **Problemas detectados** (c\xE1ries, fraturas, infec\xE7\xF5es, perda \xF3ssea, restaura\xE7\xF5es defeituosas, etc.)
4. **Observa\xE7\xF5es gerais** sobre a sa\xFAde bucal vis\xEDvel
5. **Recomenda\xE7\xF5es** de tratamento ou exames adicionais
6. **N\xEDvel de urg\xEAncia** (baixo, m\xE9dio, alto)
7. **Relat\xF3rio completo** em formato narrativo

Responda APENAS com um objeto JSON v\xE1lido (sem markdown, sem \`\`\`json) com as seguintes chaves:
{
  "tipoImagem": "string",
  "qualidade": "string",
  "problemasDetectados": ["string"],
  "observacoes": ["string"],
  "recomendacoes": ["string"],
  "nivelUrgencia": "baixo" | "medio" | "alto",
  "relatorioCompleto": "string (relat\xF3rio narrativo completo)"
}

IMPORTANTE: Seja espec\xEDfico e t\xE9cnico, mas tamb\xE9m claro. Se n\xE3o conseguir identificar algo com certeza, mencione isso. Sempre indique que esta \xE9 uma an\xE1lise preliminar e que um profissional deve fazer o diagn\xF3stico final.`;
  let base64Data = dados.imagemBase64;
  if (base64Data.includes(",")) {
    base64Data = base64Data.split(",")[1];
    console.log("\u{1F4CA} [Gemini] Removido prefixo data:image");
  }
  console.log("\u{1F680} [Gemini] Enviando requisi\xE7\xE3o...");
  try {
    const result = await model2.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Data
        }
      }
    ]);
    console.log("\u2705 [Gemini] Resposta recebida");
    const response = result.response;
    const text2 = response.text();
    console.log("\u{1F4CA} [Gemini] Tamanho da resposta:", text2.length);
    const analise = JSON.parse(text2);
    console.log("\u2705 [Gemini] JSON parseado com sucesso");
    console.log("\u{1F4CA} [Gemini] Problemas detectados:", analise.problemasDetectados.length);
    console.log("\u{1F4CA} [Gemini] N\xEDvel de urg\xEAncia:", analise.nivelUrgencia);
    return analise;
  } catch (error) {
    console.error("\u274C [Gemini] Erro:", error);
    throw error;
  }
}
var init_gemini_image_helper = __esm({
  "server/gemini-image-helper.ts"() {
    "use strict";
  }
});

// server/_core/index.ts
import "dotenv/config";
import express2 from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

// shared/const.ts
var COOKIE_NAME = "app_session_id";
var ONE_YEAR_MS = 1e3 * 60 * 60 * 24 * 365;
var AXIOS_TIMEOUT_MS = 3e4;
var UNAUTHED_ERR_MSG = "Please login (10001)";
var NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";

// server/_core/oauth.ts
init_db();

// server/_core/cookies.ts
function isSecureRequest(req) {
  if (req.protocol === "https") return true;
  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;
  const protoList = Array.isArray(forwardedProto) ? forwardedProto : forwardedProto.split(",");
  return protoList.some((proto) => proto.trim().toLowerCase() === "https");
}
function getSessionCookieOptions(req) {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: isSecureRequest(req)
  };
}

// shared/_core/errors.ts
var HttpError = class extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HttpError";
  }
};
var ForbiddenError = (msg) => new HttpError(403, msg);

// server/_core/sdk.ts
init_db();
init_env();
import axios from "axios";
import { parse as parseCookieHeader } from "cookie";
import { SignJWT, jwtVerify } from "jose";
var isNonEmptyString = (value) => typeof value === "string" && value.length > 0;
var EXCHANGE_TOKEN_PATH = `/webdev.v1.WebDevAuthPublicService/ExchangeToken`;
var GET_USER_INFO_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfo`;
var GET_USER_INFO_WITH_JWT_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfoWithJwt`;
var OAuthService = class {
  constructor(client) {
    this.client = client;
    console.log("[OAuth] Initialized with baseURL:", ENV.oAuthServerUrl);
    if (!ENV.oAuthServerUrl) {
      console.error(
        "[OAuth] ERROR: OAUTH_SERVER_URL is not configured! Set OAUTH_SERVER_URL environment variable."
      );
    }
  }
  decodeState(state) {
    const redirectUri = atob(state);
    return redirectUri;
  }
  async getTokenByCode(code, state) {
    const payload = {
      clientId: ENV.appId,
      grantType: "authorization_code",
      code,
      redirectUri: this.decodeState(state)
    };
    const { data } = await this.client.post(
      EXCHANGE_TOKEN_PATH,
      payload
    );
    return data;
  }
  async getUserInfoByToken(token) {
    const { data } = await this.client.post(
      GET_USER_INFO_PATH,
      {
        accessToken: token.accessToken
      }
    );
    return data;
  }
};
var createOAuthHttpClient = () => axios.create({
  baseURL: ENV.oAuthServerUrl,
  timeout: AXIOS_TIMEOUT_MS
});
var SDKServer = class {
  client;
  oauthService;
  constructor(client = createOAuthHttpClient()) {
    this.client = client;
    this.oauthService = new OAuthService(this.client);
  }
  deriveLoginMethod(platforms, fallback) {
    if (fallback && fallback.length > 0) return fallback;
    if (!Array.isArray(platforms) || platforms.length === 0) return null;
    const set = new Set(
      platforms.filter((p) => typeof p === "string")
    );
    if (set.has("REGISTERED_PLATFORM_EMAIL")) return "email";
    if (set.has("REGISTERED_PLATFORM_GOOGLE")) return "google";
    if (set.has("REGISTERED_PLATFORM_APPLE")) return "apple";
    if (set.has("REGISTERED_PLATFORM_MICROSOFT") || set.has("REGISTERED_PLATFORM_AZURE"))
      return "microsoft";
    if (set.has("REGISTERED_PLATFORM_GITHUB")) return "github";
    const first = Array.from(set)[0];
    return first ? first.toLowerCase() : null;
  }
  /**
   * Exchange OAuth authorization code for access token
   * @example
   * const tokenResponse = await sdk.exchangeCodeForToken(code, state);
   */
  async exchangeCodeForToken(code, state) {
    return this.oauthService.getTokenByCode(code, state);
  }
  /**
   * Get user information using access token
   * @example
   * const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
   */
  async getUserInfo(accessToken) {
    const data = await this.oauthService.getUserInfoByToken({
      accessToken
    });
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  parseCookies(cookieHeader) {
    if (!cookieHeader) {
      return /* @__PURE__ */ new Map();
    }
    const parsed = parseCookieHeader(cookieHeader);
    return new Map(Object.entries(parsed));
  }
  getSessionSecret() {
    const secret = ENV.cookieSecret;
    return new TextEncoder().encode(secret);
  }
  /**
   * Create a session token for a user ID
   * @example
   * const sessionToken = await sdk.createSessionToken(userInfo.id);
   */
  async createSessionToken(userId, options = {}) {
    return this.signSession(
      {
        openId: userId,
        appId: ENV.appId,
        name: options.name || ""
      },
      options
    );
  }
  async signSession(payload, options = {}) {
    const issuedAt = Date.now();
    const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1e3);
    const secretKey = this.getSessionSecret();
    return new SignJWT({
      openId: payload.openId,
      appId: payload.appId,
      name: payload.name
    }).setProtectedHeader({ alg: "HS256", typ: "JWT" }).setExpirationTime(expirationSeconds).sign(secretKey);
  }
  async verifySession(cookieValue) {
    if (!cookieValue) {
      console.warn("[Auth] Missing session cookie");
      return null;
    }
    try {
      const secretKey = this.getSessionSecret();
      const { payload } = await jwtVerify(cookieValue, secretKey, {
        algorithms: ["HS256"]
      });
      const { openId, appId, name } = payload;
      if (!isNonEmptyString(openId) || !isNonEmptyString(appId) || !isNonEmptyString(name)) {
        console.warn("[Auth] Session payload missing required fields");
        return null;
      }
      return {
        openId,
        appId,
        name
      };
    } catch (error) {
      console.warn("[Auth] Session verification failed", String(error));
      return null;
    }
  }
  async getUserInfoWithJwt(jwtToken) {
    const payload = {
      jwtToken,
      projectId: ENV.appId
    };
    const { data } = await this.client.post(
      GET_USER_INFO_WITH_JWT_PATH,
      payload
    );
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  async authenticateRequest(req) {
    const cookies = this.parseCookies(req.headers.cookie);
    const sessionCookie = cookies.get(COOKIE_NAME);
    const session = await this.verifySession(sessionCookie);
    if (!session) {
      throw ForbiddenError("Invalid session cookie");
    }
    const sessionUserId = session.openId;
    const signedInAt = /* @__PURE__ */ new Date();
    let user = await getUser2(sessionUserId);
    if (!user) {
      try {
        const userInfo = await this.getUserInfoWithJwt(sessionCookie ?? "");
        await upsertUser2({
          id: userInfo.openId,
          name: userInfo.name || null,
          email: userInfo.email ?? null,
          loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
          lastSignedIn: signedInAt
        });
        user = await getUser2(userInfo.openId);
      } catch (error) {
        console.error("[Auth] Failed to sync user from OAuth:", error);
        throw ForbiddenError("Failed to sync user info");
      }
    }
    if (!user) {
      throw ForbiddenError("User not found");
    }
    await upsertUser2({
      id: user.id,
      lastSignedIn: signedInAt
    });
    return {
      ...user,
      createdAt: user.createdAt || /* @__PURE__ */ new Date()
    };
  }
};
var sdk = new SDKServer();

// server/_core/oauth.ts
function getQueryParam(req, key) {
  const value = req.query[key];
  return typeof value === "string" ? value : void 0;
}
function registerOAuthRoutes(app) {
  app.get("/api/oauth/callback", async (req, res) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");
    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }
    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }
      await upsertUser2({
        id: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: /* @__PURE__ */ new Date()
      });
      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS
      });
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
}

// server/_core/systemRouter.ts
import { z } from "zod";

// server/_core/notification.ts
init_env();
import { TRPCError } from "@trpc/server";
var TITLE_MAX_LENGTH = 1200;
var CONTENT_MAX_LENGTH = 2e4;
var trimValue = (value) => value.trim();
var isNonEmptyString2 = (value) => typeof value === "string" && value.trim().length > 0;
var buildEndpointUrl = (baseUrl) => {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return new URL(
    "webdevtoken.v1.WebDevService/SendNotification",
    normalizedBase
  ).toString();
};
var validatePayload = (input) => {
  if (!isNonEmptyString2(input.title)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification title is required."
    });
  }
  if (!isNonEmptyString2(input.content)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification content is required."
    });
  }
  const title = trimValue(input.title);
  const content = trimValue(input.content);
  if (title.length > TITLE_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification title must be at most ${TITLE_MAX_LENGTH} characters.`
    });
  }
  if (content.length > CONTENT_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification content must be at most ${CONTENT_MAX_LENGTH} characters.`
    });
  }
  return { title, content };
};
async function notifyOwner(payload) {
  const { title, content } = validatePayload(payload);
  if (!ENV.forgeApiUrl) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service URL is not configured."
    });
  }
  if (!ENV.forgeApiKey) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service API key is not configured."
    });
  }
  const endpoint = buildEndpointUrl(ENV.forgeApiUrl);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1"
      },
      body: JSON.stringify({ title, content })
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Notification] Failed to notify owner (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`
      );
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[Notification] Error calling notification service:", error);
    return false;
  }
}

// server/_core/trpc.ts
init_db();
import { initTRPC, TRPCError as TRPCError2 } from "@trpc/server";
var t = initTRPC.context().create({
  // transformer: superjson, // ❌ REMOVIDO TEMPORARIAMENTE
});
var router = t.router;
var publicProcedure = t.procedure;
var requireUser = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  console.log("[AUTH] requireUser middleware - user:", ctx.user ? "exists" : "null");
  if (!ctx.user) {
    console.log("[AUTH] Creating demo user...");
    const demoUserId = "demo-user-001";
    let demoUser = await getUser2(demoUserId);
    console.log("[AUTH] Demo user from DB:", demoUser ? "found" : "not found");
    if (!demoUser) {
      console.log("[AUTH] Upserting demo user...");
      await upsertUser2({
        id: demoUserId,
        name: "Utilizador de Desenvolvimento",
        email: "demo@dentcarepro.local",
        loginMethod: "demo",
        lastSignedIn: /* @__PURE__ */ new Date()
      });
      demoUser = await getUser2(demoUserId);
      console.log("[AUTH] Demo user after upsert:", demoUser ? "created" : "failed");
    }
    if (demoUser) {
      console.log("[AUTH] Using demo user:", demoUser.id);
      return next({
        ctx: {
          ...ctx,
          user: demoUser
        }
      });
    }
    throw new TRPCError2({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  });
});
var protectedProcedure = t.procedure;
var adminProcedure = t.procedure.use(
  t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.user || ctx.user.role !== "admin") {
      throw new TRPCError2({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user
      }
    });
  })
);

// server/_core/systemRouter.ts
var systemRouter = router({
  health: publicProcedure.input(
    z.object({
      timestamp: z.number().min(0, "timestamp cannot be negative")
    })
  ).query(() => ({
    ok: true
  })),
  notifyOwner: adminProcedure.input(
    z.object({
      title: z.string().min(1, "title is required"),
      content: z.string().min(1, "content is required")
    })
  ).mutation(async ({ input }) => {
    const delivered = await notifyOwner(input);
    return {
      success: delivered
    };
  })
});

// server/routers.ts
import { z as z27 } from "zod";

// server/routers/financeiro.ts
import { z as z2 } from "zod";
init_db();
async function calcularECriarComissao(faturaId, dentistaId, valorFatura) {
  try {
    const config = await obterConfigComissao(dentistaId);
    if (!config) {
      console.log(`Dentista ${dentistaId} n\xE3o tem configura\xE7\xE3o de comiss\xE3o`);
      return;
    }
    let valorComissao = 0;
    let percentagem = 0;
    if (config.tipo === "percentagem") {
      percentagem = config.percentagem || 0;
      valorComissao = valorFatura * (percentagem / 100);
    } else if (config.tipo === "fixo") {
      valorComissao = config.valorFixo || 0;
    } else if (config.tipo === "misto") {
      percentagem = config.percentagem || 0;
      valorComissao = valorFatura * (percentagem / 100) + (config.valorFixo || 0);
    }
    if (config.valorMinimo && valorComissao < config.valorMinimo) {
      valorComissao = config.valorMinimo;
    }
    if (config.valorMaximo && valorComissao > config.valorMaximo) {
      valorComissao = config.valorMaximo;
    }
    const mes = (/* @__PURE__ */ new Date()).toISOString().slice(0, 7);
    await criarComissao({
      dentistaId,
      faturaId,
      valor: valorComissao,
      percentagem: percentagem || void 0,
      mes,
      observacoes: `Comiss\xE3o autom\xE1tica - Fatura ${faturaId}`
    });
    console.log(`Comiss\xE3o criada: ${valorComissao}\u20AC para dentista ${dentistaId}`);
  } catch (error) {
    console.error("Erro ao calcular/criar comiss\xE3o:", error);
    throw error;
  }
}
var faturasMock = [
  {
    id: "fat-001",
    numero: "2025/001",
    serie: "FT",
    tipo: "fatura",
    data: "2025-10-15T10:00:00Z",
    dataVencimento: "2025-11-15T10:00:00Z",
    utenteId: "utente-001",
    utenteNome: "Maria Silva Santos",
    utenteNif: "123456789",
    utenteMorada: "Rua das Flores, 123, 1000-100 Lisboa",
    dentista: "Dr. Jo\xE3o Costa",
    itens: [
      {
        id: "item-001",
        descricao: "Consulta de Avalia\xE7\xE3o",
        quantidade: 1,
        precoUnitario: 50,
        desconto: 0,
        iva: 23,
        total: 61.5,
        categoria: "consulta"
      },
      {
        id: "item-002",
        descricao: "Limpeza Dent\xE1ria (Destartariza\xE7\xE3o)",
        quantidade: 1,
        precoUnitario: 80,
        desconto: 10,
        iva: 23,
        total: 88.56,
        categoria: "tratamento"
      }
    ],
    subtotal: 122,
    descontoTotal: 8,
    ivaTotal: 26.22,
    total: 150.06,
    estado: "paga",
    pagamentos: [
      {
        id: "pag-001",
        faturaId: "fat-001",
        data: "2025-10-15T11:00:00Z",
        valor: 150.06,
        metodo: "multibanco",
        referencia: "MB123456789",
        criadoPor: "Sistema",
        criadoEm: "2025-10-15T11:00:00Z"
      }
    ],
    valorPago: 150.06,
    valorEmDivida: 0,
    criadoPor: "Dr. Jo\xE3o Costa",
    criadoEm: "2025-10-15T10:00:00Z",
    atualizadoEm: "2025-10-15T11:00:00Z"
  },
  {
    id: "fat-002",
    numero: "2025/002",
    serie: "FT",
    tipo: "fatura",
    data: "2025-10-16T14:00:00Z",
    dataVencimento: "2025-11-16T14:00:00Z",
    utenteId: "utente-002",
    utenteNome: "Jo\xE3o Pedro Oliveira",
    utenteNif: "987654321",
    dentista: "Dra. Ana Martins",
    itens: [
      {
        id: "item-003",
        descricao: "Restaura\xE7\xE3o em Resina Composta",
        quantidade: 2,
        precoUnitario: 120,
        desconto: 0,
        iva: 23,
        total: 295.2,
        categoria: "tratamento"
      }
    ],
    subtotal: 240,
    descontoTotal: 0,
    ivaTotal: 55.2,
    total: 295.2,
    estado: "pendente",
    pagamentos: [],
    valorPago: 0,
    valorEmDivida: 295.2,
    observacoes: "Pagamento previsto para pr\xF3xima consulta",
    criadoPor: "Dra. Ana Martins",
    criadoEm: "2025-10-16T14:00:00Z",
    atualizadoEm: "2025-10-16T14:00:00Z"
  },
  {
    id: "fat-003",
    numero: "2025/003",
    serie: "FT",
    tipo: "fatura",
    data: "2025-10-17T09:00:00Z",
    dataVencimento: "2025-11-17T09:00:00Z",
    utenteId: "utente-003",
    utenteNome: "Ana Rita Costa",
    dentista: "Dr. Jo\xE3o Costa",
    itens: [
      {
        id: "item-004",
        descricao: "Extra\xE7\xE3o Dent\xE1ria Simples",
        quantidade: 1,
        precoUnitario: 150,
        desconto: 0,
        iva: 23,
        total: 184.5,
        categoria: "tratamento"
      }
    ],
    subtotal: 150,
    descontoTotal: 0,
    ivaTotal: 34.5,
    total: 184.5,
    estado: "parcial",
    pagamentos: [
      {
        id: "pag-002",
        faturaId: "fat-003",
        data: "2025-10-17T09:30:00Z",
        valor: 100,
        metodo: "dinheiro",
        criadoPor: "Rece\xE7\xE3o",
        criadoEm: "2025-10-17T09:30:00Z"
      }
    ],
    valorPago: 100,
    valorEmDivida: 84.5,
    observacoes: "Restante a pagar na pr\xF3xima consulta",
    criadoPor: "Dr. Jo\xE3o Costa",
    criadoEm: "2025-10-17T09:00:00Z",
    atualizadoEm: "2025-10-17T09:30:00Z"
  }
];
var proximoNumeroFatura = 4;
function gerarNumeroFatura() {
  const ano = (/* @__PURE__ */ new Date()).getFullYear();
  const numero = String(proximoNumeroFatura).padStart(3, "0");
  proximoNumeroFatura++;
  return `${ano}/${numero}`;
}
function calcularEstadoFatura(fatura) {
  if (fatura.estado === "anulada") return "anulada";
  const agora = /* @__PURE__ */ new Date();
  const vencimento = new Date(fatura.dataVencimento);
  if (fatura.valorPago >= fatura.total) {
    return "paga";
  } else if (fatura.valorPago > 0) {
    return "parcial";
  } else if (vencimento < agora) {
    return "vencida";
  } else {
    return "pendente";
  }
}
function calcularTotaisFatura(itens) {
  let subtotal = 0;
  let descontoTotal = 0;
  let ivaTotal = 0;
  itens.forEach((item) => {
    const valorSemDesconto = item.quantidade * item.precoUnitario;
    const valorDesconto = valorSemDesconto * (item.desconto / 100);
    const valorComDesconto = valorSemDesconto - valorDesconto;
    const valorIva = valorComDesconto * (item.iva / 100);
    subtotal += valorSemDesconto;
    descontoTotal += valorDesconto;
    ivaTotal += valorIva;
    item.total = valorComDesconto + valorIva;
  });
  const total = subtotal - descontoTotal + ivaTotal;
  return { subtotal, descontoTotal, ivaTotal, total };
}
var financeiroRouter = router({
  // Listar faturas
  listar: publicProcedure.input(z2.object({
    utenteId: z2.string().optional(),
    dentista: z2.string().optional(),
    estado: z2.enum(["pendente", "paga", "parcial", "anulada", "vencida"]).optional(),
    dataInicio: z2.string().optional(),
    dataFim: z2.string().optional(),
    pesquisa: z2.string().optional()
  }).optional()).query(({ input }) => {
    let faturas2 = [...faturasMock];
    if (input) {
      if (input.utenteId) {
        faturas2 = faturas2.filter((f) => f.utenteId === input.utenteId);
      }
      if (input.dentista) {
        faturas2 = faturas2.filter((f) => f.dentista.toLowerCase().includes(input.dentista.toLowerCase()));
      }
      if (input.estado) {
        faturas2 = faturas2.filter((f) => f.estado === input.estado);
      }
      if (input.dataInicio) {
        faturas2 = faturas2.filter((f) => f.data >= input.dataInicio);
      }
      if (input.dataFim) {
        faturas2 = faturas2.filter((f) => f.data <= input.dataFim);
      }
      if (input.pesquisa) {
        const termo = input.pesquisa.toLowerCase();
        faturas2 = faturas2.filter(
          (f) => f.numero.toLowerCase().includes(termo) || f.utenteNome.toLowerCase().includes(termo) || f.dentista.toLowerCase().includes(termo)
        );
      }
    }
    faturas2.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
    return faturas2;
  }),
  // Obter fatura por ID
  obter: publicProcedure.input(z2.object({ id: z2.string() })).query(({ input }) => {
    const fatura = faturasMock.find((f) => f.id === input.id);
    if (!fatura) {
      throw new Error("Fatura n\xE3o encontrada");
    }
    return fatura;
  }),
  // Criar nova fatura
  criar: publicProcedure.input(z2.object({
    utenteId: z2.string(),
    utenteNome: z2.string(),
    utenteNif: z2.string().optional(),
    utenteMorada: z2.string().optional(),
    dentistaId: z2.string(),
    dentista: z2.string().optional(),
    // nome do dentista
    dentistaPercentagem: z2.number().default(0),
    dentistaComissao: z2.number().default(0),
    consultaId: z2.string().optional(),
    dataVencimento: z2.string(),
    itens: z2.array(z2.object({
      descricao: z2.string(),
      quantidade: z2.number(),
      precoUnitario: z2.number(),
      desconto: z2.number().default(0),
      iva: z2.number().default(23),
      categoria: z2.enum(["consulta", "tratamento", "material", "laboratorio", "outro"]).optional()
    })),
    observacoes: z2.string().optional()
  })).mutation(({ input }) => {
    const agora = (/* @__PURE__ */ new Date()).toISOString();
    const itens = input.itens.map((item, index) => ({
      id: `item-${Date.now()}-${index}`,
      ...item,
      total: 0,
      // Será calculado
      tratamentoId: void 0
    }));
    const totais = calcularTotaisFatura(itens);
    const novaFatura = {
      id: `fat-${Date.now()}`,
      numero: gerarNumeroFatura(),
      serie: "FT",
      tipo: "fatura",
      data: agora,
      dataVencimento: input.dataVencimento,
      utenteId: input.utenteId,
      utenteNome: input.utenteNome,
      utenteNif: input.utenteNif,
      utenteMorada: input.utenteMorada,
      consultaId: input.consultaId,
      dentistaId: input.dentistaId,
      dentista: input.dentista || input.dentistaId,
      dentistaPercentagem: input.dentistaPercentagem,
      dentistaComissao: input.dentistaComissao,
      valorClinica: totais.subtotal - input.dentistaComissao,
      itens,
      ...totais,
      estado: "pendente",
      pagamentos: [],
      valorPago: 0,
      valorEmDivida: totais.total,
      observacoes: input.observacoes,
      criadoPor: input.dentista,
      criadoEm: agora,
      atualizadoEm: agora
    };
    faturasMock.push(novaFatura);
    calcularECriarComissao(novaFatura.id, input.dentistaId, totais.total).catch((err) => {
      console.error("Erro ao criar comiss\xE3o:", err);
    });
    return novaFatura;
  }),
  // Editar fatura
  editar: publicProcedure.input(z2.object({
    id: z2.string(),
    dataVencimento: z2.string().optional(),
    itens: z2.array(z2.object({
      id: z2.string().optional(),
      descricao: z2.string(),
      quantidade: z2.number(),
      precoUnitario: z2.number(),
      desconto: z2.number(),
      iva: z2.number(),
      categoria: z2.enum(["consulta", "tratamento", "material", "laboratorio", "outro"]).optional()
    })).optional(),
    observacoes: z2.string().optional()
  })).mutation(({ input }) => {
    const fatura = faturasMock.find((f) => f.id === input.id);
    if (!fatura) {
      throw new Error("Fatura n\xE3o encontrada");
    }
    if (fatura.estado === "paga" || fatura.estado === "anulada") {
      throw new Error("N\xE3o \xE9 poss\xEDvel editar faturas pagas ou anuladas");
    }
    if (input.dataVencimento) {
      fatura.dataVencimento = input.dataVencimento;
    }
    if (input.itens) {
      const novosItens = input.itens.map((item, index) => ({
        id: item.id || `item-${Date.now()}-${index}`,
        descricao: item.descricao,
        quantidade: item.quantidade,
        precoUnitario: item.precoUnitario,
        desconto: item.desconto,
        iva: item.iva,
        total: 0,
        // Será calculado
        categoria: item.categoria
      }));
      const totais = calcularTotaisFatura(novosItens);
      fatura.itens = novosItens;
      fatura.subtotal = totais.subtotal;
      fatura.descontoTotal = totais.descontoTotal;
      fatura.ivaTotal = totais.ivaTotal;
      fatura.total = totais.total;
      fatura.valorEmDivida = totais.total - fatura.valorPago;
    }
    if (input.observacoes !== void 0) {
      fatura.observacoes = input.observacoes;
    }
    fatura.atualizadoEm = (/* @__PURE__ */ new Date()).toISOString();
    fatura.estado = calcularEstadoFatura(fatura);
    return fatura;
  }),
  // Anular fatura
  anular: publicProcedure.input(z2.object({
    id: z2.string(),
    motivo: z2.string()
  })).mutation(({ input }) => {
    const fatura = faturasMock.find((f) => f.id === input.id);
    if (!fatura) {
      throw new Error("Fatura n\xE3o encontrada");
    }
    fatura.estado = "anulada";
    fatura.anuladaEm = (/* @__PURE__ */ new Date()).toISOString();
    fatura.motivoAnulacao = input.motivo;
    fatura.atualizadoEm = (/* @__PURE__ */ new Date()).toISOString();
    return fatura;
  }),
  // Registar pagamento
  registarPagamento: publicProcedure.input(z2.object({
    faturaId: z2.string(),
    valor: z2.number().positive(),
    metodo: z2.enum(["dinheiro", "mbway", "multibanco", "cartao", "transferencia", "cheque"]),
    referencia: z2.string().optional(),
    observacoes: z2.string().optional()
  })).mutation(({ input }) => {
    const fatura = faturasMock.find((f) => f.id === input.faturaId);
    if (!fatura) {
      throw new Error("Fatura n\xE3o encontrada");
    }
    if (fatura.estado === "anulada") {
      throw new Error("N\xE3o \xE9 poss\xEDvel registar pagamento em fatura anulada");
    }
    const agora = (/* @__PURE__ */ new Date()).toISOString();
    const novoPagamento = {
      id: `pag-${Date.now()}`,
      faturaId: input.faturaId,
      data: agora,
      valor: input.valor,
      metodo: input.metodo,
      referencia: input.referencia,
      observacoes: input.observacoes,
      criadoPor: "Sistema",
      criadoEm: agora
    };
    fatura.pagamentos.push(novoPagamento);
    fatura.valorPago += input.valor;
    fatura.valorEmDivida = fatura.total - fatura.valorPago;
    if (fatura.valorPago >= fatura.total) {
      fatura.estado = "paga";
      fatura.dataPagamento = agora;
    } else if (fatura.valorPago > 0) {
      fatura.estado = "parcial";
    }
    fatura.atualizadoEm = agora;
    return { fatura, pagamento: novoPagamento };
  }),
  // Obter estatísticas
  estatisticas: publicProcedure.input(z2.object({
    dataInicio: z2.string(),
    dataFim: z2.string()
  })).query(({ input }) => {
    const faturas2 = faturasMock.filter(
      (f) => f.data >= input.dataInicio && f.data <= input.dataFim
    );
    const receitaTotal = faturas2.reduce((sum, f) => sum + f.total, 0);
    const receitaPaga = faturas2.filter((f) => f.estado === "paga").reduce((sum, f) => sum + f.total, 0);
    const receitaPendente = faturas2.filter((f) => f.estado === "pendente" || f.estado === "parcial").reduce((sum, f) => sum + f.valorEmDivida, 0);
    const totalFaturas = faturas2.length;
    const faturasPagas = faturas2.filter((f) => f.estado === "paga").length;
    const faturasPendentes = faturas2.filter((f) => f.estado === "pendente").length;
    const faturasVencidas = faturas2.filter((f) => f.estado === "vencida").length;
    const faturasAnuladas = faturas2.filter((f) => f.estado === "anulada").length;
    const ticketMedio = totalFaturas > 0 ? receitaTotal / totalFaturas : 0;
    const pagamentosPorMetodo = /* @__PURE__ */ new Map();
    faturas2.forEach((f) => {
      f.pagamentos.forEach((p) => {
        const atual = pagamentosPorMetodo.get(p.metodo) || { valor: 0, quantidade: 0 };
        pagamentosPorMetodo.set(p.metodo, {
          valor: atual.valor + p.valor,
          quantidade: atual.quantidade + 1
        });
      });
    });
    const porMetodoPagamento = Array.from(pagamentosPorMetodo.entries()).map(([metodo, dados]) => ({
      metodo,
      ...dados
    }));
    const faturasPorDentista = /* @__PURE__ */ new Map();
    faturas2.forEach((f) => {
      const atual = faturasPorDentista.get(f.dentista) || { valor: 0, quantidade: 0 };
      faturasPorDentista.set(f.dentista, {
        valor: atual.valor + f.total,
        quantidade: atual.quantidade + 1
      });
    });
    const porDentista = Array.from(faturasPorDentista.entries()).map(([dentista, dados]) => ({
      dentista,
      ...dados
    }));
    const estatisticas = {
      periodoInicio: input.dataInicio,
      periodoFim: input.dataFim,
      receitaTotal,
      receitaPaga,
      receitaPendente,
      totalFaturas,
      faturasPagas,
      faturasPendentes,
      faturasVencidas,
      faturasAnuladas,
      ticketMedio,
      porMetodoPagamento,
      porDentista,
      evolucaoMensal: []
      // TODO: Implementar
    };
    return estatisticas;
  })
});

// server/routers/dentistas.ts
import { z as z3 } from "zod";
var dentistasRouter = router({
  // Listar todos os dentistas
  listar: protectedProcedure.query(async () => {
    const { listarDentistas } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await listarDentistas();
  }),
  // Obter dentista por ID
  obter: protectedProcedure.input(z3.object({ id: z3.string() })).query(async ({ input }) => {
    const { obterDentista } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await obterDentista(input.id);
  }),
  // Criar novo dentista
  criar: protectedProcedure.input(
    z3.object({
      nome: z3.string(),
      nomeCompleto: z3.string(),
      foto: z3.string().optional(),
      nif: z3.string().length(9),
      numeroOrdem: z3.string(),
      especialidades: z3.array(z3.string()),
      email: z3.string().email(),
      telefone: z3.string(),
      telemovel: z3.string().optional(),
      dataAdmissao: z3.string(),
      cargo: z3.string().optional(),
      horarioTrabalho: z3.any().optional(),
      corAgenda: z3.string().optional(),
      permiteAgendamentoOnline: z3.boolean().optional(),
      tempoConsultaPadrao: z3.number().optional(),
      observacoes: z3.string().optional(),
      competencias: z3.array(z3.string()).optional(),
      idiomas: z3.array(z3.string()).optional()
    })
  ).mutation(async ({ input }) => {
    const { criarDentista } = await Promise.resolve().then(() => (init_db(), db_exports));
    const dados = {
      ...input,
      especialidades: JSON.stringify(input.especialidades),
      horarioTrabalho: input.horarioTrabalho ? JSON.stringify(input.horarioTrabalho) : null,
      competencias: input.competencias ? JSON.stringify(input.competencias) : null,
      idiomas: input.idiomas ? JSON.stringify(input.idiomas) : null
    };
    return await criarDentista(dados);
  }),
  // Atualizar dentista
  atualizar: protectedProcedure.input(
    z3.object({
      id: z3.string(),
      dados: z3.object({
        nome: z3.string().optional(),
        nomeCompleto: z3.string().optional(),
        foto: z3.string().optional(),
        nif: z3.string().length(9).optional(),
        numeroOrdem: z3.string().optional(),
        especialidades: z3.array(z3.string()).optional(),
        email: z3.string().email().optional(),
        telefone: z3.string().optional(),
        telemovel: z3.string().optional(),
        dataAdmissao: z3.string().optional(),
        status: z3.enum(["ativo", "inativo", "ferias", "licenca"]).optional(),
        cargo: z3.string().optional(),
        horarioTrabalho: z3.any().optional(),
        corAgenda: z3.string().optional(),
        permiteAgendamentoOnline: z3.boolean().optional(),
        tempoConsultaPadrao: z3.number().optional(),
        observacoes: z3.string().optional(),
        competencias: z3.array(z3.string()).optional(),
        idiomas: z3.array(z3.string()).optional()
      })
    })
  ).mutation(async ({ input }) => {
    const { atualizarDentista } = await Promise.resolve().then(() => (init_db(), db_exports));
    const dados = { ...input.dados };
    if (dados.especialidades) dados.especialidades = JSON.stringify(dados.especialidades);
    if (dados.horarioTrabalho) dados.horarioTrabalho = JSON.stringify(dados.horarioTrabalho);
    if (dados.competencias) dados.competencias = JSON.stringify(dados.competencias);
    if (dados.idiomas) dados.idiomas = JSON.stringify(dados.idiomas);
    return await atualizarDentista(input.id, dados);
  }),
  // Remover dentista
  remover: protectedProcedure.input(z3.object({ id: z3.string() })).mutation(async ({ input }) => {
    const { removerDentista } = await Promise.resolve().then(() => (init_db(), db_exports));
    await removerDentista(input.id);
    return { sucesso: true };
  }),
  // Obter configuração de comissão
  obterConfigComissao: protectedProcedure.input(z3.object({ dentistaId: z3.string() })).query(async ({ input }) => {
    const { obterConfigComissao: obterConfigComissao3 } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await obterConfigComissao3(input.dentistaId);
  }),
  // Salvar configuração de comissão
  salvarConfigComissao: protectedProcedure.input(
    z3.object({
      dentistaId: z3.string(),
      tipo: z3.enum(["percentagem", "fixo", "misto", "nenhum"]),
      configuracao: z3.any(),
      pagarEm: z3.enum(["semanal", "quinzenal", "mensal"]).optional(),
      diasPagamento: z3.array(z3.number()).optional()
    })
  ).mutation(async ({ input }) => {
    const { salvarConfigComissao: salvarConfigComissao3 } = await Promise.resolve().then(() => (init_db(), db_exports));
    const dados = {
      ...input,
      configuracao: JSON.stringify(input.configuracao),
      diasPagamento: input.diasPagamento ? JSON.stringify(input.diasPagamento) : null
    };
    return await salvarConfigComissao3(dados);
  }),
  // Listar comissões do dentista
  listarComissoes: protectedProcedure.input(
    z3.object({
      dentistaId: z3.string(),
      mes: z3.string().optional()
      // Formato: YYYY-MM
    })
  ).query(async ({ input }) => {
    const { listarComissoesDentista: listarComissoesDentista3 } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await listarComissoesDentista3(input.dentistaId, input.mes);
  }),
  // Obter resumo financeiro do dentista
  resumoFinanceiro: protectedProcedure.input(
    z3.object({
      dentistaId: z3.string(),
      mes: z3.string()
      // Formato: YYYY-MM
    })
  ).query(async ({ input }) => {
    const { obterResumoFinanceiroDentista } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await obterResumoFinanceiroDentista(input.dentistaId, input.mes);
  }),
  // Pagar comissão
  pagarComissao: protectedProcedure.input(
    z3.object({
      id: z3.string(),
      formaPagamento: z3.string(),
      referencia: z3.string().optional()
    })
  ).mutation(async ({ input }) => {
    const { pagarComissao: pagarComissao3 } = await Promise.resolve().then(() => (init_db(), db_exports));
    await pagarComissao3(input.id, input.formaPagamento, input.referencia);
    return { sucesso: true };
  })
});

// server/routers/configuracoes.ts
import { z as z4 } from "zod";
var configuracoesRouter = router({
  // Obter configurações da clínica
  obter: protectedProcedure.query(async () => {
    const { obterConfigClinica } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await obterConfigClinica();
  }),
  // Salvar configurações da clínica
  salvar: protectedProcedure.input(
    z4.object({
      nomeClinica: z4.string(),
      nomeFantasia: z4.string().optional(),
      razaoSocial: z4.string(),
      nif: z4.string().length(9),
      numeroRegistro: z4.string().optional(),
      telefone: z4.string(),
      telemovel: z4.string().optional(),
      email: z4.string().email(),
      website: z4.string().optional(),
      redesSociais: z4.any().optional(),
      morada: z4.any(),
      anoFundacao: z4.number().optional(),
      numeroFuncionarios: z4.number().optional(),
      especialidades: z4.array(z4.string()).optional(),
      horarioFuncionamento: z4.any().optional(),
      logoPrincipal: z4.string().optional(),
      logoSecundario: z4.string().optional(),
      favicon: z4.string().optional(),
      paletaCores: z4.any().optional(),
      papelTimbrado: z4.any().optional(),
      nomeSistema: z4.string().optional(),
      slogan: z4.string().optional()
    })
  ).mutation(async ({ input }) => {
    const { salvarConfigClinica } = await Promise.resolve().then(() => (init_db(), db_exports));
    const dados = {
      ...input,
      redesSociais: input.redesSociais ? JSON.stringify(input.redesSociais) : null,
      morada: JSON.stringify(input.morada),
      especialidades: input.especialidades ? JSON.stringify(input.especialidades) : null,
      horarioFuncionamento: input.horarioFuncionamento ? JSON.stringify(input.horarioFuncionamento) : null,
      paletaCores: input.paletaCores ? JSON.stringify(input.paletaCores) : null,
      papelTimbrado: input.papelTimbrado ? JSON.stringify(input.papelTimbrado) : null
    };
    return await salvarConfigClinica(dados);
  }),
  // Listar formas de pagamento
  listarFormasPagamento: protectedProcedure.query(async () => {
    const { listarFormasPagamento } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await listarFormasPagamento();
  }),
  // Criar forma de pagamento
  criarFormaPagamento: protectedProcedure.input(
    z4.object({
      nome: z4.string(),
      tipo: z4.string(),
      ativo: z4.boolean().optional(),
      icone: z4.string().optional(),
      cor: z4.string().optional(),
      ordem: z4.number().optional(),
      taxa: z4.any().optional(),
      valorMinimo: z4.number().optional(),
      valorMaximo: z4.number().optional(),
      integracao: z4.any().optional(),
      observacoes: z4.string().optional(),
      requerReferencia: z4.boolean().optional()
    })
  ).mutation(async ({ input }) => {
    const { criarFormaPagamento } = await Promise.resolve().then(() => (init_db(), db_exports));
    const dados = {
      ...input,
      taxa: input.taxa ? JSON.stringify(input.taxa) : null,
      integracao: input.integracao ? JSON.stringify(input.integracao) : null
    };
    return await criarFormaPagamento(dados);
  }),
  // ========================================
  // CATEGORIAS DE DESPESA
  // ========================================
  listarCategoriasDespesa: protectedProcedure.input(
    z4.object({
      tipo: z4.enum(["fixa", "variavel"]).optional(),
      ativo: z4.boolean().optional()
    }).optional()
  ).query(async ({ input }) => {
    const { listarCategoriasDespesa } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await listarCategoriasDespesa(input);
  }),
  criarCategoriaDespesa: protectedProcedure.input(
    z4.object({
      nome: z4.string().min(1, "Nome \xE9 obrigat\xF3rio"),
      tipo: z4.enum(["fixa", "variavel"]),
      icone: z4.string().optional(),
      cor: z4.string().optional(),
      ordem: z4.number().default(0),
      ativo: z4.boolean().default(true)
    })
  ).mutation(async ({ input }) => {
    const { criarCategoriaDespesa } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await criarCategoriaDespesa(input);
  }),
  // ========================================
  // FORNECEDORES
  // ========================================
  listarFornecedores: protectedProcedure.input(
    z4.object({
      tipo: z4.string().optional(),
      status: z4.enum(["ativo", "inativo"]).optional(),
      pesquisa: z4.string().optional()
    }).optional()
  ).query(async ({ input }) => {
    const { listarFornecedores } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await listarFornecedores(input);
  }),
  criarFornecedor: protectedProcedure.input(
    z4.object({
      nome: z4.string().min(1, "Nome \xE9 obrigat\xF3rio"),
      razaoSocial: z4.string().optional(),
      nif: z4.string().optional(),
      tipo: z4.enum(["materiais", "equipamentos", "servicos", "laboratorio", "outros"]),
      telefone: z4.string().optional(),
      telemovel: z4.string().optional(),
      email: z4.string().email().optional(),
      website: z4.string().url().optional().or(z4.literal("")),
      morada: z4.string().optional(),
      cidade: z4.string().optional(),
      codigoPostal: z4.string().optional(),
      pais: z4.string().default("Portugal"),
      contactoPrincipal: z4.string().optional(),
      condicoesPagamento: z4.string().optional(),
      prazoEntrega: z4.number().optional(),
      status: z4.enum(["ativo", "inativo"]).default("ativo"),
      observacoes: z4.string().optional()
    })
  ).mutation(async ({ input }) => {
    const { criarFornecedor } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await criarFornecedor(input);
  })
});

// server/routers/comissoes.ts
import { z as z5 } from "zod";
init_db();
var comissoesRouter = router({
  // Listar comissões de um dentista
  listar: protectedProcedure.input(
    z5.object({
      dentistaId: z5.string(),
      mes: z5.string().optional()
    })
  ).query(async ({ input }) => {
    return await listarComissoesDentista(input.dentistaId, input.mes);
  }),
  // Obter resumo de comissões
  resumo: protectedProcedure.input(z5.object({ dentistaId: z5.string() })).query(async ({ input }) => {
    const comissoes2 = await listarComissoesDentista(input.dentistaId);
    const resumo = {
      totalPendente: 0,
      totalPago: 0,
      totalCancelado: 0,
      quantidadePendente: 0,
      quantidadePago: 0,
      quantidadeCancelado: 0
    };
    comissoes2.forEach((c) => {
      if (c.status === "pendente") {
        resumo.totalPendente += parseFloat(c.valor || 0);
        resumo.quantidadePendente++;
      } else if (c.status === "pago") {
        resumo.totalPago += parseFloat(c.valor || 0);
        resumo.quantidadePago++;
      } else if (c.status === "cancelado") {
        resumo.totalCancelado += parseFloat(c.valor || 0);
        resumo.quantidadeCancelado++;
      }
    });
    return resumo;
  }),
  // Criar comissão
  criar: protectedProcedure.input(
    z5.object({
      dentistaId: z5.string(),
      faturaId: z5.string(),
      valor: z5.number(),
      percentagem: z5.number().optional(),
      mes: z5.string(),
      observacoes: z5.string().optional()
    })
  ).mutation(async ({ input }) => {
    return await criarComissao(input);
  }),
  // Marcar comissão como paga
  pagar: protectedProcedure.input(
    z5.object({
      id: z5.string(),
      formaPagamento: z5.string(),
      referencia: z5.string().optional()
    })
  ).mutation(async ({ input }) => {
    return await pagarComissao(input.id, input.formaPagamento, input.referencia);
  }),
  // Obter configuração de comissão do dentista
  obterConfig: protectedProcedure.input(z5.object({ dentistaId: z5.string() })).query(async ({ input }) => {
    return await obterConfigComissao(input.dentistaId);
  }),
  // Salvar configuração de comissão
  salvarConfig: protectedProcedure.input(
    z5.object({
      dentistaId: z5.string(),
      tipo: z5.enum(["percentagem", "fixo", "misto"]),
      percentagem: z5.number().optional(),
      valorFixo: z5.number().optional(),
      valorMinimo: z5.number().optional(),
      valorMaximo: z5.number().optional(),
      observacoes: z5.string().optional()
    })
  ).mutation(async ({ input }) => {
    return await salvarConfigComissao(input);
  })
});

// server/routers/laboratorios.ts
import { z as z6 } from "zod";
init_db();
var laboratoriosRouter = router({
  // ========================================
  // CADASTRO DE LABORATÓRIOS
  // ========================================
  /**
   * Listar laboratórios
   */
  listar: publicProcedure.input(
    z6.object({
      status: z6.enum(["ativo", "inativo"]).optional(),
      pesquisa: z6.string().optional()
    }).optional()
  ).query(async ({ input }) => {
    return await listarLaboratorios();
  }),
  /**
   * Obter laboratório por ID
   */
  obter: publicProcedure.input(z6.object({ id: z6.string() })).query(async ({ input }) => {
    const laboratorio = await obterLaboratorio(input.id);
    if (!laboratorio) {
      throw new Error("Laborat\xF3rio n\xE3o encontrado");
    }
    return laboratorio;
  }),
  /**
   * Criar novo laboratório
   */
  criar: publicProcedure.input(
    z6.object({
      nome: z6.string().min(1, "Nome \xE9 obrigat\xF3rio"),
      razaoSocial: z6.string().optional(),
      nif: z6.string().optional(),
      telefone: z6.string().optional(),
      telemovel: z6.string().min(1, "Telem\xF3vel/WhatsApp \xE9 obrigat\xF3rio"),
      email: z6.string().email().optional(),
      website: z6.string().url().optional().or(z6.literal("")),
      morada: z6.string().optional(),
      cidade: z6.string().optional(),
      codigoPostal: z6.string().optional(),
      pais: z6.string().default("Portugal"),
      responsavelTecnico: z6.string().optional(),
      especialidades: z6.string().optional(),
      // JSON array
      prazoMedioEntrega: z6.number().default(7),
      formasPagamentoAceitas: z6.string().optional(),
      // JSON array
      condicoesPagamento: z6.string().optional(),
      status: z6.enum(["ativo", "inativo"]).default("ativo"),
      avaliacaoQualidade: z6.number().min(1).max(5).default(5),
      observacoes: z6.string().optional(),
      criadoPor: z6.string().optional()
    })
  ).mutation(async ({ input }) => {
    return await criarLaboratorio(input);
  }),
  /**
   * Atualizar laboratório
   */
  atualizar: publicProcedure.input(
    z6.object({
      id: z6.string(),
      nome: z6.string().optional(),
      razaoSocial: z6.string().optional(),
      nif: z6.string().optional(),
      telefone: z6.string().optional(),
      telemovel: z6.string().optional(),
      email: z6.string().email().optional(),
      website: z6.string().url().optional().or(z6.literal("")),
      morada: z6.string().optional(),
      cidade: z6.string().optional(),
      codigoPostal: z6.string().optional(),
      pais: z6.string().optional(),
      responsavelTecnico: z6.string().optional(),
      especialidades: z6.string().optional(),
      prazoMedioEntrega: z6.number().optional(),
      formasPagamentoAceitas: z6.string().optional(),
      condicoesPagamento: z6.string().optional(),
      status: z6.enum(["ativo", "inativo"]).optional(),
      avaliacaoQualidade: z6.number().min(1).max(5).optional(),
      observacoes: z6.string().optional()
    })
  ).mutation(async ({ input }) => {
    const { id, ...data } = input;
    return await atualizarLaboratorio(id, data);
  }),
  /**
   * Excluir laboratório (soft delete)
   */
  excluir: publicProcedure.input(z6.object({ id: z6.string() })).mutation(async ({ input }) => {
    await excluirLaboratorio(input.id);
    return { success: true };
  }),
  // ========================================
  // TRABALHOS DE LABORATÓRIO
  // ========================================
  /**
   * Listar trabalhos de laboratório
   */
  listarTrabalhos: publicProcedure.input(
    z6.object({
      laboratorioId: z6.string().optional(),
      utenteId: z6.string().optional(),
      dentistaId: z6.string().optional(),
      status: z6.string().optional()
    }).optional()
  ).query(async ({ input }) => {
    return await (void 0)(input);
  }),
  /**
   * Obter trabalho por ID
   */
  obterTrabalho: publicProcedure.input(z6.object({ id: z6.string() })).query(async ({ input }) => {
    const trabalho = await (void 0)(input.id);
    if (!trabalho) {
      throw new Error("Trabalho n\xE3o encontrado");
    }
    return trabalho;
  }),
  /**
   * Criar novo trabalho de laboratório
   */
  criarTrabalho: publicProcedure.input(
    z6.object({
      laboratorioId: z6.string(),
      utenteId: z6.string(),
      dentistaId: z6.string(),
      consultaId: z6.string().optional(),
      tipoTrabalho: z6.string().min(1, "Tipo de trabalho \xE9 obrigat\xF3rio"),
      descricao: z6.string().min(1, "Descri\xE7\xE3o \xE9 obrigat\xF3ria"),
      dentes: z6.string().optional(),
      cor: z6.string().optional(),
      material: z6.string().optional(),
      dataEnvio: z6.string().optional(),
      dataPrevisaoEntrega: z6.string().optional(),
      dataEntregaReal: z6.string().optional(),
      dataInstalacao: z6.string().optional(),
      custoLaboratorio: z6.number().min(0, "Custo deve ser maior que zero"),
      valorCobradoUtente: z6.number().optional(),
      status: z6.enum([
        "orcamento",
        "enviado",
        "em_producao",
        "recebido",
        "instalado",
        "ajuste_necessario",
        "cancelado"
      ]).default("orcamento"),
      observacoes: z6.string().optional(),
      observacoesInternas: z6.string().optional(),
      criadoPor: z6.string().optional()
    })
  ).mutation(async ({ input }) => {
    return await (void 0)(input);
  }),
  /**
   * Atualizar trabalho de laboratório
   */
  atualizarTrabalho: publicProcedure.input(
    z6.object({
      id: z6.string(),
      laboratorioId: z6.string().optional(),
      tipoTrabalho: z6.string().optional(),
      descricao: z6.string().optional(),
      dentes: z6.string().optional(),
      cor: z6.string().optional(),
      material: z6.string().optional(),
      dataEnvio: z6.string().optional(),
      dataPrevisaoEntrega: z6.string().optional(),
      dataEntregaReal: z6.string().optional(),
      dataInstalacao: z6.string().optional(),
      custoLaboratorio: z6.number().optional(),
      valorCobradoUtente: z6.number().optional(),
      status: z6.enum([
        "orcamento",
        "enviado",
        "em_producao",
        "recebido",
        "instalado",
        "ajuste_necessario",
        "cancelado"
      ]).optional(),
      avaliacaoQualidade: z6.number().min(1).max(5).optional(),
      necessitouAjuste: z6.boolean().optional(),
      observacoes: z6.string().optional(),
      observacoesInternas: z6.string().optional()
    })
  ).mutation(async ({ input }) => {
    const { id, ...data } = input;
    return await (void 0)(id, data);
  }),
  /**
   * Excluir trabalho de laboratório
   */
  excluirTrabalho: publicProcedure.input(z6.object({ id: z6.string() })).mutation(async ({ input }) => {
    await (void 0)(input.id);
    return { success: true };
  }),
  /**
   * Estatísticas de laboratório
   */
  estatisticas: publicProcedure.input(z6.object({ laboratorioId: z6.string() })).query(async ({ input }) => {
    const trabalhos = await (void 0)({
      laboratorioId: input.laboratorioId
    });
    const totalTrabalhos = trabalhos.length;
    const trabalhosEmAndamento = trabalhos.filter(
      (t2) => t2.status === "enviado" || t2.status === "em_producao"
    ).length;
    const trabalhosFinalizados = trabalhos.filter(
      (t2) => t2.status === "instalado"
    ).length;
    const trabalhosCancelados = trabalhos.filter(
      (t2) => t2.status === "cancelado"
    ).length;
    const custoTotal = trabalhos.reduce(
      (acc, t2) => acc + (t2.custoLaboratorio || t2.custo || 0),
      0
    );
    const receitaTotal = trabalhos.reduce(
      (acc, t2) => acc + (t2.valorCobradoUtente || t2.valor || 0),
      0
    );
    const margemTotal = receitaTotal - custoTotal;
    const avaliacaoMedia = trabalhos.filter((t2) => t2.avaliacaoQualidade).reduce((acc, t2) => acc + (t2.avaliacaoQualidade || 0), 0) / (trabalhos.filter((t2) => t2.avaliacaoQualidade).length || 1);
    const necessitaramAjuste = trabalhos.filter(
      (t2) => t2.necessitouAjuste
    ).length;
    return {
      totalTrabalhos,
      trabalhosEmAndamento,
      trabalhosFinalizados,
      trabalhosCancelados,
      custoTotal,
      receitaTotal,
      margemTotal,
      avaliacaoMedia: isNaN(avaliacaoMedia) ? 0 : avaliacaoMedia,
      percentualAjustes: totalTrabalhos > 0 ? necessitaramAjuste / totalTrabalhos * 100 : 0
    };
  })
});

// server/routers/contas-pagar.ts
import { z as z7 } from "zod";
init_db();
var contasPagarRouter = router({
  /**
   * Listar contas a pagar
   */
  listar: publicProcedure.input(
    z7.object({
      status: z7.string().optional(),
      categoriaId: z7.string().optional(),
      fornecedorId: z7.string().optional(),
      dataInicio: z7.string().optional(),
      dataFim: z7.string().optional(),
      vencimentoInicio: z7.string().optional(),
      vencimentoFim: z7.string().optional()
    }).optional()
  ).query(async ({ input }) => {
    return await (void 0)();
  }),
  /**
   * Obter conta por ID
   */
  obter: publicProcedure.input(z7.object({ id: z7.string() })).query(async ({ input }) => {
    const conta = await (void 0)(input.id);
    if (!conta) {
      throw new Error("Conta n\xE3o encontrada");
    }
    return conta;
  }),
  /**
   * Criar nova conta a pagar
   */
  criar: publicProcedure.input(
    z7.object({
      categoriaId: z7.string().min(1, "Categoria \xE9 obrigat\xF3ria"),
      fornecedorId: z7.string().optional(),
      laboratorioId: z7.string().optional(),
      dentistaId: z7.string().optional(),
      descricao: z7.string().min(1, "Descri\xE7\xE3o \xE9 obrigat\xF3ria"),
      numeroDocumento: z7.string().optional(),
      dataEmissao: z7.string().min(1, "Data de emiss\xE3o \xE9 obrigat\xF3ria"),
      dataVencimento: z7.string().min(1, "Data de vencimento \xE9 obrigat\xF3ria"),
      valorTotal: z7.number().min(0.01, "Valor deve ser maior que zero"),
      valorPago: z7.number().default(0),
      formaPagamento: z7.string().optional(),
      observacoes: z7.string().optional(),
      anexos: z7.string().optional(),
      // JSON array
      recorrente: z7.boolean().default(false),
      frequenciaRecorrencia: z7.string().optional(),
      status: z7.enum(["pendente", "pago_parcial", "pago", "vencido", "cancelado"]).default("pendente"),
      criadoPor: z7.string().optional()
    })
  ).mutation(async ({ input }) => {
    return await (void 0)({
      ...input,
      valorTotal: input.valorTotal.toString(),
      valorPago: input.valorPago.toString()
    });
  }),
  /**
   * Atualizar conta a pagar
   */
  atualizar: publicProcedure.input(
    z7.object({
      id: z7.string(),
      categoriaId: z7.string().optional(),
      fornecedorId: z7.string().optional(),
      laboratorioId: z7.string().optional(),
      dentistaId: z7.string().optional(),
      descricao: z7.string().optional(),
      numeroDocumento: z7.string().optional(),
      dataEmissao: z7.string().optional(),
      dataVencimento: z7.string().optional(),
      valorTotal: z7.number().optional(),
      valorPago: z7.number().optional(),
      formaPagamento: z7.string().optional(),
      observacoes: z7.string().optional(),
      anexos: z7.string().optional(),
      recorrente: z7.boolean().optional(),
      frequenciaRecorrencia: z7.string().optional(),
      status: z7.enum(["pendente", "pago_parcial", "pago", "vencido", "cancelado"]).optional()
    })
  ).mutation(async ({ input }) => {
    const { id, ...data } = input;
    const updateData = { ...data };
    if (data.valorTotal !== void 0) {
      updateData.valorTotal = data.valorTotal.toString();
    }
    if (data.valorPago !== void 0) {
      updateData.valorPago = data.valorPago.toString();
    }
    return await (void 0)(id, updateData);
  }),
  /**
   * Excluir conta a pagar
   */
  excluir: publicProcedure.input(z7.object({ id: z7.string() })).mutation(async ({ input }) => {
    console.log("Conta a pagar exclu\xEDda:", input.id);
    return { success: true };
  }),
  /**
   * Registrar pagamento
   */
  registrarPagamento: publicProcedure.input(
    z7.object({
      contaPagarId: z7.string(),
      dataPagamento: z7.string(),
      valorPago: z7.number().min(0.01, "Valor deve ser maior que zero"),
      formaPagamento: z7.string().min(1, "Forma de pagamento \xE9 obrigat\xF3ria"),
      observacoes: z7.string().optional(),
      comprovante: z7.string().optional()
    })
  ).mutation(async ({ input }) => {
    console.log("Pagamento registrado:", input);
    return { success: true };
  }),
  /**
   * Listar pagamentos de uma conta
   */
  listarPagamentos: publicProcedure.input(z7.object({ contaPagarId: z7.string() })).query(async ({ input }) => {
    return [];
  }),
  /**
   * Obter estatísticas
   */
  estatisticas: publicProcedure.input(
    z7.object({
      dataInicio: z7.string().optional(),
      dataFim: z7.string().optional()
    }).optional()
  ).query(async ({ input }) => {
    return {};
  }),
  /**
   * Marcar como pago
   */
  marcarComoPago: publicProcedure.input(
    z7.object({
      id: z7.string(),
      dataPagamento: z7.string(),
      formaPagamento: z7.string(),
      observacoes: z7.string().optional()
    })
  ).mutation(async ({ input }) => {
    const conta = await (void 0)(input.id);
    if (!conta) {
      throw new Error("Conta n\xE3o encontrada");
    }
    const valorTotal = Number(conta.valorTotal || conta.valor || 0);
    const valorPago = Number(conta.valorPago || 0);
    const saldo = valorTotal - valorPago;
    if (saldo > 0) {
      console.log("Pagamento registrado:", { contaPagarId: input.id, valorPago: saldo });
    }
    return { success: true };
  })
});

// server/routers/ia-financeira.ts
import { z as z8 } from "zod";

// server/services/ia-financeira.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
var genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
var model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
async function assistenteFinanceiro(pergunta, dadosFinanceiros) {
  try {
    const contexto = `
Voc\xEA \xE9 um assistente financeiro especializado em cl\xEDnicas odontol\xF3gicas.
Voc\xEA tem acesso aos seguintes dados financeiros da cl\xEDnica:

RECEITAS (Faturas):
${JSON.stringify(dadosFinanceiros.receitas, null, 2)}

DESPESAS (Contas a Pagar):
${JSON.stringify(dadosFinanceiros.despesas, null, 2)}

CONTAS A PAGAR:
${JSON.stringify(dadosFinanceiros.contasPagar, null, 2)}

CONTAS A RECEBER:
${JSON.stringify(dadosFinanceiros.contasReceber, null, 2)}

COMISS\xD5ES DOS DENTISTAS:
${JSON.stringify(dadosFinanceiros.comissoes, null, 2)}

PER\xCDODO: ${dadosFinanceiros.periodo?.inicio || "N\xE3o especificado"} at\xE9 ${dadosFinanceiros.periodo?.fim || "N\xE3o especificado"}

INSTRU\xC7\xD5ES:
1. Analise os dados fornecidos
2. Responda a pergunta do usu\xE1rio de forma clara e objetiva
3. Use valores em euros (\u20AC) formatados corretamente
4. Se n\xE3o houver dados suficientes, informe isso educadamente
5. Forne\xE7a insights adicionais quando relevante
6. Use linguagem profissional mas acess\xEDvel
7. Seja conciso mas completo

PERGUNTA DO USU\xC1RIO:
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
async function gerarInsightsFinanceiros(dadosFinanceiros) {
  try {
    const prompt = `
Voc\xEA \xE9 um analista financeiro especializado em cl\xEDnicas odontol\xF3gicas.
Analise os dados financeiros abaixo e gere um relat\xF3rio completo com insights acion\xE1veis.

DADOS FINANCEIROS:

RECEITAS:
${JSON.stringify(dadosFinanceiros.receitas, null, 2)}

DESPESAS:
${JSON.stringify(dadosFinanceiros.despesas, null, 2)}

CONTAS A PAGAR:
${JSON.stringify(dadosFinanceiros.contasPagar, null, 2)}

CONTAS A RECEBER:
${JSON.stringify(dadosFinanceiros.contasReceber, null, 2)}

COMISS\xD5ES:
${JSON.stringify(dadosFinanceiros.comissoes, null, 2)}

INSTRU\xC7\xD5ES:
1. Calcule as principais m\xE9tricas financeiras
2. Identifique tend\xEAncias e padr\xF5es
3. Destaque pontos positivos e negativos
4. Gere alertas sobre problemas urgentes
5. Forne\xE7a recomenda\xE7\xF5es pr\xE1ticas e acion\xE1veis
6. Use linguagem profissional e objetiva

FORMATO DE RESPOSTA (JSON):
{
  "resumo": "Resumo executivo em 2-3 frases",
  "insights": ["Insight 1", "Insight 2", "Insight 3", ...],
  "alertas": ["Alerta 1", "Alerta 2", ...],
  "recomendacoes": ["Recomenda\xE7\xE3o 1", "Recomenda\xE7\xE3o 2", ...],
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
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return {
      resumo: "An\xE1lise financeira gerada com sucesso.",
      insights: ["Dados financeiros processados"],
      alertas: [],
      recomendacoes: ["Continue monitorando suas finan\xE7as"],
      metricas: {
        receitaTotal: 0,
        despesaTotal: 0,
        lucroLiquido: 0,
        margemLucro: 0,
        ticketMedio: 0
      }
    };
  } catch (error) {
    console.error("Erro ao gerar insights:", error);
    throw new Error("Erro ao gerar insights financeiros");
  }
}
async function categorizarDespesa(descricao, valor, fornecedor, historicoCategorizacoes) {
  try {
    const prompt = `
Voc\xEA \xE9 um especialista em categoriza\xE7\xE3o de despesas para cl\xEDnicas odontol\xF3gicas.

CATEGORIAS DISPON\xCDVEIS:
- Materiais Odontol\xF3gicos
- Equipamentos
- Laborat\xF3rio
- Aluguel
- Energia e \xC1gua
- Internet e Telefone
- Sal\xE1rios e Comiss\xF5es
- Marketing
- Limpeza e Manuten\xE7\xE3o
- Impostos e Taxas
- Seguros
- Forma\xE7\xE3o e Capacita\xE7\xE3o
- Outras Despesas

HIST\xD3RICO DE CATEGORIZA\xC7\xD5ES:
${JSON.stringify(historicoCategorizacoes || [], null, 2)}

NOVA DESPESA:
Descri\xE7\xE3o: ${descricao}
Valor: \u20AC${valor}
Fornecedor: ${fornecedor || "N\xE3o informado"}

INSTRU\xC7\xD5ES:
1. Analise a descri\xE7\xE3o e o hist\xF3rico
2. Sugira a categoria mais apropriada
3. Indique o n\xEDvel de confian\xE7a (0-100)
4. Explique brevemente o motivo

FORMATO DE RESPOSTA (JSON):
{
  "categoriaSugerida": "Nome da Categoria",
  "confianca": 85,
  "explicacao": "Breve explica\xE7\xE3o"
}

IMPORTANTE: Retorne APENAS o JSON, sem texto adicional.
`;
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return {
      categoriaSugerida: "Outras Despesas",
      confianca: 50,
      explicacao: "Categoriza\xE7\xE3o padr\xE3o aplicada"
    };
  } catch (error) {
    console.error("Erro ao categorizar despesa:", error);
    return {
      categoriaSugerida: "Outras Despesas",
      confianca: 0,
      explicacao: "Erro ao processar categoriza\xE7\xE3o"
    };
  }
}
async function analisarTendencias(dadosHistoricos) {
  try {
    const prompt = `
Voc\xEA \xE9 um analista financeiro especializado em previs\xF5es e tend\xEAncias.

DADOS HIST\xD3RICOS:
${JSON.stringify(dadosHistoricos, null, 2)}

INSTRU\xC7\xD5ES:
1. Analise as tend\xEAncias de receitas, despesas e lucro
2. Identifique se est\xE3o crescentes, est\xE1veis ou decrescentes
3. Fa\xE7a uma previs\xE3o para o pr\xF3ximo m\xEAs
4. Forne\xE7a uma an\xE1lise detalhada

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
  "analise": "An\xE1lise detalhada das tend\xEAncias"
}

IMPORTANTE: Retorne APENAS o JSON, sem texto adicional.
`;
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return {
      tendenciaReceitas: "estavel",
      tendenciaDespesas: "estavel",
      tendenciaLucro: "estavel",
      previsaoProximoMes: {
        receitas: 0,
        despesas: 0,
        lucro: 0
      },
      analise: "Dados insuficientes para an\xE1lise de tend\xEAncias"
    };
  } catch (error) {
    console.error("Erro ao analisar tend\xEAncias:", error);
    throw new Error("Erro ao analisar tend\xEAncias");
  }
}
async function sugerirEconomias(despesas, periodo) {
  try {
    const prompt = `
Voc\xEA \xE9 um consultor financeiro especializado em otimiza\xE7\xE3o de custos para cl\xEDnicas odontol\xF3gicas.

DESPESAS DO PER\xCDODO (${periodo.inicio} at\xE9 ${periodo.fim}):
${JSON.stringify(despesas, null, 2)}

INSTRU\xC7\xD5ES:
1. Analise as despesas e identifique oportunidades de economia
2. Sugira a\xE7\xF5es pr\xE1ticas para reduzir custos
3. Estime o valor de economia poss\xEDvel
4. Priorize sugest\xF5es realistas e acion\xE1veis

FORMATO DE RESPOSTA (JSON):
{
  "economiasPossiveis": [
    {
      "categoria": "Nome da Categoria",
      "valorAtual": 1000,
      "economiaEstimada": 150,
      "sugestao": "Descri\xE7\xE3o da sugest\xE3o"
    }
  ],
  "totalEconomia": 0
}

IMPORTANTE: Retorne APENAS o JSON, sem texto adicional.
`;
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return {
      economiasPossiveis: [],
      totalEconomia: 0
    };
  } catch (error) {
    console.error("Erro ao sugerir economias:", error);
    throw new Error("Erro ao sugerir economias");
  }
}

// server/routers/ia-financeira.ts
init_db();
var iaFinanceiraRouter = router({
  /**
   * Assistente Financeiro - Chatbot conversacional
   */
  perguntarAssistente: publicProcedure.input(
    z8.object({
      pergunta: z8.string().min(1, "Pergunta \xE9 obrigat\xF3ria"),
      periodo: z8.object({
        inicio: z8.string(),
        fim: z8.string()
      }).optional()
    })
  ).mutation(async ({ input }) => {
    const receitas = [];
    const despesas = await (void 0)();
    const dadosFinanceiros = {
      receitas,
      despesas,
      contasPagar: despesas,
      contasReceber: [],
      comissoes: [],
      periodo: input.periodo
    };
    const resposta = await assistenteFinanceiro(
      input.pergunta,
      dadosFinanceiros
    );
    return {
      pergunta: input.pergunta,
      resposta,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
  }),
  /**
   * Gerar Insights Automáticos
   */
  gerarInsights: publicProcedure.input(
    z8.object({
      periodo: z8.object({
        inicio: z8.string(),
        fim: z8.string()
      })
    }).optional()
  ).query(async ({ input }) => {
    const despesas = await (void 0)();
    const estatisticasDespesas = {};
    const dadosFinanceiros = {
      receitas: [],
      despesas,
      contasPagar: despesas,
      contasReceber: [],
      comissoes: [],
      periodo: input?.periodo
    };
    const insights = await gerarInsightsFinanceiros(dadosFinanceiros);
    return {
      ...insights,
      estatisticas: estatisticasDespesas,
      geradoEm: (/* @__PURE__ */ new Date()).toISOString()
    };
  }),
  /**
   * Categorizar Despesa Automaticamente
   */
  categorizarDespesa: publicProcedure.input(
    z8.object({
      descricao: z8.string(),
      valor: z8.number(),
      fornecedor: z8.string().optional()
    })
  ).mutation(async ({ input }) => {
    const despesas = await (void 0)();
    const historicoCategorizacoes = despesas.slice(0, 50).map((d) => ({
      descricao: d.descricao,
      categoria: d.categoriaId || "Outras Despesas",
      fornecedor: d.fornecedorId
    }));
    const resultado = await categorizarDespesa(
      input.descricao,
      input.valor,
      input.fornecedor,
      historicoCategorizacoes
    );
    return resultado;
  }),
  /**
   * Analisar Tendências
   */
  analisarTendencias: publicProcedure.input(
    z8.object({
      meses: z8.number().min(3).max(24).default(6)
    })
  ).query(async ({ input }) => {
    const dadosHistoricos = [];
    const hoje = /* @__PURE__ */ new Date();
    for (let i = input.meses - 1; i >= 0; i--) {
      const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
      const mesAno = data.toISOString().substring(0, 7);
      const despesas = await (void 0)();
      const totalDespesas = despesas.reduce(
        (sum, d) => sum + parseFloat(d.valor || 0),
        0
      );
      dadosHistoricos.push({
        periodo: mesAno,
        receitas: 0,
        // TODO: buscar receitas
        despesas: totalDespesas,
        lucro: 0 - totalDespesas
      });
    }
    const analise = await analisarTendencias(dadosHistoricos);
    return {
      ...analise,
      dadosHistoricos,
      geradoEm: (/* @__PURE__ */ new Date()).toISOString()
    };
  }),
  /**
   * Sugerir Economias
   */
  sugerirEconomias: publicProcedure.input(
    z8.object({
      periodo: z8.object({
        inicio: z8.string(),
        fim: z8.string()
      })
    })
  ).query(async ({ input }) => {
    const despesas = await (void 0)();
    const sugestoes = await sugerirEconomias(
      despesas,
      input.periodo
    );
    return {
      ...sugestoes,
      periodo: input.periodo,
      geradoEm: (/* @__PURE__ */ new Date()).toISOString()
    };
  })
});

// server/routers/prescricoes.ts
import { z as z9 } from "zod";
var medicamentoSchema = z9.object({
  medicamento: z9.string().min(1, "Nome do medicamento \xE9 obrigat\xF3rio"),
  posologia: z9.string().min(1, "Posologia \xE9 obrigat\xF3ria"),
  duracao: z9.string().min(1, "Dura\xE7\xE3o \xE9 obrigat\xF3ria"),
  quantidade: z9.string().optional()
});
var prescricoesRouter = router({
  /**
   * Listar prescrições de um utente
   */
  listar: protectedProcedure.input(z9.object({ utenteId: z9.string() })).query(async ({ input }) => {
    const { listarPrescricoes } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await listarPrescricoes(input.utenteId);
  }),
  /**
   * Listar todas as prescrições com paginação
   */
  listarPaginado: protectedProcedure.input(
    z9.object({
      page: z9.number().min(1).default(1),
      pageSize: z9.number().min(1).max(100).default(20),
      utenteId: z9.string().optional(),
      dataInicio: z9.string().optional(),
      dataFim: z9.string().optional()
    })
  ).query(async ({ input }) => {
    const { listarPrescricoesPaginado } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await listarPrescricoesPaginado(input);
  }),
  /**
   * Obter prescrição por ID
   */
  obter: protectedProcedure.input(z9.object({ id: z9.string() })).query(async ({ input }) => {
    const { obterPrescricao } = await Promise.resolve().then(() => (init_db(), db_exports));
    const prescricao = await obterPrescricao(input.id);
    if (!prescricao) {
      throw new Error("Prescri\xE7\xE3o n\xE3o encontrada");
    }
    return prescricao;
  }),
  /**
   * Criar nova prescrição
   */
  criar: protectedProcedure.input(
    z9.object({
      utenteId: z9.string().min(1, "Utente \xE9 obrigat\xF3rio"),
      data: z9.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inv\xE1lida (use YYYY-MM-DD)"),
      medicamentos: z9.array(medicamentoSchema).min(1, "Adicione pelo menos um medicamento"),
      observacoes: z9.string().optional().nullable(),
      diagnostico: z9.string().optional().nullable()
    })
  ).mutation(async ({ input, ctx }) => {
    const { criarPrescricao } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await criarPrescricao({
      ...input,
      criadoPor: ctx.user.id
    });
  }),
  /**
   * Atualizar prescrição
   */
  atualizar: protectedProcedure.input(
    z9.object({
      id: z9.string(),
      dados: z9.object({
        data: z9.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
        medicamentos: z9.array(medicamentoSchema).optional(),
        observacoes: z9.string().optional().nullable(),
        diagnostico: z9.string().optional().nullable()
      })
    })
  ).mutation(async ({ input, ctx }) => {
    const { atualizarPrescricao } = await Promise.resolve().then(() => (init_db(), db_exports));
    const prescricao = await atualizarPrescricao(input.id, {
      ...input.dados,
      atualizadoPor: ctx.user.id
    });
    if (!prescricao) {
      throw new Error("Prescri\xE7\xE3o n\xE3o encontrada");
    }
    return prescricao;
  }),
  /**
   * Eliminar prescrição
   */
  eliminar: protectedProcedure.input(z9.object({ id: z9.string() })).mutation(async ({ input }) => {
    const { eliminarPrescricao } = await Promise.resolve().then(() => (init_db(), db_exports));
    const sucesso = await eliminarPrescricao(input.id);
    if (!sucesso) {
      throw new Error("Erro ao eliminar prescri\xE7\xE3o");
    }
    return { success: true };
  }),
  /**
   * Gerar PDF da prescrição
   */
  gerarPdf: protectedProcedure.input(z9.object({ id: z9.string() })).query(async ({ input }) => {
    const { gerarPdfPrescricao } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await gerarPdfPrescricao(input.id);
  })
});
var medicamentosRouter = router({
  /**
   * Buscar medicamentos por nome
   */
  buscar: protectedProcedure.input(z9.object({ termo: z9.string().min(2, "Digite pelo menos 2 caracteres") })).query(async ({ input }) => {
    const { buscarMedicamentos } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await buscarMedicamentos(input.termo);
  }),
  /**
   * Listar medicamentos mais usados
   */
  maisUsados: protectedProcedure.input(z9.object({ limite: z9.number().min(1).max(50).default(10) })).query(async ({ input }) => {
    const { listarMedicamentosMaisUsados } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await listarMedicamentosMaisUsados(input.limite);
  }),
  /**
   * Obter informações de um medicamento
   */
  obter: protectedProcedure.input(z9.object({ id: z9.string() })).query(async ({ input }) => {
    const { obterMedicamento } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await obterMedicamento(input.id);
  })
});

// server/routers/odontograma.ts
import { z as z10 } from "zod";
var denteEstadoSchema = z10.object({
  numeroDente: z10.string().regex(/^[1-4][1-8]$/, "N\xFAmero de dente inv\xE1lido (use nota\xE7\xE3o FDI)"),
  estado: z10.enum([
    "saudavel",
    "carie",
    "restauracao",
    "coroa",
    "ponte",
    "implante",
    "extraido",
    "ausente",
    "tratamento_canal"
  ]),
  observacoes: z10.string().optional()
});
var odontogramaRouter = router({
  /**
   * Obter odontograma atual de um utente
   */
  obter: protectedProcedure.input(z10.object({ utenteId: z10.string() })).query(async ({ input }) => {
    const { obterOdontograma } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await obterOdontograma(input.utenteId);
  }),
  /**
   * Obter histórico de alterações do odontograma
   */
  obterHistorico: protectedProcedure.input(z10.object({ utenteId: z10.string() })).query(async ({ input }) => {
    const { obterHistoricoOdontograma } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await obterHistoricoOdontograma(input.utenteId);
  }),
  /**
   * Salvar/atualizar odontograma completo
   */
  salvar: protectedProcedure.input(
    z10.object({
      utenteId: z10.string().min(1, "Utente \xE9 obrigat\xF3rio"),
      dentes: z10.array(denteEstadoSchema).min(1, "Adicione pelo menos um dente"),
      observacoesGerais: z10.string().optional()
    })
  ).mutation(async ({ input, ctx }) => {
    const { salvarOdontograma } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await salvarOdontograma({
      ...input,
      atualizadoPor: ctx.user.id
    });
  }),
  /**
   * Atualizar estado de um dente específico
   */
  atualizarDente: protectedProcedure.input(
    z10.object({
      utenteId: z10.string(),
      dente: denteEstadoSchema
    })
  ).mutation(async ({ input, ctx }) => {
    const { atualizarDenteOdontograma } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await atualizarDenteOdontograma({
      utenteId: input.utenteId,
      dente: input.dente,
      atualizadoPor: ctx.user.id
    });
  }),
  /**
   * Obter estatísticas do odontograma
   */
  estatisticas: protectedProcedure.input(z10.object({ utenteId: z10.string() })).query(async ({ input }) => {
    const { obterEstatisticasOdontograma } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await obterEstatisticasOdontograma(input.utenteId);
  })
});

// server/routers/periodontograma.ts
import { z as z11 } from "zod";
var medicaoPeriodontaSchema = z11.object({
  numeroDente: z11.string().regex(/^[1-4][1-8]$/, "N\xFAmero de dente inv\xE1lido (use nota\xE7\xE3o FDI)"),
  // Profundidade de sondagem (6 pontos por dente)
  profundidadeSondagem: z11.object({
    mesioVestibular: z11.number().min(0).max(20),
    vestibular: z11.number().min(0).max(20),
    distoVestibular: z11.number().min(0).max(20),
    mesioLingual: z11.number().min(0).max(20),
    lingual: z11.number().min(0).max(20),
    distoLingual: z11.number().min(0).max(20)
  }),
  // Nível de inserção clínica (6 pontos)
  nivelInsercao: z11.object({
    mesioVestibular: z11.number().min(0).max(20),
    vestibular: z11.number().min(0).max(20),
    distoVestibular: z11.number().min(0).max(20),
    mesioLingual: z11.number().min(0).max(20),
    lingual: z11.number().min(0).max(20),
    distoLingual: z11.number().min(0).max(20)
  }),
  // Sangramento à sondagem
  sangramento: z11.object({
    mesioVestibular: z11.boolean(),
    vestibular: z11.boolean(),
    distoVestibular: z11.boolean(),
    mesioLingual: z11.boolean(),
    lingual: z11.boolean(),
    distoLingual: z11.boolean()
  }),
  // Mobilidade dentária (0-3)
  mobilidade: z11.number().min(0).max(3).default(0),
  // Furca (0-3)
  furca: z11.number().min(0).max(3).default(0),
  observacoes: z11.string().optional()
});
var periodontogramaRouter = router({
  /**
   * Obter periodontograma atual de um utente
   */
  obter: protectedProcedure.input(z11.object({ utenteId: z11.string() })).query(async ({ input }) => {
    const { obterPeriodontograma } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await obterPeriodontograma(input.utenteId);
  }),
  /**
   * Obter histórico de periodontogramas (evolução)
   */
  obterHistorico: protectedProcedure.input(z11.object({ utenteId: z11.string() })).query(async ({ input }) => {
    const { obterHistoricoPeriodontograma } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await obterHistoricoPeriodontograma(input.utenteId);
  }),
  /**
   * Salvar novo periodontograma completo
   */
  salvar: protectedProcedure.input(
    z11.object({
      utenteId: z11.string().min(1, "Utente \xE9 obrigat\xF3rio"),
      data: z11.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inv\xE1lida (use YYYY-MM-DD)"),
      medicoes: z11.array(medicaoPeriodontaSchema).min(1, "Adicione pelo menos uma medi\xE7\xE3o"),
      observacoesGerais: z11.string().optional(),
      diagnostico: z11.string().optional()
    })
  ).mutation(async ({ input, ctx }) => {
    const { salvarPeriodontograma } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await salvarPeriodontograma({
      ...input,
      criadoPor: ctx.user.id
    });
  }),
  /**
   * Atualizar medição de um dente específico
   */
  atualizarDente: protectedProcedure.input(
    z11.object({
      periodontogramaId: z11.string(),
      medicao: medicaoPeriodontaSchema
    })
  ).mutation(async ({ input, ctx }) => {
    const { atualizarDentePeriodontograma } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await atualizarDentePeriodontograma({
      periodontogramaId: input.periodontogramaId,
      medicao: input.medicao,
      atualizadoPor: ctx.user.id
    });
  }),
  /**
   * Obter estatísticas e análise periodontal
   */
  estatisticas: protectedProcedure.input(z11.object({ utenteId: z11.string() })).query(async ({ input }) => {
    const { obterEstatisticasPeriodontograma } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await obterEstatisticasPeriodontograma(input.utenteId);
  }),
  /**
   * Comparar dois periodontogramas (evolução)
   */
  comparar: protectedProcedure.input(
    z11.object({
      periodontogramaId1: z11.string(),
      periodontogramaId2: z11.string()
    })
  ).query(async ({ input }) => {
    const { compararPeriodontogramas } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await compararPeriodontogramas(
      input.periodontogramaId1,
      input.periodontogramaId2
    );
  })
});

// server/routers/bloqueios-agenda.ts
import { z as z12 } from "zod";
var bloqueiosAgendaRouter = router({
  /**
   * Listar bloqueios num período
   */
  listar: protectedProcedure.input(
    z12.object({
      dataInicio: z12.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inv\xE1lida (use YYYY-MM-DD)"),
      dataFim: z12.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inv\xE1lida (use YYYY-MM-DD)"),
      dentistaId: z12.string().optional()
    })
  ).query(async ({ input }) => {
    const { listarBloqueios } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await listarBloqueios(input.dataInicio, input.dataFim, input.dentistaId);
  }),
  /**
   * Criar novo bloqueio
   */
  criar: protectedProcedure.input(
    z12.object({
      dentistaId: z12.string().min(1, "Dentista \xE9 obrigat\xF3rio"),
      dataHoraInicio: z12.string().regex(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/,
        "Data/hora inv\xE1lida (use YYYY-MM-DDTHH:MM)"
      ),
      dataHoraFim: z12.string().regex(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/,
        "Data/hora inv\xE1lida (use YYYY-MM-DDTHH:MM)"
      ),
      motivo: z12.string().optional(),
      tipo: z12.enum(["almoco", "reuniao", "folga", "ferias", "outro"]),
      observacoes: z12.string().optional()
    })
  ).mutation(async ({ input, ctx }) => {
    const { criarBloqueio } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await criarBloqueio({
      ...input,
      criadoPor: ctx.user.id
    });
  }),
  /**
   * Atualizar bloqueio existente
   */
  atualizar: protectedProcedure.input(
    z12.object({
      id: z12.string(),
      dataHoraInicio: z12.string().optional(),
      dataHoraFim: z12.string().optional(),
      motivo: z12.string().optional(),
      tipo: z12.enum(["almoco", "reuniao", "folga", "ferias", "outro"]).optional(),
      observacoes: z12.string().optional()
    })
  ).mutation(async ({ input, ctx }) => {
    const { atualizarBloqueio } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await atualizarBloqueio({
      ...input,
      atualizadoPor: ctx.user.id
    });
  }),
  /**
   * Remover bloqueio
   */
  remover: protectedProcedure.input(z12.object({ id: z12.string() })).mutation(async ({ input }) => {
    const { removerBloqueio } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await removerBloqueio(input.id);
  }),
  /**
   * Verificar conflitos de horário
   */
  verificarConflitos: protectedProcedure.input(
    z12.object({
      dentistaId: z12.string(),
      dataHoraInicio: z12.string(),
      dataHoraFim: z12.string(),
      excluirBloqueioId: z12.string().optional()
    })
  ).query(async ({ input }) => {
    const { verificarConflitosAgenda } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await verificarConflitosAgenda(input);
  })
});

// server/routers/lista-espera.ts
import { z as z13 } from "zod";
var listaEsperaRouter = router({
  /**
   * Listar todos os pacientes na lista de espera
   */
  listar: protectedProcedure.input(
    z13.object({
      status: z13.enum(["pendente", "notificado", "agendado", "cancelado"]).optional(),
      prioridade: z13.enum(["baixa", "media", "alta", "urgente"]).optional(),
      dentistaId: z13.string().optional()
    }).optional()
  ).query(async ({ input }) => {
    const { listarListaEspera } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await listarListaEspera(input);
  }),
  /**
   * Adicionar paciente à lista de espera
   */
  adicionar: protectedProcedure.input(
    z13.object({
      utenteId: z13.string().min(1, "Utente \xE9 obrigat\xF3rio"),
      dentistaId: z13.string().optional(),
      tipoConsulta: z13.string().optional(),
      dataPreferida: z13.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
      periodoPreferido: z13.enum(["manha", "tarde", "qualquer"]).default("qualquer"),
      prioridade: z13.enum(["baixa", "media", "alta", "urgente"]).default("media"),
      observacoes: z13.string().optional()
    })
  ).mutation(async ({ input, ctx }) => {
    const { adicionarListaEspera } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await adicionarListaEspera({
      ...input,
      criadoPor: ctx.user.id
    });
  }),
  /**
   * Marcar paciente como notificado
   */
  marcarNotificado: protectedProcedure.input(
    z13.object({
      id: z13.string(),
      dataNotificacao: z13.string().optional(),
      observacoes: z13.string().optional()
    })
  ).mutation(async ({ input, ctx }) => {
    const { marcarNotificado } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await marcarNotificado({
      ...input,
      notificadoPor: ctx.user.id
    });
  }),
  /**
   * Marcar paciente como agendado (sai da lista)
   */
  marcarAgendado: protectedProcedure.input(
    z13.object({
      id: z13.string(),
      consultaId: z13.string(),
      dataAgendamento: z13.string().optional()
    })
  ).mutation(async ({ input, ctx }) => {
    const { marcarAgendado } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await marcarAgendado({
      ...input,
      agendadoPor: ctx.user.id
    });
  }),
  /**
   * Cancelar entrada na lista de espera
   */
  cancelar: protectedProcedure.input(
    z13.object({
      id: z13.string(),
      motivoCancelamento: z13.string().optional()
    })
  ).mutation(async ({ input, ctx }) => {
    const { cancelarListaEspera } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await cancelarListaEspera({
      ...input,
      canceladoPor: ctx.user.id
    });
  }),
  /**
   * Atualizar prioridade
   */
  atualizarPrioridade: protectedProcedure.input(
    z13.object({
      id: z13.string(),
      prioridade: z13.enum(["baixa", "media", "alta", "urgente"])
    })
  ).mutation(async ({ input, ctx }) => {
    const { atualizarPrioridadeListaEspera } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await atualizarPrioridadeListaEspera({
      ...input,
      atualizadoPor: ctx.user.id
    });
  }),
  /**
   * Obter estatísticas da lista de espera
   */
  estatisticas: protectedProcedure.query(async () => {
    const { obterEstatisticasListaEspera } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await obterEstatisticasListaEspera();
  }),
  /**
   * Sugerir próximos pacientes para agendar
   */
  sugerirProximos: protectedProcedure.input(
    z13.object({
      dentistaId: z13.string().optional(),
      data: z13.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
      periodo: z13.enum(["manha", "tarde", "qualquer"]).optional(),
      limite: z13.number().min(1).max(50).default(10)
    })
  ).query(async ({ input }) => {
    const { sugerirProximosListaEspera } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await sugerirProximosListaEspera(input);
  })
});

// server/routers/portal-paciente.ts
import { z as z14 } from "zod";
var portalPacienteRouter = router({
  /**
   * Obter dashboard do paciente (resumo geral)
   */
  dashboard: protectedProcedure.input(z14.object({ utenteId: z14.string() })).query(async ({ input }) => {
    const { obterDashboardPaciente } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await obterDashboardPaciente(input.utenteId);
  }),
  /**
   * Listar consultas do paciente
   */
  consultas: router({
    listar: protectedProcedure.input(
      z14.object({
        utenteId: z14.string(),
        status: z14.enum(["todas", "agendadas", "realizadas", "canceladas"]).optional(),
        dataInicio: z14.string().optional(),
        dataFim: z14.string().optional()
      })
    ).query(async ({ input }) => {
      const { listarConsultasPaciente } = await Promise.resolve().then(() => (init_db(), db_exports));
      return await listarConsultasPaciente(input);
    }),
    cancelar: protectedProcedure.input(
      z14.object({
        consultaId: z14.string(),
        motivoCancelamento: z14.string().optional()
      })
    ).mutation(async ({ input, ctx }) => {
      const { cancelarConsultaPaciente } = await Promise.resolve().then(() => (init_db(), db_exports));
      return await cancelarConsultaPaciente({
        ...input,
        canceladoPor: ctx.user.id
      });
    })
  }),
  /**
   * Listar faturas do paciente
   */
  faturas: router({
    listar: protectedProcedure.input(
      z14.object({
        utenteId: z14.string(),
        status: z14.enum(["todas", "pendentes", "pagas", "vencidas"]).optional()
      })
    ).query(async ({ input }) => {
      const { listarFaturasPaciente } = await Promise.resolve().then(() => (init_db(), db_exports));
      return await listarFaturasPaciente(input);
    }),
    obter: protectedProcedure.input(z14.object({ faturaId: z14.string() })).query(async ({ input }) => {
      const { obterFaturaPaciente } = await Promise.resolve().then(() => (init_db(), db_exports));
      return await obterFaturaPaciente(input.faturaId);
    })
  }),
  /**
   * Sistema de mensagens
   */
  mensagens: router({
    listar: protectedProcedure.input(
      z14.object({
        utenteId: z14.string(),
        lidas: z14.boolean().optional()
      })
    ).query(async ({ input }) => {
      const { listarMensagensPaciente } = await Promise.resolve().then(() => (init_db(), db_exports));
      return await listarMensagensPaciente(input);
    }),
    enviar: protectedProcedure.input(
      z14.object({
        utenteId: z14.string(),
        assunto: z14.string().min(1, "Assunto \xE9 obrigat\xF3rio"),
        mensagem: z14.string().min(1, "Mensagem \xE9 obrigat\xF3ria")
      })
    ).mutation(async ({ input, ctx }) => {
      const { enviarMensagemPaciente } = await Promise.resolve().then(() => (init_db(), db_exports));
      return await enviarMensagemPaciente({
        ...input,
        remetenteId: ctx.user.id
      });
    }),
    marcarLida: protectedProcedure.input(z14.object({ mensagemId: z14.string() })).mutation(async ({ input }) => {
      const { marcarMensagemLida } = await Promise.resolve().then(() => (init_db(), db_exports));
      return await marcarMensagemLida(input.mensagemId);
    })
  }),
  /**
   * Documentos clínicos
   */
  documentos: router({
    listar: protectedProcedure.input(
      z14.object({
        utenteId: z14.string(),
        tipo: z14.enum(["todos", "prescricoes", "exames", "relatorios", "outros"]).optional()
      })
    ).query(async ({ input }) => {
      const { listarDocumentosPaciente } = await Promise.resolve().then(() => (init_db(), db_exports));
      return await listarDocumentosPaciente(input);
    }),
    obter: protectedProcedure.input(z14.object({ documentoId: z14.string() })).query(async ({ input }) => {
      const { obterDocumentoPaciente } = await Promise.resolve().then(() => (init_db(), db_exports));
      return await obterDocumentoPaciente(input.documentoId);
    })
  }),
  /**
   * Histórico clínico resumido
   */
  historico: protectedProcedure.input(z14.object({ utenteId: z14.string() })).query(async ({ input }) => {
    const { obterHistoricoClinicoPaciente } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await obterHistoricoClinicoPaciente(input.utenteId);
  })
});

// server/routers/relatorios.ts
import { z as z15 } from "zod";
var relatoriosRouter = router({
  /**
   * Relatório de consultas
   */
  consultas: protectedProcedure.input(
    z15.object({
      dataInicio: z15.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      dataFim: z15.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      dentistaId: z15.string().optional(),
      status: z15.enum(["todas", "realizadas", "canceladas", "faltou"]).optional()
    })
  ).query(async ({ input }) => {
    const { gerarRelatorioConsultas } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await gerarRelatorioConsultas(input);
  }),
  /**
   * Relatório financeiro
   */
  financeiro: protectedProcedure.input(
    z15.object({
      dataInicio: z15.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      dataFim: z15.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      tipo: z15.enum(["resumo", "detalhado", "por_dentista", "por_tratamento"]).optional()
    })
  ).query(async ({ input }) => {
    const { gerarRelatorioFinanceiro } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await gerarRelatorioFinanceiro(input);
  }),
  /**
   * Relatório de tratamentos
   */
  tratamentos: protectedProcedure.input(
    z15.object({
      dataInicio: z15.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      dataFim: z15.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      dentistaId: z15.string().optional(),
      status: z15.enum(["todos", "planeado", "em_curso", "concluido", "cancelado"]).optional()
    })
  ).query(async ({ input }) => {
    const { gerarRelatorioTratamentos } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await gerarRelatorioTratamentos(input);
  }),
  /**
   * Relatório de pacientes
   */
  pacientes: protectedProcedure.input(
    z15.object({
      tipo: z15.enum(["novos", "ativos", "inativos", "aniversariantes"]),
      dataInicio: z15.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
      dataFim: z15.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
      mes: z15.number().min(1).max(12).optional()
      // Para aniversariantes
    })
  ).query(async ({ input }) => {
    const { gerarRelatorioPacientes } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await gerarRelatorioPacientes(input);
  }),
  /**
   * Relatório de produtividade
   */
  produtividade: protectedProcedure.input(
    z15.object({
      dataInicio: z15.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      dataFim: z15.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      dentistaId: z15.string().optional()
    })
  ).query(async ({ input }) => {
    const { gerarRelatorioProdutividade } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await gerarRelatorioProdutividade(input);
  }),
  /**
   * Dashboard executivo (KPIs principais)
   */
  dashboard: protectedProcedure.input(
    z15.object({
      periodo: z15.enum(["hoje", "semana", "mes", "trimestre", "ano"]).default("mes"),
      dataReferencia: z15.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()
    })
  ).query(async ({ input }) => {
    const { gerarDashboardExecutivo } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await gerarDashboardExecutivo(input);
  }),
  /**
   * Exportar relatório (PDF/Excel)
   */
  exportar: protectedProcedure.input(
    z15.object({
      tipo: z15.enum(["consultas", "financeiro", "tratamentos", "pacientes", "produtividade"]),
      formato: z15.enum(["pdf", "excel"]),
      parametros: z15.record(z15.string(), z15.any())
    })
  ).mutation(async ({ input }) => {
    const { exportarRelatorio } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await exportarRelatorio(input);
  })
});

// server/routers/imagens-clinicas.ts
import { z as z16 } from "zod";
var imagensClinicasRouter = router({
  /**
   * Listar imagens de um utente
   */
  listar: protectedProcedure.input(
    z16.object({
      utenteId: z16.string(),
      tipo: z16.enum(["todas", "raio-x", "foto-intraoral", "foto-facial", "tomografia", "outros"]).optional(),
      dataInicio: z16.string().optional(),
      dataFim: z16.string().optional()
    })
  ).query(async ({ input }) => {
    const { listarImagensClinicas } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await listarImagensClinicas(input);
  }),
  /**
   * Obter imagem por ID
   */
  obter: protectedProcedure.input(z16.object({ id: z16.string() })).query(async ({ input }) => {
    const { obterImagemClinica } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await obterImagemClinica(input.id);
  }),
  /**
   * Upload de nova imagem
   */
  upload: protectedProcedure.input(
    z16.object({
      utenteId: z16.string().min(1, "Utente \xE9 obrigat\xF3rio"),
      tipo: z16.enum(["raio-x", "foto-intraoral", "foto-facial", "tomografia", "outros"]),
      titulo: z16.string().min(1, "T\xEDtulo \xE9 obrigat\xF3rio"),
      descricao: z16.string().optional(),
      dente: z16.string().optional(),
      // Ex: "11", "21", etc
      regiao: z16.string().optional(),
      // Ex: "superior", "inferior", "anterior"
      arquivo: z16.string().min(1, "Arquivo \xE9 obrigat\xF3rio"),
      // Base64 ou URL
      dataExame: z16.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      analisarComIA: z16.boolean().default(false)
    })
  ).mutation(async ({ input, ctx }) => {
    const { uploadImagemClinica } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await uploadImagemClinica({
      ...input,
      uploadPor: ctx.user.id
    });
  }),
  /**
   * Atualizar metadados da imagem
   */
  atualizar: protectedProcedure.input(
    z16.object({
      id: z16.string(),
      titulo: z16.string().optional(),
      descricao: z16.string().optional(),
      dente: z16.string().optional(),
      regiao: z16.string().optional(),
      tags: z16.array(z16.string()).optional()
    })
  ).mutation(async ({ input }) => {
    const { atualizarImagemClinica } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await atualizarImagemClinica(input);
  }),
  /**
   * Deletar imagem
   */
  deletar: protectedProcedure.input(z16.object({ id: z16.string() })).mutation(async ({ input }) => {
    const { deletarImagemClinica } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await deletarImagemClinica(input.id);
  }),
  /**
   * Adicionar anotação na imagem
   */
  adicionarAnotacao: protectedProcedure.input(
    z16.object({
      imagemId: z16.string(),
      tipo: z16.enum(["texto", "seta", "circulo", "retangulo", "marcador"]),
      conteudo: z16.string(),
      posicao: z16.object({
        x: z16.number(),
        y: z16.number(),
        largura: z16.number().optional(),
        altura: z16.number().optional()
      }),
      cor: z16.string().optional()
    })
  ).mutation(async ({ input, ctx }) => {
    const { adicionarAnotacaoImagem } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await adicionarAnotacaoImagem({
      ...input,
      criadoPor: ctx.user.id
    });
  }),
  /**
   * Analisar imagem com IA
   */
  analisarComIA: protectedProcedure.input(
    z16.object({
      imagemId: z16.string(),
      tipoAnalise: z16.enum(["deteccao-caries", "deteccao-fraturas", "analise-geral", "comparacao"]),
      imagemComparacaoId: z16.string().optional()
      // Para comparação
    })
  ).mutation(async ({ input }) => {
    const { analisarImagemComIA } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await analisarImagemComIA(input);
  }),
  /**
   * Obter análises de IA de uma imagem
   */
  obterAnalisesIA: protectedProcedure.input(z16.object({ imagemId: z16.string() })).query(async ({ input }) => {
    const { obterAnalisesIAImagem } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await obterAnalisesIAImagem(input.imagemId);
  }),
  /**
   * Comparar duas imagens
   */
  comparar: protectedProcedure.input(
    z16.object({
      imagemId1: z16.string(),
      imagemId2: z16.string()
    })
  ).query(async ({ input }) => {
    const { compararImagens } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await compararImagens(input.imagemId1, input.imagemId2);
  }),
  /**
   * Obter estatísticas de imagens
   */
  estatisticas: protectedProcedure.input(z16.object({ utenteId: z16.string() })).query(async ({ input }) => {
    const { obterEstatisticasImagens } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await obterEstatisticasImagens(input.utenteId);
  })
});

// server/routers/endodontia.ts
import { z as z17 } from "zod";
var endodontiaRouter = router({
  /**
   * Listar tratamentos endodônticos de um utente
   */
  listar: protectedProcedure.input(
    z17.object({
      utenteId: z17.string(),
      status: z17.enum(["todos", "planejado", "em_andamento", "concluido", "cancelado"]).optional()
    })
  ).query(async ({ input }) => {
    const { listarTratamentosEndodonticos } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await listarTratamentosEndodonticos(input);
  }),
  /**
   * Obter tratamento endodôntico por ID
   */
  obter: protectedProcedure.input(z17.object({ id: z17.string() })).query(async ({ input }) => {
    const { obterTratamentoEndodontico } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await obterTratamentoEndodontico(input.id);
  }),
  /**
   * Criar novo tratamento endodôntico
   */
  criar: protectedProcedure.input(
    z17.object({
      utenteId: z17.string().min(1, "Utente \xE9 obrigat\xF3rio"),
      dente: z17.string().min(1, "Dente \xE9 obrigat\xF3rio"),
      // Ex: "11", "21"
      diagnostico: z17.string().min(1, "Diagn\xF3stico \xE9 obrigat\xF3rio"),
      sintomas: z17.array(z17.string()).optional(),
      testesVitalidade: z17.object({
        frio: z17.enum(["positivo", "negativo", "nao_realizado"]).optional(),
        calor: z17.enum(["positivo", "negativo", "nao_realizado"]).optional(),
        percussao: z17.enum(["positivo", "negativo", "nao_realizado"]).optional(),
        palpacao: z17.enum(["positivo", "negativo", "nao_realizado"]).optional()
      }).optional(),
      numeroCanais: z17.number().min(1).max(6),
      comprimentoTrabalho: z17.array(
        z17.object({
          canal: z17.string(),
          // Ex: "MV", "DV", "P"
          comprimento: z17.number()
          // Em mm
        })
      ),
      instrumentacao: z17.object({
        tecnica: z17.enum(["manual", "rotatoria", "reciprocante", "hibrida"]),
        instrumentos: z17.array(z17.string()),
        // Ex: ["K-file #15", "ProTaper F1"]
        irrigacao: z17.array(z17.string())
        // Ex: ["NaOCl 2.5%", "EDTA 17%"]
      }).optional(),
      medicacaoIntracanal: z17.string().optional(),
      obturacao: z17.object({
        tecnica: z17.enum(["condensacao_lateral", "condensacao_vertical", "onda_continua", "sistema_carrier"]).optional(),
        cimento: z17.string().optional(),
        // Ex: "AH Plus", "Sealer 26"
        data: z17.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()
      }).optional(),
      sessoes: z17.array(
        z17.object({
          numero: z17.number(),
          data: z17.string().regex(/^\d{4}-\d{2}-\d{2}$/),
          procedimentos: z17.string(),
          observacoes: z17.string().optional()
        })
      ).optional(),
      status: z17.enum(["planejado", "em_andamento", "concluido", "cancelado"]).default("planejado"),
      observacoes: z17.string().optional()
    })
  ).mutation(async ({ input, ctx }) => {
    const { criarTratamentoEndodontico } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await criarTratamentoEndodontico({
      ...input,
      criadoPor: ctx.user.id
    });
  }),
  /**
   * Atualizar tratamento endodôntico
   */
  atualizar: protectedProcedure.input(
    z17.object({
      id: z17.string(),
      dados: z17.object({
        diagnostico: z17.string().optional(),
        sintomas: z17.array(z17.string()).optional(),
        numeroCanais: z17.number().optional(),
        comprimentoTrabalho: z17.array(
          z17.object({
            canal: z17.string(),
            comprimento: z17.number()
          })
        ).optional(),
        instrumentacao: z17.object({
          tecnica: z17.enum(["manual", "rotatoria", "reciprocante", "hibrida"]),
          instrumentos: z17.array(z17.string()),
          irrigacao: z17.array(z17.string())
        }).optional(),
        medicacaoIntracanal: z17.string().optional(),
        obturacao: z17.object({
          tecnica: z17.enum(["condensacao_lateral", "condensacao_vertical", "onda_continua", "sistema_carrier"]).optional(),
          cimento: z17.string().optional(),
          data: z17.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()
        }).optional(),
        status: z17.enum(["planejado", "em_andamento", "concluido", "cancelado"]).optional(),
        observacoes: z17.string().optional()
      })
    })
  ).mutation(async ({ input }) => {
    const { atualizarTratamentoEndodontico } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await atualizarTratamentoEndodontico(input);
  }),
  /**
   * Adicionar sessão ao tratamento
   */
  adicionarSessao: protectedProcedure.input(
    z17.object({
      tratamentoId: z17.string(),
      sessao: z17.object({
        numero: z17.number(),
        data: z17.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        procedimentos: z17.string(),
        observacoes: z17.string().optional()
      })
    })
  ).mutation(async ({ input }) => {
    const { adicionarSessaoEndodontia } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await adicionarSessaoEndodontia(input);
  }),
  /**
   * Deletar tratamento endodôntico
   */
  deletar: protectedProcedure.input(z17.object({ id: z17.string() })).mutation(async ({ input }) => {
    const { deletarTratamentoEndodontico } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await deletarTratamentoEndodontico(input.id);
  }),
  /**
   * Obter estatísticas de endodontia
   */
  estatisticas: protectedProcedure.input(
    z17.object({
      dataInicio: z17.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      dataFim: z17.string().regex(/^\d{4}-\d{2}-\d{2}$/)
    })
  ).query(async ({ input }) => {
    const { obterEstatisticasEndodontia } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await obterEstatisticasEndodontia(input);
  })
});

// server/routers/implantes.ts
import { z as z18 } from "zod";
var implantesRouter = router({
  /**
   * Listar implantes de um utente
   */
  listar: protectedProcedure.input(
    z18.object({
      utenteId: z18.string(),
      status: z18.enum(["todos", "planejado", "colocado", "osseointegrado", "protese_instalada", "complicacao"]).optional()
    })
  ).query(async ({ input }) => {
    const { listarImplantes } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await listarImplantes(input);
  }),
  /**
   * Obter implante por ID
   */
  obter: protectedProcedure.input(z18.object({ id: z18.string() })).query(async ({ input }) => {
    const { obterImplante } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await obterImplante(input.id);
  }),
  /**
   * Criar novo implante
   */
  criar: protectedProcedure.input(
    z18.object({
      utenteId: z18.string().min(1, "Utente \xE9 obrigat\xF3rio"),
      dente: z18.string().min(1, "Posi\xE7\xE3o do dente \xE9 obrigat\xF3ria"),
      // Ex: "11", "21"
      marca: z18.string().min(1, "Marca \xE9 obrigat\xF3ria"),
      // Ex: "Straumann", "Nobel Biocare"
      modelo: z18.string().min(1, "Modelo \xE9 obrigat\xF3rio"),
      // Ex: "BLT", "Active"
      diametro: z18.number().min(2).max(7),
      // Em mm
      comprimento: z18.number().min(6).max(18),
      // Em mm
      lote: z18.string().optional(),
      numeroSerie: z18.string().optional(),
      dataColocacao: z18.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      cirurgiao: z18.string(),
      tipoCircurgia: z18.enum(["convencional", "carga_imediata", "guiada"]),
      enxerto: z18.object({
        realizado: z18.boolean(),
        tipo: z18.enum(["autologo", "xenoenxerto", "aloenxerto", "sintetico"]).optional(),
        material: z18.string().optional()
      }).optional(),
      torqueInsercao: z18.number().optional(),
      // Em Ncm
      estabilidadePrimaria: z18.enum(["excelente", "boa", "regular", "ruim"]).optional(),
      medicacao: z18.object({
        antibiotico: z18.string().optional(),
        analgesico: z18.string().optional(),
        antiinflamatorio: z18.string().optional()
      }).optional(),
      acompanhamento: z18.array(
        z18.object({
          data: z18.string().regex(/^\d{4}-\d{2}-\d{2}$/),
          avaliacao: z18.string(),
          observacoes: z18.string().optional()
        })
      ).optional(),
      protese: z18.object({
        tipo: z18.enum(["unitaria", "multipla", "protocolo", "overdenture"]).optional(),
        dataInstalacao: z18.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
        material: z18.string().optional()
        // Ex: "Zircônia", "Metalocerâmica"
      }).optional(),
      garantia: z18.object({
        fabricante: z18.boolean().default(false),
        dataInicio: z18.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
        dataFim: z18.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
        observacoes: z18.string().optional()
      }).optional(),
      status: z18.enum(["planejado", "colocado", "osseointegrado", "protese_instalada", "complicacao"]).default("planejado"),
      complicacoes: z18.array(
        z18.object({
          data: z18.string().regex(/^\d{4}-\d{2}-\d{2}$/),
          tipo: z18.enum(["infeccao", "mobilidade", "perda", "fratura", "periimplantite", "outros"]),
          descricao: z18.string(),
          tratamento: z18.string().optional()
        })
      ).optional(),
      observacoes: z18.string().optional()
    })
  ).mutation(async ({ input, ctx }) => {
    const { criarImplante } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await criarImplante({
      ...input,
      criadoPor: ctx.user.id
    });
  }),
  /**
   * Atualizar implante
   */
  atualizar: protectedProcedure.input(
    z18.object({
      id: z18.string(),
      dados: z18.object({
        torqueInsercao: z18.number().optional(),
        estabilidadePrimaria: z18.enum(["excelente", "boa", "regular", "ruim"]).optional(),
        protese: z18.object({
          tipo: z18.enum(["unitaria", "multipla", "protocolo", "overdenture"]).optional(),
          dataInstalacao: z18.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
          material: z18.string().optional()
        }).optional(),
        status: z18.enum(["planejado", "colocado", "osseointegrado", "protese_instalada", "complicacao"]).optional(),
        observacoes: z18.string().optional()
      })
    })
  ).mutation(async ({ input }) => {
    const { atualizarImplante } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await atualizarImplante(input);
  }),
  /**
   * Adicionar acompanhamento
   */
  adicionarAcompanhamento: protectedProcedure.input(
    z18.object({
      implanteId: z18.string(),
      acompanhamento: z18.object({
        data: z18.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        avaliacao: z18.string(),
        observacoes: z18.string().optional()
      })
    })
  ).mutation(async ({ input }) => {
    const { adicionarAcompanhamentoImplante } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await adicionarAcompanhamentoImplante(input);
  }),
  /**
   * Registrar complicação
   */
  registrarComplicacao: protectedProcedure.input(
    z18.object({
      implanteId: z18.string(),
      complicacao: z18.object({
        data: z18.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        tipo: z18.enum(["infeccao", "mobilidade", "perda", "fratura", "periimplantite", "outros"]),
        descricao: z18.string(),
        tratamento: z18.string().optional()
      })
    })
  ).mutation(async ({ input }) => {
    const { registrarComplicacaoImplante } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await registrarComplicacaoImplante(input);
  }),
  /**
   * Deletar implante
   */
  deletar: protectedProcedure.input(z18.object({ id: z18.string() })).mutation(async ({ input }) => {
    const { deletarImplante } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await deletarImplante(input.id);
  }),
  /**
   * Obter estatísticas de implantes
   */
  estatisticas: protectedProcedure.input(
    z18.object({
      dataInicio: z18.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      dataFim: z18.string().regex(/^\d{4}-\d{2}-\d{2}$/)
    })
  ).query(async ({ input }) => {
    const { obterEstatisticasImplantes } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await obterEstatisticasImplantes(input);
  })
});

// server/routers/ortodontia.ts
import { z as z19 } from "zod";
var ortodontiaRouter = router({
  /**
   * Listar tratamentos ortodônticos de um utente
   */
  listar: protectedProcedure.input(
    z19.object({
      utenteId: z19.string(),
      status: z19.enum(["todos", "planejado", "ativo", "pausado", "concluido", "cancelado"]).optional()
    })
  ).query(async ({ input }) => {
    const { listarTratamentosOrtodontia } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await listarTratamentosOrtodontia(input);
  }),
  /**
   * Obter tratamento ortodôntico por ID
   */
  obter: protectedProcedure.input(z19.object({ id: z19.string() })).query(async ({ input }) => {
    const { obterTratamentoOrtodontia } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await obterTratamentoOrtodontia(input.id);
  }),
  /**
   * Criar novo tratamento ortodôntico
   */
  criar: protectedProcedure.input(
    z19.object({
      utenteId: z19.string().min(1, "Utente \xE9 obrigat\xF3rio"),
      diagnostico: z19.string().min(1, "Diagn\xF3stico \xE9 obrigat\xF3rio"),
      classificacao: z19.object({
        angle: z19.enum(["classe_I", "classe_II_div1", "classe_II_div2", "classe_III"]),
        overjet: z19.number().optional(),
        // Em mm
        overbite: z19.number().optional(),
        // Em mm ou %
        linhaMedia: z19.enum(["centrada", "desviada_direita", "desviada_esquerda"]).optional()
      }),
      planoTratamento: z19.string(),
      tipoAparelho: z19.enum([
        "fixo_metalico",
        "fixo_estetico",
        "autoligado",
        "lingual",
        "alinhadores",
        "movel",
        "expansor",
        "outros"
      ]),
      marcaAparelho: z19.string().optional(),
      // Ex: "Invisalign", "Damon", "3M"
      dataInstalacao: z19.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      duracaoEstimada: z19.number().min(1).max(60),
      // Em meses
      dataPrevisaoConclusao: z19.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      extracoesNecessarias: z19.array(
        z19.object({
          dente: z19.string(),
          realizada: z19.boolean().default(false),
          data: z19.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()
        })
      ).optional(),
      ativacoes: z19.array(
        z19.object({
          numero: z19.number(),
          data: z19.string().regex(/^\d{4}-\d{2}-\d{2}$/),
          procedimentos: z19.string(),
          proximaAtivacao: z19.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
          observacoes: z19.string().optional()
        })
      ).optional(),
      evolucaoFotografica: z19.array(
        z19.object({
          data: z19.string().regex(/^\d{4}-\d{2}-\d{2}$/),
          fotos: z19.array(z19.string()),
          // URLs ou IDs das imagens
          observacoes: z19.string().optional()
        })
      ).optional(),
      pagamento: z19.object({
        valorTotal: z19.number(),
        valorPago: z19.number().default(0),
        formaPagamento: z19.enum(["vista", "parcelado"]),
        numeroParcelas: z19.number().optional(),
        valorParcela: z19.number().optional(),
        diaVencimento: z19.number().min(1).max(31).optional()
      }).optional(),
      status: z19.enum(["planejado", "ativo", "pausado", "concluido", "cancelado"]).default("planejado"),
      observacoes: z19.string().optional()
    })
  ).mutation(async ({ input, ctx }) => {
    const { criarTratamentoOrtodontia } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await criarTratamentoOrtodontia({
      ...input,
      criadoPor: ctx.user.id
    });
  }),
  /**
   * Atualizar tratamento ortodôntico
   */
  atualizar: protectedProcedure.input(
    z19.object({
      id: z19.string(),
      dados: z19.object({
        diagnostico: z19.string().optional(),
        planoTratamento: z19.string().optional(),
        duracaoEstimada: z19.number().optional(),
        dataPrevisaoConclusao: z19.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
        status: z19.enum(["planejado", "ativo", "pausado", "concluido", "cancelado"]).optional(),
        observacoes: z19.string().optional()
      })
    })
  ).mutation(async ({ input }) => {
    const { atualizarTratamentoOrtodontia } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await atualizarTratamentoOrtodontia(input);
  }),
  /**
   * Adicionar ativação/manutenção
   */
  adicionarAtivacao: protectedProcedure.input(
    z19.object({
      tratamentoId: z19.string(),
      ativacao: z19.object({
        numero: z19.number(),
        data: z19.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        procedimentos: z19.string(),
        proximaAtivacao: z19.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
        observacoes: z19.string().optional()
      })
    })
  ).mutation(async ({ input }) => {
    const { adicionarAtivacaoOrtodontia } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await adicionarAtivacaoOrtodontia(input);
  }),
  /**
   * Adicionar evolução fotográfica
   */
  adicionarEvolucaoFotografica: protectedProcedure.input(
    z19.object({
      tratamentoId: z19.string(),
      evolucao: z19.object({
        data: z19.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        fotos: z19.array(z19.string()),
        observacoes: z19.string().optional()
      })
    })
  ).mutation(async ({ input }) => {
    const { adicionarEvolucaoFotograficaOrtodontia } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await adicionarEvolucaoFotograficaOrtodontia(input);
  }),
  /**
   * Registrar pagamento
   */
  registrarPagamento: protectedProcedure.input(
    z19.object({
      tratamentoId: z19.string(),
      valor: z19.number().min(0.01),
      data: z19.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      formaPagamento: z19.string()
    })
  ).mutation(async ({ input }) => {
    const { registrarPagamentoOrtodontia } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await registrarPagamentoOrtodontia(input);
  }),
  /**
   * Deletar tratamento ortodôntico
   */
  deletar: protectedProcedure.input(z19.object({ id: z19.string() })).mutation(async ({ input }) => {
    const { deletarTratamentoOrtodontia } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await deletarTratamentoOrtodontia(input.id);
  }),
  /**
   * Obter estatísticas de ortodontia
   */
  estatisticas: protectedProcedure.input(
    z19.object({
      dataInicio: z19.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      dataFim: z19.string().regex(/^\d{4}-\d{2}-\d{2}$/)
    })
  ).query(async ({ input }) => {
    const { obterEstatisticasOrtodontia } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await obterEstatisticasOrtodontia(input);
  })
});

// server/routers/consentimentos.ts
import { z as z20 } from "zod";
var consentimentosRouter = router({
  /**
   * Listar templates de consentimento
   */
  listarTemplates: protectedProcedure.query(async () => {
    const { listarTemplatesConsentimento } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await listarTemplatesConsentimento();
  }),
  /**
   * Criar template de consentimento
   */
  criarTemplate: protectedProcedure.input(
    z20.object({
      titulo: z20.string().min(1, "T\xEDtulo \xE9 obrigat\xF3rio"),
      categoria: z20.enum([
        "tratamento_geral",
        "cirurgia",
        "implante",
        "ortodontia",
        "endodontia",
        "estetica",
        "anestesia",
        "radiografia",
        "outros"
      ]),
      conteudo: z20.string().min(1, "Conte\xFAdo \xE9 obrigat\xF3rio"),
      ativo: z20.boolean().default(true)
    })
  ).mutation(async ({ input, ctx }) => {
    const { criarTemplateConsentimento } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await criarTemplateConsentimento({
      ...input,
      criadoPor: ctx.user.id
    });
  }),
  /**
   * Atualizar template
   */
  atualizarTemplate: protectedProcedure.input(
    z20.object({
      id: z20.string(),
      dados: z20.object({
        titulo: z20.string().optional(),
        conteudo: z20.string().optional(),
        ativo: z20.boolean().optional()
      })
    })
  ).mutation(async ({ input }) => {
    const { atualizarTemplateConsentimento } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await atualizarTemplateConsentimento(input);
  }),
  /**
   * Listar consentimentos de um utente
   */
  listar: protectedProcedure.input(
    z20.object({
      utenteId: z20.string(),
      status: z20.enum(["todos", "pendente", "assinado", "recusado"]).optional()
    })
  ).query(async ({ input }) => {
    const { listarConsentimentos } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await listarConsentimentos(input);
  }),
  /**
   * Obter consentimento por ID
   */
  obter: protectedProcedure.input(z20.object({ id: z20.string() })).query(async ({ input }) => {
    const { obterConsentimento } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await obterConsentimento(input.id);
  }),
  /**
   * Gerar consentimento para utente
   */
  gerar: protectedProcedure.input(
    z20.object({
      utenteId: z20.string().min(1, "Utente \xE9 obrigat\xF3rio"),
      templateId: z20.string().min(1, "Template \xE9 obrigat\xF3rio"),
      procedimento: z20.string().optional(),
      observacoes: z20.string().optional()
    })
  ).mutation(async ({ input, ctx }) => {
    const { gerarConsentimento } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await gerarConsentimento({
      ...input,
      geradoPor: ctx.user.id
    });
  }),
  /**
   * Assinar consentimento
   */
  assinar: protectedProcedure.input(
    z20.object({
      consentimentoId: z20.string(),
      assinatura: z20.string(),
      // Base64 da assinatura digital
      ip: z20.string().optional(),
      localizacao: z20.string().optional()
    })
  ).mutation(async ({ input }) => {
    const { assinarConsentimento } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await assinarConsentimento(input);
  }),
  /**
   * Recusar consentimento
   */
  recusar: protectedProcedure.input(
    z20.object({
      consentimentoId: z20.string(),
      motivo: z20.string().optional()
    })
  ).mutation(async ({ input }) => {
    const { recusarConsentimento } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await recusarConsentimento(input);
  }),
  /**
   * Deletar consentimento
   */
  deletar: protectedProcedure.input(z20.object({ id: z20.string() })).mutation(async ({ input }) => {
    const { deletarConsentimento } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await deletarConsentimento(input.id);
  }),
  /**
   * Obter estatísticas de consentimentos
   */
  estatisticas: protectedProcedure.query(async () => {
    const { obterEstatisticasConsentimentos } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await obterEstatisticasConsentimentos();
  })
});

// server/routers/anamnese.ts
import { z as z21 } from "zod";
var anamneseRouter = router({
  /**
   * Obter anamnese de um utente
   */
  obter: protectedProcedure.input(z21.object({ utenteId: z21.string() })).query(async ({ input }) => {
    const { obterAnamnese } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await obterAnamnese(input.utenteId);
  }),
  /**
   * Criar/Atualizar anamnese
   */
  salvar: protectedProcedure.input(
    z21.object({
      utenteId: z21.string().min(1, "Utente \xE9 obrigat\xF3rio"),
      // Dados Pessoais
      profissao: z21.string().optional(),
      estadoCivil: z21.enum(["solteiro", "casado", "divorciado", "viuvo", "uniao_estavel"]).optional(),
      // Queixa Principal
      queixaPrincipal: z21.string().optional(),
      historiaQueixa: z21.string().optional(),
      // Histórico Médico
      historicoMedico: z21.object({
        doencasCardiacas: z21.boolean().default(false),
        hipertensao: z21.boolean().default(false),
        diabetes: z21.boolean().default(false),
        problemasTireoide: z21.boolean().default(false),
        problemasRenais: z21.boolean().default(false),
        problemasHepaticos: z21.boolean().default(false),
        problemasRespiratorios: z21.boolean().default(false),
        epilepsia: z21.boolean().default(false),
        cancer: z21.boolean().default(false),
        hiv: z21.boolean().default(false),
        hepatite: z21.boolean().default(false),
        disturbiosSanguineos: z21.boolean().default(false),
        outras: z21.string().optional()
      }),
      // Medicamentos em Uso
      medicamentosUso: z21.array(
        z21.object({
          nome: z21.string(),
          dosagem: z21.string().optional(),
          frequencia: z21.string().optional(),
          motivo: z21.string().optional()
        })
      ).optional(),
      // Alergias
      alergias: z21.object({
        medicamentos: z21.array(z21.string()).optional(),
        alimentos: z21.array(z21.string()).optional(),
        latex: z21.boolean().default(false),
        anestesicos: z21.boolean().default(false),
        outras: z21.string().optional()
      }).optional(),
      // Histórico Odontológico
      historicoOdontologico: z21.object({
        ultimaConsulta: z21.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
        motivoUltimaConsulta: z21.string().optional(),
        frequenciaEscovacao: z21.enum(["1x", "2x", "3x", "mais_3x"]).optional(),
        usaFioDental: z21.boolean().default(false),
        usaEnxaguante: z21.boolean().default(false),
        sangramentoGengival: z21.boolean().default(false),
        dorDentes: z21.boolean().default(false),
        sensibilidade: z21.boolean().default(false),
        mauHalito: z21.boolean().default(false),
        bruxismo: z21.boolean().default(false),
        atm: z21.boolean().default(false)
      }).optional(),
      // Hábitos
      habitos: z21.object({
        fumante: z21.boolean().default(false),
        cigarrosPorDia: z21.number().optional(),
        exFumante: z21.boolean().default(false),
        tempoParou: z21.string().optional(),
        alcool: z21.boolean().default(false),
        frequenciaAlcool: z21.enum(["raramente", "semanalmente", "diariamente"]).optional(),
        roiUnhas: z21.boolean().default(false),
        morderObjetos: z21.boolean().default(false)
      }).optional(),
      // Mulheres
      saudeFeminina: z21.object({
        gestante: z21.boolean().default(false),
        mesesGestacao: z21.number().optional(),
        amamentando: z21.boolean().default(false),
        usaAnticoncepcional: z21.boolean().default(false)
      }).optional(),
      // Observações Gerais
      observacoes: z21.string().optional(),
      // Assinatura
      assinatura: z21.string().optional(),
      // Base64 da assinatura
      dataPreenchimento: z21.string().regex(/^\d{4}-\d{2}-\d{2}$/)
    })
  ).mutation(async ({ input, ctx }) => {
    const { salvarAnamnese } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await salvarAnamnese({
      ...input,
      preenchidoPor: ctx.user.id
    });
  }),
  /**
   * Obter histórico de anamneses
   */
  historico: protectedProcedure.input(z21.object({ utenteId: z21.string() })).query(async ({ input }) => {
    const { obterHistoricoAnamnese } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await obterHistoricoAnamnese(input.utenteId);
  }),
  /**
   * Gerar alertas baseados na anamnese
   */
  gerarAlertas: protectedProcedure.input(z21.object({ utenteId: z21.string() })).query(async ({ input }) => {
    const { gerarAlertasAnamnese } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await gerarAlertasAnamnese(input.utenteId);
  })
});

// server/routers/lembretes.ts
import { z as z22 } from "zod";
var lembretesRouter = router({
  /**
   * Listar lembretes
   */
  listar: protectedProcedure.input(
    z22.object({
      status: z22.enum(["todos", "pendente", "enviado", "falhado", "cancelado"]).optional(),
      tipo: z22.enum(["todos", "consulta", "retorno", "aniversario", "pagamento", "personalizado"]).optional(),
      dataInicio: z22.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
      dataFim: z22.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()
    })
  ).query(async ({ input }) => {
    const { listarLembretes } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await listarLembretes(input);
  }),
  /**
   * Criar lembrete manual
   */
  criar: protectedProcedure.input(
    z22.object({
      utenteId: z22.string().min(1, "Utente \xE9 obrigat\xF3rio"),
      tipo: z22.enum(["consulta", "retorno", "aniversario", "pagamento", "personalizado"]),
      canal: z22.enum(["whatsapp", "sms", "email", "todos"]),
      mensagem: z22.string().min(1, "Mensagem \xE9 obrigat\xF3ria"),
      dataEnvio: z22.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      horaEnvio: z22.string().regex(/^\d{2}:\d{2}$/),
      consultaId: z22.string().optional()
    })
  ).mutation(async ({ input, ctx }) => {
    const { criarLembrete } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await criarLembrete({
      ...input,
      criadoPor: ctx.user.id
    });
  }),
  /**
   * Cancelar lembrete
   */
  cancelar: protectedProcedure.input(z22.object({ id: z22.string() })).mutation(async ({ input }) => {
    const { cancelarLembrete } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await cancelarLembrete(input.id);
  }),
  /**
   * Reenviar lembrete
   */
  reenviar: protectedProcedure.input(z22.object({ id: z22.string() })).mutation(async ({ input }) => {
    const { reenviarLembrete } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await reenviarLembrete(input.id);
  }),
  /**
   * Configurar lembretes automáticos
   */
  configurarAutomaticos: protectedProcedure.input(
    z22.object({
      lembreteConsulta: z22.object({
        ativo: z22.boolean(),
        diasAntes: z22.array(z22.number()),
        // Ex: [1, 3, 7] = 1 dia, 3 dias e 7 dias antes
        canais: z22.array(z22.enum(["whatsapp", "sms", "email"])),
        mensagemTemplate: z22.string().optional()
      }).optional(),
      lembreteRetorno: z22.object({
        ativo: z22.boolean(),
        diasDepois: z22.number(),
        // Ex: 30, 60, 90 dias após última consulta
        canal: z22.enum(["whatsapp", "sms", "email"]),
        mensagemTemplate: z22.string().optional()
      }).optional(),
      lembreteAniversario: z22.object({
        ativo: z22.boolean(),
        canal: z22.enum(["whatsapp", "sms", "email"]),
        mensagemTemplate: z22.string().optional()
      }).optional(),
      lembretePagamento: z22.object({
        ativo: z22.boolean(),
        diasAntes: z22.number(),
        // Dias antes do vencimento
        canal: z22.enum(["whatsapp", "sms", "email"]),
        mensagemTemplate: z22.string().optional()
      }).optional()
    })
  ).mutation(async ({ input }) => {
    const { configurarLembretesAutomaticos } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await configurarLembretesAutomaticos(input);
  }),
  /**
   * Obter configurações de lembretes
   */
  obterConfiguracoes: protectedProcedure.query(async () => {
    const { obterConfiguracoesLembretes } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await obterConfiguracoesLembretes();
  }),
  /**
   * Enviar lembrete de confirmação de consulta
   */
  enviarConfirmacaoConsulta: protectedProcedure.input(
    z22.object({
      consultaId: z22.string(),
      canal: z22.enum(["whatsapp", "sms", "email"])
    })
  ).mutation(async ({ input }) => {
    const { enviarConfirmacaoConsulta } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await enviarConfirmacaoConsulta(input);
  }),
  /**
   * Processar confirmação de consulta (callback)
   */
  confirmarConsulta: protectedProcedure.input(
    z22.object({
      lembreteId: z22.string(),
      confirmado: z22.boolean()
    })
  ).mutation(async ({ input }) => {
    const { processarConfirmacaoConsulta } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await processarConfirmacaoConsulta(input);
  }),
  /**
   * Obter estatísticas de lembretes
   */
  estatisticas: protectedProcedure.input(
    z22.object({
      dataInicio: z22.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      dataFim: z22.string().regex(/^\d{4}-\d{2}-\d{2}$/)
    })
  ).query(async ({ input }) => {
    const { obterEstatisticasLembretes } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await obterEstatisticasLembretes(input);
  }),
  /**
   * Testar envio de lembrete
   */
  testar: protectedProcedure.input(
    z22.object({
      canal: z22.enum(["whatsapp", "sms", "email"]),
      destinatario: z22.string(),
      mensagem: z22.string()
    })
  ).mutation(async ({ input }) => {
    const { testarEnvioLembrete } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await testarEnvioLembrete(input);
  })
});

// server/routers/estoque.ts
import { z as z23 } from "zod";
var estoqueRouter = router({
  /**
   * Listar produtos
   */
  listar: protectedProcedure.input(
    z23.object({
      categoria: z23.enum([
        "todos",
        "materiais_dentarios",
        "instrumentos",
        "medicamentos",
        "descartaveis",
        "higiene",
        "escritorio",
        "outros"
      ]).optional(),
      status: z23.enum(["todos", "ativo", "inativo", "descontinuado"]).optional(),
      estoqueMinimo: z23.boolean().optional()
      // Filtrar apenas produtos abaixo do estoque mínimo
    })
  ).query(async ({ input }) => {
    const { listarProdutos } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await listarProdutos(input);
  }),
  /**
   * Obter produto por ID
   */
  obter: protectedProcedure.input(z23.object({ id: z23.string() })).query(async ({ input }) => {
    const { obterProduto } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await obterProduto(input.id);
  }),
  /**
   * Criar produto
   */
  criar: protectedProcedure.input(
    z23.object({
      nome: z23.string().min(1, "Nome \xE9 obrigat\xF3rio"),
      codigo: z23.string().optional(),
      // Código interno ou SKU
      codigoBarras: z23.string().optional(),
      categoria: z23.enum([
        "materiais_dentarios",
        "instrumentos",
        "medicamentos",
        "descartaveis",
        "higiene",
        "escritorio",
        "outros"
      ]),
      subcategoria: z23.string().optional(),
      unidadeMedida: z23.enum(["unidade", "caixa", "pacote", "litro", "ml", "kg", "g"]),
      quantidadeAtual: z23.number().min(0).default(0),
      quantidadeMinima: z23.number().min(0),
      quantidadeMaxima: z23.number().min(0).optional(),
      localizacao: z23.string().optional(),
      // Ex: "Armário 1, Prateleira 2"
      fornecedor: z23.string().optional(),
      custoUnitario: z23.number().min(0).optional(),
      precoVenda: z23.number().min(0).optional(),
      lote: z23.string().optional(),
      dataValidade: z23.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
      observacoes: z23.string().optional(),
      status: z23.enum(["ativo", "inativo", "descontinuado"]).default("ativo")
    })
  ).mutation(async ({ input, ctx }) => {
    const { criarProduto } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await criarProduto({
      ...input,
      criadoPor: ctx.user.id
    });
  }),
  /**
   * Atualizar produto
   */
  atualizar: protectedProcedure.input(
    z23.object({
      id: z23.string(),
      dados: z23.object({
        nome: z23.string().optional(),
        categoria: z23.enum([
          "materiais_dentarios",
          "instrumentos",
          "medicamentos",
          "descartaveis",
          "higiene",
          "escritorio",
          "outros"
        ]).optional(),
        quantidadeMinima: z23.number().optional(),
        quantidadeMaxima: z23.number().optional(),
        localizacao: z23.string().optional(),
        fornecedor: z23.string().optional(),
        custoUnitario: z23.number().optional(),
        precoVenda: z23.number().optional(),
        status: z23.enum(["ativo", "inativo", "descontinuado"]).optional(),
        observacoes: z23.string().optional()
      })
    })
  ).mutation(async ({ input }) => {
    const { atualizarProduto } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await atualizarProduto(input);
  }),
  /**
   * Registrar entrada de estoque
   */
  registrarEntrada: protectedProcedure.input(
    z23.object({
      produtoId: z23.string(),
      quantidade: z23.number().min(0.01),
      custoUnitario: z23.number().min(0).optional(),
      fornecedor: z23.string().optional(),
      notaFiscal: z23.string().optional(),
      lote: z23.string().optional(),
      dataValidade: z23.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
      observacoes: z23.string().optional()
    })
  ).mutation(async ({ input, ctx }) => {
    const { registrarEntradaEstoque } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await registrarEntradaEstoque({
      ...input,
      registradoPor: ctx.user.id
    });
  }),
  /**
   * Registrar saída de estoque
   */
  registrarSaida: protectedProcedure.input(
    z23.object({
      produtoId: z23.string(),
      quantidade: z23.number().min(0.01),
      motivo: z23.enum(["uso_clinico", "venda", "perda", "vencimento", "devolucao", "outros"]),
      utenteId: z23.string().optional(),
      // Se for uso em paciente
      consultaId: z23.string().optional(),
      observacoes: z23.string().optional()
    })
  ).mutation(async ({ input, ctx }) => {
    const { registrarSaidaEstoque } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await registrarSaidaEstoque({
      ...input,
      registradoPor: ctx.user.id
    });
  }),
  /**
   * Obter histórico de movimentações
   */
  historico: protectedProcedure.input(
    z23.object({
      produtoId: z23.string().optional(),
      tipo: z23.enum(["todos", "entrada", "saida"]).optional(),
      dataInicio: z23.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
      dataFim: z23.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()
    })
  ).query(async ({ input }) => {
    const { obterHistoricoEstoque } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await obterHistoricoEstoque(input);
  }),
  /**
   * Obter alertas de estoque
   */
  alertas: protectedProcedure.query(async () => {
    const { obterAlertasEstoque } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await obterAlertasEstoque();
  }),
  /**
   * Realizar inventário (contagem física)
   */
  realizarInventario: protectedProcedure.input(
    z23.object({
      itens: z23.array(
        z23.object({
          produtoId: z23.string(),
          quantidadeContada: z23.number().min(0),
          observacoes: z23.string().optional()
        })
      )
    })
  ).mutation(async ({ input, ctx }) => {
    const { realizarInventario } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await realizarInventario({
      ...input,
      realizadoPor: ctx.user.id
    });
  }),
  /**
   * Deletar produto
   */
  deletar: protectedProcedure.input(z23.object({ id: z23.string() })).mutation(async ({ input }) => {
    const { deletarProduto } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await deletarProduto(input.id);
  }),
  /**
   * Obter estatísticas de estoque
   */
  estatisticas: protectedProcedure.input(
    z23.object({
      dataInicio: z23.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      dataFim: z23.string().regex(/^\d{4}-\d{2}-\d{2}$/)
    })
  ).query(async ({ input }) => {
    const { obterEstatisticasEstoque } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await obterEstatisticasEstoque(input);
  }),
  /**
   * Gerar relatório de consumo
   */
  relatorioConsumo: protectedProcedure.input(
    z23.object({
      dataInicio: z23.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      dataFim: z23.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      categoria: z23.string().optional()
    })
  ).query(async ({ input }) => {
    const { gerarRelatorioConsumo } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await gerarRelatorioConsumo(input);
  })
});

// server/routers/integracao.ts
import { z as z24 } from "zod";

// server/db-integracao.ts
async function criarProcedimento(dados) {
  const id = `proc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const procedimento = {
    ...dados,
    id,
    faturado: 0,
    criadoEm: (/* @__PURE__ */ new Date()).toISOString(),
    atualizadoEm: (/* @__PURE__ */ new Date()).toISOString()
  };
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
    cor: "blue"
  });
  return procedimento;
}
async function listarProcedimentosUtente(utenteId) {
  return [];
}
async function listarProcedimentosDentista(dentistaId, dataInicio, dataFim) {
  return [];
}
async function marcarProcedimentoFaturado(procedimentoId, faturaId) {
}
async function registarEventoHistorico(dados) {
  const id = `hist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const evento = {
    ...dados,
    id,
    criadoEm: (/* @__PURE__ */ new Date()).toISOString()
  };
  return evento;
}
async function obterHistoricoUtente(utenteId, limite) {
  return [];
}
async function salvarPreco(dados) {
  const id = dados.id || `preco-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const preco = {
    ...dados,
    id,
    ativo: dados.ativo ?? 1,
    criadoEm: (/* @__PURE__ */ new Date()).toISOString(),
    atualizadoEm: (/* @__PURE__ */ new Date()).toISOString()
  };
  return preco;
}
async function buscarPrecoPorCodigo(codigo) {
  return null;
}
async function listarPrecos(categoria) {
  return [];
}
async function gerarFaturaAutomatica(dados) {
  const id = `fat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const numero = await gerarNumeroFatura2();
  const itens = dados.procedimentos.map((proc) => ({
    id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    descricao: proc.descricao,
    quantidade: 1,
    precoUnitario: parseFloat(proc.valorProcedimento.toString()),
    desconto: 0,
    iva: 23,
    total: parseFloat(proc.valorProcedimento.toString()) * 1.23,
    categoria: proc.tipo
  }));
  const subtotal = itens.reduce((sum, item) => sum + item.precoUnitario * item.quantidade, 0);
  const descontoTotal = 0;
  const ivaTotal = subtotal * 0.23;
  const total = subtotal + ivaTotal;
  const configComissao = await obterConfigComissao2(dados.dentistaId);
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
      dentistaComissao = total * (dentistaPercentagem / 100) + parseFloat(configComissao.valorFixo?.toString() || "0");
    }
    if (configComissao.valorMinimo && dentistaComissao < parseFloat(configComissao.valorMinimo.toString())) {
      dentistaComissao = parseFloat(configComissao.valorMinimo.toString());
    }
    if (configComissao.valorMaximo && dentistaComissao > parseFloat(configComissao.valorMaximo.toString())) {
      dentistaComissao = parseFloat(configComissao.valorMaximo.toString());
    }
  }
  const valorClinica = total - dentistaComissao;
  const fatura = {
    id,
    numero,
    serie: "FT",
    tipo: "fatura",
    data: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
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
    criadoPor: dados.dentistaId
  };
  for (const proc of dados.procedimentos) {
    await marcarProcedimentoFaturado(proc.id, id);
  }
  await registarEventoHistorico({
    utenteId: dados.utenteId,
    tipo: "fatura",
    titulo: `Fatura ${numero} emitida`,
    descricao: `Fatura no valor de \u20AC${total.toFixed(2)}`,
    data: fatura.data,
    faturaId: id,
    valor: total,
    dentistaId: dados.dentistaId,
    dentistaNome: dados.dentistaNome,
    icone: "FileText",
    cor: "green"
  });
  return fatura;
}
var proximoNumero = 1;
async function gerarNumeroFatura2() {
  const ano = (/* @__PURE__ */ new Date()).getFullYear();
  const numero = String(proximoNumero).padStart(4, "0");
  proximoNumero++;
  return `${ano}/${numero}`;
}
async function criarComissaoAutomatica(dados) {
  const id = `com-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const mes = (/* @__PURE__ */ new Date()).toISOString().slice(0, 7);
  const comissao = {
    id,
    dentistaId: dados.dentistaId,
    faturaId: dados.faturaId,
    procedimentoId: dados.procedimentoId,
    valor: dados.valor.toString(),
    percentagem: dados.percentagem?.toString(),
    mes,
    status: "pendente",
    observacoes: `Comiss\xE3o autom\xE1tica - Fatura ${dados.faturaId}`
  };
  return comissao;
}
async function listarComissoesDentista2(dentistaId, mes, status) {
  return [];
}
async function pagarComissao2(comissaoId, formaPagamento, referencia) {
}
async function obterConfigComissao2(dentistaId) {
  return {
    id: "config-1",
    dentistaId,
    tipo: "percentagem",
    percentagem: "30",
    valorFixo: null,
    valorMinimo: null,
    valorMaximo: null,
    observacoes: null,
    criadoEm: (/* @__PURE__ */ new Date()).toISOString(),
    atualizadoEm: (/* @__PURE__ */ new Date()).toISOString()
  };
}
async function salvarConfigComissao2(dados) {
  const id = `config-${dados.dentistaId}`;
  const config = {
    ...dados,
    id,
    criadoEm: (/* @__PURE__ */ new Date()).toISOString(),
    atualizadoEm: (/* @__PURE__ */ new Date()).toISOString()
  };
  return config;
}
async function gerarRelatorioDentista(dentistaId, dataInicio, dataFim) {
  const procedimentos = await listarProcedimentosDentista(dentistaId, dataInicio, dataFim);
  const comissoes2 = await listarComissoesDentista2(dentistaId);
  const totalProcedimentos = procedimentos.length;
  const totalFaturado = procedimentos.reduce((sum, proc) => sum + parseFloat(proc.valorProcedimento.toString()), 0);
  const totalComissoes = comissoes2.reduce((sum, com) => sum + parseFloat(com.valor.toString()), 0);
  const totalPago = comissoes2.filter((com) => com.status === "pago").reduce((sum, com) => sum + parseFloat(com.valor.toString()), 0);
  const totalPendente = comissoes2.filter((com) => com.status === "pendente").reduce((sum, com) => sum + parseFloat(com.valor.toString()), 0);
  return {
    dentistaId,
    periodo: { inicio: dataInicio, fim: dataFim },
    procedimentos: {
      total: totalProcedimentos,
      lista: procedimentos
    },
    faturacao: {
      totalFaturado,
      totalRecebido: totalFaturado,
      // Simplificado
      totalPendente: 0
    },
    comissoes: {
      totalComissoes,
      totalPago,
      totalPendente,
      lista: comissoes2
    },
    estatisticas: {
      mediaComissaoPorProcedimento: totalProcedimentos > 0 ? totalComissoes / totalProcedimentos : 0,
      procedimentoMaisRealizado: "Limpeza",
      // Implementar cálculo real
      ticketMedio: totalProcedimentos > 0 ? totalFaturado / totalProcedimentos : 0
    }
  };
}
async function gerarRelatorioClinica(dataInicio, dataFim) {
  return {
    periodo: { inicio: dataInicio, fim: dataFim },
    faturacao: {
      totalFaturado: 0,
      totalRecebido: 0,
      totalPendente: 0,
      totalVencido: 0
    },
    custos: {
      comissoesDentistas: 0,
      contasPagar: 0,
      laboratorios: 0,
      estoque: 0,
      outros: 0,
      total: 0
    },
    lucro: {
      bruto: 0,
      liquido: 0,
      margem: 0
    },
    porDentista: [],
    porProcedimento: []
  };
}

// server/routers/integracao.ts
var integracaoRouter = router({
  // ========================================
  // PROCEDIMENTOS CLÍNICOS
  // ========================================
  procedimentos: router({
    // Criar procedimento clínico
    criar: protectedProcedure.input(
      z24.object({
        utenteId: z24.string(),
        dentistaId: z24.string(),
        consultaId: z24.string().optional(),
        tipo: z24.enum([
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
        ]),
        dados: z24.record(z24.any()),
        // JSON com dados específicos
        descricao: z24.string(),
        observacoes: z24.string().optional(),
        valorProcedimento: z24.number(),
        data: z24.string()
        // YYYY-MM-DD
      })
    ).mutation(async ({ input, ctx }) => {
      return await criarProcedimento({
        ...input,
        dados: JSON.stringify(input.dados),
        criadoPor: ctx.user.id
      });
    }),
    // Listar procedimentos de um utente
    listarPorUtente: protectedProcedure.input(z24.object({ utenteId: z24.string() })).query(async ({ input }) => {
      return await listarProcedimentosUtente(input.utenteId);
    }),
    // Listar procedimentos de um dentista
    listarPorDentista: protectedProcedure.input(
      z24.object({
        dentistaId: z24.string(),
        dataInicio: z24.string().optional(),
        dataFim: z24.string().optional()
      })
    ).query(async ({ input }) => {
      return await listarProcedimentosDentista(
        input.dentistaId,
        input.dataInicio,
        input.dataFim
      );
    })
  }),
  // ========================================
  // HISTÓRICO UNIFICADO
  // ========================================
  historico: router({
    // Obter histórico completo de um utente
    obter: protectedProcedure.input(
      z24.object({
        utenteId: z24.string(),
        limite: z24.number().optional()
      })
    ).query(async ({ input }) => {
      return await obterHistoricoUtente(input.utenteId, input.limite);
    }),
    // Registar evento manualmente
    registar: protectedProcedure.input(
      z24.object({
        utenteId: z24.string(),
        tipo: z24.enum(["consulta", "procedimento", "fatura", "pagamento", "observacao", "documento", "comunicacao"]),
        titulo: z24.string(),
        descricao: z24.string(),
        data: z24.string(),
        consultaId: z24.string().optional(),
        procedimentoId: z24.string().optional(),
        faturaId: z24.string().optional(),
        pagamentoId: z24.string().optional(),
        valor: z24.number().optional(),
        dentistaId: z24.string().optional(),
        dentistaNome: z24.string().optional(),
        icone: z24.string(),
        cor: z24.string()
      })
    ).mutation(async ({ input }) => {
      return await registarEventoHistorico(input);
    })
  }),
  // ========================================
  // TABELA DE PREÇOS
  // ========================================
  precos: router({
    // Listar preços
    listar: protectedProcedure.input(z24.object({ categoria: z24.string().optional() }).optional()).query(async ({ input }) => {
      return await listarPrecos(input?.categoria);
    }),
    // Buscar preço por código
    buscar: protectedProcedure.input(z24.object({ codigo: z24.string() })).query(async ({ input }) => {
      return await buscarPrecoPorCodigo(input.codigo);
    }),
    // Salvar preço
    salvar: protectedProcedure.input(
      z24.object({
        codigo: z24.string(),
        descricao: z24.string(),
        categoria: z24.enum([
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
        ]),
        valor: z24.number(),
        iva: z24.number().default(23),
        ativo: z24.number().default(1)
      })
    ).mutation(async ({ input }) => {
      return await salvarPreco(input);
    })
  }),
  // ========================================
  // FATURAÇÃO AUTOMÁTICA
  // ========================================
  faturacao: router({
    // Gerar fatura automaticamente
    gerarAutomatica: protectedProcedure.input(
      z24.object({
        utenteId: z24.string(),
        utenteNome: z24.string(),
        utenteNif: z24.string().optional(),
        utenteMorada: z24.string().optional(),
        dentistaId: z24.string(),
        dentistaNome: z24.string(),
        consultaId: z24.string().optional(),
        procedimentosIds: z24.array(z24.string()),
        dataVencimento: z24.string()
      })
    ).mutation(async ({ input }) => {
      const procedimentos = [];
      return await gerarFaturaAutomatica({
        ...input,
        procedimentos
      });
    })
  }),
  // ========================================
  // COMISSÕES
  // ========================================
  comissoes: router({
    // Listar comissões de um dentista
    listar: protectedProcedure.input(
      z24.object({
        dentistaId: z24.string(),
        mes: z24.string().optional(),
        status: z24.string().optional()
      })
    ).query(async ({ input }) => {
      return await listarComissoesDentista2(
        input.dentistaId,
        input.mes,
        input.status
      );
    }),
    // Criar comissão
    criar: protectedProcedure.input(
      z24.object({
        dentistaId: z24.string(),
        faturaId: z24.string(),
        valor: z24.number(),
        percentagem: z24.number().optional(),
        procedimentoId: z24.string().optional()
      })
    ).mutation(async ({ input }) => {
      return await criarComissaoAutomatica(input);
    }),
    // Marcar como paga
    pagar: protectedProcedure.input(
      z24.object({
        comissaoId: z24.string(),
        formaPagamento: z24.string(),
        referencia: z24.string().optional()
      })
    ).mutation(async ({ input }) => {
      await pagarComissao2(
        input.comissaoId,
        input.formaPagamento,
        input.referencia
      );
      return { sucesso: true };
    }),
    // Obter configuração
    obterConfig: protectedProcedure.input(z24.object({ dentistaId: z24.string() })).query(async ({ input }) => {
      return await obterConfigComissao2(input.dentistaId);
    }),
    // Salvar configuração
    salvarConfig: protectedProcedure.input(
      z24.object({
        dentistaId: z24.string(),
        tipo: z24.enum(["percentagem", "fixo", "misto"]),
        percentagem: z24.number().optional(),
        valorFixo: z24.number().optional(),
        valorMinimo: z24.number().optional(),
        valorMaximo: z24.number().optional(),
        observacoes: z24.string().optional()
      })
    ).mutation(async ({ input }) => {
      return await salvarConfigComissao2(input);
    })
  }),
  // ========================================
  // RELATÓRIOS
  // ========================================
  relatorios: router({
    // Relatório do dentista
    dentista: protectedProcedure.input(
      z24.object({
        dentistaId: z24.string(),
        dataInicio: z24.string(),
        dataFim: z24.string()
      })
    ).query(async ({ input }) => {
      return await gerarRelatorioDentista(
        input.dentistaId,
        input.dataInicio,
        input.dataFim
      );
    }),
    // Relatório da clínica
    clinica: protectedProcedure.input(
      z24.object({
        dataInicio: z24.string(),
        dataFim: z24.string()
      })
    ).query(async ({ input }) => {
      return await gerarRelatorioClinica(input.dataInicio, input.dataFim);
    })
  })
});

// server/routers/auth.ts
import { z as z25 } from "zod";

// server/services/auth-simple.service.ts
init_db();
import { SignJWT as SignJWT2, jwtVerify as jwtVerify2 } from "jose";
import { nanoid } from "nanoid";
import bcrypt from "bcrypt";
var JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
var JWT_EXPIRES_IN = "7d";
var SESSION_EXPIRES_IN = 7 * 24 * 60 * 60 * 1e3;
var SALT_ROUNDS = 10;
async function hashPassword(password) {
  return await bcrypt.hash(password, SALT_ROUNDS);
}
async function verifyPassword(password, hash) {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    console.error("Erro ao verificar senha:", error);
    return false;
  }
}
async function generateToken(payload) {
  const secret = new TextEncoder().encode(JWT_SECRET);
  const token = await new SignJWT2(payload).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime(JWT_EXPIRES_IN).sign(secret);
  return token;
}
async function verifyToken(token) {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify2(token, secret);
    if (!payload.userId || !payload.email || !payload.role || !payload.sessionId) {
      return null;
    }
    return payload;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}
var AuthServiceSimple = class {
  /**
   * Login de usuário usando queries SQL diretas
   */
  static async login(credentials, ipAddress, userAgent) {
    const pool2 = await getDb();
    if (!pool2) {
      throw new Error("Database not available");
    }
    try {
      const result = await pool2.query(
        "SELECT id, name, email, password_hash, role, status, dentista_id FROM users WHERE email = $1",
        [credentials.email]
      );
      if (result.rows.length === 0) {
        throw new Error("Email ou senha inv\xE1lidos");
      }
      const user = result.rows[0];
      if (user.status === "bloqueado") {
        throw new Error("Conta bloqueada. Entre em contato com o administrador.");
      }
      const isValidPassword = await verifyPassword(credentials.password, user.password_hash);
      if (!isValidPassword) {
        throw new Error("Email ou senha inv\xE1lidos");
      }
      await pool2.query(
        "UPDATE users SET last_signed_in = NOW(), updated_at = NOW() WHERE id = $1",
        [user.id]
      );
      const sessionId = nanoid();
      const token = await generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
        sessionId
      });
      const expiresAt = new Date(Date.now() + SESSION_EXPIRES_IN);
      await pool2.query(
        "INSERT INTO user_sessions (id, user_id, token, expires_at, ip_address, user_agent, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW())",
        [sessionId, user.id, token, expiresAt, ipAddress || null, userAgent || null]
      );
      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          dentistaId: user.dentista_id || void 0
        },
        token,
        expiresAt
      };
    } catch (error) {
      console.error("[AuthServiceSimple] Login error:", error);
      throw error;
    }
  }
  /**
   * Registrar novo usuário
   */
  static async register(data) {
    const pool2 = await getDb();
    if (!pool2) {
      throw new Error("Database not available");
    }
    try {
      const existingUser = await pool2.query(
        "SELECT id FROM users WHERE email = $1",
        [data.email]
      );
      if (existingUser.rows.length > 0) {
        throw new Error("Email j\xE1 cadastrado");
      }
      const passwordHash = await hashPassword(data.password);
      const userId = nanoid();
      await pool2.query(
        "INSERT INTO users (id, name, email, password_hash, role, status, dentista_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())",
        [userId, data.name, data.email, passwordHash, data.role || "user", "ativo", data.dentistaId || null]
      );
      const sessionId = nanoid();
      const token = await generateToken({
        userId,
        email: data.email,
        role: data.role || "user",
        sessionId
      });
      const expiresAt = new Date(Date.now() + SESSION_EXPIRES_IN);
      await pool2.query(
        "INSERT INTO user_sessions (id, user_id, token, expires_at, created_at) VALUES ($1, $2, $3, $4, NOW())",
        [sessionId, userId, token, expiresAt]
      );
      return {
        user: {
          id: userId,
          email: data.email,
          name: data.name,
          role: data.role || "user",
          dentistaId: data.dentistaId
        },
        token,
        expiresAt
      };
    } catch (error) {
      console.error("[AuthServiceSimple] Register error:", error);
      throw error;
    }
  }
  /**
   * Verificar sessão
   */
  static async verifySession(token) {
    const payload = await verifyToken(token);
    if (!payload) {
      return null;
    }
    const pool2 = await getDb();
    if (!pool2) {
      return payload;
    }
    try {
      const result = await pool2.query(
        "SELECT id FROM user_sessions WHERE id = $1 AND expires_at > NOW()",
        [payload.sessionId]
      );
      if (result.rows.length === 0) {
        return null;
      }
      return payload;
    } catch (error) {
      console.error("[AuthServiceSimple] Session verification error:", error);
      return payload;
    }
  }
  /**
   * Logout
   */
  static async logout(sessionId) {
    const pool2 = await getDb();
    if (!pool2) {
      return;
    }
    try {
      await pool2.query(
        "DELETE FROM user_sessions WHERE id = $1",
        [sessionId]
      );
    } catch (error) {
      console.error("[AuthServiceSimple] Logout error:", error);
    }
  }
};

// server/routers/auth.ts
import { TRPCError as TRPCError3 } from "@trpc/server";
var loginSchema = z25.object({
  email: z25.string().email("Email inv\xE1lido"),
  password: z25.string().min(6, "Senha deve ter no m\xEDnimo 6 caracteres")
});
var registerSchema = z25.object({
  email: z25.string().email("Email inv\xE1lido"),
  password: z25.string().min(8, "Senha deve ter no m\xEDnimo 8 caracteres").regex(/[A-Z]/, "Senha deve conter pelo menos uma letra mai\xFAscula").regex(/[a-z]/, "Senha deve conter pelo menos uma letra min\xFAscula").regex(/[0-9]/, "Senha deve conter pelo menos um n\xFAmero").regex(/[^A-Za-z0-9]/, "Senha deve conter pelo menos um caractere especial"),
  name: z25.string().min(3, "Nome deve ter no m\xEDnimo 3 caracteres"),
  role: z25.enum(["admin", "dentista", "recepcionista", "user"]).optional(),
  dentistaId: z25.string().optional()
});
var changePasswordSchema = z25.object({
  currentPassword: z25.string(),
  newPassword: z25.string().min(8, "Senha deve ter no m\xEDnimo 8 caracteres").regex(/[A-Z]/, "Senha deve conter pelo menos uma letra mai\xFAscula").regex(/[a-z]/, "Senha deve conter pelo menos uma letra min\xFAscula").regex(/[0-9]/, "Senha deve conter pelo menos um n\xFAmero").regex(/[^A-Za-z0-9]/, "Senha deve conter pelo menos um caractere especial")
});
var requestPasswordResetSchema = z25.object({
  email: z25.string().email("Email inv\xE1lido")
});
var resetPasswordSchema = z25.object({
  token: z25.string(),
  newPassword: z25.string().min(8, "Senha deve ter no m\xEDnimo 8 caracteres")
});
var authRouter = router({
  /**
   * Login
   */
  login: publicProcedure.input(loginSchema).mutation(async ({ input, ctx }) => {
    try {
      const ipAddress = ctx.req?.ip || ctx.req?.socket?.remoteAddress;
      const userAgent = ctx.req?.headers?.["user-agent"];
      const result = await AuthServiceSimple.login(input, ipAddress, userAgent);
      return {
        success: true,
        data: result
      };
    } catch (error) {
      throw new TRPCError3({
        code: "UNAUTHORIZED",
        message: error.message || "Erro ao fazer login"
      });
    }
  }),
  /**
   * Registrar novo usuário
   */
  register: publicProcedure.input(registerSchema).mutation(async ({ input, ctx }) => {
    try {
      const result = await AuthServiceSimple.register(input);
      return {
        success: true,
        data: result
      };
    } catch (error) {
      throw new TRPCError3({
        code: "BAD_REQUEST",
        message: error.message || "Erro ao registrar usu\xE1rio"
      });
    }
  }),
  /**
   * Logout
   */
  logout: publicProcedure.input(z25.object({
    token: z25.string()
  })).mutation(async ({ input, ctx }) => {
    try {
      const authService = new AuthService(ctx.db);
      await authService.logout(input.token);
      return {
        success: true,
        message: "Logout realizado com sucesso"
      };
    } catch (error) {
      throw new TRPCError3({
        code: "BAD_REQUEST",
        message: error.message || "Erro ao fazer logout"
      });
    }
  }),
  /**
   * Verificar sessão atual
   */
  verifySession: publicProcedure.input(z25.object({
    token: z25.string()
  })).query(async ({ input, ctx }) => {
    try {
      const authService = new AuthService(ctx.db);
      const user = await authService.verifySession(input.token);
      if (!user) {
        throw new TRPCError3({
          code: "UNAUTHORIZED",
          message: "Sess\xE3o inv\xE1lida ou expirada"
        });
      }
      return {
        success: true,
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          dentistaId: user.dentista_id || void 0
        }
      };
    } catch (error) {
      throw new TRPCError3({
        code: "UNAUTHORIZED",
        message: error.message || "Sess\xE3o inv\xE1lida"
      });
    }
  }),
  /**
   * Obter usuário atual
   */
  me: publicProcedure.input(z25.object({
    token: z25.string()
  })).query(async ({ input, ctx }) => {
    try {
      const authService = new AuthService(ctx.db);
      const user = await authService.verifySession(input.token);
      if (!user) {
        throw new TRPCError3({
          code: "UNAUTHORIZED",
          message: "N\xE3o autenticado"
        });
      }
      const permissions = await ctx.db.query.user_permissions.findMany({
        where: (perms, { eq: eq2, and: and2 }) => and2(
          eq2(perms.user_id, user.id),
          eq2(perms.granted, 1)
        )
      });
      return {
        success: true,
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          status: user.status,
          dentistaId: user.dentista_id || void 0,
          emailVerified: user.email_verified === 1,
          lastLogin: user.last_login,
          permissions: permissions.map((p) => ({
            module: p.module,
            action: p.action
          }))
        }
      };
    } catch (error) {
      throw new TRPCError3({
        code: "UNAUTHORIZED",
        message: error.message || "N\xE3o autenticado"
      });
    }
  }),
  /**
   * Alterar senha
   */
  changePassword: publicProcedure.input(changePasswordSchema.extend({
    token: z25.string()
  })).mutation(async ({ input, ctx }) => {
    try {
      const authService = new AuthService(ctx.db);
      const user = await authService.verifySession(input.token);
      if (!user) {
        throw new TRPCError3({
          code: "UNAUTHORIZED",
          message: "N\xE3o autenticado"
        });
      }
      return {
        success: true,
        message: "Senha alterada com sucesso"
      };
    } catch (error) {
      throw new TRPCError3({
        code: "BAD_REQUEST",
        message: error.message || "Erro ao alterar senha"
      });
    }
  }),
  /**
   * Solicitar recuperação de senha
   */
  requestPasswordReset: publicProcedure.input(requestPasswordResetSchema).mutation(async ({ input, ctx }) => {
    try {
      return {
        success: true,
        message: "Se o email existir, voc\xEA receber\xE1 instru\xE7\xF5es para recupera\xE7\xE3o de senha"
      };
    } catch (error) {
      throw new TRPCError3({
        code: "BAD_REQUEST",
        message: "Erro ao solicitar recupera\xE7\xE3o de senha"
      });
    }
  }),
  /**
   * Resetar senha com token
   */
  resetPassword: publicProcedure.input(resetPasswordSchema).mutation(async ({ input, ctx }) => {
    try {
      return {
        success: true,
        message: "Senha resetada com sucesso"
      };
    } catch (error) {
      throw new TRPCError3({
        code: "BAD_REQUEST",
        message: "Token inv\xE1lido ou expirado"
      });
    }
  }),
  /**
   * Verificar permissão
   */
  checkPermission: publicProcedure.input(z25.object({
    token: z25.string(),
    module: z25.string(),
    action: z25.enum(["read", "create", "update", "delete", "export"])
  })).query(async ({ input, ctx }) => {
    try {
      const authService = new AuthService(ctx.db);
      const user = await authService.verifySession(input.token);
      if (!user) {
        return { success: true, data: { hasPermission: false } };
      }
      const hasPermission = await authService.hasPermission(
        user.id,
        input.module,
        input.action
      );
      return {
        success: true,
        data: { hasPermission }
      };
    } catch (error) {
      return {
        success: true,
        data: { hasPermission: false }
      };
    }
  }),
  /**
   * Listar sessões ativas
   */
  listSessions: publicProcedure.input(z25.object({
    token: z25.string()
  })).query(async ({ input, ctx }) => {
    try {
      const authService = new AuthService(ctx.db);
      const user = await authService.verifySession(input.token);
      if (!user) {
        throw new TRPCError3({
          code: "UNAUTHORIZED",
          message: "N\xE3o autenticado"
        });
      }
      const sessions = await ctx.db.query.user_sessions.findMany({
        where: (sessions2, { eq: eq2, and: and2 }) => and2(
          eq2(sessions2.user_id, user.id),
          eq2(sessions2.is_active, 1)
        ),
        orderBy: (sessions2, { desc }) => [desc(sessions2.last_activity)]
      });
      return {
        success: true,
        data: sessions.map((s) => ({
          id: s.id,
          ipAddress: s.ip_address,
          userAgent: s.user_agent,
          lastActivity: s.last_activity,
          expiresAt: s.expires_at,
          createdAt: s.created_at
        }))
      };
    } catch (error) {
      throw new TRPCError3({
        code: "UNAUTHORIZED",
        message: error.message || "N\xE3o autenticado"
      });
    }
  }),
  /**
   * Revogar sessão
   */
  revokeSession: publicProcedure.input(z25.object({
    token: z25.string(),
    sessionId: z25.string()
  })).mutation(async ({ input, ctx }) => {
    try {
      const authService = new AuthService(ctx.db);
      const user = await authService.verifySession(input.token);
      if (!user) {
        throw new TRPCError3({
          code: "UNAUTHORIZED",
          message: "N\xE3o autenticado"
        });
      }
      const session = await ctx.db.query.user_sessions.findFirst({
        where: (sessions, { eq: eq2, and: and2 }) => and2(
          eq2(sessions.id, input.sessionId),
          eq2(sessions.user_id, user.id)
        )
      });
      if (!session) {
        throw new TRPCError3({
          code: "NOT_FOUND",
          message: "Sess\xE3o n\xE3o encontrada"
        });
      }
      await ctx.db.update(ctx.db.schema.user_sessions).set({ is_active: 0 }).where((sessions, { eq: eq2 }) => eq2(sessions.id, input.sessionId));
      return {
        success: true,
        message: "Sess\xE3o revogada com sucesso"
      };
    } catch (error) {
      throw new TRPCError3({
        code: "BAD_REQUEST",
        message: error.message || "Erro ao revogar sess\xE3o"
      });
    }
  })
});

// server/routers/consultas.ts
import { z as z26 } from "zod";
init_db();
var consultaSchema = z26.object({
  utenteId: z26.string().min(1, "ID do utente \xE9 obrigat\xF3rio"),
  dentistaId: z26.string().optional(),
  dataHora: z26.string().or(z26.date()),
  duracao: z26.number().int().positive().default(30),
  tipo: z26.string().optional(),
  status: z26.enum(["agendada", "confirmada", "realizada", "cancelada", "faltou"]).default("agendada"),
  notas: z26.string().optional(),
  valor: z26.number().optional()
});
var atualizarConsultaSchema = z26.object({
  utenteId: z26.string().optional(),
  dentistaId: z26.string().optional(),
  dataHora: z26.string().or(z26.date()).optional(),
  duracao: z26.number().int().positive().optional(),
  tipo: z26.string().optional(),
  status: z26.enum(["agendada", "confirmada", "realizada", "cancelada", "faltou"]).optional(),
  notas: z26.string().optional(),
  valor: z26.number().optional()
});
var consultasRouter = router({
  /**
   * Criar nova consulta
   */
  criar: publicProcedure.input(consultaSchema).mutation(async ({ input }) => {
    try {
      if (input.dentistaId) {
        const dataHora = typeof input.dataHora === "string" ? new Date(input.dataHora) : input.dataHora;
        const conflito = await verificarConflito(
          input.dentistaId,
          dataHora,
          input.duracao
        );
        if (conflito) {
          throw new Error("J\xE1 existe uma consulta agendada neste hor\xE1rio para este dentista");
        }
      }
      const consulta = await criarConsulta(input);
      return {
        success: true,
        data: consulta,
        message: "Consulta criada com sucesso"
      };
    } catch (error) {
      console.error("[Router] Erro ao criar consulta:", error);
      throw new Error(error.message || "Erro ao criar consulta");
    }
  }),
  /**
   * Listar todas as consultas
   */
  listar: publicProcedure.query(async () => {
    try {
      const consultas2 = await listarConsultas();
      return {
        success: true,
        data: consultas2,
        total: consultas2.length
      };
    } catch (error) {
      console.error("[Router] Erro ao listar consultas:", error);
      throw new Error("Erro ao listar consultas");
    }
  }),
  /**
   * Listar consultas por data específica
   */
  listarPorData: publicProcedure.input(z26.object({
    data: z26.string()
    // formato: YYYY-MM-DD
  })).query(async ({ input }) => {
    try {
      const consultas2 = await listarConsultasPorData(input.data);
      return {
        success: true,
        data: consultas2,
        total: consultas2.length
      };
    } catch (error) {
      console.error("[Router] Erro ao listar consultas por data:", error);
      throw new Error("Erro ao listar consultas por data");
    }
  }),
  /**
   * Listar consultas por médico/dentista
   */
  listarPorMedico: publicProcedure.input(z26.object({
    medicoId: z26.string()
  })).query(async ({ input }) => {
    try {
      const consultas2 = await listarConsultasPorMedico(input.medicoId);
      return {
        success: true,
        data: consultas2,
        total: consultas2.length
      };
    } catch (error) {
      console.error("[Router] Erro ao listar consultas por m\xE9dico:", error);
      throw new Error("Erro ao listar consultas por m\xE9dico");
    }
  }),
  /**
   * Listar consultas por período
   */
  listarPorPeriodo: publicProcedure.input(z26.object({
    dataInicio: z26.string(),
    // formato: YYYY-MM-DD
    dataFim: z26.string()
    // formato: YYYY-MM-DD
  })).query(async ({ input }) => {
    try {
      const consultas2 = await listarConsultasPorPeriodo(
        input.dataInicio,
        input.dataFim
      );
      return {
        success: true,
        data: consultas2,
        total: consultas2.length
      };
    } catch (error) {
      console.error("[Router] Erro ao listar consultas por per\xEDodo:", error);
      throw new Error("Erro ao listar consultas por per\xEDodo");
    }
  }),
  /**
   * Obter consulta por ID
   */
  obter: publicProcedure.input(z26.object({
    id: z26.string()
  })).query(async ({ input }) => {
    try {
      const consulta = await obterConsulta(input.id);
      if (!consulta) {
        throw new Error("Consulta n\xE3o encontrada");
      }
      return {
        success: true,
        data: consulta
      };
    } catch (error) {
      console.error("[Router] Erro ao obter consulta:", error);
      throw new Error(error.message || "Erro ao obter consulta");
    }
  }),
  /**
   * Atualizar consulta
   */
  atualizar: publicProcedure.input(z26.object({
    id: z26.string(),
    dados: atualizarConsultaSchema
  })).mutation(async ({ input }) => {
    try {
      const consultaExistente = await obterConsulta(input.id);
      if (!consultaExistente) {
        throw new Error("Consulta n\xE3o encontrada");
      }
      if (input.dados.dataHora || input.dados.dentistaId) {
        const dentistaId = input.dados.dentistaId || consultaExistente.dentistaId;
        const dataHora = input.dados.dataHora ? typeof input.dados.dataHora === "string" ? new Date(input.dados.dataHora) : input.dados.dataHora : new Date(consultaExistente.dataHora);
        const duracao = input.dados.duracao || consultaExistente.duracao || 30;
        if (dentistaId) {
          const conflito = await verificarConflito(
            dentistaId,
            dataHora,
            duracao
          );
          if (conflito) {
            const consultasConflitantes = await listarConsultasPorMedico(dentistaId);
            const outroConflito = consultasConflitantes.some(
              (c) => c.id !== input.id && new Date(c.dataHora).getTime() === dataHora.getTime()
            );
            if (outroConflito) {
              throw new Error("J\xE1 existe outra consulta agendada neste hor\xE1rio para este dentista");
            }
          }
        }
      }
      const consulta = await atualizarConsulta(input.id, input.dados);
      return {
        success: true,
        data: consulta,
        message: "Consulta atualizada com sucesso"
      };
    } catch (error) {
      console.error("[Router] Erro ao atualizar consulta:", error);
      throw new Error(error.message || "Erro ao atualizar consulta");
    }
  }),
  /**
   * Remover consulta
   */
  remover: publicProcedure.input(z26.object({
    id: z26.string()
  })).mutation(async ({ input }) => {
    try {
      const consultaExistente = await obterConsulta(input.id);
      if (!consultaExistente) {
        throw new Error("Consulta n\xE3o encontrada");
      }
      await removerConsulta(input.id);
      return {
        success: true,
        message: "Consulta removida com sucesso"
      };
    } catch (error) {
      console.error("[Router] Erro ao remover consulta:", error);
      throw new Error(error.message || "Erro ao remover consulta");
    }
  }),
  /**
   * Cancelar consulta (soft delete)
   */
  cancelar: publicProcedure.input(z26.object({
    id: z26.string(),
    motivo: z26.string().optional()
  })).mutation(async ({ input }) => {
    try {
      const consultaExistente = await obterConsulta(input.id);
      if (!consultaExistente) {
        throw new Error("Consulta n\xE3o encontrada");
      }
      const notas = input.motivo ? `${consultaExistente.notas || ""}
[CANCELADA] ${input.motivo}`.trim() : consultaExistente.notas;
      await atualizarConsulta(input.id, {
        status: "cancelada",
        notas
      });
      return {
        success: true,
        message: "Consulta cancelada com sucesso"
      };
    } catch (error) {
      console.error("[Router] Erro ao cancelar consulta:", error);
      throw new Error(error.message || "Erro ao cancelar consulta");
    }
  }),
  /**
   * Confirmar consulta
   */
  confirmar: publicProcedure.input(z26.object({
    id: z26.string()
  })).mutation(async ({ input }) => {
    try {
      const consultaExistente = await obterConsulta(input.id);
      if (!consultaExistente) {
        throw new Error("Consulta n\xE3o encontrada");
      }
      await atualizarConsulta(input.id, {
        status: "confirmada"
      });
      return {
        success: true,
        message: "Consulta confirmada com sucesso"
      };
    } catch (error) {
      console.error("[Router] Erro ao confirmar consulta:", error);
      throw new Error(error.message || "Erro ao confirmar consulta");
    }
  }),
  /**
   * Marcar consulta como realizada
   */
  marcarRealizada: publicProcedure.input(z26.object({
    id: z26.string(),
    notas: z26.string().optional()
  })).mutation(async ({ input }) => {
    try {
      const consultaExistente = await obterConsulta(input.id);
      if (!consultaExistente) {
        throw new Error("Consulta n\xE3o encontrada");
      }
      const dados = {
        status: "realizada"
      };
      if (input.notas) {
        dados.notas = input.notas;
      }
      await atualizarConsulta(input.id, dados);
      return {
        success: true,
        message: "Consulta marcada como realizada"
      };
    } catch (error) {
      console.error("[Router] Erro ao marcar consulta como realizada:", error);
      throw new Error(error.message || "Erro ao marcar consulta como realizada");
    }
  }),
  /**
   * Verificar conflito de horário
   */
  verificarConflito: publicProcedure.input(z26.object({
    dentistaId: z26.string(),
    dataHora: z26.string().or(z26.date()),
    duracao: z26.number().int().positive().default(30)
  })).query(async ({ input }) => {
    try {
      const dataHora = typeof input.dataHora === "string" ? new Date(input.dataHora) : input.dataHora;
      const conflito = await verificarConflito(
        input.dentistaId,
        dataHora,
        input.duracao
      );
      return {
        success: true,
        conflito,
        message: conflito ? "Existe conflito de hor\xE1rio" : "Hor\xE1rio dispon\xEDvel"
      };
    } catch (error) {
      console.error("[Router] Erro ao verificar conflito:", error);
      throw new Error("Erro ao verificar conflito");
    }
  }),
  /**
   * Obter estatísticas de consultas
   */
  estatisticas: publicProcedure.query(async () => {
    try {
      const stats = await obterEstatisticasConsultas();
      return {
        success: true,
        data: stats
      };
    } catch (error) {
      console.error("[Router] Erro ao obter estat\xEDsticas:", error);
      throw new Error("Erro ao obter estat\xEDsticas");
    }
  })
});

// server/routers.ts
var appRouter = router({
  system: systemRouter,
  // Sistema de Autenticação Completo
  auth: authRouter,
  // Auth legado (manter para compatibilidade)
  authLegacy: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true
      };
    })
  }),
  // ========================================
  // UTENTES (Pacientes)
  // ========================================
  utentes: router({
    // Listar todos os utentes
    listar: protectedProcedure.query(async () => {
      const { listarUtentes: listarUtentes2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      return await listarUtentes2();
    }),
    // Obter utente por ID
    obter: protectedProcedure.input(z27.object({ id: z27.string() })).query(async ({ input }) => {
      const { obterUtente: obterUtente2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      return await obterUtente2(input.id);
    }),
    // Pesquisar utentes
    pesquisar: protectedProcedure.input(z27.object({ termo: z27.string() })).query(async ({ input }) => {
      const { pesquisarUtentes: pesquisarUtentes2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      return await pesquisarUtentes2(input.termo);
    }),
    // Criar novo utente
    criar: protectedProcedure.input(
      z27.object({
        nomeCompleto: z27.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
        dataNascimento: z27.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inv\xE1lida (use YYYY-MM-DD)"),
        genero: z27.enum(["M", "F", "Outro"]),
        nif: z27.string().length(9, "NIF deve ter 9 d\xEDgitos").optional(),
        numUtenteSns: z27.string().length(9).optional(),
        fotoPerfil: z27.string().optional(),
        contacto: z27.object({
          telemovel: z27.string().min(1, "Telem\xF3vel/WhatsApp \xE9 obrigat\xF3rio"),
          telefone: z27.string().optional(),
          email: z27.string().email("Email inv\xE1lido").optional(),
          telefoneEmergencia: z27.string().optional()
        }),
        morada: z27.object({
          rua: z27.string().optional(),
          numero: z27.string().optional(),
          codigoPostal: z27.string().regex(/^\d{4}-\d{3}$/, "C\xF3digo postal inv\xE1lido").optional(),
          localidade: z27.string().optional(),
          distrito: z27.string().optional()
        }).optional(),
        infoMedica: z27.object({
          alergias: z27.array(z27.string()),
          medicamentos: z27.array(z27.string()),
          condicoesMedicas: z27.array(z27.string()),
          classificacaoAsa: z27.enum(["I", "II", "III", "IV", "V", "VI"]),
          grupoSanguineo: z27.string().optional(),
          notasImportantes: z27.string().optional()
        }),
        tags: z27.array(z27.string()).optional()
      })
    ).mutation(async ({ input, ctx }) => {
      const { criarUtente: criarUtente2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      return await criarUtente2({
        ...input,
        status: "ativo",
        criadoPor: ctx.user.id
      });
    }),
    // Atualizar utente
    atualizar: protectedProcedure.input(
      z27.object({
        id: z27.string(),
        dados: z27.object({
          nomeCompleto: z27.string().min(3).optional(),
          dataNascimento: z27.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
          genero: z27.enum(["M", "F", "Outro"]).optional(),
          nif: z27.string().length(9).optional(),
          numUtenteSns: z27.string().length(9).optional(),
          fotoPerfil: z27.string().optional(),
          contacto: z27.object({
            telemovel: z27.string().min(1, "Telem\xF3vel/WhatsApp \xE9 obrigat\xF3rio"),
            telefone: z27.string().optional(),
            email: z27.string().email().optional(),
            telefoneEmergencia: z27.string().optional()
          }).optional(),
          morada: z27.object({
            rua: z27.string(),
            numero: z27.string(),
            codigoPostal: z27.string().regex(/^\d{4}-\d{3}$/),
            localidade: z27.string(),
            distrito: z27.string()
          }).optional(),
          infoMedica: z27.object({
            alergias: z27.array(z27.string()),
            medicamentos: z27.array(z27.string()),
            condicoesMedicas: z27.array(z27.string()),
            classificacaoAsa: z27.enum(["I", "II", "III", "IV", "V", "VI"]),
            grupoSanguineo: z27.string().optional(),
            notasImportantes: z27.string().optional()
          }).optional(),
          status: z27.enum(["ativo", "inativo", "arquivado"]).optional(),
          tags: z27.array(z27.string()).optional()
        })
      })
    ).mutation(async ({ input }) => {
      const { atualizarUtente: atualizarUtente2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      const dados = { ...input.dados };
      if (dados.contacto) dados.contacto = JSON.stringify(dados.contacto);
      if (dados.morada) dados.morada = JSON.stringify(dados.morada);
      if (dados.infoMedica) dados.infoMedica = JSON.stringify(dados.infoMedica);
      if (dados.tags) dados.tags = JSON.stringify(dados.tags);
      return await atualizarUtente2(input.id, dados);
    }),
    // Remover utente (soft delete)
    remover: protectedProcedure.input(z27.object({ id: z27.string() })).mutation(async ({ input }) => {
      const { removerUtente: removerUtente3 } = await Promise.resolve().then(() => (init_db(), db_exports));
      await removerUtente3(input.id);
      return { sucesso: true };
    }),
    // Obter estatísticas
    estatisticas: protectedProcedure.query(async () => {
      const { obterEstatisticasUtentes: obterEstatisticasUtentes2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      return await obterEstatisticasUtentes2();
    })
  }),
  // ========================================
  // IA - ASSISTENTE INTELIGENTE
  // ========================================
  ia: router({
    // Assistente de Diagnóstico
    analisarSintomas: protectedProcedure.input(
      z27.object({
        utenteId: z27.string(),
        sintomas: z27.string()
      })
    ).mutation(async ({ input }) => {
      const { obterUtente: obterUtente2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      const { analisarSintomas: analisarSintomas2 } = await Promise.resolve().then(() => (init_ai_helper(), ai_helper_exports));
      const utente = await obterUtente2(input.utenteId);
      if (!utente) throw new Error("Utente n\xE3o encontrado");
      const infoMedica = typeof utente.infoMedica === "string" ? JSON.parse(utente.infoMedica) : utente.infoMedica;
      const idade = (/* @__PURE__ */ new Date()).getFullYear() - new Date(utente.dataNascimento).getFullYear();
      return await analisarSintomas2({
        sintomas: input.sintomas,
        historicoMedico: infoMedica?.notasImportantes,
        alergias: infoMedica?.alergias || [],
        medicamentos: infoMedica?.medicamentos || [],
        idade,
        genero: utente.genero
      });
    }),
    // Verificação de Medicamento
    verificarMedicamento: protectedProcedure.input(
      z27.object({
        utenteId: z27.string(),
        medicamento: z27.string(),
        dosagem: z27.string()
      })
    ).mutation(async ({ input }) => {
      const { obterUtente: obterUtente2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      const { verificarMedicamento: verificarMedicamento2 } = await Promise.resolve().then(() => (init_ai_helper(), ai_helper_exports));
      const utente = await obterUtente2(input.utenteId);
      if (!utente) throw new Error("Utente n\xE3o encontrado");
      const infoMedica = typeof utente.infoMedica === "string" ? JSON.parse(utente.infoMedica) : utente.infoMedica;
      const idade = (/* @__PURE__ */ new Date()).getFullYear() - new Date(utente.dataNascimento).getFullYear();
      return await verificarMedicamento2({
        medicamento: input.medicamento,
        dosagem: input.dosagem,
        alergias: infoMedica?.alergias || [],
        medicamentosAtuais: infoMedica?.medicamentos || [],
        condicoesMedicas: infoMedica?.condicoesMedicas || [],
        idade
      });
    }),
    // Gerar Resumo de Consulta
    gerarResumo: protectedProcedure.input(
      z27.object({
        notasConsulta: z27.string(),
        tratamentosRealizados: z27.array(z27.string()).optional(),
        proximaConsulta: z27.string().optional()
      })
    ).mutation(async ({ input }) => {
      const { gerarResumoConsulta: gerarResumoConsulta2 } = await Promise.resolve().then(() => (init_ai_helper(), ai_helper_exports));
      return await gerarResumoConsulta2(input);
    }),
    // Análise de Risco
    analisarRisco: protectedProcedure.input(z27.object({ utenteId: z27.string() })).mutation(async ({ input }) => {
      const { obterUtente: obterUtente2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      const { analisarRiscoPaciente: analisarRiscoPaciente2 } = await Promise.resolve().then(() => (init_ai_helper(), ai_helper_exports));
      const utente = await obterUtente2(input.utenteId);
      if (!utente) throw new Error("Utente n\xE3o encontrado");
      const infoMedica = typeof utente.infoMedica === "string" ? JSON.parse(utente.infoMedica) : utente.infoMedica;
      const idade = (/* @__PURE__ */ new Date()).getFullYear() - new Date(utente.dataNascimento).getFullYear();
      return await analisarRiscoPaciente2({
        historicoMedico: infoMedica?.notasImportantes || "",
        condicoesMedicas: infoMedica?.condicoesMedicas || [],
        idade
      });
    }),
    // Assistente Virtual
    assistente: protectedProcedure.input(
      z27.object({
        utenteId: z27.string(),
        pergunta: z27.string()
      })
    ).mutation(async ({ input }) => {
      const { obterUtente: obterUtente2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      const { assistenteVirtual: assistenteVirtual2 } = await Promise.resolve().then(() => (init_ai_helper(), ai_helper_exports));
      const utente = await obterUtente2(input.utenteId);
      if (!utente) throw new Error("Utente n\xE3o encontrado");
      const infoMedica = typeof utente.infoMedica === "string" ? JSON.parse(utente.infoMedica) : utente.infoMedica;
      const idade = (/* @__PURE__ */ new Date()).getFullYear() - new Date(utente.dataNascimento).getFullYear();
      return await assistenteVirtual2({
        pergunta: input.pergunta,
        contextoUtente: {
          nome: utente.nomeCompleto,
          idade,
          historicoMedico: infoMedica?.notasImportantes,
          alergias: infoMedica?.alergias,
          medicamentos: infoMedica?.medicamentos,
          condicoesMedicas: infoMedica?.condicoesMedicas
        }
      });
    }),
    // Análise de Imagem com IA
    analisarImagem: protectedProcedure.input(
      z27.object({
        imagemBase64: z27.string(),
        tipoImagem: z27.string(),
        contexto: z27.string().optional()
      })
    ).mutation(async ({ input }) => {
      try {
        console.log("\u{1F50D} [IA] Iniciando an\xE1lise de imagem...");
        console.log("\u{1F4CA} [IA] Tipo de imagem:", input.tipoImagem);
        console.log("\u{1F4CA} [IA] Tamanho base64:", input.imagemBase64.length, "caracteres");
        console.log("\u{1F4CA} [IA] Contexto:", input.contexto || "(nenhum)");
        const { analisarImagemComGemini: analisarImagemComGemini2 } = await Promise.resolve().then(() => (init_gemini_image_helper(), gemini_image_helper_exports));
        const resultado = await analisarImagemComGemini2({
          imagemBase64: input.imagemBase64,
          tipoImagem: input.tipoImagem,
          contexto: input.contexto
        });
        console.log("\u2705 [IA] An\xE1lise conclu\xEDda com sucesso");
        return resultado;
      } catch (error) {
        console.error("\u274C [IA] Erro na an\xE1lise de imagem:", error);
        console.error("\u274C [IA] Stack:", error instanceof Error ? error.stack : "N/A");
        throw error;
      }
    })
  }),
  // ========================================
  // IMAGENS (Persistência)
  // ========================================
  // imagens: imagensRouter,
  // ========================================
  // CONSULTAS (removido inline - agora usa router importado)
  // ========================================
  // ========================================
  // FINANCEIRO / FATURAÇÃO
  // ========================================
  financeiro: financeiroRouter,
  // ========================================
  // DENTISTAS
  // ========================================
  dentistas: dentistasRouter,
  // ========================================
  // CONFIGURAÇÕES
  // ========================================
  configuracoes: configuracoesRouter,
  // ========================================
  // COMISSÕES
  // ========================================
  comissoes: comissoesRouter,
  // ========================================
  // LABORATÓRIOS
  // ========================================
  laboratorios: laboratoriosRouter,
  // ========================================
  // CONTAS A PAGAR
  // ========================================
  contasPagar: contasPagarRouter,
  // ========================================
  // IA FINANCEIRA
  // ========================================
  iaFinanceira: iaFinanceiraRouter,
  // ========================================
  // TRATAMENTOS
  // ========================================
  // tratamentos: tratamentosRouter, // Temporariamente desativado - funções não implementadas no db.ts
  // ========================================
  // PRESCRIÇÕES
  // ========================================
  prescricoes: prescricoesRouter,
  // ========================================
  // MEDICAMENTOS
  // ========================================
  medicamentos: medicamentosRouter,
  // ========================================
  // ODONTOGRAMA
  // ========================================
  odontograma: odontogramaRouter,
  // ========================================
  // PERIODONTOGRAMA
  // ========================================
  periodontograma: periodontogramaRouter,
  // ========================================
  // BLOQUEIOS DE AGENDA
  // ========================================
  bloqueiosAgenda: bloqueiosAgendaRouter,
  // ========================================
  // LISTA DE ESPERA
  // ========================================
  listaEspera: listaEsperaRouter,
  // ========================================
  // PORTAL DO PACIENTE
  // ========================================
  portalPaciente: portalPacienteRouter,
  // ========================================
  // RELATÓRIOS
  // ========================================
  relatorios: relatoriosRouter,
  // ========================================
  // IMAGENS CLÍNICAS
  // ========================================
  imagensClinicas: imagensClinicasRouter,
  // ========================================
  // ENDODONTIA
  // ========================================
  endodontia: endodontiaRouter,
  // ========================================
  // IMPLANTES
  // ========================================
  implantes: implantesRouter,
  // ========================================
  // ORTODONTIA
  // ========================================
  ortodontia: ortodontiaRouter,
  // ========================================
  // CONSENTIMENTOS INFORMADOS
  // ========================================
  consentimentos: consentimentosRouter,
  // ========================================
  // ANAMNESE
  // ========================================
  anamnese: anamneseRouter,
  // ========================================
  // LEMBRETES E NOTIFICAÇÕES
  // ========================================
  lembretes: lembretesRouter,
  // ========================================
  // ESTOQUE/INVENTÁRIO
  // ========================================
  estoque: estoqueRouter,
  integracao: integracaoRouter,
  // ========================================
  // CONSULTAS/AGENDAMENTO
  // ========================================
  consultas: consultasRouter
});

// server/_core/context.ts
init_db();
async function createContext(opts) {
  let user = null;
  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    user = null;
  }
  return {
    req: opts.req,
    res: opts.res,
    user,
    db
  };
}

// server/init-db-endpoint.ts
init_db();
import { Router } from "express";
var router2 = Router();
router2.get("/init-database", async (req, res) => {
  try {
    console.log("\u{1F527} Inicializando base de dados...");
    const pool2 = await getDb();
    await pool2.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        login_method VARCHAR(50),
        role VARCHAR(50) DEFAULT 'user',
        last_signed_in TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("\u2705 Tabela users criada!");
    await pool2.query(`
      CREATE TABLE IF NOT EXISTS config_clinica (
        id VARCHAR(50) PRIMARY KEY,
        nome_clinica VARCHAR(255),
        razao_social VARCHAR(255),
        nif VARCHAR(20),
        numero_registo VARCHAR(50),
        telefone VARCHAR(20),
        telemovel VARCHAR(20),
        email VARCHAR(255),
        website VARCHAR(255),
        rua TEXT,
        numero VARCHAR(20),
        complemento VARCHAR(100),
        codigo_postal VARCHAR(20),
        cidade VARCHAR(100),
        pais VARCHAR(100) DEFAULT 'Portugal',
        nome_fantasia VARCHAR(255),
        logotipo TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("\u2705 Tabela config_clinica criada!");
    await pool2.query(`
      CREATE TABLE IF NOT EXISTS utentes (
        id VARCHAR(50) PRIMARY KEY,
        codigo VARCHAR(20) UNIQUE,
        nome VARCHAR(255) NOT NULL,
        data_nascimento DATE,
        genero VARCHAR(10),
        nif VARCHAR(20),
        numero_sns VARCHAR(20),
        email VARCHAR(255),
        telefone VARCHAR(20),
        telemovel VARCHAR(20),
        rua TEXT,
        numero VARCHAR(20),
        complemento VARCHAR(100),
        codigo_postal VARCHAR(20),
        cidade VARCHAR(100),
        pais VARCHAR(100) DEFAULT 'Portugal',
        estado VARCHAR(20) DEFAULT 'ativo',
        observacoes TEXT,
        alergias TEXT,
        medicamentos TEXT,
        historico_medico TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await pool2.query(`
      CREATE INDEX IF NOT EXISTS idx_utentes_nome ON utentes(nome);
      CREATE INDEX IF NOT EXISTS idx_utentes_nif ON utentes(nif);
      CREATE INDEX IF NOT EXISTS idx_utentes_numero_sns ON utentes(numero_sns);
      CREATE INDEX IF NOT EXISTS idx_utentes_estado ON utentes(estado);
    `);
    console.log("\u2705 Tabela utentes criada!");
    const countResult = await pool2.query("SELECT COUNT(*) as count FROM utentes");
    const count = parseInt(countResult.rows[0]?.count || "0");
    const configResult = await pool2.query("SELECT COUNT(*) as count FROM config_clinica");
    const configCount = parseInt(configResult.rows[0]?.count || "0");
    if (configCount === 0) {
      await pool2.query(`
        INSERT INTO config_clinica (id, nome_clinica, email, cidade, pais)
        VALUES ('config-1', 'Cl\xEDnica Dent\xE1ria', 'geral@clinica.pt', 'Lisboa', 'Portugal')
      `);
      console.log("\u2705 Configura\xE7\xE3o padr\xE3o da cl\xEDnica criada!");
    }
    const userResult = await pool2.query("SELECT COUNT(*) as count FROM users");
    const userCount = parseInt(userResult.rows[0]?.count || "0");
    if (userCount === 0) {
      await pool2.query(`
        INSERT INTO users (id, name, email, login_method, role, last_signed_in)
        VALUES ('user-demo', 'Utilizador de Desenvolvimento', 'demo@dentcarepro.pt', 'demo', 'admin', CURRENT_TIMESTAMP)
      `);
      console.log("\u2705 Utilizador demo criado!");
    }
    if (count === 0) {
      await pool2.query(`
        INSERT INTO utentes (
          id, codigo, nome, data_nascimento, genero, nif, numero_sns,
          email, telefone, telemovel, cidade, alergias, medicamentos, estado
        ) VALUES
        ('utente-1', 'U001', 'Jo\xE3o Silva', '1980-05-15', 'M', '123456789', '123456789', 'joao.silva@email.pt', '912345678', '912345678', 'Lisboa', 'Penicilina', '', 'ativo'),
        ('utente-2', 'U002', 'Maria Santos', '1992-08-22', 'F', '987654321', '987654321', 'maria.santos@email.pt', '923456789', '923456789', 'Porto', '', 'Paracetamol', 'ativo'),
        ('utente-3', 'U003', 'Carlos Oliveira', '1975-03-10', 'M', '456789123', NULL, 'carlos.oliveira@email.pt', '934567890', '934567890', 'Coimbra', 'L\xE1tex', 'Ibuprofeno', 'ativo'),
        ('utente-4', 'U004', 'Ana Costa', '1988-11-30', 'F', '789123456', '456789123', 'ana.costa@email.pt', '945678901', '945678901', 'Braga', '', '', 'ativo'),
        ('utente-5', 'U005', 'Pedro Ferreira', '1995-01-18', 'M', '321654987', '321654987', 'pedro.ferreira@email.pt', '956789012', '956789012', 'Faro', 'Anestesia local', '', 'ativo')
      `);
      console.log("\u2705 Dados de demonstra\xE7\xE3o inseridos!");
    } else {
      console.log(`\u2139\uFE0F Base de dados j\xE1 cont\xE9m ${count} utentes`);
    }
    const finalCountResult = await pool2.query("SELECT COUNT(*) as count FROM utentes");
    const finalCount = parseInt(finalCountResult.rows[0]?.count || "0");
    const usersFinalCount = await pool2.query("SELECT COUNT(*) as count FROM users");
    const configFinalCount = await pool2.query("SELECT COUNT(*) as count FROM config_clinica");
    res.json({
      success: true,
      message: "Base de dados inicializada com sucesso!",
      tables: {
        users: parseInt(usersFinalCount.rows[0]?.count || "0"),
        config_clinica: parseInt(configFinalCount.rows[0]?.count || "0"),
        utentes: finalCount
      }
    });
  } catch (error) {
    console.error("\u274C Erro ao inicializar base de dados:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      details: error.stack
    });
  }
});
var init_db_endpoint_default = router2;

// server/_core/vite.ts
import express from "express";
import fs from "fs";
import { nanoid as nanoid2 } from "nanoid";
import path2 from "path";
import { createServer as createViteServer } from "vite";

// vite.config.ts
import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";
var plugins = [react(), tailwindcss(), jsxLocPlugin(), vitePluginManusRuntime()];
var vite_config_default = defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, "client", "public"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    host: true,
    allowedHosts: [
      ".manuspre.computer",
      ".manus.computer",
      ".manus-asia.computer",
      ".manuscomputer.ai",
      ".manusvm.computer",
      "localhost",
      "127.0.0.1"
    ],
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/_core/vite.ts
async function setupVite(app, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    server: serverOptions,
    appType: "custom"
  });
  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid2()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app) {
  const distPath = process.env.NODE_ENV === "development" ? path2.resolve(import.meta.dirname, "../..", "dist", "public") : path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app.use(express.static(distPath));
  app.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/_core/index.ts
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}
async function findAvailablePort(startPort = 3e3) {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}
async function startServer() {
  const app = express2();
  const server = createServer(app);
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    const isAllowed = origin && (origin.includes("vercel.app") || origin.includes("localhost") || origin.includes("railway.app"));
    if (isAllowed) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    }
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-trpc-source");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    if (req.method === "OPTIONS") {
      res.sendStatus(200);
      return;
    }
    next();
  });
  app.use(express2.json({ limit: "50mb" }));
  app.use(express2.urlencoded({ limit: "50mb", extended: true }));
  registerOAuthRoutes(app);
  app.use("/api", init_db_endpoint_default);
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext
    })
  );
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);
  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}
startServer().catch(console.error);
