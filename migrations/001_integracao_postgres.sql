-- Migration: Sistema de Integração - PostgreSQL
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
  tipo VARCHAR(50) NOT NULL CHECK (tipo IN (
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
  )),
  
  -- Dados específicos (JSON)
  dados TEXT NOT NULL,
  
  -- Descrição
  descricao TEXT NOT NULL,
  observacoes TEXT,
  
  -- Faturação
  valor_procedimento DECIMAL(10, 2) NOT NULL,
  fatura_id VARCHAR(64),
  faturado INTEGER DEFAULT 0 CHECK (faturado IN (0, 1)),
  
  -- Datas
  data DATE NOT NULL,
  
  -- Auditoria
  criado_por VARCHAR(64) NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Índices
  CONSTRAINT fk_proc_utente FOREIGN KEY (utente_id) REFERENCES utentes(id) ON DELETE CASCADE,
  CONSTRAINT fk_proc_dentista FOREIGN KEY (dentista_id) REFERENCES dentistas(id) ON DELETE RESTRICT
);

CREATE INDEX idx_proc_utente ON procedimentos_clinicos(utente_id);
CREATE INDEX idx_proc_dentista ON procedimentos_clinicos(dentista_id);
CREATE INDEX idx_proc_data ON procedimentos_clinicos(data);
CREATE INDEX idx_proc_tipo ON procedimentos_clinicos(tipo);
CREATE INDEX idx_proc_fatura ON procedimentos_clinicos(fatura_id);

-- ========================================
-- TABELA: historico_utente
-- ========================================

CREATE TABLE IF NOT EXISTS historico_utente (
  id VARCHAR(64) PRIMARY KEY,
  utente_id VARCHAR(64) NOT NULL,
  
  -- Tipo de evento
  tipo VARCHAR(50) NOT NULL CHECK (tipo IN (
    'consulta',
    'procedimento',
    'fatura',
    'pagamento',
    'observacao',
    'documento',
    'comunicacao'
  )),
  
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
  CONSTRAINT fk_hist_utente FOREIGN KEY (utente_id) REFERENCES utentes(id) ON DELETE CASCADE
);

CREATE INDEX idx_hist_utente ON historico_utente(utente_id);
CREATE INDEX idx_hist_data ON historico_utente(data);
CREATE INDEX idx_hist_tipo ON historico_utente(tipo);
CREATE INDEX idx_hist_criado ON historico_utente(criado_em);

-- ========================================
-- TABELA: tabela_precos
-- ========================================

CREATE TABLE IF NOT EXISTS tabela_precos (
  id VARCHAR(64) PRIMARY KEY,
  codigo VARCHAR(50) NOT NULL UNIQUE,
  descricao VARCHAR(255) NOT NULL,
  categoria VARCHAR(50) NOT NULL CHECK (categoria IN (
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
  )),
  valor DECIMAL(10, 2) NOT NULL,
  iva DECIMAL(5, 2) DEFAULT 23.00,
  ativo INTEGER DEFAULT 1 CHECK (ativo IN (0, 1)),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_preco_codigo ON tabela_precos(codigo);
CREATE INDEX idx_preco_categoria ON tabela_precos(categoria);
CREATE INDEX idx_preco_ativo ON tabela_precos(ativo);

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
  ativo INTEGER DEFAULT 1 CHECK (ativo IN (0, 1)),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_dent_nome ON dentistas(nome);
CREATE INDEX idx_dent_email ON dentistas(email);
CREATE INDEX idx_dent_ativo ON dentistas(ativo);

-- ========================================
-- TABELA: faturas (extensão)
-- ========================================

-- Adicionar colunas à tabela existente (se não existirem)
ALTER TABLE faturas ADD COLUMN IF NOT EXISTS dentista_id VARCHAR(64);
ALTER TABLE faturas ADD COLUMN IF NOT EXISTS dentista_nome VARCHAR(255);
ALTER TABLE faturas ADD COLUMN IF NOT EXISTS dentista_percentagem DECIMAL(5, 2) DEFAULT 0.00;
ALTER TABLE faturas ADD COLUMN IF NOT EXISTS dentista_comissao DECIMAL(10, 2) DEFAULT 0.00;
ALTER TABLE faturas ADD COLUMN IF NOT EXISTS comissao_id VARCHAR(64);
ALTER TABLE faturas ADD COLUMN IF NOT EXISTS valor_clinica DECIMAL(10, 2) DEFAULT 0.00;
ALTER TABLE faturas ADD COLUMN IF NOT EXISTS consulta_id VARCHAR(64);

CREATE INDEX IF NOT EXISTS idx_fat_dentista ON faturas(dentista_id);
CREATE INDEX IF NOT EXISTS idx_fat_consulta ON faturas(consulta_id);

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
  status VARCHAR(20) NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'pago', 'cancelado')),
  
  -- Pagamento
  data_pagamento DATE,
  forma_pagamento VARCHAR(50),
  referencia VARCHAR(100),
  
  -- Observações
  observacoes TEXT,
  
  -- Auditoria
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Índices
  CONSTRAINT fk_com_dentista FOREIGN KEY (dentista_id) REFERENCES dentistas(id) ON DELETE RESTRICT,
  CONSTRAINT fk_com_fatura FOREIGN KEY (fatura_id) REFERENCES faturas(id) ON DELETE CASCADE
);

