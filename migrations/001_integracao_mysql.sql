-- Migration: Sistema de Integração - MySQL
-- Data: 2025-10-28
-- Descrição: Criação de tabelas para integração entre módulos

-- ========================================
-- TABELA: procedimentos_clinicos
-- ========================================

CREATE TABLE IF NOT EXISTS procedimentos_clinicos (
  id VARCHAR(64) PRIMARY KEY,
  utente_id VARCHAR(64) NOT NULL,
  dentista_id VARCHAR(64) NOT NULL,
  consulta_id VARCHAR(64),
  
  -- Tipo de procedimento
  tipo ENUM(
    'odontograma',
    'periodontograma',
    'endodontia',
    'implante',
    'ortodontia',
    'limpeza',
    'restauracao',
    'extracao',
    'protese',
    'clareamento',
    'outro'
  ) NOT NULL,
  
  -- Dados específicos (JSON)
  dados TEXT NOT NULL,
  
  -- Descrição
  descricao TEXT NOT NULL,
  observacoes TEXT,
  
  -- Faturação
  valor_procedimento DECIMAL(10, 2) NOT NULL,
  fatura_id VARCHAR(64),
  faturado TINYINT(1) DEFAULT 0,
  
  -- Datas
  data DATE NOT NULL,
  
  -- Auditoria
  criado_por VARCHAR(64) NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Índices
  INDEX idx_proc_utente (utente_id),
  INDEX idx_proc_dentista (dentista_id),
  INDEX idx_proc_data (data),
  INDEX idx_proc_tipo (tipo),
  INDEX idx_proc_fatura (fatura_id),
  
  FOREIGN KEY (utente_id) REFERENCES utentes(id) ON DELETE CASCADE,
  FOREIGN KEY (dentista_id) REFERENCES dentistas(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- TABELA: historico_utente
-- ========================================

CREATE TABLE IF NOT EXISTS historico_utente (
  id VARCHAR(64) PRIMARY KEY,
  utente_id VARCHAR(64) NOT NULL,
  
  -- Tipo de evento
  tipo ENUM(
    'consulta',
    'procedimento',
    'fatura',
    'pagamento',
    'observacao',
    'documento',
    'comunicacao'
  ) NOT NULL,
  
  -- Dados do evento
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT NOT NULL,
  data DATE NOT NULL,
  
  -- Ligações com outras entidades
  consulta_id VARCHAR(64),
  procedimento_id VARCHAR(64),
  fatura_id VARCHAR(64),
  pagamento_id VARCHAR(64),
  
  -- Financeiro
  valor DECIMAL(10, 2),
  
  -- Responsável
  dentista_id VARCHAR(64),
  dentista_nome VARCHAR(255),
  
  -- UI
  icone VARCHAR(50) NOT NULL,
  cor VARCHAR(50) NOT NULL,
  
  -- Auditoria
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Índices
  INDEX idx_hist_utente (utente_id),
  INDEX idx_hist_data (data),
  INDEX idx_hist_tipo (tipo),
  INDEX idx_hist_criado (criado_em),
  
  FOREIGN KEY (utente_id) REFERENCES utentes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- TABELA: tabela_precos
-- ========================================

CREATE TABLE IF NOT EXISTS tabela_precos (
  id VARCHAR(64) PRIMARY KEY,
  codigo VARCHAR(50) NOT NULL UNIQUE,
  descricao VARCHAR(255) NOT NULL,
  categoria ENUM(
    'consulta',
    'tratamento',
    'cirurgia',
    'protese',
    'ortodontia',
    'implante',
    'estetica',
    'urgencia',
    'material',
    'laboratorio',
    'outro'
  ) NOT NULL,
  valor DECIMAL(10, 2) NOT NULL,
  iva DECIMAL(5, 2) DEFAULT 23.00,
  ativo TINYINT(1) DEFAULT 1,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Índices
  INDEX idx_preco_codigo (codigo),
  INDEX idx_preco_categoria (categoria),
  INDEX idx_preco_ativo (ativo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- TABELA: dentistas
-- ========================================

CREATE TABLE IF NOT EXISTS dentistas (
  id VARCHAR(64) PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  telefone VARCHAR(20),
  nif VARCHAR(9),
  numero_ordem VARCHAR(20),
  especialidade VARCHAR(100),
  ativo TINYINT(1) DEFAULT 1,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Índices
  INDEX idx_dent_nome (nome),
  INDEX idx_dent_email (email),
  INDEX idx_dent_ativo (ativo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- TABELA: faturas (extensão)
-- ========================================

-- Verificar se as colunas já existem antes de adicionar
SET @dbname = DATABASE();
SET @tablename = 'faturas';

SET @sql = CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN IF NOT EXISTS dentista_id VARCHAR(64)');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN IF NOT EXISTS dentista_nome VARCHAR(255)');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN IF NOT EXISTS dentista_percentagem DECIMAL(5, 2) DEFAULT 0.00');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN IF NOT EXISTS dentista_comissao DECIMAL(10, 2) DEFAULT 0.00');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN IF NOT EXISTS comissao_id VARCHAR(64)');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN IF NOT EXISTS valor_clinica DECIMAL(10, 2) DEFAULT 0.00');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN IF NOT EXISTS consulta_id VARCHAR(64)');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Adicionar índices
ALTER TABLE faturas ADD INDEX IF NOT EXISTS idx_fat_dentista (dentista_id);
ALTER TABLE faturas ADD INDEX IF NOT EXISTS idx_fat_consulta (consulta_id);

-- ========================================
-- TABELA: comissoes
-- ========================================

CREATE TABLE IF NOT EXISTS comissoes (
  id VARCHAR(64) PRIMARY KEY,
  dentista_id VARCHAR(64) NOT NULL,
  fatura_id VARCHAR(64) NOT NULL,
  procedimento_id VARCHAR(64),
  
  -- Valores
  valor DECIMAL(10, 2) NOT NULL,
  percentagem DECIMAL(5, 2),
  
  -- Período
  mes VARCHAR(7) NOT NULL, -- YYYY-MM
  
  -- Estado
  status ENUM('pendente', 'pago', 'cancelado') NOT NULL DEFAULT 'pendente',
  
  -- Pagamento
  data_pagamento DATE,
  forma_pagamento VARCHAR(50),
  referencia VARCHAR(100),
  
  -- Observações
  observacoes TEXT,
  
  -- Auditoria
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Índices
  INDEX idx_com_dentista (dentista_id),
  INDEX idx_com_fatura (fatura_id),
  INDEX idx_com_mes (mes),
  INDEX idx_com_status (status),
  
  FOREIGN KEY (dentista_id) REFERENCES dentistas(id) ON DELETE RESTRICT,
  FOREIGN KEY (fatura_id) REFERENCES faturas(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- TABELA: config_comissoes
-- ========================================

CREATE TABLE IF NOT EXISTS config_comissoes (
  id VARCHAR(64) PRIMARY KEY,
  dentista_id VARCHAR(64) NOT NULL UNIQUE,
  
  -- Tipo de comissão
  tipo ENUM('percentagem', 'fixo', 'misto') NOT NULL DEFAULT 'percentagem',
  
  -- Valores
  percentagem DECIMAL(5, 2),
  valor_fixo DECIMAL(10, 2),
  
  -- Limites
  valor_minimo DECIMAL(10, 2),
  valor_maximo DECIMAL(10, 2),
  
  -- Observações
  observacoes TEXT,
  
  -- Auditoria
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Índices
  INDEX idx_config_dentista (dentista_id),
  
  FOREIGN KEY (dentista_id) REFERENCES dentistas(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- DADOS INICIAIS
-- ========================================

-- Inserir preços padrão
INSERT IGNORE INTO tabela_precos (id, codigo, descricao, categoria, valor, iva, ativo) VALUES
  ('preco-001', 'CONS-AVAL', 'Consulta de Avaliação', 'consulta', 50.00, 23.00, 1),
  ('preco-002', 'LIMP-DEST', 'Limpeza Dentária (Destartarização)', 'tratamento', 80.00, 23.00, 1),
  ('preco-003', 'REST-COMP', 'Restauração em Resina Composta', 'tratamento', 120.00, 23.00, 1),
  ('preco-004', 'EXTR-SIMP', 'Extração Dentária Simples', 'cirurgia', 150.00, 23.00, 1),
  ('preco-005', 'ENDO-MOLA', 'Endodontia - Molar', 'tratamento', 500.00, 23.00, 1),
  ('preco-006', 'IMPL-UNIT', 'Implante Unitário', 'implante', 2000.00, 23.00, 1),
  ('preco-007', 'ORTO-MENS', 'Ortodontia - Mensalidade', 'ortodontia', 150.00, 23.00, 1),
  ('preco-008', 'CLAR-DENT', 'Clareamento Dentário', 'estetica', 400.00, 23.00, 1);

-- ========================================
-- FIM DA MIGRATION
-- ========================================
