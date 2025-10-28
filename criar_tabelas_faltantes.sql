-- Script para criar tabelas faltantes no DentCarePro v8
-- Data: 28 de Outubro de 2025
-- Objetivo: Corrigir estrutura do banco de dados

-- =====================================================
-- 1. TABELA DE CONSULTAS (CRÍTICA - NÃO EXISTE)
-- =====================================================

CREATE TABLE IF NOT EXISTS consultas (
  id VARCHAR(255) PRIMARY KEY,
  utente_id VARCHAR(255) REFERENCES utentes(id) ON DELETE CASCADE,
  dentista_id VARCHAR(255) REFERENCES users(id) ON DELETE SET NULL,
  data_hora TIMESTAMP NOT NULL,
  duracao INTEGER DEFAULT 30,
  tipo VARCHAR(100),
  status VARCHAR(50) DEFAULT 'agendada',
  notas TEXT,
  valor DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_consultas_data_hora ON consultas(data_hora);
CREATE INDEX IF NOT EXISTS idx_consultas_utente ON consultas(utente_id);
CREATE INDEX IF NOT EXISTS idx_consultas_dentista ON consultas(dentista_id);
CREATE INDEX IF NOT EXISTS idx_consultas_status ON consultas(status);

-- =====================================================
-- 2. TABELA DE TRATAMENTOS
-- =====================================================

CREATE TABLE IF NOT EXISTS tratamentos (
  id VARCHAR(255) PRIMARY KEY,
  utente_id VARCHAR(255) REFERENCES utentes(id) ON DELETE CASCADE,
  consulta_id VARCHAR(255) REFERENCES consultas(id) ON DELETE SET NULL,
  dentista_id VARCHAR(255) REFERENCES users(id) ON DELETE SET NULL,
  tipo VARCHAR(100) NOT NULL,
  descricao TEXT,
  dente VARCHAR(10),
  faces VARCHAR(50),
  valor DECIMAL(10,2),
  status VARCHAR(50) DEFAULT 'planejado',
  data_planejamento DATE,
  data_realizacao DATE,
  notas TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tratamentos_utente ON tratamentos(utente_id);
CREATE INDEX IF NOT EXISTS idx_tratamentos_consulta ON tratamentos(consulta_id);
CREATE INDEX IF NOT EXISTS idx_tratamentos_status ON tratamentos(status);

-- =====================================================
-- 3. TABELA DE PRESCRIÇÕES
-- =====================================================

CREATE TABLE IF NOT EXISTS prescricoes (
  id VARCHAR(255) PRIMARY KEY,
  utente_id VARCHAR(255) REFERENCES utentes(id) ON DELETE CASCADE,
  consulta_id VARCHAR(255) REFERENCES consultas(id) ON DELETE SET NULL,
  dentista_id VARCHAR(255) REFERENCES users(id) ON DELETE SET NULL,
  medicamento VARCHAR(255) NOT NULL,
  dosagem VARCHAR(100),
  frequencia VARCHAR(100),
  duracao VARCHAR(100),
  via_administracao VARCHAR(50),
  notas TEXT,
  data_prescricao DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_prescricoes_utente ON prescricoes(utente_id);
CREATE INDEX IF NOT EXISTS idx_prescricoes_consulta ON prescricoes(consulta_id);

-- =====================================================
-- 4. TABELA DE LABORATÓRIOS
-- =====================================================

CREATE TABLE IF NOT EXISTS laboratorios (
  id VARCHAR(255) PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  contato VARCHAR(255),
  telefone VARCHAR(50),
  email VARCHAR(255),
  morada TEXT,
  nif VARCHAR(50),
  notas TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_laboratorios_ativo ON laboratorios(ativo);

-- =====================================================
-- 5. TABELA DE TRABALHOS DE LABORATÓRIO
-- =====================================================

CREATE TABLE IF NOT EXISTS trabalhos_laboratorio (
  id VARCHAR(255) PRIMARY KEY,
  laboratorio_id VARCHAR(255) REFERENCES laboratorios(id) ON DELETE SET NULL,
  utente_id VARCHAR(255) REFERENCES utentes(id) ON DELETE CASCADE,
  consulta_id VARCHAR(255) REFERENCES consultas(id) ON DELETE SET NULL,
  dentista_id VARCHAR(255) REFERENCES users(id) ON DELETE SET NULL,
  tipo_trabalho VARCHAR(100) NOT NULL,
  descricao TEXT,
  dentes VARCHAR(100),
  cor VARCHAR(50),
  data_envio DATE,
  data_prevista_entrega DATE,
  data_entrega_real DATE,
  valor DECIMAL(10,2),
  status VARCHAR(50) DEFAULT 'enviado',
  notas TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_trabalhos_lab_laboratorio ON trabalhos_laboratorio(laboratorio_id);
CREATE INDEX IF NOT EXISTS idx_trabalhos_lab_utente ON trabalhos_laboratorio(utente_id);
CREATE INDEX IF NOT EXISTS idx_trabalhos_lab_status ON trabalhos_laboratorio(status);
CREATE INDEX IF NOT EXISTS idx_trabalhos_lab_data_entrega ON trabalhos_laboratorio(data_prevista_entrega);

-- =====================================================
-- 6. TABELA DE CONTAS A PAGAR
-- =====================================================

CREATE TABLE IF NOT EXISTS contas_pagar (
  id VARCHAR(255) PRIMARY KEY,
  descricao VARCHAR(255) NOT NULL,
  fornecedor VARCHAR(255),
  categoria VARCHAR(100),
  valor DECIMAL(10,2) NOT NULL,
  data_vencimento DATE NOT NULL,
  data_pagamento DATE,
  forma_pagamento VARCHAR(50),
  status VARCHAR(50) DEFAULT 'pendente',
  notas TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_contas_pagar_status ON contas_pagar(status);
CREATE INDEX IF NOT EXISTS idx_contas_pagar_vencimento ON contas_pagar(data_vencimento);

-- =====================================================
-- 7. TABELA DE ITENS DE FATURA
-- =====================================================

CREATE TABLE IF NOT EXISTS itens_fatura (
  id VARCHAR(255) PRIMARY KEY,
  fatura_id VARCHAR(255) REFERENCES faturas(id) ON DELETE CASCADE,
  tratamento_id VARCHAR(255) REFERENCES tratamentos(id) ON DELETE SET NULL,
  descricao VARCHAR(255) NOT NULL,
  quantidade INTEGER DEFAULT 1,
  valor_unitario DECIMAL(10,2) NOT NULL,
  valor_total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_itens_fatura_fatura ON itens_fatura(fatura_id);

-- =====================================================
-- 8. TABELA DE PAGAMENTOS
-- =====================================================

CREATE TABLE IF NOT EXISTS pagamentos (
  id VARCHAR(255) PRIMARY KEY,
  fatura_id VARCHAR(255) REFERENCES faturas(id) ON DELETE CASCADE,
  valor DECIMAL(10,2) NOT NULL,
  forma_pagamento VARCHAR(50) NOT NULL,
  data_pagamento DATE NOT NULL,
  referencia VARCHAR(100),
  notas TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_pagamentos_fatura ON pagamentos(fatura_id);
CREATE INDEX IF NOT EXISTS idx_pagamentos_data ON pagamentos(data_pagamento);

-- =====================================================
-- 9. ADICIONAR CAMPOS FALTANTES EM TABELAS EXISTENTES
-- =====================================================

-- Adicionar campos em utentes se não existirem
ALTER TABLE utentes ADD COLUMN IF NOT EXISTS genero VARCHAR(20);
ALTER TABLE utentes ADD COLUMN IF NOT EXISTS profissao VARCHAR(100);
ALTER TABLE utentes ADD COLUMN IF NOT EXISTS estado_civil VARCHAR(50);
ALTER TABLE utentes ADD COLUMN IF NOT EXISTS contacto_emergencia VARCHAR(255);
ALTER TABLE utentes ADD COLUMN IF NOT EXISTS telefone_emergencia VARCHAR(50);
ALTER TABLE utentes ADD COLUMN IF NOT EXISTS alergias TEXT;
ALTER TABLE utentes ADD COLUMN IF NOT EXISTS medicamentos_uso TEXT;
ALTER TABLE utentes ADD COLUMN IF NOT EXISTS observacoes_medicas TEXT;
ALTER TABLE utentes ADD COLUMN IF NOT EXISTS ativo BOOLEAN DEFAULT true;
ALTER TABLE utentes ADD COLUMN IF NOT EXISTS foto_url VARCHAR(500);

-- Adicionar campos em faturas se não existirem
ALTER TABLE faturas ADD COLUMN IF NOT EXISTS desconto DECIMAL(10,2) DEFAULT 0;
ALTER TABLE faturas ADD COLUMN IF NOT EXISTS observacoes TEXT;
ALTER TABLE faturas ADD COLUMN IF NOT EXISTS data_vencimento DATE;

-- Adicionar campos em users se não existirem
ALTER TABLE users ADD COLUMN IF NOT EXISTS telefone VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS especialidade VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS numero_ordem VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS foto_url VARCHAR(500);
ALTER TABLE users ADD COLUMN IF NOT EXISTS ativo BOOLEAN DEFAULT true;

-- =====================================================
-- 10. DADOS DE EXEMPLO PARA TESTES
-- =====================================================

-- Inserir consultas de exemplo (apenas se não existirem)
INSERT INTO consultas (id, utente_id, dentista_id, data_hora, duracao, tipo, status, valor)
SELECT 
  'consulta-' || generate_series(1, 5),
  (SELECT id FROM utentes LIMIT 1 OFFSET (generate_series(1, 5) % (SELECT COUNT(*) FROM utentes))),
  (SELECT id FROM users WHERE role = 'dentista' OR role = 'admin' LIMIT 1),
  CURRENT_TIMESTAMP + (generate_series(1, 5) || ' days')::interval,
  30,
  CASE (generate_series(1, 5) % 3)
    WHEN 0 THEN 'Consulta de Rotina'
    WHEN 1 THEN 'Limpeza'
    ELSE 'Avaliação'
  END,
  'agendada',
  50.00
WHERE NOT EXISTS (SELECT 1 FROM consultas WHERE id = 'consulta-' || generate_series(1, 5));

-- Inserir laboratório de exemplo
INSERT INTO laboratorios (id, nome, contato, telefone, email, morada)
VALUES 
  ('lab-001', 'Laboratório Dental Lisboa', 'João Silva', '+351 21 123 4567', 'contato@labdental.pt', 'Rua das Flores, 123, Lisboa')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- VERIFICAÇÃO FINAL
-- =====================================================

-- Listar todas as tabelas
SELECT 
  tablename,
  schemaname
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- Contar registros em tabelas principais
SELECT 
  'users' as tabela, COUNT(*) as total FROM users
UNION ALL
SELECT 'utentes', COUNT(*) FROM utentes
UNION ALL
SELECT 'consultas', COUNT(*) FROM consultas
UNION ALL
SELECT 'faturas', COUNT(*) FROM faturas
UNION ALL
SELECT 'tratamentos', COUNT(*) FROM tratamentos
UNION ALL
SELECT 'prescricoes', COUNT(*) FROM prescricoes
UNION ALL
SELECT 'laboratorios', COUNT(*) FROM laboratorios
UNION ALL
SELECT 'trabalhos_laboratorio', COUNT(*) FROM trabalhos_laboratorio
UNION ALL
SELECT 'contas_pagar', COUNT(*) FROM contas_pagar;
