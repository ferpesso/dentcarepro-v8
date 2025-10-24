// PostgreSQL database for DentCarePRO
import pg from 'pg';
import type { InsertUser } from "../drizzle/schema";

const { Pool } = pg;

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Test connection
pool.on('connect', () => {
  console.log('[PostgreSQL] Connected to database');
});

pool.on('error', (err) => {
  console.error('[PostgreSQL] Unexpected error:', err);
});

// Flag para usar mock data quando não há conexão com BD
const useMockData = !process.env.DATABASE_URL || process.env.USE_MOCK_DATA === 'true';

export async function getDb() {
  return pool;
}

// ========================================
// USERS
// ========================================

export async function getUser(userId: string) {
  try {
    console.log('[DB] getUser called with userId:', userId);
    const result = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [userId]
    );
    console.log('[DB] getUser result:', result.rows.length, 'rows');
    const user = result.rows[0] || null;
    if (user) {
      // Convert snake_case to camelCase for compatibility
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        loginMethod: user.login_method,
        role: user.role,
        lastSignedIn: user.last_signed_in,
      };
    }
    return null;
  } catch (error) {
    console.error('[DB ERROR] getUser failed:', error);
    throw error;
  }
}

export async function upsertUser(user: InsertUser): Promise<void> {
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
    [user.id, user.name, user.email, user.loginMethod, user.role || 'user', user.lastSignedIn || new Date()]
  );
}

// ========================================
// CONFIGURAÇÕES DA CLÍNICA
// ========================================

export async function obterConfigClinica() {
  const result = await pool.query(
    'SELECT * FROM config_clinica WHERE id = $1',
    ['config-1']
  );
  
  if (result.rows.length === 0) {
    // Retornar configuração padrão se não existir
    return {
      id: 'config-1',
      nomeClinica: 'Clínica Dentária',
      email: 'geral@clinica.pt',
      telefone: '',
      cidade: 'Lisboa',
      pais: 'Portugal'
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
    atualizadoEm: row.updated_at,
  };
}

export async function salvarConfigClinica(dados: any) {
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
      dados.nomeClinica, dados.razaoSocial, dados.nif, dados.numeroRegisto,
      dados.telefone, dados.telemovel, dados.email, dados.website,
      dados.rua, dados.numero, dados.complemento, dados.codigoPostal,
      dados.cidade, dados.pais, dados.nomeFantasia, dados.logotipo
    ]
  );
  
  return await obterConfigClinica();
}

// ========================================
// UTENTES
// ========================================

export async function listarUtentes() {
  const result = await pool.query(
    'SELECT * FROM utentes ORDER BY created_at DESC'
  );
  
  return result.rows.map(row => ({
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
    atualizadoEm: row.updated_at,
  }));
}

export async function obterUtente(id: string) {
  try {
    console.log('[DEBUG] obterUtente called with id:', id);
    const result = await pool.query(
      'SELECT * FROM utentes WHERE id = $1',
      [id]
    );
    console.log('[DEBUG] Query result rows:', result.rows.length);
    
    if (result.rows.length === 0) {
      console.log('[DEBUG] No utente found');
      return null;
    }
  
  const row = result.rows[0];
  
  // Converter alergias e medicamentos de string para array
  const alergias = row.alergias ? row.alergias.split(',').map((a: string) => a.trim()).filter((a: string) => a) : [];
  const medicamentos = row.medicamentos ? row.medicamentos.split(',').map((m: string) => m.trim()).filter((m: string) => m) : [];
  
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
      telefone: row.telefone || '',
      telemovel: row.telemovel || '',
      email: row.email || '',
      telefoneEmergencia: '',
    },
    morada: {
      rua: row.rua || '',
      numero: row.numero || '',
      complemento: row.complemento || '',
      codigoPostal: row.codigo_postal || '',
      localidade: row.cidade || '',
      distrito: row.cidade || '',
    },
    infoMedica: {
      alergias: alergias,
      medicamentos: medicamentos,
      condicoesMedicas: [],
      classificacaoAsa: 'I',
      grupoSanguineo: '',
      notasImportantes: row.historico_medico || '',
    },
    tags: [],
    criadoEm: row.created_at,
    atualizadoEm: row.updated_at,
  };
  } catch (error) {
    console.error('[ERROR] obterUtente failed:', error);
    throw error;
  }
}

export async function pesquisarUtentes(termo: string) {
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
  
  return result.rows.map(row => ({
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
    criadoEm: row.created_at,
  }));
}

export async function criarUtente(dados: any) {
  const id = `utente-${Date.now()}`;
  
  // Get next codigo
  const countResult = await pool.query('SELECT COUNT(*) FROM utentes');
  const count = parseInt(countResult.rows[0].count) + 1;
  const codigo = dados.codigo || `U${String(count).padStart(3, '0')}`;
  
  await pool.query(
    `INSERT INTO utentes (
      id, codigo, nome, data_nascimento, genero, nif, numero_sns,
      email, telefone, telemovel, rua, numero, complemento,
      codigo_postal, cidade, pais, estado, observacoes,
      alergias, medicamentos, historico_medico
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)`,
    [
      id, codigo, dados.nome, dados.dataNascimento, dados.genero,
      dados.nif, dados.numeroSNS, dados.email, dados.telefone, dados.telemovel,
      dados.rua, dados.numero, dados.complemento, dados.codigoPostal,
      dados.cidade, dados.pais || 'Portugal', dados.estado || 'ativo',
      dados.observacoes, dados.alergias, dados.medicamentos, dados.historicoMedico
    ]
  );
  
  return await obterUtente(id);
}

export async function atualizarUtente(id: string, dados: any) {
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
      dados.nome, dados.dataNascimento, dados.genero, dados.nif,
      dados.numeroSNS, dados.email, dados.telefone, dados.telemovel,
      dados.rua, dados.numero, dados.complemento, dados.codigoPostal,
      dados.cidade, dados.pais, dados.estado, dados.observacoes,
      dados.alergias, dados.medicamentos, dados.historicoMedico, id
    ]
  );
  
  return await obterUtente(id);
}

export async function removerUtente(id: string) {
  await pool.query('DELETE FROM utentes WHERE id = $1', [id]);
  return { sucesso: true };
}

export async function obterEstatisticasUtentes() {
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
    arquivados: parseInt(row.arquivados),
  };
}

// ========================================
// CONSULTAS
// ========================================

export async function listarConsultas() {
  const result = await pool.query(`
    SELECT c.*, 
           u.nome as utente_nome,
           d.nome as dentista_nome
    FROM consultas c
    LEFT JOIN utentes u ON c.utente_id = u.id
    LEFT JOIN dentistas d ON c.dentista_id = d.id
    ORDER BY c.data_hora DESC
  `);
  
  return result.rows.map(row => ({
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
    criadoEm: row.created_at,
  }));
}

export async function obterConsulta(id: string) {
  const result = await pool.query(
    'SELECT * FROM consultas WHERE id = $1',
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
    valor: row.valor ? parseFloat(row.valor) : null,
  };
}

