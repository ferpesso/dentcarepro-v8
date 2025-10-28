import { drizzle } from "drizzle-orm/node-postgres";
import pg from 'pg';
import type { InsertUser } from "../drizzle/schema";
import * as schema from "../drizzle/schema";
import { eq, like, and, gte, lte, sql } from "drizzle-orm";
import * as mock from './db-mock';

const { Pool } = pg;

let pool: pg.Pool | null = null;
let db: any = null;

if (process.env.DATABASE_URL) {
  try {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    });

    pool.on('connect', () => {
      console.log('[PostgreSQL] Connected to database');
    });

    pool.on('error', (err) => {
      console.error('[PostgreSQL] Unexpected error:', err);
      pool = null; // Invalida o pool em caso de erro
    });

    db = drizzle(pool, { schema });
    // Adicionar schema ao objeto db para acesso direto
    if (db) {
      (db as any).schema = schema;
    }

  } catch (error) {
    console.error('[PostgreSQL] Failed to create connection pool:', error);
    pool = null;
  }
} else {
  console.warn('[DB] DATABASE_URL não definida. A usar MOCK DATA.');
}

const useMockData = !pool;

// Exportar o objeto 'db' do Drizzle (pode ser nulo)
export { db, schema };

// ========================================
// FUNÇÕES DE ACESSO A DADOS (com fallback para mock)
// ========================================

// ========================================
// USERS
// ========================================

export async function getUser(userId: string) {
  if (useMockData) return mock.getUser(userId);
  // @ts-ignore
  return db.query.users.findFirst({ where: (users, { eq }) => eq(users.id, userId) });
}

export async function upsertUser(user: InsertUser) {
  if (useMockData) return mock.upsertUser(user);
  // @ts-ignore
  return db.insert(schema.users).values(user).onConflictDoUpdate({ target: schema.users.id, set: user });
}

// ========================================
// UTENTES (Pacientes)
// ========================================

export async function getUtentes() {
  if (useMockData) return mock.getUtentes();
  // @ts-ignore
  return db.query.utentes.findMany();
}

export async function listarUtentes() {
  if (useMockData) return mock.getUtentes();
  // @ts-ignore
  return db.query.utentes.findMany({
    orderBy: (utentes, { desc }) => [desc(utentes.criadoEm)]
  });
}

export async function getUtente(id: string) {
  if (useMockData) return mock.getUtente(id);
  // @ts-ignore
  return db.query.utentes.findFirst({ where: (utentes, { eq }) => eq(utentes.id, id) });
}

export async function obterUtente(id: string) {
  return getUtente(id);
}

export async function pesquisarUtentes(termo: string) {
  if (useMockData) return [];
  
  try {
    // @ts-ignore
    const result = await db.query.utentes.findMany({
      where: (utentes, { or, like }) => or(
        like(utentes.nomeCompleto, `%${termo}%`),
        like(utentes.nif, `%${termo}%`),
        like(utentes.numeroUtente, `%${termo}%`)
      ),
      limit: 50
    });
    return result;
  } catch (error) {
    console.error('[DB] Erro ao pesquisar utentes:', error);
    return [];
  }
}

