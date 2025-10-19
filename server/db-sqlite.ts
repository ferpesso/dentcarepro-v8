// @ts-nocheck
import { eq, sql, like, or, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { InsertUser, users } from "../drizzle/schema";
import path from "path";
import fs from "fs";

let _db: ReturnType<typeof drizzle> | null = null;
let _sqlite: Database.Database | null = null;

// Criar diretório de dados se não existir
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'dentcarepro.db');

// Lazily create the drizzle instance
export async function getDb() {
  if (!_db) {
    try {
      _sqlite = new Database(dbPath);
      _sqlite.pragma('journal_mode = WAL');
      _db = drizzle(_sqlite);
      console.log(`[Database] Connected to SQLite at ${dbPath}`);
    } catch (error) {
      console.error("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.id) {
    throw new Error("User ID is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      id: user.id,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    }

    await db
      .insert(users)
      .values(values)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...updateSet,
          lastSignedIn: sql`CURRENT_TIMESTAMP`,
        },
      });
  } catch (error) {
    console.error("[Database] Error upserting user:", error);
    throw error;
  }
}

// Exportar funções básicas para compatibilidade
export async function listarUtentes() {
  const db = await getDb();
  if (!db) return [];
  
  try {
    const result = await db.query.utentes?.findMany() || [];
    return result;
  } catch (error) {
    console.error("[Database] Error listing utentes:", error);
    return [];
  }
}

export async function obterUtente(id: string) {
  const db = await getDb();
  if (!db) return null;
  
  try {
    const result = await db.query.utentes?.findFirst({
      where: (utentes, { eq }) => eq(utentes.id, id)
    });
    return result || null;
  } catch (error) {
    console.error("[Database] Error getting utente:", error);
    return null;
  }
}

export async function pesquisarUtentes(termo: string) {
  const db = await getDb();
  if (!db) return [];
  
  try {
    const result = await db.query.utentes?.findMany({
      where: (utentes, { like, or }) => or(
        like(utentes.nomeCompleto, `%${termo}%`),
        like(utentes.numeroUtente, `%${termo}%`)
      )
    }) || [];
    return result;
  } catch (error) {
    console.error("[Database] Error searching utentes:", error);
    return [];
  }
}

export async function criarUtente(dados: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  try {
    // Gerar ID único
    const id = `UT-${Date.now()}`;
    const numeroUtente = `${Date.now()}`.slice(-8);
    
    const novoUtente = {
      id,
      numeroUtente,
      ...dados,
      contacto: JSON.stringify(dados.contacto || {}),
      morada: JSON.stringify(dados.morada || {}),
      infoMedica: JSON.stringify(dados.infoMedica || {}),
      tags: JSON.stringify(dados.tags || []),
    };
    
    await db.insert(users).values(novoUtente as any);
    return { id, numeroUtente };
  } catch (error) {
    console.error("[Database] Error creating utente:", error);
    throw error;
  }
}

export async function atualizarUtente(id: string, dados: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  try {
    await db.update(users).set(dados as any).where(eq(users.id, id));
    return { sucesso: true };
  } catch (error) {
    console.error("[Database] Error updating utente:", error);
    throw error;
  }
}

export async function removerUtente(id: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  try {
    await db.update(users).set({ status: 'arquivado' } as any).where(eq(users.id, id));
    return { sucesso: true };
  } catch (error) {
    console.error("[Database] Error removing utente:", error);
    throw error;
  }
}

export async function obterEstatisticasUtentes() {
  const db = await getDb();
  if (!db) return { total: 0, ativos: 0, inativos: 0, arquivados: 0 };
  
  try {
    const todos = await db.query.utentes?.findMany() || [];
    return {
      total: todos.length,
      ativos: todos.filter((u: any) => u.status === 'ativo').length,
      inativos: todos.filter((u: any) => u.status === 'inativo').length,
      arquivados: todos.filter((u: any) => u.status === 'arquivado').length,
    };
  } catch (error) {
    console.error("[Database] Error getting statistics:", error);
    return { total: 0, ativos: 0, inativos: 0, arquivados: 0 };
  }
}

// Exportar todas as outras funções como stubs para compatibilidade
export const listarConsultas = async () => [];
export const obterConsulta = async (id: string) => null;
export const criarConsulta = async (dados: any) => ({ id: `CON-${Date.now()}` });
export const atualizarConsulta = async (id: string, dados: any) => ({ sucesso: true });
export const removerConsulta = async (id: string) => ({ sucesso: true });
export const listarDentistas = async () => [];
export const obterDentista = async (id: string) => null;
export const criarDentista = async (dados: any) => ({ id: `DEN-${Date.now()}` });
export const atualizarDentista = async (id: string, dados: any) => ({ sucesso: true });
export const removerDentista = async (id: string) => ({ sucesso: true });
export const listarComissoes = async () => [];
export const calcularComissoes = async (mes: string) => ({ total: 0, comissoes: [] });
export const pagarComissao = async (id: string, dados: any) => ({ sucesso: true });
export const listarLaboratorios = async () => [];
export const criarLaboratorio = async (dados: any) => ({ id: `LAB-${Date.now()}` });
export const atualizarLaboratorio = async (id: string, dados: any) => ({ sucesso: true });
export const removerLaboratorio = async (id: string) => ({ sucesso: true });
export const listarContasPagar = async () => [];
export const criarContaPagar = async (dados: any) => ({ id: `CP-${Date.now()}` });
export const pagarConta = async (id: string, dados: any) => ({ sucesso: true });
export const obterConfigClinica = async () => ({
  id: 'CONFIG-PRINCIPAL',
  nomeClinica: 'DentCare PRO',
  razaoSocial: 'DentCare PRO Lda',
  nif: '000000000',
  telefone: '+351 21 000 0000',
  email: 'geral@dentcarepro.pt',
});
export const atualizarConfigClinica = async (dados: any) => ({ sucesso: true });
export const listarFormasPagamento = async () => [
  { id: 'FP-001', nome: 'Dinheiro', tipo: 'dinheiro', ativo: true },
  { id: 'FP-002', nome: 'Multibanco', tipo: 'cartao', ativo: true },
  { id: 'FP-003', nome: 'Transferência Bancária', tipo: 'transferencia', ativo: true },
  { id: 'FP-004', nome: 'MBWay', tipo: 'digital', ativo: true },
];

