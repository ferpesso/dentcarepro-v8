import { Router } from 'express';
import { getDb } from './db';

const router = Router();

router.get('/init-database', async (req, res) => {
  try {
    console.log('🔧 Inicializando base de dados...');

    const pool = await getDb();

    // Criar tabela users
    await pool.query(`
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

    console.log('✅ Tabela users criada!');

    // Criar tabela config_clinica
    await pool.query(`
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

    console.log('✅ Tabela config_clinica criada!');

    // Criar tabela de utentes
    await pool.query(`
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

    // Criar índices
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_utentes_nome ON utentes(nome);
      CREATE INDEX IF NOT EXISTS idx_utentes_nif ON utentes(nif);
      CREATE INDEX IF NOT EXISTS idx_utentes_numero_sns ON utentes(numero_sns);
      CREATE INDEX IF NOT EXISTS idx_utentes_estado ON utentes(estado);
    `);

    console.log('✅ Tabela utentes criada!');

    // Verificar se já existem dados
    const countResult = await pool.query('SELECT COUNT(*) as count FROM utentes');
    const count = parseInt(countResult.rows[0]?.count || '0');

    // Inserir configuração padrão da clínica se não existir
    const configResult = await pool.query('SELECT COUNT(*) as count FROM config_clinica');
    const configCount = parseInt(configResult.rows[0]?.count || '0');
    
    if (configCount === 0) {
      await pool.query(`
        INSERT INTO config_clinica (id, nome_clinica, email, cidade, pais)
        VALUES ('config-1', 'Clínica Dentária', 'geral@clinica.pt', 'Lisboa', 'Portugal')
      `);
      console.log('✅ Configuração padrão da clínica criada!');
    }

    // Inserir utilizador demo se não existir
    const userResult = await pool.query('SELECT COUNT(*) as count FROM users');
    const userCount = parseInt(userResult.rows[0]?.count || '0');
    
    if (userCount === 0) {
      await pool.query(`
        INSERT INTO users (id, name, email, login_method, role, last_signed_in)
        VALUES ('user-demo', 'Utilizador de Desenvolvimento', 'demo@dentcarepro.pt', 'demo', 'admin', CURRENT_TIMESTAMP)
      `);
      console.log('✅ Utilizador demo criado!');
    }

    if (count === 0) {
      // Inserir dados de demonstração
      await pool.query(`
        INSERT INTO utentes (
          id, codigo, nome, data_nascimento, genero, nif, numero_sns,
          email, telefone, telemovel, cidade, alergias, medicamentos, estado
        ) VALUES
        ('utente-1', 'U001', 'João Silva', '1980-05-15', 'M', '123456789', '123456789', 'joao.silva@email.pt', '912345678', '912345678', 'Lisboa', 'Penicilina', '', 'ativo'),
        ('utente-2', 'U002', 'Maria Santos', '1992-08-22', 'F', '987654321', '987654321', 'maria.santos@email.pt', '923456789', '923456789', 'Porto', '', 'Paracetamol', 'ativo'),
        ('utente-3', 'U003', 'Carlos Oliveira', '1975-03-10', 'M', '456789123', NULL, 'carlos.oliveira@email.pt', '934567890', '934567890', 'Coimbra', 'Látex', 'Ibuprofeno', 'ativo'),
        ('utente-4', 'U004', 'Ana Costa', '1988-11-30', 'F', '789123456', '456789123', 'ana.costa@email.pt', '945678901', '945678901', 'Braga', '', '', 'ativo'),
        ('utente-5', 'U005', 'Pedro Ferreira', '1995-01-18', 'M', '321654987', '321654987', 'pedro.ferreira@email.pt', '956789012', '956789012', 'Faro', 'Anestesia local', '', 'ativo')
      `);

      console.log('✅ Dados de demonstração inseridos!');
    } else {
      console.log(`ℹ️ Base de dados já contém ${count} utentes`);
    }

    // Verificar utentes criados
    const finalCountResult = await pool.query('SELECT COUNT(*) as count FROM utentes');
    const finalCount = parseInt(finalCountResult.rows[0]?.count || '0');

    // Contar todas as tabelas
    const usersFinalCount = await pool.query('SELECT COUNT(*) as count FROM users');
    const configFinalCount = await pool.query('SELECT COUNT(*) as count FROM config_clinica');

    res.json({
      success: true,
      message: 'Base de dados inicializada com sucesso!',
      tables: {
        users: parseInt(usersFinalCount.rows[0]?.count || '0'),
        config_clinica: parseInt(configFinalCount.rows[0]?.count || '0'),
        utentes: finalCount
      }
    });

  } catch (error: any) {
    console.error('❌ Erro ao inicializar base de dados:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      details: error.stack
    });
  }
});

export default router;