export async function criarConsulta(dados: any) {
  const id = `consulta-${Date.now()}`;
  
  await pool.query(
    `INSERT INTO consultas (id, utente_id, dentista_id, data_hora, duracao, tipo, status, observacoes, valor)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [id, dados.utenteId, dados.dentistaId, dados.dataHora, dados.duracao || 30,
     dados.tipo, dados.status || 'agendada', dados.observacoes, dados.valor]
  );
  
  return await obterConsulta(id);
}

export async function atualizarConsulta(id: string, dados: any) {
  const campos: string[] = [];
  const valores: any[] = [];
  let paramIndex = 1;

  // Construir dinamicamente a query UPDATE
  if (dados.utenteId !== undefined) {
    campos.push(`utente_id = $${paramIndex++}`);
    valores.push(dados.utenteId);
  }
  if (dados.medicoId !== undefined) {
    campos.push(`dentista_id = $${paramIndex++}`);
    valores.push(dados.medicoId);
  }
  if (dados.dataHora !== undefined) {
    campos.push(`data_hora = $${paramIndex++}`);
    valores.push(dados.dataHora);
  }
  if (dados.duracao !== undefined) {
    campos.push(`duracao = $${paramIndex++}`);
    valores.push(dados.duracao);
  }
  if (dados.tipoConsulta !== undefined) {
    campos.push(`tipo = $${paramIndex++}`);
    valores.push(dados.tipoConsulta);
  }
  if (dados.procedimento !== undefined) {
    campos.push(`procedimento = $${paramIndex++}`);
    valores.push(dados.procedimento);
  }
  if (dados.status !== undefined) {
    campos.push(`status = $${paramIndex++}`);
    valores.push(dados.status);
  }
  if (dados.observacoes !== undefined) {
    campos.push(`observacoes = $${paramIndex++}`);
    valores.push(dados.observacoes);
  }
  if (dados.valorEstimado !== undefined) {
    campos.push(`valor = $${paramIndex++}`);
    valores.push(dados.valorEstimado);
  }
  if (dados.classificacaoRisco !== undefined) {
    campos.push(`classificacao_risco = $${paramIndex++}`);
    valores.push(dados.classificacaoRisco);
  }

  // Se não há campos para atualizar, retornar a consulta atual
  if (campos.length === 0) {
    return await obterConsulta(id);
  }

  // Adicionar o ID como último parâmetro
  campos.push(`updated_at = CURRENT_TIMESTAMP`);
  valores.push(id);

  const query = `UPDATE consultas SET ${campos.join(', ')} WHERE id = $${paramIndex}`;
  
  await pool.query(query, valores);
  
  return await obterConsulta(id);
}

export async function removerConsulta(id: string) {
  await pool.query('DELETE FROM consultas WHERE id = $1', [id]);
  return { sucesso: true };
}

// ========================================
// DENTISTAS
// ========================================

export async function listarDentistas() {
  const result = await pool.query(
    'SELECT * FROM dentistas ORDER BY nome'
  );
  
  return result.rows.map(row => ({
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
    criadoEm: row.created_at,
  }));
}

export async function obterDentista(id: string) {
  const result = await pool.query(
    'SELECT * FROM dentistas WHERE id = $1',
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
    observacoes: row.observacoes,
  };
}

export async function criarDentista(dados: any) {
  const id = `dentista-${Date.now()}`;
  
  await pool.query(
    `INSERT INTO dentistas (id, nome, especialidade, numero_ordem, email, telefone, telemovel, ativo, cor_agenda, observacoes)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
    [id, dados.nome, dados.especialidade, dados.numeroOrdem, dados.email,
     dados.telefone, dados.telemovel, dados.ativo !== false, dados.corAgenda, dados.observacoes]
  );
  
  return await obterDentista(id);
}

export async function atualizarDentista(id: string, dados: any) {
  await pool.query(
    `UPDATE dentistas SET
      nome = $1, especialidade = $2, numero_ordem = $3, email = $4,
      telefone = $5, telemovel = $6, ativo = $7, cor_agenda = $8,
      observacoes = $9, updated_at = CURRENT_TIMESTAMP
    WHERE id = $10`,
    [dados.nome, dados.especialidade, dados.numeroOrdem, dados.email,
     dados.telefone, dados.telemovel, dados.ativo, dados.corAgenda,
     dados.observacoes, id]
  );
  
  return await obterDentista(id);
}

export async function removerDentista(id: string) {
  await pool.query('DELETE FROM dentistas WHERE id = $1', [id]);
  return { sucesso: true };
}

// ========================================
// FORMAS DE PAGAMENTO
// ========================================

export async function listarFormasPagamento() {
  const result = await pool.query(
    'SELECT * FROM formas_pagamento WHERE ativo = true ORDER BY nome'
  );
  
  return result.rows.map(row => ({
    id: row.id,
    nome: row.nome,
    ativo: row.ativo,
    criadoEm: row.created_at,
  }));
}

export async function criarFormaPagamento(dados: any) {
  const id = `fp-${Date.now()}`;
  
  await pool.query(
    'INSERT INTO formas_pagamento (id, nome, ativo) VALUES ($1, $2, $3)',
    [id, dados.nome, dados.ativo !== false]
  );
  
  const result = await pool.query(
    'SELECT * FROM formas_pagamento WHERE id = $1',
    [id]
  );
  
  return result.rows[0];
}

// ========================================
// CATEGORIAS DE DESPESA
// ========================================

export async function listarCategoriasDespesa() {
  const result = await pool.query(
    'SELECT * FROM categorias_despesa WHERE ativo = true ORDER BY nome'
  );
  
  return result.rows.map(row => ({
    id: row.id,
    nome: row.nome,
    descricao: row.descricao,
    ativo: row.ativo,
    criadoEm: row.created_at,
  }));
}

export async function criarCategoriaDespesa(dados: any) {
  const id = `cat-${Date.now()}`;
  
  await pool.query(
    'INSERT INTO categorias_despesa (id, nome, descricao, ativo) VALUES ($1, $2, $3, $4)',
    [id, dados.nome, dados.descricao, dados.ativo !== false]
  );
  
  const result = await pool.query(
    'SELECT * FROM categorias_despesa WHERE id = $1',
    [id]
  );
  
  return result.rows[0];
}

// ========================================
// FORNECEDORES
// ========================================

export async function listarFornecedores() {
  const result = await pool.query(
    'SELECT * FROM fornecedores WHERE ativo = true ORDER BY nome'
  );
  
  return result.rows.map(row => ({
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
    criadoEm: row.created_at,
  }));
}