CREATE INDEX idx_com_dentista ON comissoes(dentista_id);
CREATE INDEX idx_com_fatura ON comissoes(fatura_id);
CREATE INDEX idx_com_mes ON comissoes(mes);
CREATE INDEX idx_com_status ON comissoes(status);

-- ========================================
-- TABELA: config_comissoes
-- ========================================

CREATE TABLE IF NOT EXISTS config_comissoes (
  id VARCHAR(64) PRIMARY KEY,
  dentista_id VARCHAR(64) NOT NULL UNIQUE,
  
  -- Tipo de comissão
  tipo VARCHAR(20) NOT NULL DEFAULT 'percentagem' CHECK (tipo IN ('percentagem', 'fixo', 'misto')),
  
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
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Índices
  CONSTRAINT fk_config_dentista FOREIGN KEY (dentista_id) REFERENCES dentistas(id) ON DELETE CASCADE
);

CREATE INDEX idx_config_dentista ON config_comissoes(dentista_id);

-- ========================================
-- TRIGGERS para atualizar atualizado_em
-- ========================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_procedimentos_updated_at BEFORE UPDATE ON procedimentos_clinicos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tabela_precos_updated_at BEFORE UPDATE ON tabela_precos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dentistas_updated_at BEFORE UPDATE ON dentistas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comissoes_updated_at BEFORE UPDATE ON comissoes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_config_comissoes_updated_at BEFORE UPDATE ON config_comissoes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- DADOS INICIAIS
-- ========================================

-- Inserir preços padrão
INSERT INTO tabela_precos (id, codigo, descricao, categoria, valor, iva, ativo) VALUES
  ('preco-001', 'CONS-AVAL', 'Consulta de Avaliação', 'consulta', 50.00, 23.00, 1),
  ('preco-002', 'LIMP-DEST', 'Limpeza Dentária (Destartarização)', 'tratamento', 80.00, 23.00, 1),
  ('preco-003', 'REST-COMP', 'Restauração em Resina Composta', 'tratamento', 120.00, 23.00, 1),
  ('preco-004', 'EXTR-SIMP', 'Extração Dentária Simples', 'cirurgia', 150.00, 23.00, 1),
  ('preco-005', 'ENDO-MOLA', 'Endodontia - Molar', 'tratamento', 500.00, 23.00, 1),
  ('preco-006', 'IMPL-UNIT', 'Implante Unitário', 'implante', 2000.00, 23.00, 1),
  ('preco-007', 'ORTO-MENS', 'Ortodontia - Mensalidade', 'ortodontia', 150.00, 23.00, 1),
  ('preco-008', 'CLAR-DENT', 'Clareamento Dentário', 'estetica', 400.00, 23.00, 1)
ON CONFLICT (codigo) DO NOTHING;

-- ========================================
-- FIM DA MIGRATION
-- ========================================

-- Comentários
COMMENT ON TABLE procedimentos_clinicos IS 'Registro de todos os procedimentos clínicos realizados';
COMMENT ON TABLE historico_utente IS 'Timeline unificada de eventos do utente';
COMMENT ON TABLE tabela_precos IS 'Tabela de preços configurável para procedimentos';
COMMENT ON TABLE comissoes IS 'Comissões dos dentistas';
COMMENT ON TABLE config_comissoes IS 'Configuração de comissões por dentista';
