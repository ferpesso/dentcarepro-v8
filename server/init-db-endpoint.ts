import { Router } from 'express';
import { db } from './db';
import { sql } from 'drizzle-orm';

const router = Router();

router.get('/init-database', async (req, res) => {
  try {
    console.log('🔧 Inicializando base de dados...');

    // Criar tabelas
    await db.execute(sql`
      -- Criar tabela de utentes
      CREATE TABLE IF NOT EXISTS utentes (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        nif VARCHAR(20),
        sns VARCHAR(20),
        data_nascimento DATE,
        genero VARCHAR(10),
        estado_civil VARCHAR(50),
        profissao VARCHAR(100),
        telefone_principal VARCHAR(20),
        telefone_alternativo VARCHAR(20),
        email VARCHAR(255),
        morada_rua TEXT,
        morada_codigo_postal VARCHAR(20),
        morada_cidade VARCHAR(100),
        morada_pais VARCHAR(100) DEFAULT 'Portugal',
        contacto_emergencia_nome VARCHAR(255),
        contacto_emergencia_parentesco VARCHAR(100),
        contacto_emergencia_telefone VARCHAR(20),
        alergias TEXT,
        medicamentos_atuais TEXT,
        doencas_cronicas TEXT,
        cirurgias_anteriores TEXT,
        observacoes_medicas TEXT,
        foto_url TEXT,
        consentimento_rgpd BOOLEAN DEFAULT FALSE,
        data_registo TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(20) DEFAULT 'Ativo',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Criar índices
      CREATE INDEX IF NOT EXISTS idx_utentes_nome ON utentes(nome);
      CREATE INDEX IF NOT EXISTS idx_utentes_nif ON utentes(nif);
      CREATE INDEX IF NOT EXISTS idx_utentes_sns ON utentes(sns);
      CREATE INDEX IF NOT EXISTS idx_utentes_status ON utentes(status);
    `);

    console.log('✅ Tabelas criadas!');

    // Inserir dados de demonstração
    await db.execute(sql`
      INSERT INTO utentes (
        nome, nif, sns, data_nascimento, genero, telefone_principal, email,
        morada_cidade, alergias, medicamentos_atuais, status
      ) VALUES
      ('João Silva', '123456789', '123456789', '1980-05-15', 'M', '912345678', 'joao.silva@email.pt', 'Lisboa', 'Penicilina', 'Nenhum', 'Ativo'),
      ('Maria Santos', '987654321', '987654321', '1992-08-22', 'F', '923456789', 'maria.santos@email.pt', 'Porto', 'Nenhuma', 'Paracetamol', 'Ativo'),
      ('Carlos Oliveira', '456789123', NULL, '1975-03-10', 'M', '934567890', 'carlos.oliveira@email.pt', 'Coimbra', 'Látex', 'Ibuprofeno', 'Ativo'),
      ('Ana Costa', '789123456', '456789123', '1988-11-30', 'F', '945678901', 'ana.costa@email.pt', 'Braga', 'Nenhuma', 'Nenhum', 'Ativo'),
      ('Pedro Ferreira', '321654987', '321654987', '1995-01-18', 'M', '956789012', 'pedro.ferreira@email.pt', 'Faro', 'Anestesia local', 'Nenhum', 'Ativo')
      ON CONFLICT DO NOTHING;
    `);

    console.log('✅ Dados de demonstração inseridos!');

    // Verificar utentes criados
    const result = await db.execute(sql`SELECT COUNT(*) as count FROM utentes`);
    const count = result.rows[0]?.count || 0;

    res.json({
      success: true,
      message: 'Base de dados inicializada com sucesso!',
      utentes_count: count
    });

  } catch (error: any) {
    console.error('❌ Erro ao inicializar base de dados:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;