export async function criarFornecedor(dados: any) {
  const id = `fornecedor-${Date.now()}`;
  
  await pool.query(
    `INSERT INTO fornecedores (id, nome, nif, email, telefone, rua, cidade, codigo_postal, pais, ativo)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
    [id, dados.nome, dados.nif, dados.email, dados.telefone,
     dados.rua, dados.cidade, dados.codigoPostal, dados.pais || 'Portugal', dados.ativo !== false]
  );
  
  const result = await pool.query(
    'SELECT * FROM fornecedores WHERE id = $1',
    [id]
  );
  
  return result.rows[0];
}

// ========================================
// COMISSÕES
// ========================================

export async function obterConfigComissao(dentistaId: string) {
  const result = await pool.query(
    'SELECT * FROM config_comissoes WHERE dentista_id = $1',
    [dentistaId]
  );
  
  if (result.rows.length === 0) {
    return {
      dentistaId,
      percentual: 0,
      ativo: false,
    };
  }
  
  const row = result.rows[0];
  return {
    id: row.id,
    dentistaId: row.dentista_id,
    percentual: parseFloat(row.percentual),
    ativo: row.ativo,
  };
}

export async function salvarConfigComissao(dentistaId: string, config: any) {
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

export async function listarComissoes() {
  const result = await pool.query(`
    SELECT c.*, d.nome as dentista_nome
    FROM comissoes c
    LEFT JOIN dentistas d ON c.dentista_id = d.id
    ORDER BY c.created_at DESC
  `);
  
  return result.rows.map(row => ({
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
    criadoEm: row.created_at,
  }));
}

export async function obterComissao(id: string) {
  const result = await pool.query(
    'SELECT * FROM comissoes WHERE id = $1',
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
    status: row.status,
  };
}

export async function listarComissoesDentista(dentistaId: string, filtros?: any) {
  const result = await pool.query(
    'SELECT * FROM comissoes WHERE dentista_id = $1 ORDER BY created_at DESC',
    [dentistaId]
  );
  
  return result.rows.map(row => ({
    id: row.id,
    dentistaId: row.dentista_id,
    faturaId: row.fatura_id,
    valor: parseFloat(row.valor),
    percentual: parseFloat(row.percentual),
    status: row.status,
    dataPagamento: row.data_pagamento,
    criadoEm: row.created_at,
  }));
}

export async function criarComissao(dados: any) {
  const id = `comissao-${Date.now()}`;
  
  await pool.query(
    `INSERT INTO comissoes (id, dentista_id, fatura_id, valor, percentual, status)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [id, dados.dentistaId, dados.faturaId, dados.valor, dados.percentual, 'pendente']
  );
  
  return await obterComissao(id);
}

export async function pagarComissao(id: string, formaPagamento: string, observacoes?: string) {
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

export async function obterResumoFinanceiroDentista(dentistaId: string, periodo?: any) {
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
    quantidadePaga: parseInt(row.qtd_paga || 0),
  };
}

// ========================================
// LABORATÓRIOS
// ========================================

export async function listarLaboratorios() {
  const result = await pool.query(
    'SELECT * FROM laboratorios WHERE ativo = true ORDER BY nome'
  );
  
  return result.rows.map(row => ({
    id: row.id,
    nome: row.nome,
    responsavel: row.responsavel,
    email: row.email,
    telefone: row.telefone,
    rua: row.rua,
    cidade: row.cidade,
    codigoPostal: row.codigo_postal,
    ativo: row.ativo,
    criadoEm: row.created_at,
  }));
}

export async function obterLaboratorio(id: string) {
  const result = await pool.query(
    'SELECT * FROM laboratorios WHERE id = $1',
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
    ativo: row.ativo,
  };
}

export async function criarLaboratorio(dados: any) {
  const id = `laboratorio-${Date.now()}`;
  
  await pool.query(
    `INSERT INTO laboratorios (id, nome, responsavel, email, telefone, rua, cidade, codigo_postal, ativo)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [id, dados.nome, dados.responsavel, dados.email, dados.telefone,
     dados.rua, dados.cidade, dados.codigoPostal, dados.ativo !== false]
  );
  
  return await obterLaboratorio(id);
}

export async function atualizarLaboratorio(id: string, dados: any) {
  await pool.query(
    `UPDATE laboratorios SET
      nome = $1, responsavel = $2, email = $3, telefone = $4,
      rua = $5, cidade = $6, codigo_postal = $7, ativo = $8,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $9`,
    [dados.nome, dados.responsavel, dados.email, dados.telefone,
     dados.rua, dados.cidade, dados.codigoPostal, dados.ativo, id]
  );
  
  return await obterLaboratorio(id);
}

export async function removerLaboratorio(id: string) {
  await pool.query('DELETE FROM laboratorios WHERE id = $1', [id]);
  return { sucesso: true };
}

export async function excluirLaboratorio(id: string) {
  return await removerLaboratorio(id);
}

// Trabalhos de laboratório
export async function listarTrabalhosLaboratorio(filtros: any) {
  const result = await pool.query(`
    SELECT t.*, l.nome as laboratorio_nome, u.nome as utente_nome, d.nome as dentista_nome
    FROM trabalhos_laboratorio t
    LEFT JOIN laboratorios l ON t.laboratorio_id = l.id
    LEFT JOIN utentes u ON t.utente_id = u.id
    LEFT JOIN dentistas d ON t.dentista_id = d.id
    ORDER BY t.created_at DESC
  `);
  
  return result.rows.map(row => ({
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
    criadoEm: row.created_at,
  }));
}

export async function obterTrabalhoLaboratorio(id: string) {
  const result = await pool.query(
    'SELECT * FROM trabalhos_laboratorio WHERE id = $1',
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
    observacoes: row.observacoes,
  };
}

export async function criarTrabalhoLaboratorio(dados: any) {
  const id = `trabalho-lab-${Date.now()}`;
  
  await pool.query(
    `INSERT INTO trabalhos_laboratorio 
     (id, laboratorio_id, utente_id, dentista_id, tipo_trabalho, descricao, 
      data_envio, data_prevista_entrega, status, valor, observacoes)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
    [id, dados.laboratorioId, dados.utenteId, dados.dentistaId, dados.tipoTrabalho,
     dados.descricao, dados.dataEnvio, dados.dataPrevistaEntrega, 'enviado',
     dados.valor, dados.observacoes]
  );
  
  return await obterTrabalhoLaboratorio(id);
}

export async function atualizarTrabalhoLaboratorio(id: string, dados: any) {
  await pool.query(
    `UPDATE trabalhos_laboratorio SET
      tipo_trabalho = $1, descricao = $2, data_envio = $3,
      data_prevista_entrega = $4, data_entrega = $5, status = $6,
      valor = $7, observacoes = $8, updated_at = CURRENT_TIMESTAMP
    WHERE id = $9`,
    [dados.tipoTrabalho, dados.descricao, dados.dataEnvio,
     dados.dataPrevistaEntrega, dados.dataEntrega, dados.status,
     dados.valor, dados.observacoes, id]
  );
  
  return await obterTrabalhoLaboratorio(id);
}

export async function excluirTrabalhoLaboratorio(id: string) {
  await pool.query('DELETE FROM trabalhos_laboratorio WHERE id = $1', [id]);
  return { sucesso: true };
}

// ========================================
// CONTAS A PAGAR
// ========================================

