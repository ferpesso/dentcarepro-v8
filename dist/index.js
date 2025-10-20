var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/db.ts
var db_exports = {};
__export(db_exports, {
  atualizarConsulta: () => atualizarConsulta,
  atualizarContaPagar: () => atualizarContaPagar,
  atualizarDentista: () => atualizarDentista,
  atualizarFatura: () => atualizarFatura,
  atualizarLaboratorio: () => atualizarLaboratorio,
  atualizarTrabalhoLaboratorio: () => atualizarTrabalhoLaboratorio,
  atualizarUtente: () => atualizarUtente,
  criarCategoriaDespesa: () => criarCategoriaDespesa,
  criarComissao: () => criarComissao,
  criarConsulta: () => criarConsulta,
  criarContaPagar: () => criarContaPagar,
  criarDentista: () => criarDentista,
  criarFatura: () => criarFatura,
  criarFormaPagamento: () => criarFormaPagamento,
  criarFornecedor: () => criarFornecedor,
  criarLaboratorio: () => criarLaboratorio,
  criarTrabalhoLaboratorio: () => criarTrabalhoLaboratorio,
  criarUtente: () => criarUtente,
  excluirLaboratorio: () => excluirLaboratorio,
  excluirTrabalhoLaboratorio: () => excluirTrabalhoLaboratorio,
  getDb: () => getDb,
  getUser: () => getUser,
  listarCategoriasDespesa: () => listarCategoriasDespesa,
  listarComissoes: () => listarComissoes,
  listarComissoesDentista: () => listarComissoesDentista,
  listarConsultas: () => listarConsultas,
  listarContasPagar: () => listarContasPagar,
  listarDentistas: () => listarDentistas,
  listarFaturas: () => listarFaturas,
  listarFormasPagamento: () => listarFormasPagamento,
  listarFornecedores: () => listarFornecedores,
  listarLaboratorios: () => listarLaboratorios,
  listarTrabalhosLaboratorio: () => listarTrabalhosLaboratorio,
  listarUtentes: () => listarUtentes,
  marcarContaPaga: () => marcarContaPaga,
  obterComissao: () => obterComissao,
  obterConfigClinica: () => obterConfigClinica,
  obterConfigComissao: () => obterConfigComissao,
  obterConsulta: () => obterConsulta,
  obterContaPagar: () => obterContaPagar,
  obterDashboardFinanceiro: () => obterDashboardFinanceiro,
  obterDentista: () => obterDentista,
  obterEstatisticasUtentes: () => obterEstatisticasUtentes,
  obterFatura: () => obterFatura,
  obterLaboratorio: () => obterLaboratorio,
  obterResumoFinanceiroDentista: () => obterResumoFinanceiroDentista,
  obterTrabalhoLaboratorio: () => obterTrabalhoLaboratorio,
  obterUtente: () => obterUtente,
  pagarComissao: () => pagarComissao,
  pesquisarUtentes: () => pesquisarUtentes,
  removerConsulta: () => removerConsulta,
  removerContaPagar: () => removerContaPagar,
  removerDentista: () => removerDentista,
  removerFatura: () => removerFatura,
  removerLaboratorio: () => removerLaboratorio,
  removerUtente: () => removerUtente,
  salvarConfigClinica: () => salvarConfigClinica,
  salvarConfigComissao: () => salvarConfigComissao,
  upsertUser: () => upsertUser
});
import pg from "pg";
async function getDb() {
  return pool;
}
async function getUser(userId) {
  try {
    console.log("[DB] getUser called with userId:", userId);
    const result = await pool.query(
      "SELECT * FROM users WHERE id = $1",
      [userId]
    );
    console.log("[DB] getUser result:", result.rows.length, "rows");
    const user = result.rows[0] || null;
    if (user) {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        loginMethod: user.login_method,
        role: user.role,
        lastSignedIn: user.last_signed_in
      };
    }
    return null;
  } catch (error) {
    console.error("[DB ERROR] getUser failed:", error);
    throw error;
  }
}
async function upsertUser(user) {
  if (!user.id) {
    throw new Error("User ID is required for upsert");
  }
  await pool.query(
    `INSERT INTO users (id, name, email, login_method, role, last_signed_in, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
     ON CONFLICT (id) DO UPDATE SET
       name = EXCLUDED.name,
       email = EXCLUDED.email,
       last_signed_in = EXCLUDED.last_signed_in,
       updated_at = CURRENT_TIMESTAMP`,
    [user.id, user.name, user.email, user.loginMethod, user.role || "user", user.lastSignedIn || /* @__PURE__ */ new Date()]
  );
}
async function obterConfigClinica() {
  const result = await pool.query(
    "SELECT * FROM config_clinica WHERE id = $1",
    ["config-1"]
  );
  if (result.rows.length === 0) {
    return {
      id: "config-1",
      nomeClinica: "Cl\xEDnica Dent\xE1ria",
      email: "geral@clinica.pt",
      telefone: "",
      cidade: "Lisboa",
      pais: "Portugal"
    };
  }
  const row = result.rows[0];
  return {
    id: row.id,
    nomeClinica: row.nome_clinica,
    razaoSocial: row.razao_social,
    nif: row.nif,
    numeroRegisto: row.numero_registo,
    telefone: row.telefone,
    telemovel: row.telemovel,
    email: row.email,
    website: row.website,
    rua: row.rua,
    numero: row.numero,
    complemento: row.complemento,
    codigoPostal: row.codigo_postal,
    cidade: row.cidade,
    pais: row.pais,
    nomeFantasia: row.nome_fantasia,
    logotipo: row.logotipo,
    atualizadoEm: row.updated_at
  };
}
async function salvarConfigClinica(dados) {
  await pool.query(
    `UPDATE config_clinica SET
      nome_clinica = $1,
      razao_social = $2,
      nif = $3,
      numero_registo = $4,
      telefone = $5,
      telemovel = $6,
      email = $7,
      website = $8,
      rua = $9,
      numero = $10,
      complemento = $11,
      codigo_postal = $12,
      cidade = $13,
      pais = $14,
      nome_fantasia = $15,
      logotipo = $16,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = 'config-1'`,
    [
      dados.nomeClinica,
      dados.razaoSocial,
      dados.nif,
      dados.numeroRegisto,
      dados.telefone,
      dados.telemovel,
      dados.email,
      dados.website,
      dados.rua,
      dados.numero,
      dados.complemento,
      dados.codigoPostal,
      dados.cidade,
      dados.pais,
      dados.nomeFantasia,
      dados.logotipo
    ]
  );
  return await obterConfigClinica();
}
async function listarUtentes() {
  const result = await pool.query(
    "SELECT * FROM utentes ORDER BY created_at DESC"
  );
  return result.rows.map((row) => ({
    id: row.id,
    codigo: row.codigo,
    nome: row.nome,
    dataNascimento: row.data_nascimento,
    genero: row.genero,
    nif: row.nif,
    numeroSNS: row.numero_sns,
    email: row.email,
    telefone: row.telefone,
    telemovel: row.telemovel,
    rua: row.rua,
    numero: row.numero,
    complemento: row.complemento,
    codigoPostal: row.codigo_postal,
    cidade: row.cidade,
    pais: row.pais,
    estado: row.estado,
    observacoes: row.observacoes,
    alergias: row.alergias,
    medicamentos: row.medicamentos,
    historicoMedico: row.historico_medico,
    criadoEm: row.created_at,
    atualizadoEm: row.updated_at
  }));
}
async function obterUtente(id) {
  try {
    console.log("[DEBUG] obterUtente called with id:", id);
    const result = await pool.query(
      "SELECT * FROM utentes WHERE id = $1",
      [id]
    );
    console.log("[DEBUG] Query result rows:", result.rows.length);
    if (result.rows.length === 0) {
      console.log("[DEBUG] No utente found");
      return null;
    }
    const row = result.rows[0];
    const alergias = row.alergias ? row.alergias.split(",").map((a) => a.trim()).filter((a) => a) : [];
    const medicamentos = row.medicamentos ? row.medicamentos.split(",").map((m) => m.trim()).filter((m) => m) : [];
    return {
      id: row.id,
      codigo: row.codigo,
      nomeCompleto: row.nome,
      nome: row.nome,
      dataNascimento: row.data_nascimento,
      genero: row.genero,
      nif: row.nif,
      numUtenteSns: row.numero_sns,
      numeroSNS: row.numero_sns,
      estado: row.estado,
      status: row.estado,
      observacoes: row.observacoes,
      contacto: {
        telefone: row.telefone || "",
        telemovel: row.telemovel || "",
        email: row.email || "",
        telefoneEmergencia: ""
      },
      morada: {
        rua: row.rua || "",
        numero: row.numero || "",
        complemento: row.complemento || "",
        codigoPostal: row.codigo_postal || "",
        localidade: row.cidade || "",
        distrito: row.cidade || ""
      },
      infoMedica: {
        alergias,
        medicamentos,
        condicoesMedicas: [],
        classificacaoAsa: "I",
        grupoSanguineo: "",
        notasImportantes: row.historico_medico || ""
      },
      tags: [],
      criadoEm: row.created_at,
      atualizadoEm: row.updated_at
    };
  } catch (error) {
    console.error("[ERROR] obterUtente failed:", error);
    throw error;
  }
}
async function pesquisarUtentes(termo) {
  if (!termo) return await listarUtentes();
  const termoLike = `%${termo}%`;
  const result = await pool.query(
    `SELECT * FROM utentes 
     WHERE nome ILIKE $1 
        OR nif ILIKE $1 
        OR numero_sns ILIKE $1 
        OR email ILIKE $1 
        OR codigo ILIKE $1
     ORDER BY created_at DESC`,
    [termoLike]
  );
  return result.rows.map((row) => ({
    id: row.id,
    codigo: row.codigo,
    nome: row.nome,
    dataNascimento: row.data_nascimento,
    genero: row.genero,
    nif: row.nif,
    numeroSNS: row.numero_sns,
    email: row.email,
    telefone: row.telefone,
    telemovel: row.telemovel,
    estado: row.estado,
    alergias: row.alergias,
    medicamentos: row.medicamentos,
    criadoEm: row.created_at
  }));
}
async function criarUtente(dados) {
  const id = `utente-${Date.now()}`;
  const countResult = await pool.query("SELECT COUNT(*) FROM utentes");
  const count = parseInt(countResult.rows[0].count) + 1;
  const codigo = dados.codigo || `U${String(count).padStart(3, "0")}`;
  await pool.query(
    `INSERT INTO utentes (
      id, codigo, nome, data_nascimento, genero, nif, numero_sns,
      email, telefone, telemovel, rua, numero, complemento,
      codigo_postal, cidade, pais, estado, observacoes,
      alergias, medicamentos, historico_medico
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)`,
    [
      id,
      codigo,
      dados.nome,
      dados.dataNascimento,
      dados.genero,
      dados.nif,
      dados.numeroSNS,
      dados.email,
      dados.telefone,
      dados.telemovel,
      dados.rua,
      dados.numero,
      dados.complemento,
      dados.codigoPostal,
      dados.cidade,
      dados.pais || "Portugal",
      dados.estado || "ativo",
      dados.observacoes,
      dados.alergias,
      dados.medicamentos,
      dados.historicoMedico
    ]
  );
  return await obterUtente(id);
}
async function atualizarUtente(id, dados) {
  await pool.query(
    `UPDATE utentes SET
      nome = $1, data_nascimento = $2, genero = $3, nif = $4,
      numero_sns = $5, email = $6, telefone = $7, telemovel = $8,
      rua = $9, numero = $10, complemento = $11, codigo_postal = $12,
      cidade = $13, pais = $14, estado = $15, observacoes = $16,
      alergias = $17, medicamentos = $18, historico_medico = $19,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $20`,
    [
      dados.nome,
      dados.dataNascimento,
      dados.genero,
      dados.nif,
      dados.numeroSNS,
      dados.email,
      dados.telefone,
      dados.telemovel,
      dados.rua,
      dados.numero,
      dados.complemento,
      dados.codigoPostal,
      dados.cidade,
      dados.pais,
      dados.estado,
      dados.observacoes,
      dados.alergias,
      dados.medicamentos,
      dados.historicoMedico,
      id
    ]
  );
  return await obterUtente(id);
}
async function removerUtente(id) {
  await pool.query("DELETE FROM utentes WHERE id = $1", [id]);
  return { sucesso: true };
}
async function obterEstatisticasUtentes() {
  const result = await pool.query(`
    SELECT 
      COUNT(*) as total,
      COUNT(*) FILTER (WHERE estado = 'ativo') as ativos,
      COUNT(*) FILTER (WHERE estado = 'inativo') as inativos,
      COUNT(*) FILTER (WHERE estado = 'arquivado') as arquivados
    FROM utentes
  `);
  const row = result.rows[0];
  return {
    total: parseInt(row.total),
    ativos: parseInt(row.ativos),
    inativos: parseInt(row.inativos),
    arquivados: parseInt(row.arquivados)
  };
}
async function listarConsultas() {
  const result = await pool.query(`
    SELECT c.*, 
           u.nome as utente_nome,
           d.nome as dentista_nome
    FROM consultas c
    LEFT JOIN utentes u ON c.utente_id = u.id
    LEFT JOIN dentistas d ON c.dentista_id = d.id
    ORDER BY c.data_hora DESC
  `);
  return result.rows.map((row) => ({
    id: row.id,
    utenteId: row.utente_id,
    utenteNome: row.utente_nome,
    dentistaId: row.dentista_id,
    dentistaNome: row.dentista_nome,
    dataHora: row.data_hora,
    duracao: row.duracao,
    tipo: row.tipo,
    status: row.status,
    observacoes: row.observacoes,
    valor: row.valor ? parseFloat(row.valor) : null,
    criadoEm: row.created_at
  }));
}
async function obterConsulta(id) {
  const result = await pool.query(
    "SELECT * FROM consultas WHERE id = $1",
    [id]
  );
  if (result.rows.length === 0) return null;
  const row = result.rows[0];
  return {
    id: row.id,
    utenteId: row.utente_id,
    dentistaId: row.dentista_id,
    dataHora: row.data_hora,
    duracao: row.duracao,
    tipo: row.tipo,
    status: row.status,
    observacoes: row.observacoes,
    valor: row.valor ? parseFloat(row.valor) : null
  };
}
async function criarConsulta(dados) {
  const id = `consulta-${Date.now()}`;
  await pool.query(
    `INSERT INTO consultas (id, utente_id, dentista_id, data_hora, duracao, tipo, status, observacoes, valor)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [
      id,
      dados.utenteId,
      dados.dentistaId,
      dados.dataHora,
      dados.duracao || 30,
      dados.tipo,
      dados.status || "agendada",
      dados.observacoes,
      dados.valor
    ]
  );
  return await obterConsulta(id);
}
async function atualizarConsulta(id, dados) {
  const campos = [];
  const valores = [];
  let paramIndex = 1;
  if (dados.utenteId !== void 0) {
    campos.push(`utente_id = $${paramIndex++}`);
    valores.push(dados.utenteId);
  }
  if (dados.medicoId !== void 0) {
    campos.push(`dentista_id = $${paramIndex++}`);
    valores.push(dados.medicoId);
  }
  if (dados.dataHora !== void 0) {
    campos.push(`data_hora = $${paramIndex++}`);
    valores.push(dados.dataHora);
  }
  if (dados.duracao !== void 0) {
    campos.push(`duracao = $${paramIndex++}`);
    valores.push(dados.duracao);
  }
  if (dados.tipoConsulta !== void 0) {
    campos.push(`tipo = $${paramIndex++}`);
    valores.push(dados.tipoConsulta);
  }
  if (dados.procedimento !== void 0) {
    campos.push(`procedimento = $${paramIndex++}`);
    valores.push(dados.procedimento);
  }
  if (dados.status !== void 0) {
    campos.push(`status = $${paramIndex++}`);
    valores.push(dados.status);
  }
  if (dados.observacoes !== void 0) {
    campos.push(`observacoes = $${paramIndex++}`);
    valores.push(dados.observacoes);
  }
  if (dados.valorEstimado !== void 0) {
    campos.push(`valor = $${paramIndex++}`);
    valores.push(dados.valorEstimado);
  }
  if (dados.classificacaoRisco !== void 0) {
    campos.push(`classificacao_risco = $${paramIndex++}`);
    valores.push(dados.classificacaoRisco);
  }
  if (campos.length === 0) {
    return await obterConsulta(id);
  }
  campos.push(`updated_at = CURRENT_TIMESTAMP`);
  valores.push(id);
  const query = `UPDATE consultas SET ${campos.join(", ")} WHERE id = $${paramIndex}`;
  await pool.query(query, valores);
  return await obterConsulta(id);
}
async function removerConsulta(id) {
  await pool.query("DELETE FROM consultas WHERE id = $1", [id]);
  return { sucesso: true };
}
async function listarDentistas() {
  const result = await pool.query(
    "SELECT * FROM dentistas ORDER BY nome"
  );
  return result.rows.map((row) => ({
    id: row.id,
    nome: row.nome,
    especialidade: row.especialidade,
    numeroOrdem: row.numero_ordem,
    email: row.email,
    telefone: row.telefone,
    telemovel: row.telemovel,
    ativo: row.ativo,
    corAgenda: row.cor_agenda,
    observacoes: row.observacoes,
    criadoEm: row.created_at
  }));
}
async function obterDentista(id) {
  const result = await pool.query(
    "SELECT * FROM dentistas WHERE id = $1",
    [id]
  );
  if (result.rows.length === 0) return null;
  const row = result.rows[0];
  return {
    id: row.id,
    nome: row.nome,
    especialidade: row.especialidade,
    numeroOrdem: row.numero_ordem,
    email: row.email,
    telefone: row.telefone,
    telemovel: row.telemovel,
    ativo: row.ativo,
    corAgenda: row.cor_agenda,
    observacoes: row.observacoes
  };
}
async function criarDentista(dados) {
  const id = `dentista-${Date.now()}`;
  await pool.query(
    `INSERT INTO dentistas (id, nome, especialidade, numero_ordem, email, telefone, telemovel, ativo, cor_agenda, observacoes)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
    [
      id,
      dados.nome,
      dados.especialidade,
      dados.numeroOrdem,
      dados.email,
      dados.telefone,
      dados.telemovel,
      dados.ativo !== false,
      dados.corAgenda,
      dados.observacoes
    ]
  );
  return await obterDentista(id);
}
async function atualizarDentista(id, dados) {
  await pool.query(
    `UPDATE dentistas SET
      nome = $1, especialidade = $2, numero_ordem = $3, email = $4,
      telefone = $5, telemovel = $6, ativo = $7, cor_agenda = $8,
      observacoes = $9, updated_at = CURRENT_TIMESTAMP
    WHERE id = $10`,
    [
      dados.nome,
      dados.especialidade,
      dados.numeroOrdem,
      dados.email,
      dados.telefone,
      dados.telemovel,
      dados.ativo,
      dados.corAgenda,
      dados.observacoes,
      id
    ]
  );
  return await obterDentista(id);
}
async function removerDentista(id) {
  await pool.query("DELETE FROM dentistas WHERE id = $1", [id]);
  return { sucesso: true };
}
async function listarFormasPagamento() {
  const result = await pool.query(
    "SELECT * FROM formas_pagamento WHERE ativo = true ORDER BY nome"
  );
  return result.rows.map((row) => ({
    id: row.id,
    nome: row.nome,
    ativo: row.ativo,
    criadoEm: row.created_at
  }));
}
async function criarFormaPagamento(dados) {
  const id = `fp-${Date.now()}`;
  await pool.query(
    "INSERT INTO formas_pagamento (id, nome, ativo) VALUES ($1, $2, $3)",
    [id, dados.nome, dados.ativo !== false]
  );
  const result = await pool.query(
    "SELECT * FROM formas_pagamento WHERE id = $1",
    [id]
  );
  return result.rows[0];
}
async function listarCategoriasDespesa() {
  const result = await pool.query(
    "SELECT * FROM categorias_despesa WHERE ativo = true ORDER BY nome"
  );
  return result.rows.map((row) => ({
    id: row.id,
    nome: row.nome,
    descricao: row.descricao,
    ativo: row.ativo,
    criadoEm: row.created_at
  }));
}
async function criarCategoriaDespesa(dados) {
  const id = `cat-${Date.now()}`;
  await pool.query(
    "INSERT INTO categorias_despesa (id, nome, descricao, ativo) VALUES ($1, $2, $3, $4)",
    [id, dados.nome, dados.descricao, dados.ativo !== false]
  );
  const result = await pool.query(
    "SELECT * FROM categorias_despesa WHERE id = $1",
    [id]
  );
  return result.rows[0];
}
async function listarFornecedores() {
  const result = await pool.query(
    "SELECT * FROM fornecedores WHERE ativo = true ORDER BY nome"
  );
  return result.rows.map((row) => ({
    id: row.id,
    nome: row.nome,
    nif: row.nif,
    email: row.email,
    telefone: row.telefone,
    rua: row.rua,
    cidade: row.cidade,
    codigoPostal: row.codigo_postal,
    pais: row.pais,
    ativo: row.ativo,
    criadoEm: row.created_at
  }));
}
async function criarFornecedor(dados) {
  const id = `fornecedor-${Date.now()}`;
  await pool.query(
    `INSERT INTO fornecedores (id, nome, nif, email, telefone, rua, cidade, codigo_postal, pais, ativo)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
    [
      id,
      dados.nome,
      dados.nif,
      dados.email,
      dados.telefone,
      dados.rua,
      dados.cidade,
      dados.codigoPostal,
      dados.pais || "Portugal",
      dados.ativo !== false
    ]
  );
  const result = await pool.query(
    "SELECT * FROM fornecedores WHERE id = $1",
    [id]
  );
  return result.rows[0];
}
async function obterConfigComissao(dentistaId) {
  const result = await pool.query(
    "SELECT * FROM config_comissoes WHERE dentista_id = $1",
    [dentistaId]
  );
  if (result.rows.length === 0) {
    return {
      dentistaId,
      percentual: 0,
      ativo: false
    };
  }
  const row = result.rows[0];
  return {
    id: row.id,
    dentistaId: row.dentista_id,
    percentual: parseFloat(row.percentual),
    ativo: row.ativo
  };
}
async function salvarConfigComissao(dentistaId, config) {
  await pool.query(
    `INSERT INTO config_comissoes (id, dentista_id, percentual, ativo)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (dentista_id) DO UPDATE SET
       percentual = EXCLUDED.percentual,
       ativo = EXCLUDED.ativo,
       updated_at = CURRENT_TIMESTAMP`,
    [`config-comissao-${dentistaId}`, dentistaId, config.percentual, config.ativo !== false]
  );
  return await obterConfigComissao(dentistaId);
}
async function listarComissoes() {
  const result = await pool.query(`
    SELECT c.*, d.nome as dentista_nome
    FROM comissoes c
    LEFT JOIN dentistas d ON c.dentista_id = d.id
    ORDER BY c.created_at DESC
  `);
  return result.rows.map((row) => ({
    id: row.id,
    dentistaId: row.dentista_id,
    dentistaNome: row.dentista_nome,
    faturaId: row.fatura_id,
    valor: parseFloat(row.valor),
    percentual: parseFloat(row.percentual),
    status: row.status,
    dataPagamento: row.data_pagamento,
    formaPagamento: row.forma_pagamento,
    observacoes: row.observacoes,
    criadoEm: row.created_at
  }));
}
async function obterComissao(id) {
  const result = await pool.query(
    "SELECT * FROM comissoes WHERE id = $1",
    [id]
  );
  if (result.rows.length === 0) return null;
  const row = result.rows[0];
  return {
    id: row.id,
    dentistaId: row.dentista_id,
    faturaId: row.fatura_id,
    valor: parseFloat(row.valor),
    percentual: parseFloat(row.percentual),
    status: row.status
  };
}
async function listarComissoesDentista(dentistaId, filtros) {
  const result = await pool.query(
    "SELECT * FROM comissoes WHERE dentista_id = $1 ORDER BY created_at DESC",
    [dentistaId]
  );
  return result.rows.map((row) => ({
    id: row.id,
    dentistaId: row.dentista_id,
    faturaId: row.fatura_id,
    valor: parseFloat(row.valor),
    percentual: parseFloat(row.percentual),
    status: row.status,
    dataPagamento: row.data_pagamento,
    criadoEm: row.created_at
  }));
}
async function criarComissao(dados) {
  const id = `comissao-${Date.now()}`;
  await pool.query(
    `INSERT INTO comissoes (id, dentista_id, fatura_id, valor, percentual, status)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [id, dados.dentistaId, dados.faturaId, dados.valor, dados.percentual, "pendente"]
  );
  return await obterComissao(id);
}
async function pagarComissao(id, formaPagamento, observacoes) {
  await pool.query(
    `UPDATE comissoes SET
      status = 'paga',
      forma_pagamento = $1,
      observacoes = $2,
      data_pagamento = CURRENT_DATE,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $3`,
    [formaPagamento, observacoes, id]
  );
  return await obterComissao(id);
}
async function obterResumoFinanceiroDentista(dentistaId, periodo) {
  const result = await pool.query(`
    SELECT 
      SUM(valor) FILTER (WHERE status = 'pendente') as total_pendente,
      SUM(valor) FILTER (WHERE status = 'paga') as total_pago,
      COUNT(*) FILTER (WHERE status = 'pendente') as qtd_pendente,
      COUNT(*) FILTER (WHERE status = 'paga') as qtd_paga
    FROM comissoes
    WHERE dentista_id = $1
  `, [dentistaId]);
  const row = result.rows[0];
  return {
    totalPendente: parseFloat(row.total_pendente || 0),
    totalPago: parseFloat(row.total_pago || 0),
    totalComissoes: parseFloat(row.total_pendente || 0) + parseFloat(row.total_pago || 0),
    quantidadePendente: parseInt(row.qtd_pendente || 0),
    quantidadePaga: parseInt(row.qtd_paga || 0)
  };
}
async function listarLaboratorios() {
  const result = await pool.query(
    "SELECT * FROM laboratorios WHERE ativo = true ORDER BY nome"
  );
  return result.rows.map((row) => ({
    id: row.id,
    nome: row.nome,
    responsavel: row.responsavel,
    email: row.email,
    telefone: row.telefone,
    rua: row.rua,
    cidade: row.cidade,
    codigoPostal: row.codigo_postal,
    ativo: row.ativo,
    criadoEm: row.created_at
  }));
}
async function obterLaboratorio(id) {
  const result = await pool.query(
    "SELECT * FROM laboratorios WHERE id = $1",
    [id]
  );
  if (result.rows.length === 0) return null;
  const row = result.rows[0];
  return {
    id: row.id,
    nome: row.nome,
    responsavel: row.responsavel,
    email: row.email,
    telefone: row.telefone,
    rua: row.rua,
    cidade: row.cidade,
    codigoPostal: row.codigo_postal,
    ativo: row.ativo
  };
}
async function criarLaboratorio(dados) {
  const id = `laboratorio-${Date.now()}`;
  await pool.query(
    `INSERT INTO laboratorios (id, nome, responsavel, email, telefone, rua, cidade, codigo_postal, ativo)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [
      id,
      dados.nome,
      dados.responsavel,
      dados.email,
      dados.telefone,
      dados.rua,
      dados.cidade,
      dados.codigoPostal,
      dados.ativo !== false
    ]
  );
  return await obterLaboratorio(id);
}
async function atualizarLaboratorio(id, dados) {
  await pool.query(
    `UPDATE laboratorios SET
      nome = $1, responsavel = $2, email = $3, telefone = $4,
      rua = $5, cidade = $6, codigo_postal = $7, ativo = $8,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $9`,
    [
      dados.nome,
      dados.responsavel,
      dados.email,
      dados.telefone,
      dados.rua,
      dados.cidade,
      dados.codigoPostal,
      dados.ativo,
      id
    ]
  );
  return await obterLaboratorio(id);
}
async function removerLaboratorio(id) {
  await pool.query("DELETE FROM laboratorios WHERE id = $1", [id]);
  return { sucesso: true };
}
async function excluirLaboratorio(id) {
  return await removerLaboratorio(id);
}
async function listarTrabalhosLaboratorio(filtros) {
  const result = await pool.query(`
    SELECT t.*, l.nome as laboratorio_nome, u.nome as utente_nome, d.nome as dentista_nome
    FROM trabalhos_laboratorio t
    LEFT JOIN laboratorios l ON t.laboratorio_id = l.id
    LEFT JOIN utentes u ON t.utente_id = u.id
    LEFT JOIN dentistas d ON t.dentista_id = d.id
    ORDER BY t.created_at DESC
  `);
  return result.rows.map((row) => ({
    id: row.id,
    laboratorioId: row.laboratorio_id,
    laboratorioNome: row.laboratorio_nome,
    utenteId: row.utente_id,
    utenteNome: row.utente_nome,
    dentistaId: row.dentista_id,
    dentistaNome: row.dentista_nome,
    tipoTrabalho: row.tipo_trabalho,
    descricao: row.descricao,
    dataEnvio: row.data_envio,
    dataPrevistaEntrega: row.data_prevista_entrega,
    dataEntrega: row.data_entrega,
    status: row.status,
    valor: row.valor ? parseFloat(row.valor) : null,
    observacoes: row.observacoes,
    criadoEm: row.created_at
  }));
}
async function obterTrabalhoLaboratorio(id) {
  const result = await pool.query(
    "SELECT * FROM trabalhos_laboratorio WHERE id = $1",
    [id]
  );
  if (result.rows.length === 0) return null;
  const row = result.rows[0];
  return {
    id: row.id,
    laboratorioId: row.laboratorio_id,
    utenteId: row.utente_id,
    dentistaId: row.dentista_id,
    tipoTrabalho: row.tipo_trabalho,
    descricao: row.descricao,
    dataEnvio: row.data_envio,
    dataPrevistaEntrega: row.data_prevista_entrega,
    dataEntrega: row.data_entrega,
    status: row.status,
    valor: row.valor ? parseFloat(row.valor) : null,
    observacoes: row.observacoes
  };
}
async function criarTrabalhoLaboratorio(dados) {
  const id = `trabalho-lab-${Date.now()}`;
  await pool.query(
    `INSERT INTO trabalhos_laboratorio 
     (id, laboratorio_id, utente_id, dentista_id, tipo_trabalho, descricao, 
      data_envio, data_prevista_entrega, status, valor, observacoes)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
    [
      id,
      dados.laboratorioId,
      dados.utenteId,
      dados.dentistaId,
      dados.tipoTrabalho,
      dados.descricao,
      dados.dataEnvio,
      dados.dataPrevistaEntrega,
      "enviado",
      dados.valor,
      dados.observacoes
    ]
  );
  return await obterTrabalhoLaboratorio(id);
}
async function atualizarTrabalhoLaboratorio(id, dados) {
  await pool.query(
    `UPDATE trabalhos_laboratorio SET
      tipo_trabalho = $1, descricao = $2, data_envio = $3,
      data_prevista_entrega = $4, data_entrega = $5, status = $6,
      valor = $7, observacoes = $8, updated_at = CURRENT_TIMESTAMP
    WHERE id = $9`,
    [
      dados.tipoTrabalho,
      dados.descricao,
      dados.dataEnvio,
      dados.dataPrevistaEntrega,
      dados.dataEntrega,
      dados.status,
      dados.valor,
      dados.observacoes,
      id
    ]
  );
  return await obterTrabalhoLaboratorio(id);
}
async function excluirTrabalhoLaboratorio(id) {
  await pool.query("DELETE FROM trabalhos_laboratorio WHERE id = $1", [id]);
  return { sucesso: true };
}
async function listarContasPagar() {
  const result = await pool.query(`
    SELECT c.*, f.nome as fornecedor_nome, cat.nome as categoria_nome
    FROM contas_pagar c
    LEFT JOIN fornecedores f ON c.fornecedor_id = f.id
    LEFT JOIN categorias_despesa cat ON c.categoria_id = cat.id
    ORDER BY c.data_vencimento DESC
  `);
  return result.rows.map((row) => ({
    id: row.id,
    fornecedorId: row.fornecedor_id,
    fornecedorNome: row.fornecedor_nome,
    categoriaId: row.categoria_id,
    categoriaNome: row.categoria_nome,
    descricao: row.descricao,
    valor: parseFloat(row.valor),
    dataVencimento: row.data_vencimento,
    dataPagamento: row.data_pagamento,
    status: row.status,
    formaPagamento: row.forma_pagamento,
    observacoes: row.observacoes,
    criadoEm: row.created_at
  }));
}
async function obterContaPagar(id) {
  const result = await pool.query(
    "SELECT * FROM contas_pagar WHERE id = $1",
    [id]
  );
  if (result.rows.length === 0) return null;
  const row = result.rows[0];
  return {
    id: row.id,
    fornecedorId: row.fornecedor_id,
    categoriaId: row.categoria_id,
    descricao: row.descricao,
    valor: parseFloat(row.valor),
    dataVencimento: row.data_vencimento,
    dataPagamento: row.data_pagamento,
    status: row.status,
    formaPagamento: row.forma_pagamento,
    observacoes: row.observacoes
  };
}
async function criarContaPagar(dados) {
  const id = `conta-pagar-${Date.now()}`;
  await pool.query(
    `INSERT INTO contas_pagar 
     (id, fornecedor_id, categoria_id, descricao, valor, data_vencimento, status, observacoes)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      id,
      dados.fornecedorId,
      dados.categoriaId,
      dados.descricao,
      dados.valor,
      dados.dataVencimento,
      "pendente",
      dados.observacoes
    ]
  );
  return await obterContaPagar(id);
}
async function atualizarContaPagar(id, dados) {
  await pool.query(
    `UPDATE contas_pagar SET
      fornecedor_id = $1, categoria_id = $2, descricao = $3, valor = $4,
      data_vencimento = $5, status = $6, observacoes = $7,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $8`,
    [
      dados.fornecedorId,
      dados.categoriaId,
      dados.descricao,
      dados.valor,
      dados.dataVencimento,
      dados.status,
      dados.observacoes,
      id
    ]
  );
  return await obterContaPagar(id);
}
async function removerContaPagar(id) {
  await pool.query("DELETE FROM contas_pagar WHERE id = $1", [id]);
  return { sucesso: true };
}
async function marcarContaPaga(id) {
  await pool.query(
    `UPDATE contas_pagar SET
      status = 'paga',
      data_pagamento = CURRENT_DATE,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $1`,
    [id]
  );
  return await obterContaPagar(id);
}
async function listarFaturas() {
  const result = await pool.query(`
    SELECT f.*, u.nome as utente_nome
    FROM faturas f
    LEFT JOIN utentes u ON f.utente_id = u.id
    ORDER BY f.data_emissao DESC
  `);
  return result.rows.map((row) => ({
    id: row.id,
    numeroFatura: row.numero_fatura,
    utenteId: row.utente_id,
    utenteNome: row.utente_nome,
    dataEmissao: row.data_emissao,
    dataVencimento: row.data_vencimento,
    valorTotal: parseFloat(row.valor_total),
    valorPago: parseFloat(row.valor_pago),
    status: row.status,
    observacoes: row.observacoes,
    criadoEm: row.created_at
  }));
}
async function obterFatura(id) {
  const result = await pool.query(
    "SELECT * FROM faturas WHERE id = $1",
    [id]
  );
  if (result.rows.length === 0) return null;
  const row = result.rows[0];
  return {
    id: row.id,
    numeroFatura: row.numero_fatura,
    utenteId: row.utente_id,
    dataEmissao: row.data_emissao,
    dataVencimento: row.data_vencimento,
    valorTotal: parseFloat(row.valor_total),
    valorPago: parseFloat(row.valor_pago),
    status: row.status,
    observacoes: row.observacoes
  };
}
async function criarFatura(dados) {
  const id = `fatura-${Date.now()}`;
  const countResult = await pool.query("SELECT COUNT(*) FROM faturas");
  const count = parseInt(countResult.rows[0].count) + 1;
  const numeroFatura = dados.numeroFatura || `FT${(/* @__PURE__ */ new Date()).getFullYear()}/${String(count).padStart(5, "0")}`;
  await pool.query(
    `INSERT INTO faturas 
     (id, numero_fatura, utente_id, data_emissao, data_vencimento, valor_total, valor_pago, status, observacoes)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [
      id,
      numeroFatura,
      dados.utenteId,
      dados.dataEmissao,
      dados.dataVencimento,
      dados.valorTotal,
      dados.valorPago || 0,
      dados.status || "pendente",
      dados.observacoes
    ]
  );
  return await obterFatura(id);
}
async function atualizarFatura(id, dados) {
  await pool.query(
    `UPDATE faturas SET
      data_vencimento = $1, valor_total = $2, valor_pago = $3,
      status = $4, observacoes = $5, updated_at = CURRENT_TIMESTAMP
    WHERE id = $6`,
    [
      dados.dataVencimento,
      dados.valorTotal,
      dados.valorPago,
      dados.status,
      dados.observacoes,
      id
    ]
  );
  return await obterFatura(id);
}
async function removerFatura(id) {
  await pool.query("DELETE FROM faturas WHERE id = $1", [id]);
  return { sucesso: true };
}
async function obterDashboardFinanceiro() {
  const mesAtual = /* @__PURE__ */ new Date();
  const primeiroDiaMes = new Date(mesAtual.getFullYear(), mesAtual.getMonth(), 1);
  const ultimoDiaMes = new Date(mesAtual.getFullYear(), mesAtual.getMonth() + 1, 0);
  const receitasResult = await pool.query(
    `SELECT COALESCE(SUM(valor_pago), 0) as total
     FROM faturas
     WHERE data_emissao >= $1 AND data_emissao <= $2`,
    [primeiroDiaMes, ultimoDiaMes]
  );
  const despesasResult = await pool.query(
    `SELECT COALESCE(SUM(valor), 0) as total
     FROM contas_pagar
     WHERE data_pagamento >= $1 AND data_pagamento <= $2`,
    [primeiroDiaMes, ultimoDiaMes]
  );
  const contasPendentesResult = await pool.query(
    `SELECT COUNT(*) as total
     FROM contas_pagar
     WHERE status = 'pendente'`
  );
  const faturasResult = await pool.query(
    `SELECT COUNT(*) as total
     FROM faturas
     WHERE data_emissao >= $1 AND data_emissao <= $2`,
    [primeiroDiaMes, ultimoDiaMes]
  );
  const receitas = parseFloat(receitasResult.rows[0].total);
  const despesas = parseFloat(despesasResult.rows[0].total);
  return {
    receitasMes: receitas,
    despesasMes: despesas,
    lucroMes: receitas - despesas,
    contasPendentes: parseInt(contasPendentesResult.rows[0].total),
    faturasEmitidas: parseInt(faturasResult.rows[0].total)
  };
}
var Pool, pool;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    ({ Pool } = pg);
    pool = new Pool({
      host: "localhost",
      port: 5432,
      database: "dentcarepro",
      user: "dentcarepro",
      password: "dentcare2025",
      max: 20,
      idleTimeoutMillis: 3e4,
      connectionTimeoutMillis: 2e3,
      ssl: false
    });
    pool.on("connect", () => {
      console.log("[PostgreSQL] Connected to database");
    });
    pool.on("error", (err) => {
      console.error("[PostgreSQL] Unexpected error:", err);
    });
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
    const text = response.text();
    console.log("\u{1F4CA} [Gemini] Tamanho da resposta:", text.length);
    const analise = JSON.parse(text);
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
    let user = await getUser(sessionUserId);
    if (!user) {
      try {
        const userInfo = await this.getUserInfoWithJwt(sessionCookie ?? "");
        await upsertUser({
          id: userInfo.openId,
          name: userInfo.name || null,
          email: userInfo.email ?? null,
          loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
          lastSignedIn: signedInAt
        });
        user = await getUser(userInfo.openId);
      } catch (error) {
        console.error("[Auth] Failed to sync user from OAuth:", error);
        throw ForbiddenError("Failed to sync user info");
      }
    }
    if (!user) {
      throw ForbiddenError("User not found");
    }
    await upsertUser({
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
      await upsertUser({
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
import superjson from "superjson";
var t = initTRPC.context().create({
  transformer: superjson
});
var router = t.router;
var publicProcedure = t.procedure;
var requireUser = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  console.log("[AUTH] requireUser middleware - user:", ctx.user ? "exists" : "null");
  if (!ctx.user) {
    console.log("[AUTH] Creating demo user...");
    const demoUserId = "demo-user-001";
    let demoUser = await getUser(demoUserId);
    console.log("[AUTH] Demo user from DB:", demoUser ? "found" : "not found");
    if (!demoUser) {
      console.log("[AUTH] Upserting demo user...");
      await upsertUser({
        id: demoUserId,
        name: "Utilizador de Desenvolvimento",
        email: "demo@dentcarepro.local",
        loginMethod: "demo",
        lastSignedIn: /* @__PURE__ */ new Date()
      });
      demoUser = await getUser(demoUserId);
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
var protectedProcedure = t.procedure.use(requireUser);
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
import { z as z9 } from "zod";

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
    let faturas = [...faturasMock];
    if (input) {
      if (input.utenteId) {
        faturas = faturas.filter((f) => f.utenteId === input.utenteId);
      }
      if (input.dentista) {
        faturas = faturas.filter((f) => f.dentista.toLowerCase().includes(input.dentista.toLowerCase()));
      }
      if (input.estado) {
        faturas = faturas.filter((f) => f.estado === input.estado);
      }
      if (input.dataInicio) {
        faturas = faturas.filter((f) => f.data >= input.dataInicio);
      }
      if (input.dataFim) {
        faturas = faturas.filter((f) => f.data <= input.dataFim);
      }
      if (input.pesquisa) {
        const termo = input.pesquisa.toLowerCase();
        faturas = faturas.filter(
          (f) => f.numero.toLowerCase().includes(termo) || f.utenteNome.toLowerCase().includes(termo) || f.dentista.toLowerCase().includes(termo)
        );
      }
    }
    faturas.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
    return faturas;
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
    const faturas = faturasMock.filter(
      (f) => f.data >= input.dataInicio && f.data <= input.dataFim
    );
    const receitaTotal = faturas.reduce((sum, f) => sum + f.total, 0);
    const receitaPaga = faturas.filter((f) => f.estado === "paga").reduce((sum, f) => sum + f.total, 0);
    const receitaPendente = faturas.filter((f) => f.estado === "pendente" || f.estado === "parcial").reduce((sum, f) => sum + f.valorEmDivida, 0);
    const totalFaturas = faturas.length;
    const faturasPagas = faturas.filter((f) => f.estado === "paga").length;
    const faturasPendentes = faturas.filter((f) => f.estado === "pendente").length;
    const faturasVencidas = faturas.filter((f) => f.estado === "vencida").length;
    const faturasAnuladas = faturas.filter((f) => f.estado === "anulada").length;
    const ticketMedio = totalFaturas > 0 ? receitaTotal / totalFaturas : 0;
    const pagamentosPorMetodo = /* @__PURE__ */ new Map();
    faturas.forEach((f) => {
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
    faturas.forEach((f) => {
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
    const { listarDentistas: listarDentistas2 } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await listarDentistas2();
  }),
  // Obter dentista por ID
  obter: protectedProcedure.input(z3.object({ id: z3.string() })).query(async ({ input }) => {
    const { obterDentista: obterDentista2 } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await obterDentista2(input.id);
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
    const { criarDentista: criarDentista2 } = await Promise.resolve().then(() => (init_db(), db_exports));
    const dados = {
      ...input,
      especialidades: JSON.stringify(input.especialidades),
      horarioTrabalho: input.horarioTrabalho ? JSON.stringify(input.horarioTrabalho) : null,
      competencias: input.competencias ? JSON.stringify(input.competencias) : null,
      idiomas: input.idiomas ? JSON.stringify(input.idiomas) : null
    };
    return await criarDentista2(dados);
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
    const { atualizarDentista: atualizarDentista2 } = await Promise.resolve().then(() => (init_db(), db_exports));
    const dados = { ...input.dados };
    if (dados.especialidades) dados.especialidades = JSON.stringify(dados.especialidades);
    if (dados.horarioTrabalho) dados.horarioTrabalho = JSON.stringify(dados.horarioTrabalho);
    if (dados.competencias) dados.competencias = JSON.stringify(dados.competencias);
    if (dados.idiomas) dados.idiomas = JSON.stringify(dados.idiomas);
    return await atualizarDentista2(input.id, dados);
  }),
  // Remover dentista
  remover: protectedProcedure.input(z3.object({ id: z3.string() })).mutation(async ({ input }) => {
    const { removerDentista: removerDentista2 } = await Promise.resolve().then(() => (init_db(), db_exports));
    await removerDentista2(input.id);
    return { sucesso: true };
  }),
  // Obter configuração de comissão
  obterConfigComissao: protectedProcedure.input(z3.object({ dentistaId: z3.string() })).query(async ({ input }) => {
    const { obterConfigComissao: obterConfigComissao2 } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await obterConfigComissao2(input.dentistaId);
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
    const { salvarConfigComissao: salvarConfigComissao2 } = await Promise.resolve().then(() => (init_db(), db_exports));
    const dados = {
      ...input,
      configuracao: JSON.stringify(input.configuracao),
      diasPagamento: input.diasPagamento ? JSON.stringify(input.diasPagamento) : null
    };
    return await salvarConfigComissao2(dados);
  }),
  // Listar comissões do dentista
  listarComissoes: protectedProcedure.input(
    z3.object({
      dentistaId: z3.string(),
      mes: z3.string().optional()
      // Formato: YYYY-MM
    })
  ).query(async ({ input }) => {
    const { listarComissoesDentista: listarComissoesDentista2 } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await listarComissoesDentista2(input.dentistaId, input.mes);
  }),
  // Obter resumo financeiro do dentista
  resumoFinanceiro: protectedProcedure.input(
    z3.object({
      dentistaId: z3.string(),
      mes: z3.string()
      // Formato: YYYY-MM
    })
  ).query(async ({ input }) => {
    const { obterResumoFinanceiroDentista: obterResumoFinanceiroDentista2 } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await obterResumoFinanceiroDentista2(input.dentistaId, input.mes);
  }),
  // Pagar comissão
  pagarComissao: protectedProcedure.input(
    z3.object({
      id: z3.string(),
      formaPagamento: z3.string(),
      referencia: z3.string().optional()
    })
  ).mutation(async ({ input }) => {
    const { pagarComissao: pagarComissao2 } = await Promise.resolve().then(() => (init_db(), db_exports));
    await pagarComissao2(input.id, input.formaPagamento, input.referencia);
    return { sucesso: true };
  })
});

// server/routers/configuracoes.ts
import { z as z4 } from "zod";
var configuracoesRouter = router({
  // Obter configurações da clínica
  obter: protectedProcedure.query(async () => {
    const { obterConfigClinica: obterConfigClinica2 } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await obterConfigClinica2();
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
    const { salvarConfigClinica: salvarConfigClinica2 } = await Promise.resolve().then(() => (init_db(), db_exports));
    const dados = {
      ...input,
      redesSociais: input.redesSociais ? JSON.stringify(input.redesSociais) : null,
      morada: JSON.stringify(input.morada),
      especialidades: input.especialidades ? JSON.stringify(input.especialidades) : null,
      horarioFuncionamento: input.horarioFuncionamento ? JSON.stringify(input.horarioFuncionamento) : null,
      paletaCores: input.paletaCores ? JSON.stringify(input.paletaCores) : null,
      papelTimbrado: input.papelTimbrado ? JSON.stringify(input.papelTimbrado) : null
    };
    return await salvarConfigClinica2(dados);
  }),
  // Listar formas de pagamento
  listarFormasPagamento: protectedProcedure.query(async () => {
    const { listarFormasPagamento: listarFormasPagamento2 } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await listarFormasPagamento2();
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
    const { criarFormaPagamento: criarFormaPagamento2 } = await Promise.resolve().then(() => (init_db(), db_exports));
    const dados = {
      ...input,
      taxa: input.taxa ? JSON.stringify(input.taxa) : null,
      integracao: input.integracao ? JSON.stringify(input.integracao) : null
    };
    return await criarFormaPagamento2(dados);
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
    const { listarCategoriasDespesa: listarCategoriasDespesa2 } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await listarCategoriasDespesa2(input);
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
    const { criarCategoriaDespesa: criarCategoriaDespesa2 } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await criarCategoriaDespesa2(input);
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
    const { listarFornecedores: listarFornecedores2 } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await listarFornecedores2(input);
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
    const { criarFornecedor: criarFornecedor2 } = await Promise.resolve().then(() => (init_db(), db_exports));
    return await criarFornecedor2(input);
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
    const comissoes = await listarComissoesDentista(input.dentistaId);
    const resumo = {
      totalPendente: 0,
      totalPago: 0,
      totalCancelado: 0,
      quantidadePendente: 0,
      quantidadePago: 0,
      quantidadeCancelado: 0
    };
    comissoes.forEach((c) => {
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
    return await listarTrabalhosLaboratorio(input);
  }),
  /**
   * Obter trabalho por ID
   */
  obterTrabalho: publicProcedure.input(z6.object({ id: z6.string() })).query(async ({ input }) => {
    const trabalho = await obterTrabalhoLaboratorio(input.id);
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
    return await criarTrabalhoLaboratorio(input);
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
    return await atualizarTrabalhoLaboratorio(id, data);
  }),
  /**
   * Excluir trabalho de laboratório
   */
  excluirTrabalho: publicProcedure.input(z6.object({ id: z6.string() })).mutation(async ({ input }) => {
    await excluirTrabalhoLaboratorio(input.id);
    return { success: true };
  }),
  /**
   * Estatísticas de laboratório
   */
  estatisticas: publicProcedure.input(z6.object({ laboratorioId: z6.string() })).query(async ({ input }) => {
    const trabalhos = await listarTrabalhosLaboratorio({
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
    return await listarContasPagar();
  }),
  /**
   * Obter conta por ID
   */
  obter: publicProcedure.input(z7.object({ id: z7.string() })).query(async ({ input }) => {
    const conta = await obterContaPagar(input.id);
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
    return await criarContaPagar({
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
    return await atualizarContaPagar(id, updateData);
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
    const conta = await obterContaPagar(input.id);
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
    const despesas = await listarContasPagar();
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
    const despesas = await listarContasPagar();
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
    const despesas = await listarContasPagar();
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
      const despesas = await listarContasPagar();
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
    const despesas = await listarContasPagar();
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

// server/routers.ts
var appRouter = router({
  system: systemRouter,
  auth: router({
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
    obter: protectedProcedure.input(z9.object({ id: z9.string() })).query(async ({ input }) => {
      const { obterUtente: obterUtente2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      return await obterUtente2(input.id);
    }),
    // Pesquisar utentes
    pesquisar: protectedProcedure.input(z9.object({ termo: z9.string() })).query(async ({ input }) => {
      const { pesquisarUtentes: pesquisarUtentes2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      return await pesquisarUtentes2(input.termo);
    }),
    // Criar novo utente
    criar: protectedProcedure.input(
      z9.object({
        nomeCompleto: z9.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
        dataNascimento: z9.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inv\xE1lida (use YYYY-MM-DD)"),
        genero: z9.enum(["M", "F", "Outro"]),
        nif: z9.string().length(9, "NIF deve ter 9 d\xEDgitos").optional(),
        numUtenteSns: z9.string().length(9).optional(),
        fotoPerfil: z9.string().optional(),
        contacto: z9.object({
          telemovel: z9.string().min(1, "Telem\xF3vel/WhatsApp \xE9 obrigat\xF3rio"),
          telefone: z9.string().optional(),
          email: z9.string().email("Email inv\xE1lido").optional(),
          telefoneEmergencia: z9.string().optional()
        }),
        morada: z9.object({
          rua: z9.string().optional(),
          numero: z9.string().optional(),
          codigoPostal: z9.string().regex(/^\d{4}-\d{3}$/, "C\xF3digo postal inv\xE1lido").optional(),
          localidade: z9.string().optional(),
          distrito: z9.string().optional()
        }).optional(),
        infoMedica: z9.object({
          alergias: z9.array(z9.string()),
          medicamentos: z9.array(z9.string()),
          condicoesMedicas: z9.array(z9.string()),
          classificacaoAsa: z9.enum(["I", "II", "III", "IV", "V", "VI"]),
          grupoSanguineo: z9.string().optional(),
          notasImportantes: z9.string().optional()
        }),
        tags: z9.array(z9.string()).optional()
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
      z9.object({
        id: z9.string(),
        dados: z9.object({
          nomeCompleto: z9.string().min(3).optional(),
          dataNascimento: z9.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
          genero: z9.enum(["M", "F", "Outro"]).optional(),
          nif: z9.string().length(9).optional(),
          numUtenteSns: z9.string().length(9).optional(),
          fotoPerfil: z9.string().optional(),
          contacto: z9.object({
            telemovel: z9.string().min(1, "Telem\xF3vel/WhatsApp \xE9 obrigat\xF3rio"),
            telefone: z9.string().optional(),
            email: z9.string().email().optional(),
            telefoneEmergencia: z9.string().optional()
          }).optional(),
          morada: z9.object({
            rua: z9.string(),
            numero: z9.string(),
            codigoPostal: z9.string().regex(/^\d{4}-\d{3}$/),
            localidade: z9.string(),
            distrito: z9.string()
          }).optional(),
          infoMedica: z9.object({
            alergias: z9.array(z9.string()),
            medicamentos: z9.array(z9.string()),
            condicoesMedicas: z9.array(z9.string()),
            classificacaoAsa: z9.enum(["I", "II", "III", "IV", "V", "VI"]),
            grupoSanguineo: z9.string().optional(),
            notasImportantes: z9.string().optional()
          }).optional(),
          status: z9.enum(["ativo", "inativo", "arquivado"]).optional(),
          tags: z9.array(z9.string()).optional()
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
    remover: protectedProcedure.input(z9.object({ id: z9.string() })).mutation(async ({ input }) => {
      const { removerUtente: removerUtente2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      await removerUtente2(input.id);
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
      z9.object({
        utenteId: z9.string(),
        sintomas: z9.string()
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
      z9.object({
        utenteId: z9.string(),
        medicamento: z9.string(),
        dosagem: z9.string()
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
      z9.object({
        notasConsulta: z9.string(),
        tratamentosRealizados: z9.array(z9.string()).optional(),
        proximaConsulta: z9.string().optional()
      })
    ).mutation(async ({ input }) => {
      const { gerarResumoConsulta: gerarResumoConsulta2 } = await Promise.resolve().then(() => (init_ai_helper(), ai_helper_exports));
      return await gerarResumoConsulta2(input);
    }),
    // Análise de Risco
    analisarRisco: protectedProcedure.input(z9.object({ utenteId: z9.string() })).mutation(async ({ input }) => {
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
      z9.object({
        utenteId: z9.string(),
        pergunta: z9.string()
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
      z9.object({
        imagemBase64: z9.string(),
        tipoImagem: z9.string(),
        contexto: z9.string().optional()
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
  // CONSULTAS
  // ========================================
  consultas: router({
    // Listar todas as consultas
    listar: protectedProcedure.query(async () => {
      const { listarConsultas: listarConsultas2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      return await listarConsultas2();
    }),
    // Obter consulta por ID
    obter: protectedProcedure.input(z9.object({ id: z9.string() })).query(async ({ input }) => {
      const { obterConsulta: obterConsulta2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      return await obterConsulta2(input.id);
    }),
    // Criar nova consulta
    criar: protectedProcedure.input(
      z9.object({
        utenteId: z9.string(),
        medicoId: z9.string().optional().nullable(),
        dataHora: z9.string(),
        duracao: z9.number().optional(),
        tipoConsulta: z9.string().optional().nullable(),
        procedimento: z9.string().optional().nullable(),
        status: z9.enum(["agendada", "confirmada", "realizada", "cancelada", "faltou", "em_atendimento"]).optional(),
        observacoes: z9.string().optional().nullable(),
        valorEstimado: z9.number().optional().nullable(),
        classificacaoRisco: z9.string().optional().nullable()
      })
    ).mutation(async ({ input }) => {
      const { criarConsulta: criarConsulta2, verificarConflito } = await Promise.resolve().then(() => (init_db(), db_exports));
      if (input.medicoId) {
        const temConflito = await verificarConflito(
          input.medicoId,
          input.dataHora,
          input.duracao || 30
        );
        if (temConflito) {
          throw new Error("J\xE1 existe uma consulta agendada para este m\xE9dico neste hor\xE1rio");
        }
      }
      return await criarConsulta2(input);
    }),
    // Atualizar consulta
    atualizar: protectedProcedure.input(
      z9.object({
        id: z9.string(),
        utenteId: z9.string().optional(),
        medicoId: z9.string().optional().nullable(),
        dataHora: z9.string().optional(),
        duracao: z9.number().optional(),
        tipoConsulta: z9.string().optional().nullable(),
        procedimento: z9.string().optional().nullable(),
        status: z9.enum(["agendada", "confirmada", "realizada", "cancelada", "faltou", "em_atendimento"]).optional(),
        observacoes: z9.string().optional().nullable(),
        valorEstimado: z9.number().optional().nullable(),
        classificacaoRisco: z9.string().optional().nullable()
      })
    ).mutation(async ({ input }) => {
      const { atualizarConsulta: atualizarConsulta2, verificarConflito, obterConsulta: obterConsulta2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      if (input.medicoId || input.dataHora || input.duracao) {
        const consultaAtual = await obterConsulta2(input.id);
        const medicoId = input.medicoId !== void 0 ? input.medicoId : consultaAtual.medicoId;
        const dataHora = input.dataHora || consultaAtual.dataHora;
        const duracao = input.duracao || consultaAtual.duracao;
        if (medicoId) {
          const temConflito = await verificarConflito(
            medicoId,
            dataHora,
            duracao,
            input.id
          );
          if (temConflito) {
            throw new Error("J\xE1 existe uma consulta agendada para este m\xE9dico neste hor\xE1rio");
          }
        }
      }
      const { id, ...dados } = input;
      return await atualizarConsulta2(id, dados);
    }),
    // Remover consulta
    remover: protectedProcedure.input(z9.object({ id: z9.string() })).mutation(async ({ input }) => {
      const { removerConsulta: removerConsulta2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      await removerConsulta2(input.id);
      return { success: true };
    }),
    // Listar consultas por data
    listarPorData: protectedProcedure.input(z9.object({ data: z9.string() })).query(async ({ input }) => {
      const { listarConsultasPorData } = await Promise.resolve().then(() => (init_db(), db_exports));
      return await listarConsultasPorData(input.data);
    }),
    // Listar consultas por período
    listarPorPeriodo: protectedProcedure.input(z9.object({
      dataInicio: z9.string(),
      dataFim: z9.string()
    })).query(async ({ input }) => {
      const { listarConsultasPorPeriodo } = await Promise.resolve().then(() => (init_db(), db_exports));
      return await listarConsultasPorPeriodo(input.dataInicio, input.dataFim);
    }),
    // Listar consultas por médico
    listarPorMedico: protectedProcedure.input(z9.object({ medicoId: z9.string() })).query(async ({ input }) => {
      const { listarConsultasPorMedico } = await Promise.resolve().then(() => (init_db(), db_exports));
      return await listarConsultasPorMedico(input.medicoId);
    }),
    // Verificar conflito de horário
    verificarConflito: protectedProcedure.input(z9.object({
      medicoId: z9.string(),
      dataHora: z9.string(),
      duracao: z9.number(),
      consultaIdExcluir: z9.string().optional()
    })).query(async ({ input }) => {
      const { verificarConflito } = await Promise.resolve().then(() => (init_db(), db_exports));
      return await verificarConflito(
        input.medicoId,
        input.dataHora,
        input.duracao,
        input.consultaIdExcluir
      );
    }),
    // Obter estatísticas
    estatisticas: protectedProcedure.query(async () => {
      const { obterEstatisticasConsultas } = await Promise.resolve().then(() => (init_db(), db_exports));
      return await obterEstatisticasConsultas();
    })
  }),
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
  iaFinanceira: iaFinanceiraRouter
});

// server/_core/context.ts
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
    user
  };
}

// server/_core/vite.ts
import express from "express";
import fs from "fs";
import { nanoid } from "nanoid";
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
        `src="/src/main.tsx?v=${nanoid()}"`
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
  app.use(express2.json({ limit: "50mb" }));
  app.use(express2.urlencoded({ limit: "50mb", extended: true }));
  registerOAuthRoutes(app);
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