export async function criarUtente(dados: any) {
  if (useMockData) return { id: 'mock-utente-id', ...dados };
  
  try {
    // Gerar ID único
    const id = `utente-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Gerar número de utente único
    const numeroUtente = `U${Date.now().toString().substr(-8)}`;
    
    // Preparar dados para inserção
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
      status: dados.status || 'ativo',
      tags: dados.tags ? JSON.stringify(dados.tags) : null,
      criadoPor: dados.criadoPor,
    };
    
    // @ts-ignore
    await db.insert(schema.utentes).values(dadosInsert);
    
    return { id, numeroUtente, ...dadosInsert };
  } catch (error) {
    console.error('[DB] Erro ao criar utente:', error);
    throw error;
  }
}

export async function atualizarUtente(id: string, dados: any) {
  if (useMockData) return { id, ...dados };
  
  try {
    // @ts-ignore
    await db.update(schema.utentes)
      .set({
        ...dados,
        atualizadoEm: new Date()
      })
      .where(eq(schema.utentes.id, id));
    
    return { id, ...dados };
  } catch (error) {
    console.error('[DB] Erro ao atualizar utente:', error);
    throw error;
  }
}

export async function removerUtente(id: string) {
  if (useMockData) return mock.removerUtente(id);
  
  try {
    // Soft delete - apenas marca como arquivado
    // @ts-ignore
    await db.update(schema.utentes)
      .set({ status: 'arquivado' })
      .where(eq(schema.utentes.id, id));
    
    return { success: true };
  } catch (error) {
    console.error('[DB] Erro ao remover utente:', error);
    throw error;
  }
}

export async function getUtentesStats() {
  if (useMockData) return mock.getUtentesStats();
  
  try {
    // @ts-ignore
    const result = await db.select({
      total: sql`count(*)`,
      ativos: sql`sum(case when status = 'ativo' then 1 else 0 end)`,
      inativos: sql`sum(case when status = 'inativo' then 1 else 0 end)`,
      arquivados: sql`sum(case when status = 'arquivado' then 1 else 0 end)`
    }).from(schema.utentes);
    
    return {
      total: Number(result[0].total) || 0,
      ativos: Number(result[0].ativos) || 0,
      inativos: Number(result[0].inativos) || 0,
      arquivados: Number(result[0].arquivados) || 0
    };
  } catch (error) {
    console.error('[DB] Erro ao obter estatísticas de utentes:', error);
    return { total: 0, ativos: 0, inativos: 0, arquivados: 0 };
  }
}

export async function obterEstatisticasUtentes() {
  return getUtentesStats();
}

// ========================================
// CONSULTAS
// ========================================

export async function criarConsulta(dados: any) {
  if (useMockData) return { id: 'mock-consulta-id', ...dados };
  
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
      status: dados.status || 'agendada',
      observacoes: dados.observacoes || null,
      valorEstimado: dados.valorEstimado || null,
      classificacaoRisco: dados.classificacaoRisco || null,
    };
    
    // @ts-ignore
    await db.insert(schema.consultas).values(dadosInsert);
    
    return { id, ...dadosInsert };
  } catch (error) {
    console.error('[DB] Erro ao criar consulta:', error);
    throw error;
  }
}

export async function listarConsultas() {
  if (useMockData) return [];
  
  try {
    // @ts-ignore
    return db.query.consultas.findMany({
      orderBy: (consultas, { desc }) => [desc(consultas.dataHora)]
    });
  } catch (error) {
    console.error('[DB] Erro ao listar consultas:', error);
    return [];
  }
}

export async function listarConsultasPorData(data: string) {
  if (useMockData) return [];
  
  try {
    const dataInicio = new Date(data);
    dataInicio.setHours(0, 0, 0, 0);
    
    const dataFim = new Date(data);
    dataFim.setHours(23, 59, 59, 999);
    
    // @ts-ignore
    return db.query.consultas.findMany({
      where: (consultas, { and, gte, lte }) => and(
        gte(consultas.dataHora, dataInicio),
        lte(consultas.dataHora, dataFim)
      ),
      orderBy: (consultas, { asc }) => [asc(consultas.dataHora)]
    });
  } catch (error) {
    console.error('[DB] Erro ao listar consultas por data:', error);
    return [];
  }
}

export async function listarConsultasPorMedico(medicoId: string) {
  if (useMockData) return [];
  
  try {
    // @ts-ignore
    return db.query.consultas.findMany({
      where: (consultas, { eq }) => eq(consultas.medicoId, medicoId),
      orderBy: (consultas, { desc }) => [desc(consultas.dataHora)]
    });
  } catch (error) {
    console.error('[DB] Erro ao listar consultas por médico:', error);
    return [];
  }
}

export async function listarConsultasPorPeriodo(dataInicio: string, dataFim: string) {
  if (useMockData) return [];
  
  try {
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);
    
    // @ts-ignore
    return db.query.consultas.findMany({
      where: (consultas, { and, gte, lte }) => and(
        gte(consultas.dataHora, inicio),
        lte(consultas.dataHora, fim)
      ),
      orderBy: (consultas, { asc }) => [asc(consultas.dataHora)]
    });
  } catch (error) {
    console.error('[DB] Erro ao listar consultas por período:', error);
    return [];
  }
}

export async function obterConsulta(id: string) {
  if (useMockData) return null;
  
  try {
    // @ts-ignore
    return db.query.consultas.findFirst({
      where: (consultas, { eq }) => eq(consultas.id, id)
    });
  } catch (error) {
    console.error('[DB] Erro ao obter consulta:', error);
    return null;
  }
}

export async function atualizarConsulta(id: string, dados: any) {
  if (useMockData) return { id, ...dados };
  
  try {
    // @ts-ignore
    await db.update(schema.consultas)
      .set({
        ...dados,
        atualizadoEm: new Date()
      })
      .where(eq(schema.consultas.id, id));
    
    return { id, ...dados };
  } catch (error) {
    console.error('[DB] Erro ao atualizar consulta:', error);
    throw error;
  }
}

export async function removerConsulta(id: string) {
  if (useMockData) return { success: true };
  
  try {
    // @ts-ignore
    await db.delete(schema.consultas)
      .where(eq(schema.consultas.id, id));
    
    return { success: true };
  } catch (error) {
    console.error('[DB] Erro ao remover consulta:', error);
    throw error;
  }
}

export async function verificarConflito(medicoId: string, dataHora: Date, duracao: number = 30) {
  if (useMockData) return false;
  
  try {
    const dataInicio = new Date(dataHora);
    const dataFim = new Date(dataHora);
    dataFim.setMinutes(dataFim.getMinutes() + duracao);
    
    // @ts-ignore
    const consultas = await db.query.consultas.findMany({
      where: (consultas, { and, eq, gte, lte, or }) => and(
        eq(consultas.medicoId, medicoId),
        or(
          and(
            gte(consultas.dataHora, dataInicio),
            lte(consultas.dataHora, dataFim)
          )
        )
      )
    });
    
    return consultas.length > 0;
  } catch (error) {
    console.error('[DB] Erro ao verificar conflito:', error);
    return false;
  }
}

export async function obterEstatisticasConsultas() {
  if (useMockData) return { total: 0, agendadas: 0, realizadas: 0, canceladas: 0 };
  
  try {
    // @ts-ignore
    const result = await db.select({
      total: sql`count(*)`,
      agendadas: sql`sum(case when status = 'agendada' then 1 else 0 end)`,
      confirmadas: sql`sum(case when status = 'confirmada' then 1 else 0 end)`,
      realizadas: sql`sum(case when status = 'realizada' then 1 else 0 end)`,
      canceladas: sql`sum(case when status = 'cancelada' then 1 else 0 end)`,
      faltou: sql`sum(case when status = 'faltou' then 1 else 0 end)`
    }).from(schema.consultas);
    
    return {
      total: Number(result[0].total) || 0,
      agendadas: Number(result[0].agendadas) || 0,
      confirmadas: Number(result[0].confirmadas) || 0,
      realizadas: Number(result[0].realizadas) || 0,
      canceladas: Number(result[0].canceladas) || 0,
      faltou: Number(result[0].faltou) || 0
    };
  } catch (error) {
    console.error('[DB] Erro ao obter estatísticas de consultas:', error);
    return { total: 0, agendadas: 0, confirmadas: 0, realizadas: 0, canceladas: 0, faltou: 0 };
  }
}

// ========================================
// COMISSÕES
// ========================================

export async function obterConfigComissao(dentistaId: string) {
  if (useMockData) return null;
  
  try {
    // Verificar se existe tabela config_comissoes no schema
    if (!schema.configComissoes) {
      console.warn('[DB] Tabela config_comissoes não encontrada no schema');
      return {
        dentistaId,
        percentualPadrao: 30,
        tipoCalculo: 'percentual'
      };
    }
    
    // @ts-ignore
    return db.query.configComissoes.findFirst({
      where: (config, { eq }) => eq(config.dentistaId, dentistaId)
    });
  } catch (error) {
    console.error('[DB] Erro ao obter config de comissão:', error);
    return {
      dentistaId,
      percentualPadrao: 30,
      tipoCalculo: 'percentual'
    };
  }
}

export async function criarComissao(dados: any) {
  if (useMockData) return { id: 'mock-comissao-id', ...dados };
  
  try {
    // Verificar se existe tabela comissoes no schema
    if (!schema.comissoes) {
      console.warn('[DB] Tabela comissoes não encontrada no schema');
      return { id: 'temp-comissao-id', ...dados };
    }
    
    const id = `comissao-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const dadosInsert = {
      id,
      dentistaId: dados.dentistaId,
      faturaId: dados.faturaId || null,
      valor: dados.valor,
      percentual: dados.percentual || null,
      status: dados.status || 'pendente',
      dataCriacao: new Date(),
      dataPagamento: dados.dataPagamento || null,
      observacoes: dados.observacoes || null
    };
    
    // @ts-ignore
    await db.insert(schema.comissoes).values(dadosInsert);
    
    return { id, ...dadosInsert };
  } catch (error) {
    console.error('[DB] Erro ao criar comissão:', error);
    throw error;
  }
}

