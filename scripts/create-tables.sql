-- Script de criação de tabelas para DentCarePRO v8.0
-- PostgreSQL 14+

-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  name TEXT,
  email VARCHAR(320),
  loginMethod VARCHAR(64),
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  lastSignedIn TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Utentes (Pacientes)
CREATE TABLE IF NOT EXISTS utentes (
  id VARCHAR(36) PRIMARY KEY,
  numeroUtente VARCHAR(20) NOT NULL UNIQUE,
  nomeCompleto VARCHAR(200) NOT NULL,
  dataNascimento VARCHAR(10) NOT NULL,
  genero VARCHAR(10) NOT NULL CHECK (genero IN ('M', 'F', 'Outro')),
  nif VARCHAR(9),
  numUtenteSns VARCHAR(9),
  fotoPerfil TEXT,
  contacto TEXT,
  morada TEXT,
  infoMedica TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'arquivado')),
  tags TEXT,
  criadoPor VARCHAR(64) NOT NULL,
  criadoEm TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizadoEm TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Consultas
CREATE TABLE IF NOT EXISTS consultas (
  id VARCHAR(255) PRIMARY KEY,
  utenteId VARCHAR(255) NOT NULL,
  medicoId VARCHAR(255),
  dataHora TIMESTAMP NOT NULL,
  duracao INTEGER DEFAULT 30,
  tipoConsulta VARCHAR(100),
  procedimento TEXT,
  status VARCHAR(30) DEFAULT 'agendada' CHECK (status IN ('agendada', 'confirmada', 'realizada', 'cancelada', 'faltou', 'em_atendimento')),
  observacoes TEXT,
  valorEstimado DECIMAL(10, 2),
  classificacaoRisco VARCHAR(10),
  criadoEm TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizadoEm TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (utenteId) REFERENCES utentes(id)
);

-- Tabela de Imagens
CREATE TABLE IF NOT EXISTS imagens (
  id VARCHAR(64) PRIMARY KEY,
  utenteId VARCHAR(64) NOT NULL,
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('raio_x', 'fotografia', 'tomografia', 'scanner_3d', 'outro')),
  categoria VARCHAR(100),
  url TEXT NOT NULL,
  nomeArquivo VARCHAR(255) NOT NULL,
  tamanho VARCHAR(50),
  dataImagem VARCHAR(10),
  descricao TEXT,
  criadoEm TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (utenteId) REFERENCES utentes(id)
);

-- Tabela de Odontograma
CREATE TABLE IF NOT EXISTS odontograma (
  id VARCHAR(64) PRIMARY KEY,
  utenteId VARCHAR(64) NOT NULL,
  numeroDente VARCHAR(10) NOT NULL,
  faces TEXT,
  condicao VARCHAR(100),
  tratamento VARCHAR(100),
  observacoes TEXT,
  dataRegistro VARCHAR(10),
  criadoEm TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (utenteId) REFERENCES utentes(id)
);

-- Tabela de Faturação
CREATE TABLE IF NOT EXISTS faturacao (
  id VARCHAR(64) PRIMARY KEY,
  numero VARCHAR(50) NOT NULL UNIQUE,
  data DATE NOT NULL,
  utenteId VARCHAR(64) NOT NULL,
  dentistaId VARCHAR(64),
  descricao TEXT,
  valor DECIMAL(10, 2) NOT NULL,
  valorPago DECIMAL(10, 2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('pendente', 'pago', 'parcial', 'anulada')),
  dataPagamento DATE,
  observacoes TEXT,
  criadoEm TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (utenteId) REFERENCES utentes(id)
);

-- Tabela de Contas a Pagar
CREATE TABLE IF NOT EXISTS contas_pagar (
  id VARCHAR(64) PRIMARY KEY,
  fornecedorId VARCHAR(64),
  fornecedorNome VARCHAR(200),
  categoriaId VARCHAR(64),
  categoriaNome VARCHAR(100),
  descricao TEXT,
  valor DECIMAL(10, 2) NOT NULL,
  dataVencimento DATE NOT NULL,
  dataPagamento DATE,
  status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('pendente', 'pago', 'vencido')),
  formaPagamento VARCHAR(50),
  observacoes TEXT,
  criadoEm TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Laboratórios