export async function listarContasPagar() {
  const result = await pool.query(`
    SELECT c.*, f.nome as fornecedor_nome, cat.nome as categoria_nome
    FROM contas_pagar c
    LEFT JOIN fornecedores f ON c.fornecedor_id = f.id
    LEFT JOIN categorias_despesa cat ON c.categoria_id = cat.id
    ORDER BY c.data_vencimento DESC
  `);
  
  return result.rows.map(row => ({
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
    criadoEm: row.created_at,
  }));
}

export async function obterContaPagar(id: string) {
  const result = await pool.query(
    'SELECT * FROM contas_pagar WHERE id = $1',
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
    observacoes: row.observacoes,
  };
}

export async function criarContaPagar(dados: any) {
  const id = `conta-pagar-${Date.now()}`;
  
  await pool.query(
    `INSERT INTO contas_pagar 
     (id, fornecedor_id, categoria_id, descricao, valor, data_vencimento, status, observacoes)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [id, dados.fornecedorId, dados.categoriaId, dados.descricao,
     dados.valor, dados.dataVencimento, 'pendente', dados.observacoes]
  );
  
  return await obterContaPagar(id);
}

export async function atualizarContaPagar(id: string, dados: any) {
  await pool.query(
    `UPDATE contas_pagar SET
      fornecedor_id = $1, categoria_id = $2, descricao = $3, valor = $4,
      data_vencimento = $5, status = $6, observacoes = $7,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $8`,
    [dados.fornecedorId, dados.categoriaId, dados.descricao, dados.valor,
     dados.dataVencimento, dados.status, dados.observacoes, id]
  );
  
  return await obterContaPagar(id);
}

export async function removerContaPagar(id: string) {
  await pool.query('DELETE FROM contas_pagar WHERE id = $1', [id]);
  return { sucesso: true };
}

export async function marcarContaPaga(id: string) {
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

// ========================================
// FATURAS
// ========================================

export async function listarFaturas() {
  const result = await pool.query(`
    SELECT f.*, u.nome as utente_nome
    FROM faturas f
    LEFT JOIN utentes u ON f.utente_id = u.id
    ORDER BY f.data_emissao DESC
  `);
  
  return result.rows.map(row => ({
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
    criadoEm: row.created_at,
  }));
}

export async function obterFatura(id: string) {
  const result = await pool.query(
    'SELECT * FROM faturas WHERE id = $1',
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
    observacoes: row.observacoes,
  };
}

export async function criarFatura(dados: any) {
  const id = `fatura-${Date.now()}`;
  
  // Generate invoice number
  const countResult = await pool.query('SELECT COUNT(*) FROM faturas');
  const count = parseInt(countResult.rows[0].count) + 1;
  const numeroFatura = dados.numeroFatura || `FT${new Date().getFullYear()}/${String(count).padStart(5, '0')}`;
  
  await pool.query(
    `INSERT INTO faturas 
     (id, numero_fatura, utente_id, data_emissao, data_vencimento, valor_total, valor_pago, status, observacoes)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [id, numeroFatura, dados.utenteId, dados.dataEmissao, dados.dataVencimento,
     dados.valorTotal, dados.valorPago || 0, dados.status || 'pendente', dados.observacoes]
  );
  
  return await obterFatura(id);
}

export async function atualizarFatura(id: string, dados: any) {
  await pool.query(
    `UPDATE faturas SET
      data_vencimento = $1, valor_total = $2, valor_pago = $3,
      status = $4, observacoes = $5, updated_at = CURRENT_TIMESTAMP
    WHERE id = $6`,
    [dados.dataVencimento, dados.valorTotal, dados.valorPago,
     dados.status, dados.observacoes, id]
  );
  
  return await obterFatura(id);
}

export async function removerFatura(id: string) {
  await pool.query('DELETE FROM faturas WHERE id = $1', [id]);
  return { sucesso: true };
}

// ========================================
// DASHBOARD FINANCEIRO
// ========================================

export async function obterDashboardFinanceiro() {
  const mesAtual = new Date();
  const primeiroDiaMes = new Date(mesAtual.getFullYear(), mesAtual.getMonth(), 1);
  const ultimoDiaMes = new Date(mesAtual.getFullYear(), mesAtual.getMonth() + 1, 0);
  
  // Receitas do mês (faturas pagas)
  const receitasResult = await pool.query(
    `SELECT COALESCE(SUM(valor_pago), 0) as total
     FROM faturas
     WHERE data_emissao >= $1 AND data_emissao <= $2`,
    [primeiroDiaMes, ultimoDiaMes]
  );
  
  // Despesas do mês (contas pagas)
  const despesasResult = await pool.query(
    `SELECT COALESCE(SUM(valor), 0) as total
     FROM contas_pagar
     WHERE data_pagamento >= $1 AND data_pagamento <= $2`,
    [primeiroDiaMes, ultimoDiaMes]
  );
  
  // Contas pendentes
  const contasPendentesResult = await pool.query(
    `SELECT COUNT(*) as total
     FROM contas_pagar
     WHERE status = 'pendente'`
  );
  
  // Faturas emitidas no mês
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
    faturasEmitidas: parseInt(faturasResult.rows[0].total),
  };
}


// ============================================================================
// TRATAMENTOS
// ============================================================================

interface Tratamento {
  id: string;
  utenteId: string;
  consultaId?: string | null;
  dentistaId?: string;
  data: string;
  dente?: string | null;
  procedimento: string;
  descricao?: string | null;
  valor: number;
  valorPago: number;
  status: "planeado" | "em_andamento" | "concluido" | "cancelado";
  observacoes?: string | null;
  criadoPor: string;
  atualizadoPor?: string;
  criadoEm: string;
  atualizadoEm: string;
}

// Mock data de tratamentos
let tratamentosMock: Tratamento[] = [
  {
    id: "trat_1",
    utenteId: "1",
    dentistaId: "1",
    data: "2025-10-15",
    dente: "16",
    procedimento: "Restauração em Resina Composta",
    descricao: "Restauração classe II na face oclusal",
    valor: 80.00,
    valorPago: 80.00,
    status: "concluido",
    observacoes: "Paciente tolerou bem o procedimento",
    criadoPor: "1",
    criadoEm: new Date("2025-10-15").toISOString(),
    atualizadoEm: new Date("2025-10-15").toISOString(),
  },
  {
    id: "trat_2",
    utenteId: "1",
    dentistaId: "1",
    data: "2025-10-20",
    dente: "26",
    procedimento: "Endodontia",
    descricao: "Tratamento endodôntico - 1ª sessão",
    valor: 250.00,
    valorPago: 0,
    status: "em_andamento",
    observacoes: "Necessário mais 2 sessões",
    criadoPor: "1",
    criadoEm: new Date("2025-10-20").toISOString(),
    atualizadoEm: new Date("2025-10-20").toISOString(),
  },
  {
    id: "trat_3",
    utenteId: "2",
    dentistaId: "1",
    data: "2025-11-05",
    dente: "11",
    procedimento: "Coroa em Porcelana",
    descricao: "Coroa total em porcelana sobre metal",
    valor: 450.00,
    valorPago: 0,
    status: "planeado",
    observacoes: "Aguardando laboratório",
    criadoPor: "1",
    criadoEm: new Date("2025-10-22").toISOString(),
    atualizadoEm: new Date("2025-10-22").toISOString(),
  },
];