export async function listarComissoesDentista(dentistaId: string, mes?: string) {
  if (useMockData) return [];
  
  try {
    // Verificar se existe tabela comissoes no schema
    if (!schema.comissoes) {
      console.warn('[DB] Tabela comissoes não encontrada no schema');
      return [];
    }
    
    if (mes) {
      // Filtrar por mês específico
      const [ano, mesNum] = mes.split('-');
      const dataInicio = new Date(parseInt(ano), parseInt(mesNum) - 1, 1);
      const dataFim = new Date(parseInt(ano), parseInt(mesNum), 0, 23, 59, 59);
      
      // @ts-ignore
      return db.query.comissoes.findMany({
        where: (comissoes, { and, eq, gte, lte }) => and(
          eq(comissoes.dentistaId, dentistaId),
          gte(comissoes.dataCriacao, dataInicio),
          lte(comissoes.dataCriacao, dataFim)
        ),
        orderBy: (comissoes, { desc }) => [desc(comissoes.dataCriacao)]
      });
    } else {
      // Listar todas
      // @ts-ignore
      return db.query.comissoes.findMany({
        where: (comissoes, { eq }) => eq(comissoes.dentistaId, dentistaId),
        orderBy: (comissoes, { desc }) => [desc(comissoes.dataCriacao)]
      });
    }
  } catch (error) {
    console.error('[DB] Erro ao listar comissões do dentista:', error);
    return [];
  }
}