CREATE TABLE IF NOT EXISTS laboratorios (
  id VARCHAR(64) PRIMARY KEY,
  nome VARCHAR(200) NOT NULL,
  responsavel VARCHAR(200),
  email VARCHAR(320),
  telefone VARCHAR(20),
  rua VARCHAR(255),
  cidade VARCHAR(100),
  codigoPostal VARCHAR(20),
  ativo BOOLEAN DEFAULT true,
  criadoEm TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Trabalhos de Laboratório
CREATE TABLE IF NOT EXISTS laboratorio_trabalhos (
  id VARCHAR(64) PRIMARY KEY,
  laboratorioId VARCHAR(64) NOT NULL,
  laboratorioNome VARCHAR(200),
  utenteId VARCHAR(64) NOT NULL,
  utenteNome VARCHAR(200),
  dentistaId VARCHAR(64),
  dentistaNome VARCHAR(200),
  tipoTrabalho VARCHAR(100),
  descricao TEXT,
  dataEnvio DATE,
  dataPrevistaEntrega DATE,
  dataEntrega DATE,
  status VARCHAR(30) DEFAULT 'pendente' CHECK (status IN ('pendente', 'enviado', 'em_producao', 'recebido', 'instalado', 'ajuste_necessario', 'cancelado')),
  observacoes TEXT,
  criadoEm TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (laboratorioId) REFERENCES laboratorios(id),
  FOREIGN KEY (utenteId) REFERENCES utentes(id)
);

-- Tabela de Dentistas
CREATE TABLE IF NOT EXISTS dentistas (
  id VARCHAR(64) PRIMARY KEY,
  nome VARCHAR(200) NOT NULL,
  email VARCHAR(320),
  telefone VARCHAR(20),
  especialidade VARCHAR(100),
  nomeConsultorio VARCHAR(200),
  ativo BOOLEAN DEFAULT true,
  criadoEm TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Configurações
CREATE TABLE IF NOT EXISTS config_clinica (
  id VARCHAR(64) PRIMARY KEY,
  nomeClinica VARCHAR(200),
  endereco TEXT,
  telefone VARCHAR(20),
  email VARCHAR(320),
  website VARCHAR(255),
  nif VARCHAR(20),
  logo TEXT,
  cores TEXT,
  horarioAbertura VARCHAR(20),
  horarioFecho VARCHAR(20),
  diasFecho TEXT,
  criadoEm TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizadoEm TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar índices para melhor performance
CREATE INDEX idx_utentes_numeroUtente ON utentes(numeroUtente);
CREATE INDEX idx_utentes_nomeCompleto ON utentes(nomeCompleto);
CREATE INDEX idx_consultas_utenteId ON consultas(utenteId);
CREATE INDEX idx_consultas_dataHora ON consultas(dataHora);
CREATE INDEX idx_faturacao_utenteId ON faturacao(utenteId);
CREATE INDEX idx_faturacao_data ON faturacao(data);
CREATE INDEX idx_contas_pagar_dataVencimento ON contas_pagar(dataVencimento);
CREATE INDEX idx_laboratorio_trabalhos_laboratorioId ON laboratorio_trabalhos(laboratorioId);
CREATE INDEX idx_laboratorio_trabalhos_utenteId ON laboratorio_trabalhos(utenteId);

-- Inserir dados de exemplo
INSERT INTO utentes (id, numeroUtente, nomeCompleto, dataNascimento, genero, nif, numUtenteSns, contacto, morada, infoMedica, status, criadoPor, criadoEm) VALUES
('U001', 'U001', 'Maria Silva Santos', '1984-05-15', 'F', '123456789', '987654321', '912345678', 'Rua A, 123', 'Sem alergias conhecidas', 'ativo', 'admin', CURRENT_TIMESTAMP),
('U002', 'U002', 'João Pedro Costa', '1989-08-22', 'M', '234567890', '876543210', '923456789', 'Rua B, 456', 'Alérgico a Penicilina', 'ativo', 'admin', CURRENT_TIMESTAMP),
('U003', 'U003', 'Ana Rita Ferreira', '1978-03-10', 'F', '345678901', '765432109', '934567890', 'Rua C, 789', 'Sem medicamentos', 'ativo', 'admin', CURRENT_TIMESTAMP),
('U004', 'U004', 'Carlos Manuel Oliveira', '1992-11-30', 'M', '456789012', '654321098', '945678901', 'Rua D, 101', 'Hipertensão controlada', 'ativo', 'admin', CURRENT_TIMESTAMP),
('U005', 'U005', 'Sofia Marques Rodrigues', '1995-07-18', 'F', '567890123', '543210987', '956789012', 'Rua E, 202', 'Sem alergias', 'ativo', 'admin', CURRENT_TIMESTAMP);

INSERT INTO consultas (id, utenteId, medicoId, dataHora, duracao, tipoConsulta, status, criadoEm) VALUES
('C001', 'U001', 'D001', '2025-10-19 09:00:00', 30, 'Consulta de Rotina', 'confirmada', CURRENT_TIMESTAMP),
('C002', 'U002', 'D002', '2025-10-19 10:30:00', 45, 'Restauração', 'confirmada', CURRENT_TIMESTAMP),
('C003', 'U003', 'D001', '2025-10-19 14:00:00', 60, 'Implante', 'agendada', CURRENT_TIMESTAMP),
('C004', 'U004', 'D002', '2025-10-19 16:00:00', 30, 'Consulta de Rotina', 'confirmada', CURRENT_TIMESTAMP),
('C005', 'U005', 'D003', '2025-10-20 10:00:00', 45, 'Ortodontia', 'agendada', CURRENT_TIMESTAMP);

INSERT INTO faturacao (id, numero, data, utenteId, dentistaId, descricao, valor, valorPago, status, criadoEm) VALUES
('F001', '2025/001', '2025-10-15', 'U001', 'D001', 'Consulta de Rotina', 150.06, 150.06, 'pago', CURRENT_TIMESTAMP),
('F002', '2025/002', '2025-10-16', 'U002', 'D002', 'Restauração', 295.20, 0.00, 'pendente', CURRENT_TIMESTAMP),
('F003', '2025/003', '2025-10-17', 'U003', 'D001', 'Implante', 184.50, 100.00, 'parcial', CURRENT_TIMESTAMP);

INSERT INTO dentistas (id, nome, email, telefone, especialidade, nomeConsultorio, ativo, criadoEm) VALUES
('D001', 'Dr. João Costa', 'joao.costa@dentcarepro.pt', '912345678', 'Implantologia', 'Consultório A', true, CURRENT_TIMESTAMP),
('D002', 'Dra. Ana Martins', 'ana.martins@dentcarepro.pt', '923456789', 'Restauração', 'Consultório B', true, CURRENT_TIMESTAMP),
('D003', 'Dr. Carlos Silva', 'carlos.silva@dentcarepro.pt', '934567890', 'Ortodontia', 'Consultório C', true, CURRENT_TIMESTAMP);

INSERT INTO config_clinica (id, nomeClinica, endereco, telefone, email, website, nif, horarioAbertura, horarioFecho, diasFecho, criadoEm) VALUES
('CONFIG001', 'DentCarePRO Clínica Dentária', 'Rua Principal, 123, Lisboa', '210123456', 'info@dentcarepro.pt', 'www.dentcarepro.pt', '123456789', '09:00', '19:00', 'Domingo', CURRENT_TIMESTAMP);

-- Dar permissões ao usuário dentcarepro
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO dentcarepro;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO dentcarepro;
GRANT USAGE ON SCHEMA public TO dentcarepro;

COMMIT;
