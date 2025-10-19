-- ========================================
-- DENTCARE PRO - Script de Inicialização da Base de Dados
-- Versão: 1.0
-- Data: 17/10/2025
-- ========================================

-- Criar base de dados (se não existir)
CREATE DATABASE IF NOT EXISTS dentcare_pro 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE dentcare_pro;

-- ========================================
-- TABELA: users (Utilizadores do Sistema)
-- ========================================
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(64) PRIMARY KEY,
  `name` TEXT,
  `email` VARCHAR(320),
  `loginMethod` VARCHAR(64),
  `role` ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `lastSignedIn` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- TABELA: utentes (Pacientes)
-- ========================================
CREATE TABLE IF NOT EXISTS `utentes` (
  `id` VARCHAR(20) PRIMARY KEY,
  `nome` VARCHAR(255) NOT NULL,
  `dataNascimento` DATE NOT NULL,
  `genero` ENUM('M', 'F', 'Outro') NOT NULL,
  `nif` VARCHAR(9),
  `numeroUtente` VARCHAR(20),
  `contacto` JSON,
  `morada` JSON,
  `profissao` VARCHAR(100),
  `estadoCivil` VARCHAR(50),
  `observacoes` TEXT,
  `alergias` JSON,
  `medicamentos` JSON,
  `condicoesMedicas` JSON,
  `historicoFamiliar` TEXT,
  `criadoEm` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `atualizadoEm` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- TABELA: consultas (Agendamentos)
-- ========================================
CREATE TABLE IF NOT EXISTS `consultas` (
  `id` VARCHAR(20) PRIMARY KEY,
  `utenteId` VARCHAR(20) NOT NULL,
  `dentistaId` VARCHAR(20),
  `data` DATE NOT NULL,
  `horaInicio` TIME NOT NULL,
  `horaFim` TIME NOT NULL,
  `tipo` VARCHAR(100) NOT NULL,
  `status` ENUM('agendada', 'confirmada', 'realizada', 'cancelada', 'faltou') NOT NULL DEFAULT 'agendada',
  `observacoes` TEXT,
  `tratamentosRealizados` JSON,
  `proximaConsulta` DATE,
  `criadoEm` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `atualizadoEm` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`utenteId`) REFERENCES `utentes`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- TABELA: dentistas (Profissionais)
-- ========================================
CREATE TABLE IF NOT EXISTS `dentistas` (
  `id` VARCHAR(20) PRIMARY KEY,
  `nomeAbreviado` VARCHAR(100) NOT NULL,
  `nomeCompleto` VARCHAR(255) NOT NULL,
  `nif` VARCHAR(9),
  `numeroOrdem` VARCHAR(20),
  `especialidades` JSON,
  `email` VARCHAR(255),
  `telefone` VARCHAR(20),
  `telemovel` VARCHAR(20),
  `dataAdmissao` DATE,
  `cargo` VARCHAR(100),
  `corAgenda` VARCHAR(7) DEFAULT '#3b82f6',
  `tempoConsultaPadrao` INT DEFAULT 30,
  `ativo` BOOLEAN DEFAULT TRUE,
  `observacoes` TEXT,
  `criadoEm` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `atualizadoEm` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- TABELA: config_comissoes (Configuração de Comissões)
-- ========================================
CREATE TABLE IF NOT EXISTS `config_comissoes` (
  `id` VARCHAR(20) PRIMARY KEY,
  `dentistaId` VARCHAR(20) NOT NULL UNIQUE,
  `tipo` ENUM('percentagem', 'fixo', 'misto') NOT NULL,
  `percentagem` DECIMAL(5,2),
  `valorFixo` DECIMAL(10,2),
  `valorMinimo` DECIMAL(10,2),
  `valorMaximo` DECIMAL(10,2),
  `observacoes` TEXT,
  `criadoEm` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `atualizadoEm` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`dentistaId`) REFERENCES `dentistas`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- TABELA: comissoes (Registro de Comissões)
-- ========================================
CREATE TABLE IF NOT EXISTS `comissoes` (
  `id` VARCHAR(20) PRIMARY KEY,
  `dentistaId` VARCHAR(20) NOT NULL,
  `faturaId` VARCHAR(20),
  `valor` DECIMAL(10,2) NOT NULL,
  `percentagem` DECIMAL(5,2),
  `mes` VARCHAR(7) NOT NULL,
  `pago` BOOLEAN DEFAULT FALSE,
  `dataPagamento` DATE,
  `formaPagamento` VARCHAR(50),
  `observacoes` TEXT,
  `criadoEm` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `atualizadoEm` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`dentistaId`) REFERENCES `dentistas`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- TABELA: config_clinica (Configurações da Clínica)
-- ========================================
CREATE TABLE IF NOT EXISTS `config_clinica` (
  `id` VARCHAR(50) PRIMARY KEY DEFAULT 'CONFIG-PRINCIPAL',
  `nomeClinica` VARCHAR(255) NOT NULL,
  `nomeFantasia` VARCHAR(255),
  `razaoSocial` VARCHAR(255) NOT NULL,
  `nif` VARCHAR(9) NOT NULL,
  `numeroRegistro` VARCHAR(50),
  `telefone` VARCHAR(20) NOT NULL,
  `telemovel` VARCHAR(20),
  `email` VARCHAR(255) NOT NULL,
  `website` VARCHAR(255),
  `redesSociais` JSON,
  `morada` JSON NOT NULL,
  `anoFundacao` INT,
  `numeroFuncionarios` INT,
  `especialidades` JSON,
  `horarioFuncionamento` JSON,
  `logoPrincipal` TEXT,
  `logoSecundario` TEXT,
  `favicon` TEXT,
  `paletaCores` JSON,
  `papelTimbrado` JSON,
  `nomeSistema` VARCHAR(100),
  `slogan` TEXT,
  `criadoEm` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `atualizadoEm` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- TABELA: formas_pagamento (Métodos de Pagamento)
-- ========================================
CREATE TABLE IF NOT EXISTS `formas_pagamento` (
  `id` VARCHAR(20) PRIMARY KEY,
  `nome` VARCHAR(100) NOT NULL,
  `tipo` VARCHAR(50) NOT NULL,
  `ativo` BOOLEAN DEFAULT TRUE,
  `icone` VARCHAR(50),
  `cor` VARCHAR(7),
  `ordem` INT,
  `taxa` JSON,
  `valorMinimo` DECIMAL(10,2),
  `valorMaximo` DECIMAL(10,2),
  `integracao` JSON,
  `observacoes` TEXT,
  `requerReferencia` BOOLEAN DEFAULT FALSE,
  `criadoEm` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `atualizadoEm` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- TABELA: funcionarios (Staff da Clínica)
-- ========================================
CREATE TABLE IF NOT EXISTS `funcionarios` (
  `id` VARCHAR(20) PRIMARY KEY,
  `nome` VARCHAR(255) NOT NULL,
  `cargo` VARCHAR(100) NOT NULL,
  `email` VARCHAR(255),
  `telefone` VARCHAR(20),
  `dataAdmissao` DATE,
  `ativo` BOOLEAN DEFAULT TRUE,
  `observacoes` TEXT,
  `criadoEm` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `atualizadoEm` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- ÍNDICES PARA MELHOR PERFORMANCE
-- ========================================

-- Índices para consultas
CREATE INDEX idx_consultas_utente ON consultas(utenteId);
CREATE INDEX idx_consultas_dentista ON consultas(dentistaId);
CREATE INDEX idx_consultas_data ON consultas(data);
CREATE INDEX idx_consultas_status ON consultas(status);

-- Índices para comissões
CREATE INDEX idx_comissoes_dentista ON comissoes(dentistaId);
CREATE INDEX idx_comissoes_mes ON comissoes(mes);
CREATE INDEX idx_comissoes_pago ON comissoes(pago);

-- Índices para utentes
CREATE INDEX idx_utentes_nome ON utentes(nome);
CREATE INDEX idx_utentes_nif ON utentes(nif);

-- ========================================
-- DADOS INICIAIS (OPCIONAL)
-- ========================================

-- Inserir configuração padrão da clínica
INSERT INTO config_clinica (
  id, 
  nomeClinica, 
  razaoSocial, 
  nif, 
  telefone, 
  email, 
  morada
) VALUES (
  'CONFIG-PRINCIPAL',
  'DentCare Pro',
  'DentCare Pro Lda',
  '000000000',
  '+351 21 000 0000',
  'geral@dentcarepro.pt',
  '{"rua":"","numero":"","codigoPostal":"","cidade":"","distrito":"","pais":"Portugal"}'
) ON DUPLICATE KEY UPDATE id=id;

-- Inserir formas de pagamento padrão
INSERT INTO formas_pagamento (id, nome, tipo, ativo, icone, cor, ordem) VALUES
('FP-001', 'Dinheiro', 'dinheiro', TRUE, 'banknote', '#22c55e', 1),
('FP-002', 'Multibanco', 'cartao', TRUE, 'credit-card', '#3b82f6', 2),
('FP-003', 'Transferência Bancária', 'transferencia', TRUE, 'arrow-right-left', '#8b5cf6', 3),
('FP-004', 'MBWay', 'digital', TRUE, 'smartphone', '#f59e0b', 4)
ON DUPLICATE KEY UPDATE id=id;

-- ========================================
-- VERIFICAÇÃO FINAL
-- ========================================

-- Mostrar tabelas criadas
SHOW TABLES;

-- Verificar estrutura das tabelas principais
DESCRIBE users;
DESCRIBE utentes;
DESCRIBE consultas;
DESCRIBE dentistas;
DESCRIBE comissoes;
DESCRIBE config_comissoes;
DESCRIBE config_clinica;

-- ========================================
-- FIM DO SCRIPT
-- ========================================

SELECT 'Base de dados DentCare Pro inicializada com sucesso!' AS Status;