// ========================================
// HELPER FUNCTIONS
// ========================================

export async function getDb() {
  if (useMockData) {
    console.warn('[DB] getDb chamado em modo MOCK. Retornando null.');
    return null;
  }
  return pool;
}

export async function pagarComissao(id: string, formaPagamento: string, dataPagamento?: Date) {
  if (useMockData) return { id, status: 'pago' };
  
  try {
    // Verificar se existe tabela comissoes no schema
    if (!schema.comissoes) {
      console.warn('[DB] Tabela comissoes não encontrada no schema');
      return { id, status: 'pago' };
    }
    
    // @ts-ignore
    await db.update(schema.comissoes)
      .set({
        status: 'pago',
        dataPagamento: dataPagamento || new Date(),
        formaPagamento
      })
      .where(eq(schema.comissoes.id, id));
    
    return { id, status: 'pago' };
  } catch (error) {
    console.error('[DB] Erro ao pagar comissão:', error);
    throw error;
  }
}

export async function salvarConfigComissao(dados: any) {
  if (useMockData) return { id: 'mock-config-id', ...dados };
  
  try {
    // Verificar se existe tabela config_comissoes no schema
    if (!schema.configComissoes) {
      console.warn('[DB] Tabela config_comissoes não encontrada no schema');
      return { id: 'temp-config-id', ...dados };
    }
    
    const id = dados.id || `config-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const dadosInsert = {
      id,
      dentistaId: dados.dentistaId,
      percentualPadrao: dados.percentualPadrao || 30,
      tipoCalculo: dados.tipoCalculo || 'percentual',
      ativo: dados.ativo !== undefined ? dados.ativo : true
    };
    
    // @ts-ignore
    await db.insert(schema.configComissoes)
      .values(dadosInsert)
      .onConflictDoUpdate({
        target: schema.configComissoes.dentistaId,
        set: dadosInsert
      });
    
    return { id, ...dadosInsert };
  } catch (error) {
    console.error('[DB] Erro ao salvar config de comissão:', error);
    throw error;
  }
}

// ========================================
// LABORATÓRIOS
// ========================================

export async function listarLaboratorios() {
  if (useMockData) return [];
  
  try {
    // Verificar se existe tabela laboratorios no schema
    if (!schema.laboratorios) {
      console.warn('[DB] Tabela laboratorios não encontrada no schema');
      return [];
    }
    
    // @ts-ignore
    return db.query.laboratorios.findMany({
      orderBy: (laboratorios, { asc }) => [asc(laboratorios.nome)]
    });
  } catch (error) {
    console.error('[DB] Erro ao listar laboratórios:', error);
    return [];
  }
}

export async function criarLaboratorio(dados: any) {
  if (useMockData) return { id: 'mock-lab-id', ...dados };
  
  try {
    if (!schema.laboratorios) {
      console.warn('[DB] Tabela laboratorios não encontrada no schema');
      return { id: 'temp-lab-id', ...dados };
    }
    
    const id = `lab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const dadosInsert = {
      id,
      nome: dados.nome,
      contacto: dados.contacto ? JSON.stringify(dados.contacto) : null,
      morada: dados.morada ? JSON.stringify(dados.morada) : null,
      especialidades: dados.especialidades ? JSON.stringify(dados.especialidades) : null,
      observacoes: dados.observacoes || null,
      ativo: dados.ativo !== undefined ? dados.ativo : true
    };
    
    // @ts-ignore
    await db.insert(schema.laboratorios).values(dadosInsert);
    
    return { id, ...dadosInsert };
  } catch (error) {
    console.error('[DB] Erro ao criar laboratório:', error);
    throw error;
  }
}

