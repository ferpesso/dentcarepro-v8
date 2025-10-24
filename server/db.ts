import { drizzle } from "drizzle-orm/node-postgres";
import pg from 'pg';
import type { InsertUser } from "../drizzle/schema";
import * as schema from "../drizzle/schema";
import { eq } from "drizzle-orm";
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

  } catch (error) {
    console.error('[PostgreSQL] Failed to create connection pool:', error);
    pool = null;
  }
} else {
  console.warn('[DB] DATABASE_URL não definida. A usar MOCK DATA.');
}

const useMockData = !pool;

// Exportar o objeto 'db' do Drizzle (pode ser nulo)
export { db };

// ========================================
// FUNÇÕES DE ACESSO A DADOS (com fallback para mock)
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

export async function getUtentes() {
  if (useMockData) return mock.getUtentes();
  // @ts-ignore
  return db.query.utentes.findMany();
}

export async function getUtente(id: string) {
  if (useMockData) return mock.getUtente(id);
    // @ts-ignore
  return db.query.utentes.findFirst({ where: (utentes, { eq }) => eq(utentes.id, id) });
}

// ... e assim por diante para todas as outras funções
// Vou adicionar apenas as que são essenciais para o diagnóstico inicial

export async function getUtentesStats() {
    if (useMockData) return mock.getUtentesStats();
    return { total: 0, ativos: 0, inativos: 0, arquivados: 0 };
}

export async function removerUtente(id: string) {
    if (useMockData) return mock.removerUtente(id);
    // @ts-ignore
    return db.delete(schema.utentes).where(eq(schema.utentes.id, id));
}



export async function getDb() {
  if (useMockData) {
    console.warn('[DB] getDb chamado em modo MOCK. Retornando null.');
    return null;
  }
  return pool;
}