/**
 * Listar todos os tratamentos
 */
export async function listarTratamentos(): Promise<Tratamento[]> {
  if (useMockData) {
    return tratamentosMock.sort((a, b) => 
      new Date(b.data).getTime() - new Date(a.data).getTime()
    );
  }

  const result = await pool.query(`
    SELECT 
      id,
      utente_id as "utenteId",
      consulta_id as "consultaId",
      dentista_id as "dentistaId",
      data,
      dente,
      procedimento,
      descricao,
      valor,
      valor_pago as "valorPago",
      status,
      observacoes,
      criado_por as "criadoPor",
      atualizado_por as "atualizadoPor",
      criado_em as "criadoEm",
      atualizado_em as "atualizadoEm"
    FROM tratamentos
    ORDER BY data DESC
  `);

  return result.rows;
}

/**
 * Listar tratamentos de um utente
 */
export async function listarTratamentosUtente(utenteId: string): Promise<Tratamento[]> {
  if (useMockData) {
    return tratamentosMock
      .filter(t => t.utenteId === utenteId)
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
  }

  const result = await pool.query(
    `SELECT 
      id,
      utente_id as "utenteId",
      consulta_id as "consultaId",
      dentista_id as "dentistaId",
      data,
      dente,
      procedimento,
      descricao,
      valor,
      valor_pago as "valorPago",
      status,
      observacoes,
      criado_por as "criadoPor",
      atualizado_por as "atualizadoPor",
      criado_em as "criadoEm",
      atualizado_em as "atualizadoEm"
    FROM tratamentos
    WHERE utente_id = $1
    ORDER BY data DESC`,
    [utenteId]
  );

  return result.rows;
}

/**
 * Listar tratamentos com paginação
 */
