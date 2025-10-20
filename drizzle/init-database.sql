-- ========================================
-- DentCarePRO - PostgreSQL Database Schema
-- ========================================

-- Limpar tabelas existentes (se houver)
DROP TABLE IF EXISTS documentos CASCADE;
DROP TABLE IF EXISTS consultas CASCADE;
DROP TABLE IF EXISTS dentistas CASCADE;
DROP TABLE IF EXISTS utentes CASCADE;
DROP TABLE IF EXISTS config_clinica CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ========================================
-- USERS (Sistema de autenticação)
-- ========================================

CREATE TABLE users (
  id VARCHAR(64) PRIMARY KEY,
  name TEXT,
  email VARCHAR(320),
  login_method VARCHAR(64),
  role VARCHAR(20) NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_signed_in TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- CONFIGURAÇÃO DA CLÍNICA
-- ========================================

CREATE TABLE config_clinica (
  id VARCHAR(36) PRIMARY KEY,
  nome_clinica VARCHAR(200) NOT NULL,
  razao_social VARCHAR(200),
  nif VARCHAR(9),
  numero_registo VARCHAR(50),
  telefone VARCHAR(20),
  telemovel VARCHAR(20),
  email VARCHAR(100),
  website VARCHAR(200),
  rua VARCHAR(200),
  numero VARCHAR(20),
  complemento VARCHAR(100),
  codigo_postal VARCHAR(10),
  cidade VARCHAR(100),
  pais VARCHAR(100) DEFAULT 'Portugal',
  nome_fantasia VARCHAR(200),
  logotipo TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir configuração padrão
INSERT INTO config_clinica (id, nome_clinica, email, cidade, pais)
VALUES ('config-1', 'Clínica Dentária', 'geral@clinica.pt', 'Lisboa', 'Portugal');

-- ========================================
-- UTENTES (Pacientes)
-- ========================================

CREATE TABLE utentes (
  id VARCHAR(36) PRIMARY KEY,
  codigo VARCHAR(20) NOT NULL UNIQUE,
  
  -- Dados Pessoais
  nome VARCHAR(200) NOT NULL,
  data_nascimento DATE NOT NULL,
  genero VARCHAR(10) NOT NULL,
  nif VARCHAR(9),
  numero_sns VARCHAR(9), -- OPCIONAL
  estado_civil VARCHAR(20),
  profissao VARCHAR(100),
  foto_perfil TEXT,
  
  -- Contactos
  email VARCHAR(100),
  telefone VARCHAR(20),
  telemovel VARCHAR(20),
  
  -- Morada
  rua VARCHAR(200),
  numero VARCHAR(20),
  complemento VARCHAR(100),
  codigo_postal VARCHAR(10),
  cidade VARCHAR(100),
  pais VARCHAR(100) DEFAULT 'Portugal',
  
  -- Contacto de Emergência
  emergencia_nome VARCHAR(200),
  emergencia_parentesco VARCHAR(50),
  emergencia_telefone VARCHAR(20),
  
  -- Histórico Médico
  alergias TEXT,
  medicamentos TEXT,
  doencas_cronicas TEXT,
  cirurgias_anteriores TEXT,
  historico_medico TEXT,
  
  -- Outros
  estado VARCHAR(20) NOT NULL DEFAULT 'ativo',
  observacoes TEXT,
  consentimento_rgpd BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para pesquisa rápida
CREATE INDEX idx_utentes_nome ON utentes(nome);
CREATE INDEX idx_utentes_nif ON utentes(nif);
CREATE INDEX idx_utentes_numero_sns ON utentes(numero_sns);
CREATE INDEX idx_utentes_data_nascimento ON utentes(data_nascimento);
CREATE INDEX idx_utentes_estado ON utentes(estado);

-- ========================================
-- DENTISTAS
-- ========================================

CREATE TABLE dentistas (
  id VARCHAR(36) PRIMARY KEY,
  codigo VARCHAR(20) NOT NULL UNIQUE,
  
  -- Dados Pessoais
  nome VARCHAR(200) NOT NULL,
  nif VARCHAR(9),
  numero_ordem VARCHAR(20),
  especialidade VARCHAR(100),
  
  -- Contactos
  email VARCHAR(100),
  telefone VARCHAR(20),
  telemovel VARCHAR(20),
  
  -- Configurações
  cor_agenda VARCHAR(7) DEFAULT '#3B82F6',
  ativo BOOLEAN DEFAULT TRUE,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir dentista padrão
INSERT INTO dentistas (id, codigo, nome, especialidade, ativo)
VALUES ('dentista-1', 'D001', 'Dr. João Silva', 'Clínica Geral', TRUE);

-- ========================================
-- CONSULTAS
-- ========================================

CREATE TABLE consultas (
  id VARCHAR(36) PRIMARY KEY,
  utente_id VARCHAR(36) NOT NULL REFERENCES utentes(id) ON DELETE CASCADE,
  dentista_id VARCHAR(36) REFERENCES dentistas(id),
  
  -- Data e Hora
  data_hora TIMESTAMP NOT NULL,
  duracao INTEGER DEFAULT 30,
  
  -- Detalhes
  tipo_consulta VARCHAR(100),
  procedimento TEXT,
  sala VARCHAR(50),
  
  -- Status
  status VARCHAR(20) NOT NULL DEFAULT 'agendada',
  
  -- Observações
  observacoes TEXT,
  observacoes_internas TEXT,
  
  -- Financeiro
  valor_estimado DECIMAL(10, 2),
  valor_final DECIMAL(10, 2),
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para consultas
CREATE INDEX idx_consultas_utente ON consultas(utente_id);
CREATE INDEX idx_consultas_dentista ON consultas(dentista_id);
CREATE INDEX idx_consultas_data_hora ON consultas(data_hora);
CREATE INDEX idx_consultas_status ON consultas(status);

-- ========================================
-- DOCUMENTOS
-- ========================================

CREATE TABLE documentos (
  id VARCHAR(36) PRIMARY KEY,
  utente_id VARCHAR(36) NOT NULL REFERENCES utentes(id) ON DELETE CASCADE,
  
  -- Informações do Documento
  tipo VARCHAR(50) NOT NULL,
  nome VARCHAR(200) NOT NULL,
  descricao TEXT,
  
  -- Arquivo
  url TEXT NOT NULL,
  nome_arquivo VARCHAR(255) NOT NULL,
  tamanho INTEGER,
  tipo_mime VARCHAR(100),
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índice para documentos
CREATE INDEX idx_documentos_utente ON documentos(utente_id);

-- ========================================
-- DADOS DE DEMONSTRAÇÃO - UTENTES
-- ========================================

INSERT INTO utentes (
  id, codigo, nome, data_nascimento, genero, nif, numero_sns,
  email, telefone, telemovel, cidade, pais, estado,
  alergias, medicamentos
) VALUES
  (
    'utente-1', 'U001', 'Maria Silva Santos', '1984-03-15', 'F',
    '123456789', '123456789',
    'maria.silva@email.pt', '210000001', '910000001',
    'Lisboa', 'Portugal', 'ativo',
    'Penicilina', 'Paracetamol'
  ),
  (
    'utente-2', 'U002', 'João Pedro Costa', '1989-07-22', 'M',
    '987654321', NULL,
    'joao.costa@email.pt', '210000002', '910000002',
    'Porto', 'Portugal', 'ativo',
    NULL, NULL
  ),
  (
    'utente-3', 'U003', 'Ana Rita Ferreira', '1978-11-08', 'F',
    '456789123', '987654321',
    'ana.ferreira@email.pt', '210000003', '910000003',
    'Coimbra', 'Portugal', 'ativo',
    'Látex', 'Ibuprofeno'
  ),
  (
    'utente-4', 'U004', 'Carlos Manuel Oliveira', '1964-05-30', 'M',
    '789123456', '456789123',
    'carlos.oliveira@email.pt', '210000004', '910000004',
    'Braga', 'Portugal', 'ativo',
    NULL, NULL
  ),
  (
    'utente-5', 'U005', 'Sofia Marques Rodrigues', '1999-09-12', 'F',
    '321654987', NULL,
    'sofia.rodrigues@email.pt', '210000005', '910000005',
    'Faro', 'Portugal', 'ativo',
    NULL, NULL
  );

-- ========================================
-- FIM DO SCRIPT
-- ========================================

