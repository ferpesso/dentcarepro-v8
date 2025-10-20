#!/usr/bin/env node

import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { Pool } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initDatabase() {
  const DATABASE_URL = process.env.DATABASE_URL;
  
  if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL não está definida!');
    console.error('Execute: export DATABASE_URL="postgresql://..."');
    process.exit(1);
  }

  console.log('🔌 Conectando à base de dados...');
  console.log(`📍 URL: ${DATABASE_URL.replace(/:[^:@]+@/, ':****@')}`);

  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    // Testar conexão
    const testResult = await pool.query('SELECT NOW()');
    console.log('✅ Conexão estabelecida!', testResult.rows[0].now);

    // Ler o script SQL
    const sqlPath = path.join(__dirname, '..', 'drizzle', 'init-database.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('\n📝 Executando script SQL...\n');

    // Executar o script
    await pool.query(sql);

    console.log('\n✅ Base de dados inicializada com sucesso!');
    console.log('\n📊 Verificando tabelas criadas...\n');

    // Verificar tabelas criadas
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);

    console.log('Tabelas criadas:');
    tablesResult.rows.forEach(row => {
      console.log(`  ✓ ${row.table_name}`);
    });

    // Verificar utentes inseridos
    const utentesResult = await pool.query('SELECT COUNT(*) FROM utentes');
    console.log(`\n👥 Utentes de demonstração: ${utentesResult.rows[0].count}`);

  } catch (error) {
    console.error('\n❌ Erro ao inicializar base de dados:');
    console.error(error.message);
    if (error.detail) console.error('Detalhe:', error.detail);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

initDatabase();