export async function atualizarLaboratorio(id: string, dados: any) {
  if (useMockData) return { id, ...dados };
  
  try {
    if (!schema.laboratorios) {
      console.warn('[DB] Tabela laboratorios não encontrada no schema');
      return { id, ...dados };
    }
    
    // @ts-ignore
    await db.update(schema.laboratorios)
      .set(dados)
      .where(eq(schema.laboratorios.id, id));
    
    return { id, ...dados };
  } catch (error) {
    console.error('[DB] Erro ao atualizar laboratório:', error);
    throw error;
  }
}

export async function removerLaboratorio(id: string) {
  if (useMockData) return { success: true };
  
  try {
    if (!schema.laboratorios) {
      console.warn('[DB] Tabela laboratorios não encontrada no schema');
      return { success: true };
    }
    
    // @ts-ignore
    await db.update(schema.laboratorios)
      .set({ ativo: false })
      .where(eq(schema.laboratorios.id, id));
    
    return { success: true };
  } catch (error) {
    console.error('[DB] Erro ao remover laboratório:', error);
    throw error;
  }
}

export async function obterLaboratorio(id: string) {
  if (useMockData) return null;
  
  try {
    if (!schema.laboratorios) {
      console.warn('[DB] Tabela laboratorios não encontrada no schema');
      return null;
    }
    
    // @ts-ignore
    return db.query.laboratorios.findFirst({
      where: (laboratorios, { eq }) => eq(laboratorios.id, id)
    });
  } catch (error) {
    console.error('[DB] Erro ao obter laboratório:', error);
    return null;
  }
}

export async function excluirLaboratorio(id: string) {
  if (useMockData) return { success: true };
  
  try {
    if (!schema.laboratorios) {
      console.warn('[DB] Tabela laboratorios não encontrada no schema');
      return { success: true };
    }
    
    // Soft delete
    // @ts-ignore
    await db.update(schema.laboratorios)
      .set({ ativo: false })
      .where(eq(schema.laboratorios.id, id));
    
    return { success: true };
  } catch (error) {
    console.error('[DB] Erro ao excluir laboratório:', error);
    throw error;
  }
}
