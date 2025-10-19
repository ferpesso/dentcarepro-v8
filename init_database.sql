-- DentCarePRO Database Schema
-- PostgreSQL 14+

-- ========================================
-- TABELA: users (utilizadores do sistema)
-- ========================================
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    login_method VARCHAR(50) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    last_signed_in TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABELA: config_clinica (configurações da clínica)
-- ========================================
CREATE TABLE IF NOT EXISTS config_clinica (
    id VARCHAR(255) PRIMARY KEY DEFAULT 'config-1',
    nome_clinica VARCHAR(255) NOT NULL,
    razao_social VARCHAR(255),
    nif VARCHAR(50),
    numero_registo VARCHAR(100),
    telefone VARCHAR(50),
    telemovel VARCHAR(50),
    email VARCHAR(255),
    website VARCHAR(255),
    rua VARCHAR(255),
    numero VARCHAR(20),
    complemento VARCHAR(255),
    codigo_postal VARCHAR(20),
    cidade VARCHAR(100),
    pais VARCHAR(100),
    nome_fantasia VARCHAR(255),
    logotipo TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABELA: utentes (pacientes)
-- ========================================
CREATE TABLE IF NOT EXISTS utentes (
    id VARCHAR(255) PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    nome VARCHAR(255) NOT NULL,
    data_nascimento DATE,
    genero VARCHAR(20),
    nif VARCHAR(50),
    numero_sns VARCHAR(50),
    email VARCHAR(255),
    telefone VARCHAR(50),
    telemovel VARCHAR(50),
    rua VARCHAR(255),
    numero VARCHAR(20),
    complemento VARCHAR(255),
    codigo_postal VARCHAR(20),
    cidade VARCHAR(100),
    pais VARCHAR(100) DEFAULT 'Portugal',
    estado VARCHAR(50) DEFAULT 'ativo',
    observacoes TEXT,
    alergias TEXT,
    medicamentos TEXT,
    historico_medico TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABELA: dentistas
-- ========================================
CREATE TABLE IF NOT EXISTS dentistas (
    id VARCHAR(255) PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    especialidade VARCHAR(255),
    numero_ordem VARCHAR(50),
    email VARCHAR(255),
    telefone VARCHAR(50),
    telemovel VARCHAR(50),
    ativo BOOLEAN DEFAULT true,
    cor_agenda VARCHAR(20),
    observacoes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABELA: consultas
-- ========================================
CREATE TABLE IF NOT EXISTS consultas (
    id VARCHAR(255) PRIMARY KEY,
    utente_id VARCHAR(255) REFERENCES utentes(id) ON DELETE CASCADE,
    dentista_id VARCHAR(255) REFERENCES dentistas(id) ON DELETE SET NULL,
    data_hora TIMESTAMP NOT NULL,
    duracao INTEGER DEFAULT 30,
    tipo VARCHAR(100),
    status VARCHAR(50) DEFAULT 'agendada',
    observacoes TEXT,
    valor DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABELA: tratamentos
-- ========================================
CREATE TABLE IF NOT EXISTS tratamentos (
    id VARCHAR(255) PRIMARY KEY,
    utente_id VARCHAR(255) REFERENCES utentes(id) ON DELETE CASCADE,
    dentista_id VARCHAR(255) REFERENCES dentistas(id) ON DELETE SET NULL,
    consulta_id VARCHAR(255) REFERENCES consultas(id) ON DELETE SET NULL,
    dente VARCHAR(10),
    procedimento VARCHAR(255) NOT NULL,
    descricao TEXT,
    status VARCHAR(50) DEFAULT 'planejado',
    data_realizacao DATE,
    valor DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABELA: faturas
-- ========================================
CREATE TABLE IF NOT EXISTS faturas (
    id VARCHAR(255) PRIMARY KEY,
    numero_fatura VARCHAR(50) UNIQUE NOT NULL,
    utente_id VARCHAR(255) REFERENCES utentes(id) ON DELETE CASCADE,
    data_emissao DATE NOT NULL,
    data_vencimento DATE,
    valor_total DECIMAL(10, 2) NOT NULL,
    valor_pago DECIMAL(10, 2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'pendente',
    observacoes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABELA: itens_fatura
-- ========================================
CREATE TABLE IF NOT EXISTS itens_fatura (
    id VARCHAR(255) PRIMARY KEY,
    fatura_id VARCHAR(255) REFERENCES faturas(id) ON DELETE CASCADE,
    descricao VARCHAR(255) NOT NULL,
    quantidade INTEGER DEFAULT 1,
    valor_unitario DECIMAL(10, 2) NOT NULL,
    valor_total DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABELA: pagamentos
-- ========================================
CREATE TABLE IF NOT EXISTS pagamentos (
    id VARCHAR(255) PRIMARY KEY,
    fatura_id VARCHAR(255) REFERENCES faturas(id) ON DELETE CASCADE,
    data_pagamento DATE NOT NULL,
    valor DECIMAL(10, 2) NOT NULL,
    forma_pagamento VARCHAR(100),
    observacoes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABELA: formas_pagamento
-- ========================================
CREATE TABLE IF NOT EXISTS formas_pagamento (
    id VARCHAR(255) PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABELA: categorias_despesa
-- ========================================
CREATE TABLE IF NOT EXISTS categorias_despesa (
    id VARCHAR(255) PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABELA: fornecedores
-- ========================================
CREATE TABLE IF NOT EXISTS fornecedores (
    id VARCHAR(255) PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    nif VARCHAR(50),
    email VARCHAR(255),
    telefone VARCHAR(50),
    rua VARCHAR(255),
    cidade VARCHAR(100),
    codigo_postal VARCHAR(20),
    pais VARCHAR(100) DEFAULT 'Portugal',
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABELA: contas_pagar
-- ========================================
CREATE TABLE IF NOT EXISTS contas_pagar (
    id VARCHAR(255) PRIMARY KEY,
    fornecedor_id VARCHAR(255) REFERENCES fornecedores(id) ON DELETE SET NULL,
    categoria_id VARCHAR(255) REFERENCES categorias_despesa(id) ON DELETE SET NULL,
    descricao VARCHAR(255) NOT NULL,
    valor DECIMAL(10, 2) NOT NULL,
    data_vencimento DATE NOT NULL,
    data_pagamento DATE,
    status VARCHAR(50) DEFAULT 'pendente',
    forma_pagamento VARCHAR(100),
    observacoes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABELA: laboratorios
-- ========================================
CREATE TABLE IF NOT EXISTS laboratorios (
    id VARCHAR(255) PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    responsavel VARCHAR(255),
    email VARCHAR(255),
    telefone VARCHAR(50),
    rua VARCHAR(255),
    cidade VARCHAR(100),
    codigo_postal VARCHAR(20),
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABELA: trabalhos_laboratorio
-- ========================================
CREATE TABLE IF NOT EXISTS trabalhos_laboratorio (
    id VARCHAR(255) PRIMARY KEY,
    laboratorio_id VARCHAR(255) REFERENCES laboratorios(id) ON DELETE CASCADE,
    utente_id VARCHAR(255) REFERENCES utentes(id) ON DELETE CASCADE,
    dentista_id VARCHAR(255) REFERENCES dentistas(id) ON DELETE SET NULL,
    tipo_trabalho VARCHAR(255) NOT NULL,
    descricao TEXT,
    data_envio DATE,
    data_prevista_entrega DATE,
    data_entrega DATE,
    status VARCHAR(50) DEFAULT 'enviado',
    valor DECIMAL(10, 2),
    observacoes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABELA: config_comissoes
-- ========================================
CREATE TABLE IF NOT EXISTS config_comissoes (
    id VARCHAR(255) PRIMARY KEY,
    dentista_id VARCHAR(255) REFERENCES dentistas(id) ON DELETE CASCADE,
    percentual DECIMAL(5, 2) NOT NULL,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(dentista_id)
);

-- ========================================
-- TABELA: comissoes
-- ========================================
CREATE TABLE IF NOT EXISTS comissoes (
    id VARCHAR(255) PRIMARY KEY,
    dentista_id VARCHAR(255) REFERENCES dentistas(id) ON DELETE CASCADE,
    fatura_id VARCHAR(255) REFERENCES faturas(id) ON DELETE CASCADE,
    valor DECIMAL(10, 2) NOT NULL,
    percentual DECIMAL(5, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pendente',
    data_pagamento DATE,
    forma_pagamento VARCHAR(100),
    observacoes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- ÍNDICES para melhor performance
-- ========================================
CREATE INDEX IF NOT EXISTS idx_utentes_codigo ON utentes(codigo);
CREATE INDEX IF NOT EXISTS idx_utentes_estado ON utentes(estado);
CREATE INDEX IF NOT EXISTS idx_consultas_data ON consultas(data_hora);
CREATE INDEX IF NOT EXISTS idx_consultas_utente ON consultas(utente_id);
CREATE INDEX IF NOT EXISTS idx_consultas_dentista ON consultas(dentista_id);
CREATE INDEX IF NOT EXISTS idx_faturas_status ON faturas(status);
CREATE INDEX IF NOT EXISTS idx_faturas_utente ON faturas(utente_id);
CREATE INDEX IF NOT EXISTS idx_comissoes_dentista ON comissoes(dentista_id);
CREATE INDEX IF NOT EXISTS idx_comissoes_status ON comissoes(status);

-- ========================================
-- INSERIR DADOS INICIAIS
-- ========================================

-- Inserir configuração padrão da clínica
INSERT INTO config_clinica (id, nome_clinica, razao_social, nif, telefone, email, cidade, pais)
VALUES ('config-1', 'Clínica Dentária Sorrisos', 'Clínica Dentária Sorrisos Lda', '123456789', 
        '+351 21 123 4567', 'geral@clinica.pt', 'Lisboa', 'Portugal')
ON CONFLICT (id) DO NOTHING;

-- Inserir formas de pagamento padrão
INSERT INTO formas_pagamento (id, nome) VALUES
    ('fp-1', 'Dinheiro'),
    ('fp-2', 'Multibanco'),
    ('fp-3', 'MB WAY'),
    ('fp-4', 'Transferência Bancária'),
    ('fp-5', 'Cartão de Crédito')
ON CONFLICT (id) DO NOTHING;

-- Inserir categorias de despesa padrão
INSERT INTO categorias_despesa (id, nome, descricao) VALUES
    ('cat-1', 'Material Dentário', 'Materiais e equipamentos dentários'),
    ('cat-2', 'Laboratório', 'Despesas com laboratórios externos'),
    ('cat-3', 'Pessoal', 'Salários e encargos'),
    ('cat-4', 'Instalações', 'Renda, água, luz, etc.'),
    ('cat-5', 'Marketing', 'Publicidade e marketing')
ON CONFLICT (id) DO NOTHING;

-- Inserir utilizador demo
INSERT INTO users (id, name, email, login_method, role)
VALUES ('demo-user-001', 'Utilizador Demo', 'demo@dentcarepro.local', 'demo', 'admin')
ON CONFLICT (id) DO NOTHING;