export async function listarTratamentosPaginado(params: {
  page: number;
  pageSize: number;
  utenteId?: string;
  status?: string;
  dentistaId?: string;
  dataInicio?: string;
  dataFim?: string;
}): Promise<{ tratamentos: Tratamento[]; total: number; totalPages: number }> {
  const { page, pageSize, utenteId, status, dentistaId, dataInicio, dataFim } = params;

  if (useMockData) {
    let filtered = [...tratamentosMock];

    if (utenteId) {
      filtered = filtered.filter(t => t.utenteId === utenteId);
    }
    if (status) {
      filtered = filtered.filter(t => t.status === status);
    }
    if (dentistaId) {
      filtered = filtered.filter(t => t.dentistaId === dentistaId);
    }
    if (dataInicio) {
      filtered = filtered.filter(t => t.data >= dataInicio);
    }
    if (dataFim) {
      filtered = filtered.filter(t => t.data <= dataFim);
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const tratamentos = filtered
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
      .slice(start, start + pageSize);

    return { tratamentos, total, totalPages };
  }

  // Construir query dinâmica
  const conditions: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (utenteId) {
    conditions.push(`utente_id = $${paramIndex++}`);
    values.push(utenteId);
  }
  if (status) {
    conditions.push(`status = $${paramIndex++}`);
    values.push(status);
  }
  if (dentistaId) {
    conditions.push(`dentista_id = $${paramIndex++}`);
    values.push(dentistaId);
  }
  if (dataInicio) {
    conditions.push(`data >= $${paramIndex++}`);
    values.push(dataInicio);
  }
  if (dataFim) {
    conditions.push(`data <= $${paramIndex++}`);
    values.push(dataFim);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  // Contar total
  const countResult = await pool.query(
    `SELECT COUNT(*) as total FROM tratamentos ${whereClause}`,
    values
  );
  const total = parseInt(countResult.rows[0].total);
  const totalPages = Math.ceil(total / pageSize);

  // Buscar dados paginados
  const offset = (page - 1) * pageSize;
  values.push(pageSize, offset);

  const result = await pool.query(
    `SELECT 
      id,
      utente_id as "utenteId",
      consulta_id as "consultaId",
      dentista_id as "dentistaId",
      data,
      dente,
      procedimento,
      descricao,
      valor,
      valor_pago as "valorPago",
      status,
      observacoes,
      criado_por as "criadoPor",
      atualizado_por as "atualizadoPor",
      criado_em as "criadoEm",
      atualizado_em as "atualizadoEm"
    FROM tratamentos
    ${whereClause}
    ORDER BY data DESC
    LIMIT $${paramIndex++} OFFSET $${paramIndex}`,
    values
  );

  return {
    tratamentos: result.rows,
    total,
    totalPages,
  };
}

/**
 * Obter tratamento por ID
 */
export async function obterTratamento(id: string): Promise<Tratamento | null> {
  if (useMockData) {
    return tratamentosMock.find(t => t.id === id) || null;
  }

  const result = await pool.query(
    `SELECT 
      id,
      utente_id as "utenteId",
      consulta_id as "consultaId",
      dentista_id as "dentistaId",
      data,
      dente,
      procedimento,
      descricao,
      valor,
      valor_pago as "valorPago",
      status,
      observacoes,
      criado_por as "criadoPor",
      atualizado_por as "atualizadoPor",
      criado_em as "criadoEm",
      atualizado_em as "atualizadoEm"
    FROM tratamentos
    WHERE id = $1`,
    [id]
  );

  return result.rows[0] || null;
}

/**
 * Criar tratamento
 */
export async function criarTratamento(dados: Omit<Tratamento, "id" | "criadoEm" | "atualizadoEm">): Promise<Tratamento> {
  if (useMockData) {
    const novoTratamento: Tratamento = {
      ...dados,
      id: `trat_${tratamentosMock.length + 1}`,
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
    };
    tratamentosMock.push(novoTratamento);
    return novoTratamento;
  }

  const result = await pool.query(
    `INSERT INTO tratamentos (
      utente_id, consulta_id, dentista_id, data, dente, procedimento,
      descricao, valor, valor_pago, status, observacoes, criado_por
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING 
      id,
      utente_id as "utenteId",
      consulta_id as "consultaId",
      dentista_id as "dentistaId",
      data,
      dente,
      procedimento,
      descricao,
      valor,
      valor_pago as "valorPago",
      status,
      observacoes,
      criado_por as "criadoPor",
      atualizado_por as "atualizadoPor",
      criado_em as "criadoEm",
      atualizado_em as "atualizadoEm"`,
    [
      dados.utenteId,
      dados.consultaId || null,
      dados.dentistaId || null,
      dados.data,
      dados.dente || null,
      dados.procedimento,
      dados.descricao || null,
      dados.valor,
      dados.valorPago,
      dados.status,
      dados.observacoes || null,
      dados.criadoPor,
    ]
  );

  return result.rows[0];
}

/**
 * Atualizar tratamento
 */
export async function atualizarTratamento(
  id: string,
  dados: Partial<Omit<Tratamento, "id" | "criadoEm" | "criadoPor">>
): Promise<Tratamento | null> {
  if (useMockData) {
    const index = tratamentosMock.findIndex(t => t.id === id);
    if (index === -1) return null;

    tratamentosMock[index] = {
      ...tratamentosMock[index],
      ...dados,
      atualizadoEm: new Date().toISOString(),
    };
    return tratamentosMock[index];
  }

  const fields: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (dados.consultaId !== undefined) {
    fields.push(`consulta_id = $${paramIndex++}`);
    values.push(dados.consultaId);
  }
  if (dados.dentistaId !== undefined) {
    fields.push(`dentista_id = $${paramIndex++}`);
    values.push(dados.dentistaId);
  }
  if (dados.data !== undefined) {
    fields.push(`data = $${paramIndex++}`);
    values.push(dados.data);
  }
  if (dados.dente !== undefined) {
    fields.push(`dente = $${paramIndex++}`);
    values.push(dados.dente);
  }
  if (dados.procedimento !== undefined) {
    fields.push(`procedimento = $${paramIndex++}`);
    values.push(dados.procedimento);
  }
  if (dados.descricao !== undefined) {
    fields.push(`descricao = $${paramIndex++}`);
    values.push(dados.descricao);
  }
  if (dados.valor !== undefined) {
    fields.push(`valor = $${paramIndex++}`);
    values.push(dados.valor);
  }
  if (dados.valorPago !== undefined) {
    fields.push(`valor_pago = $${paramIndex++}`);
    values.push(dados.valorPago);
  }
  if (dados.status !== undefined) {
    fields.push(`status = $${paramIndex++}`);
    values.push(dados.status);
  }
  if (dados.observacoes !== undefined) {
    fields.push(`observacoes = $${paramIndex++}`);
    values.push(dados.observacoes);
  }
  if (dados.atualizadoPor !== undefined) {
    fields.push(`atualizado_por = $${paramIndex++}`);
    values.push(dados.atualizadoPor);
  }

  if (fields.length === 0) return await obterTratamento(id);

  fields.push(`atualizado_em = NOW()`);
  values.push(id);

  const result = await pool.query(
    `UPDATE tratamentos
    SET ${fields.join(", ")}
    WHERE id = $${paramIndex}
    RETURNING 
      id,
      utente_id as "utenteId",
      consulta_id as "consultaId",
      dentista_id as "dentistaId",
      data,
      dente,
      procedimento,
      descricao,
      valor,
      valor_pago as "valorPago",
      status,
      observacoes,
      criado_por as "criadoPor",
      atualizado_por as "atualizadoPor",
      criado_em as "criadoEm",
      atualizado_em as "atualizadoEm"`,
    values
  );

  return result.rows[0] || null;
}

/**
 * Deletar tratamento
 */
export async function deletarTratamento(id: string): Promise<boolean> {
  if (useMockData) {
    const index = tratamentosMock.findIndex(t => t.id === id);
    if (index === -1) return false;
    tratamentosMock.splice(index, 1);
    return true;
  }

  const result = await pool.query("DELETE FROM tratamentos WHERE id = $1", [id]);
  return (result.rowCount || 0) > 0;
}

/**
 * Obter estatísticas de tratamentos
 */
export async function obterEstatisticasTratamentos(params: {
  utenteId?: string;
  dentistaId?: string;
  dataInicio?: string;
  dataFim?: string;
}): Promise<{
  total: number;
  planeados: number;
  emAndamento: number;
  concluidos: number;
  cancelados: number;
  valorTotal: number;
  valorPago: number;
  valorPendente: number;
}> {
  const { utenteId, dentistaId, dataInicio, dataFim } = params;

  if (useMockData) {
    let filtered = [...tratamentosMock];

    if (utenteId) {
      filtered = filtered.filter(t => t.utenteId === utenteId);
    }
    if (dentistaId) {
      filtered = filtered.filter(t => t.dentistaId === dentistaId);
    }
    if (dataInicio) {
      filtered = filtered.filter(t => t.data >= dataInicio);
    }
    if (dataFim) {
      filtered = filtered.filter(t => t.data <= dataFim);
    }

    const valorTotal = filtered.reduce((sum, t) => sum + t.valor, 0);
    const valorPago = filtered.reduce((sum, t) => sum + t.valorPago, 0);

    return {
      total: filtered.length,
      planeados: filtered.filter(t => t.status === "planeado").length,
      emAndamento: filtered.filter(t => t.status === "em_andamento").length,
      concluidos: filtered.filter(t => t.status === "concluido").length,
      cancelados: filtered.filter(t => t.status === "cancelado").length,
      valorTotal,
      valorPago,
      valorPendente: valorTotal - valorPago,
    };
  }

  const conditions: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (utenteId) {
    conditions.push(`utente_id = $${paramIndex++}`);
    values.push(utenteId);
  }
  if (dentistaId) {
    conditions.push(`dentista_id = $${paramIndex++}`);
    values.push(dentistaId);
  }
  if (dataInicio) {
    conditions.push(`data >= $${paramIndex++}`);
    values.push(dataInicio);
  }
  if (dataFim) {
    conditions.push(`data <= $${paramIndex++}`);
    values.push(dataFim);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const result = await pool.query(
    `SELECT 
      COUNT(*) as total,
      COUNT(*) FILTER (WHERE status = 'planeado') as planeados,
      COUNT(*) FILTER (WHERE status = 'em_andamento') as "emAndamento",
      COUNT(*) FILTER (WHERE status = 'concluido') as concluidos,
      COUNT(*) FILTER (WHERE status = 'cancelado') as cancelados,
      COALESCE(SUM(valor), 0) as "valorTotal",
      COALESCE(SUM(valor_pago), 0) as "valorPago"
    FROM tratamentos
    ${whereClause}`,
    values
  );

  const row = result.rows[0];
  const valorTotal = parseFloat(row.valorTotal);
  const valorPago = parseFloat(row.valorPago);

  return {
    total: parseInt(row.total),
    planeados: parseInt(row.planeados),
    emAndamento: parseInt(row.emAndamento),
    concluidos: parseInt(row.concluidos),
    cancelados: parseInt(row.cancelados),
    valorTotal,
    valorPago,
    valorPendente: valorTotal - valorPago,
  };
}

/**
 * Exportar tratamentos
 */
export async function exportarTratamentos(params: {
  utenteId?: string;
  status?: string;
  dataInicio?: string;
  dataFim?: string;
}): Promise<Tratamento[]> {
  // Retorna todos os tratamentos filtrados (sem paginação)
  const result = await listarTratamentosPaginado({
    ...params,
    page: 1,
    pageSize: 10000, // Número grande para pegar todos
  });

  return result.tratamentos;
}



// ============================================================================
// PRESCRIÇÕES
// ============================================================================

interface Medicamento {
  medicamento: string;
  posologia: string;
  duracao: string;
  quantidade?: string;
}

interface Prescricao {
  id: string;
  utenteId: string;
  data: string;
  medicamentos: Medicamento[];
  observacoes?: string | null;
  diagnostico?: string | null;
  criadoPor: string;
  atualizadoPor?: string;
  criadoEm: string;
  atualizadoEm: string;
}

// Mock data de prescrições
let prescricoesMock: Prescricao[] = [
  {
    id: "presc_1",
    utenteId: "1",
    data: "2025-10-20",
    medicamentos: [
      {
        medicamento: "Amoxicilina 500mg",
        posologia: "1 comprimido de 8 em 8 horas",
        duracao: "7 dias",
        quantidade: "21 comprimidos",
      },
      {
        medicamento: "Ibuprofeno 600mg",
        posologia: "1 comprimido de 8 em 8 horas (após refeições)",
        duracao: "5 dias",
        quantidade: "15 comprimidos",
      },
    ],
    diagnostico: "Infecção dentária aguda",
    observacoes: "Tomar com alimentos. Evitar álcool durante o tratamento.",
    criadoPor: "1",
    criadoEm: new Date("2025-10-20").toISOString(),
    atualizadoEm: new Date("2025-10-20").toISOString(),
  },
  {
    id: "presc_2",
    utenteId: "2",
    data: "2025-10-22",
    medicamentos: [
      {
        medicamento: "Paracetamol 1000mg",
        posologia: "1 comprimido de 6 em 6 horas (SOS dor)",
        duracao: "3 dias",
        quantidade: "12 comprimidos",
      },
    ],
    diagnostico: "Dor pós-operatória",
    observacoes: "Usar apenas se necessário para controlo da dor.",
    criadoPor: "1",
    criadoEm: new Date("2025-10-22").toISOString(),
    atualizadoEm: new Date("2025-10-22").toISOString(),
  },
];

/**
 * Listar prescrições de um utente
 */
export async function listarPrescricoes(utenteId: string): Promise<Prescricao[]> {
  if (useMockData) {
    return prescricoesMock
      .filter(p => p.utenteId === utenteId)
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
  }

  const result = await pool.query(
    `SELECT 
      id,
      utente_id as "utenteId",
      data,
      medicamentos,
      observacoes,
      diagnostico,
      criado_por as "criadoPor",
      atualizado_por as "atualizadoPor",
      criado_em as "criadoEm",
      atualizado_em as "atualizadoEm"
    FROM prescricoes
    WHERE utente_id = $1
    ORDER BY data DESC`,
    [utenteId]
  );

  return result.rows.map(row => ({
    ...row,
    medicamentos: JSON.parse(row.medicamentos),
  }));
}

/**
 * Listar prescrições com paginação
 */
export async function listarPrescricoesPaginado(params: {
  page: number;
  pageSize: number;
  utenteId?: string;
  dataInicio?: string;
  dataFim?: string;
}): Promise<{ prescricoes: Prescricao[]; total: number; totalPages: number }> {
  const { page, pageSize, utenteId, dataInicio, dataFim } = params;

  if (useMockData) {
    let filtered = [...prescricoesMock];

    if (utenteId) {
      filtered = filtered.filter(p => p.utenteId === utenteId);
    }
    if (dataInicio) {
      filtered = filtered.filter(p => p.data >= dataInicio);
    }
    if (dataFim) {
      filtered = filtered.filter(p => p.data <= dataFim);
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const prescricoes = filtered
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
      .slice(start, start + pageSize);

    return { prescricoes, total, totalPages };
  }

  const conditions: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (utenteId) {
    conditions.push(`utente_id = $${paramIndex++}`);
    values.push(utenteId);
  }
  if (dataInicio) {
    conditions.push(`data >= $${paramIndex++}`);
    values.push(dataInicio);
  }
  if (dataFim) {
    conditions.push(`data <= $${paramIndex++}`);
    values.push(dataFim);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const countResult = await pool.query(
    `SELECT COUNT(*) as total FROM prescricoes ${whereClause}`,
    values
  );
  const total = parseInt(countResult.rows[0].total);
  const totalPages = Math.ceil(total / pageSize);

  const offset = (page - 1) * pageSize;
  values.push(pageSize, offset);

  const result = await pool.query(
    `SELECT 
      id,
      utente_id as "utenteId",
      data,
      medicamentos,
      observacoes,
      diagnostico,
      criado_por as "criadoPor",
      atualizado_por as "atualizadoPor",
      criado_em as "criadoEm",
      atualizado_em as "atualizadoEm"
    FROM prescricoes
    ${whereClause}
    ORDER BY data DESC
    LIMIT $${paramIndex++} OFFSET $${paramIndex}`,
    values
  );

  return {
    prescricoes: result.rows.map(row => ({
      ...row,
      medicamentos: JSON.parse(row.medicamentos),
    })),
    total,
    totalPages,
  };
}

/**
 * Obter prescrição por ID
 */
export async function obterPrescricao(id: string): Promise<Prescricao | null> {
  if (useMockData) {
    return prescricoesMock.find(p => p.id === id) || null;
  }

  const result = await pool.query(
    `SELECT 
      id,
      utente_id as "utenteId",
      data,
      medicamentos,
      observacoes,
      diagnostico,
      criado_por as "criadoPor",
      atualizado_por as "atualizadoPor",
      criado_em as "criadoEm",
      atualizado_em as "atualizadoEm"
    FROM prescricoes
    WHERE id = $1`,
    [id]
  );

  if (result.rows.length === 0) return null;

  return {
    ...result.rows[0],
    medicamentos: JSON.parse(result.rows[0].medicamentos),
  };
}

/**
 * Criar prescrição
 */
export async function criarPrescricao(dados: Omit<Prescricao, "id" | "criadoEm" | "atualizadoEm">): Promise<Prescricao> {
  if (useMockData) {
    const novaPrescricao: Prescricao = {
      ...dados,
      id: `presc_${prescricoesMock.length + 1}`,
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
    };
    prescricoesMock.push(novaPrescricao);
    return novaPrescricao;
  }

  const result = await pool.query(
    `INSERT INTO prescricoes (
      utente_id, data, medicamentos, observacoes, diagnostico, criado_por
    ) VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING 
      id,
      utente_id as "utenteId",
      data,
      medicamentos,
      observacoes,
      diagnostico,
      criado_por as "criadoPor",
      atualizado_por as "atualizadoPor",
      criado_em as "criadoEm",
      atualizado_em as "atualizadoEm"`,
    [
      dados.utenteId,
      dados.data,
      JSON.stringify(dados.medicamentos),
      dados.observacoes || null,
      dados.diagnostico || null,
      dados.criadoPor,
    ]
  );

  return {
    ...result.rows[0],
    medicamentos: JSON.parse(result.rows[0].medicamentos),
  };
}

/**
 * Atualizar prescrição
 */
export async function atualizarPrescricao(
  id: string,
  dados: Partial<Omit<Prescricao, "id" | "criadoEm" | "criadoPor">>
): Promise<Prescricao | null> {
  if (useMockData) {
    const index = prescricoesMock.findIndex(p => p.id === id);
    if (index === -1) return null;

    prescricoesMock[index] = {
      ...prescricoesMock[index],
      ...dados,
      atualizadoEm: new Date().toISOString(),
    };
    return prescricoesMock[index];
  }

  const fields: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (dados.data !== undefined) {
    fields.push(`data = $${paramIndex++}`);
    values.push(dados.data);
  }
  if (dados.medicamentos !== undefined) {
    fields.push(`medicamentos = $${paramIndex++}`);
    values.push(JSON.stringify(dados.medicamentos));
  }
  if (dados.observacoes !== undefined) {
    fields.push(`observacoes = $${paramIndex++}`);
    values.push(dados.observacoes);
  }
  if (dados.diagnostico !== undefined) {
    fields.push(`diagnostico = $${paramIndex++}`);
    values.push(dados.diagnostico);
  }
  if (dados.atualizadoPor !== undefined) {
    fields.push(`atualizado_por = $${paramIndex++}`);
    values.push(dados.atualizadoPor);
  }

  if (fields.length === 0) return await obterPrescricao(id);

  fields.push(`atualizado_em = NOW()`);
  values.push(id);

  const result = await pool.query(
    `UPDATE prescricoes
    SET ${fields.join(", ")}
    WHERE id = $${paramIndex}
    RETURNING 
      id,
      utente_id as "utenteId",
      data,
      medicamentos,
      observacoes,
      diagnostico,
      criado_por as "criadoPor",
      atualizado_por as "atualizadoPor",
      criado_em as "criadoEm",
      atualizado_em as "atualizadoEm"`,
    values
  );

  if (result.rows.length === 0) return null;

  return {
    ...result.rows[0],
    medicamentos: JSON.parse(result.rows[0].medicamentos),
  };
}

/**
 * Eliminar prescrição
 */
export async function eliminarPrescricao(id: string): Promise<boolean> {
  if (useMockData) {
    const index = prescricoesMock.findIndex(p => p.id === id);
    if (index === -1) return false;
    prescricoesMock.splice(index, 1);
    return true;
  }

  const result = await pool.query("DELETE FROM prescricoes WHERE id = $1", [id]);
  return (result.rowCount || 0) > 0;
}

/**
 * Gerar PDF da prescrição
 */
export async function gerarPdfPrescricao(id: string): Promise<{ url: string }> {
  // Implementação simplificada - retorna URL mockada
  // Em produção, geraria PDF real com jsPDF
  return {
    url: `/api/prescricoes/${id}/pdf`,
  };
}

// ============================================================================
// MEDICAMENTOS
// ============================================================================

interface MedicamentoInfo {
  id: string;
  nome: string;
  principioAtivo?: string;
  forma?: string;
  dosagem?: string;
  laboratorio?: string;
  categoria?: string;
}

// Mock data de medicamentos comuns em odontologia
let medicamentosMock: MedicamentoInfo[] = [
  {
    id: "med_1",
    nome: "Amoxicilina 500mg",
    principioAtivo: "Amoxicilina",
    forma: "Comprimido",
    dosagem: "500mg",
    categoria: "Antibiótico",
  },
  {
    id: "med_2",
    nome: "Amoxicilina + Ácido Clavulânico 875mg + 125mg",
    principioAtivo: "Amoxicilina + Ácido Clavulânico",
    forma: "Comprimido",
    dosagem: "875mg + 125mg",
    categoria: "Antibiótico",
  },
  {
    id: "med_3",
    nome: "Azitromicina 500mg",
    principioAtivo: "Azitromicina",
    forma: "Comprimido",
    dosagem: "500mg",
    categoria: "Antibiótico",
  },
  {
    id: "med_4",
    nome: "Ibuprofeno 600mg",
    principioAtivo: "Ibuprofeno",
    forma: "Comprimido",
    dosagem: "600mg",
    categoria: "Anti-inflamatório",
  },
  {
    id: "med_5",
    nome: "Paracetamol 1000mg",
    principioAtivo: "Paracetamol",
    forma: "Comprimido",
    dosagem: "1000mg",
    categoria: "Analgésico",
  },
  {
    id: "med_6",
    nome: "Nimesulida 100mg",
    principioAtivo: "Nimesulida",
    forma: "Comprimido",
    dosagem: "100mg",
    categoria: "Anti-inflamatório",
  },
  {
    id: "med_7",
    nome: "Metronidazol 400mg",
    principioAtivo: "Metronidazol",
    forma: "Comprimido",
    dosagem: "400mg",
    categoria: "Antibiótico",
  },
  {
    id: "med_8",
    nome: "Dexametasona 4mg",
    principioAtivo: "Dexametasona",
    forma: "Comprimido",
    dosagem: "4mg",
    categoria: "Corticosteroide",
  },
  {
    id: "med_9",
    nome: "Clorexidina 0,12%",
    principioAtivo: "Clorexidina",
    forma: "Solução oral",
    dosagem: "0,12%",
    categoria: "Antisséptico",
  },
  {
    id: "med_10",
    nome: "Tramadol 50mg",
    principioAtivo: "Tramadol",
    forma: "Cápsula",
    dosagem: "50mg",
    categoria: "Analgésico opioide",
  },
];

/**
 * Buscar medicamentos por nome
 */
export async function buscarMedicamentos(termo: string): Promise<MedicamentoInfo[]> {
  if (useMockData) {
    const termoLower = termo.toLowerCase();
    return medicamentosMock.filter(
      m =>
        m.nome.toLowerCase().includes(termoLower) ||
        m.principioAtivo?.toLowerCase().includes(termoLower)
    );
  }

  const result = await pool.query(
    `SELECT 
      id,
      nome,
      principio_ativo as "principioAtivo",
      forma,
      dosagem,
      laboratorio,
      categoria
    FROM medicamentos
    WHERE 
      LOWER(nome) LIKE LOWER($1) OR
      LOWER(principio_ativo) LIKE LOWER($1)
    ORDER BY nome
    LIMIT 20`,
    [`%${termo}%`]
  );

  return result.rows;
}

/**
 * Listar medicamentos mais usados
 */
export async function listarMedicamentosMaisUsados(limite: number): Promise<MedicamentoInfo[]> {
  if (useMockData) {
    // Retorna os primeiros N medicamentos como "mais usados"
    return medicamentosMock.slice(0, limite);
  }

  const result = await pool.query(
    `SELECT 
      m.id,
      m.nome,
      m.principio_ativo as "principioAtivo",
      m.forma,
      m.dosagem,
      m.laboratorio,
      m.categoria,
      COUNT(p.id) as uso_count
    FROM medicamentos m
    LEFT JOIN prescricoes p ON p.medicamentos::text LIKE '%' || m.nome || '%'
    GROUP BY m.id
    ORDER BY uso_count DESC, m.nome
    LIMIT $1`,
    [limite]
  );

  return result.rows;
}

/**
 * Obter informações de um medicamento
 */
export async function obterMedicamento(id: string): Promise<MedicamentoInfo | null> {
  if (useMockData) {
    return medicamentosMock.find(m => m.id === id) || null;
  }

  const result = await pool.query(
    `SELECT 
      id,
      nome,
      principio_ativo as "principioAtivo",
      forma,
      dosagem,
      laboratorio,
      categoria
    FROM medicamentos
    WHERE id = $1`,
    [id]
  );

  return result.rows[0] || null;
}

