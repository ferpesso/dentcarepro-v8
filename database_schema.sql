-- MySQL dump 10.13  Distrib 8.0.43, for Linux (x86_64)
--
-- Host: localhost    Database: dentcarepro
-- ------------------------------------------------------
-- Server version	8.0.43-0ubuntu0.22.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `__drizzle_migrations`
--

DROP TABLE IF EXISTS `__drizzle_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `__drizzle_migrations` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `hash` text NOT NULL,
  `created_at` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cadastro_laboratorios`
--

DROP TABLE IF EXISTS `cadastro_laboratorios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cadastro_laboratorios` (
  `id` varchar(64) NOT NULL,
  `nome` varchar(200) NOT NULL,
  `razaoSocial` varchar(200) DEFAULT NULL,
  `nif` varchar(9) DEFAULT NULL,
  `telefone` varchar(20) NOT NULL,
  `telemovel` varchar(20) DEFAULT NULL,
  `email` varchar(320) DEFAULT NULL,
  `whatsapp` varchar(20) DEFAULT NULL,
  `website` varchar(200) DEFAULT NULL,
  `morada` text,
  `cidade` varchar(100) DEFAULT NULL,
  `codigoPostal` varchar(10) DEFAULT NULL,
  `pais` varchar(50) DEFAULT 'Portugal',
  `responsavelTecnico` varchar(200) DEFAULT NULL,
  `especialidades` text,
  `prazoMedioEntrega` int DEFAULT '7',
  `formasPagamentoAceitas` text,
  `condicoesPagamento` varchar(200) DEFAULT NULL,
  `status` enum('ativo','inativo') NOT NULL DEFAULT 'ativo',
  `avaliacaoQualidade` int DEFAULT '5',
  `observacoes` text,
  `criadoEm` timestamp NULL DEFAULT (now()),
  `criadoPor` varchar(64) DEFAULT NULL,
  `atualizadoEm` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `categorias_despesa`
--

DROP TABLE IF EXISTS `categorias_despesa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categorias_despesa` (
  `id` varchar(64) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `descricao` text,
  `tipo` enum('fixa','variavel') NOT NULL,
  `icone` varchar(50) DEFAULT NULL,
  `cor` varchar(7) DEFAULT NULL,
  `categoriaPai` varchar(64) DEFAULT NULL,
  `ordem` int DEFAULT '0',
  `ativo` tinyint(1) DEFAULT '1',
  `criadoEm` timestamp NULL DEFAULT (now()),
  `atualizadoEm` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `comissoes`
--

DROP TABLE IF EXISTS `comissoes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comissoes` (
  `id` varchar(64) NOT NULL,
  `dentistaId` varchar(64) NOT NULL,
  `faturaId` varchar(64) DEFAULT NULL,
  `utenteId` varchar(64) DEFAULT NULL,
  `dataReferencia` varchar(10) NOT NULL,
  `dataPagamento` varchar(10) DEFAULT NULL,
  `valorBase` decimal(10,2) NOT NULL,
  `valorComissao` decimal(10,2) NOT NULL,
  `bonificacao` decimal(10,2) DEFAULT '0.00',
  `valorTotal` decimal(10,2) NOT NULL,
  `status` enum('a_pagar','pago','cancelado') NOT NULL DEFAULT 'a_pagar',
  `tipoComissao` enum('percentagem','fixo','misto') NOT NULL,
  `percentagemAplicada` decimal(5,2) DEFAULT NULL,
  `observacoes` text,
  `formaPagamento` varchar(50) DEFAULT NULL,
  `referenciaPagamento` varchar(100) DEFAULT NULL,
  `criadoEm` timestamp NULL DEFAULT (now()),
  `criadoPor` varchar(64) DEFAULT NULL,
  `atualizadoEm` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `config_clinica`
--

DROP TABLE IF EXISTS `config_clinica`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `config_clinica` (
  `id` varchar(64) NOT NULL,
  `nomeClinica` varchar(200) NOT NULL,
  `nomeFantasia` varchar(200) DEFAULT NULL,
  `razaoSocial` varchar(200) NOT NULL,
  `nif` varchar(9) NOT NULL,
  `numeroRegistro` varchar(50) DEFAULT NULL,
  `telefone` varchar(20) NOT NULL,
  `telemovel` varchar(20) DEFAULT NULL,
  `email` varchar(320) NOT NULL,
  `website` varchar(200) DEFAULT NULL,
  `redesSociais` text,
  `morada` text NOT NULL,
  `anoFundacao` int DEFAULT NULL,
  `numeroFuncionarios` int DEFAULT NULL,
  `especialidades` text,
  `horarioFuncionamento` text,
  `logoPrincipal` text,
  `logoSecundario` text,
  `favicon` text,
  `paletaCores` text,
  `papelTimbrado` text,
  `nomeSistema` varchar(100) DEFAULT NULL,
  `slogan` varchar(200) DEFAULT NULL,
  `criadoEm` timestamp NULL DEFAULT (now()),
  `atualizadoEm` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `config_comissoes`
--

DROP TABLE IF EXISTS `config_comissoes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `config_comissoes` (
  `id` varchar(64) NOT NULL,
  `dentistaId` varchar(64) NOT NULL,
  `tipo` enum('percentagem','fixo','misto','nenhum') NOT NULL DEFAULT 'percentagem',
  `configuracao` text NOT NULL,
  `pagarEm` enum('semanal','quinzenal','mensal') DEFAULT 'mensal',
  `diasPagamento` text,
  `criadoEm` timestamp NULL DEFAULT (now()),
  `atualizadoEm` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `config_comissoes_dentistaId_unique` (`dentistaId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `consultas`
--

DROP TABLE IF EXISTS `consultas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `consultas` (
  `id` varchar(255) NOT NULL,
  `utente_id` varchar(255) NOT NULL,
  `medico_id` varchar(255) DEFAULT NULL,
  `data_hora` datetime NOT NULL,
  `duracao` int DEFAULT '30',
  `tipo_consulta` varchar(100) DEFAULT NULL,
  `procedimento` text,
  `status` enum('agendada','confirmada','realizada','cancelada','faltou','em_atendimento') DEFAULT 'agendada',
  `observacoes` text,
  `valor_estimado` decimal(10,2) DEFAULT NULL,
  `classificacao_risco` varchar(10) DEFAULT NULL,
  `criado_em` timestamp NULL DEFAULT (now()),
  `atualizado_em` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `contas_pagar`
--

DROP TABLE IF EXISTS `contas_pagar`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contas_pagar` (
  `id` varchar(64) NOT NULL,
  `fornecedorId` varchar(64) DEFAULT NULL,
  `categoriaId` varchar(64) NOT NULL,
  `trabalhoLaboratorioId` varchar(64) DEFAULT NULL,
  `descricao` varchar(255) NOT NULL,
  `numeroDocumento` varchar(50) DEFAULT NULL,
  `valor` decimal(10,2) NOT NULL,
  `valorPago` decimal(10,2) DEFAULT '0.00',
  `valorRestante` decimal(10,2) NOT NULL,
  `dataEmissao` varchar(10) NOT NULL,
  `dataVencimento` varchar(10) NOT NULL,
  `dataPagamento` varchar(10) DEFAULT NULL,
  `status` enum('pendente','paga','parcial','vencida','cancelada') NOT NULL DEFAULT 'pendente',
  `recorrente` tinyint(1) DEFAULT '0',
  `frequenciaRecorrencia` enum('mensal','trimestral','semestral','anual') DEFAULT NULL,
  `anexos` text,
  `observacoes` text,
  `criadoEm` timestamp NULL DEFAULT (now()),
  `criadoPor` varchar(64) DEFAULT NULL,
  `atualizadoEm` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `contas_receber`
--

DROP TABLE IF EXISTS `contas_receber`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contas_receber` (
  `id` varchar(64) NOT NULL,
  `utenteId` varchar(64) NOT NULL,
  `dentistaId` varchar(64) DEFAULT NULL,
  `consultaId` varchar(64) DEFAULT NULL,
  `numeroFatura` varchar(50) NOT NULL,
  `serie` varchar(10) DEFAULT 'FT',
  `tipo` enum('fatura','recibo','fatura_recibo','nota_credito') NOT NULL DEFAULT 'fatura',
  `subtotal` decimal(10,2) NOT NULL,
  `descontoTotal` decimal(10,2) DEFAULT '0.00',
  `ivaTotal` decimal(10,2) DEFAULT '0.00',
  `total` decimal(10,2) NOT NULL,
  `valorPago` decimal(10,2) DEFAULT '0.00',
  `valorRestante` decimal(10,2) NOT NULL,
  `dentistaPercentagem` decimal(5,2) DEFAULT '0.00',
  `dentistaComissao` decimal(10,2) DEFAULT '0.00',
  `valorClinica` decimal(10,2) DEFAULT '0.00',
  `dataEmissao` varchar(10) NOT NULL,
  `dataVencimento` varchar(10) NOT NULL,
  `status` enum('pendente','paga','parcial','vencida','cancelada') NOT NULL DEFAULT 'pendente',
  `itens` text NOT NULL,
  `observacoes` text,
  `criadoEm` timestamp NULL DEFAULT (now()),
  `criadoPor` varchar(64) DEFAULT NULL,
  `atualizadoEm` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `contas_receber_numeroFatura_unique` (`numeroFatura`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `dentistas`
--

DROP TABLE IF EXISTS `dentistas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dentistas` (
  `id` varchar(64) NOT NULL,
  `nome` varchar(200) NOT NULL,
  `nomeCompleto` varchar(200) NOT NULL,
  `foto` text,
  `nif` varchar(9) NOT NULL,
  `numeroOrdem` varchar(20) NOT NULL,
  `especialidades` text NOT NULL,
  `email` varchar(320) NOT NULL,
  `telefone` varchar(20) NOT NULL,
  `telemovel` varchar(20) DEFAULT NULL,
  `dataAdmissao` varchar(10) NOT NULL,
  `status` enum('ativo','inativo','ferias','licenca') NOT NULL DEFAULT 'ativo',
  `cargo` varchar(100) DEFAULT NULL,
  `horarioTrabalho` text,
  `corAgenda` varchar(7) DEFAULT '#3b82f6',
  `permiteAgendamentoOnline` tinyint(1) DEFAULT '1',
  `tempoConsultaPadrao` int DEFAULT '30',
  `observacoes` text,
  `competencias` text,
  `idiomas` text,
  `criadoEm` timestamp NULL DEFAULT (now()),
  `atualizadoEm` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `dentistas_numeroOrdem_unique` (`numeroOrdem`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `endodontia`
--

DROP TABLE IF EXISTS `endodontia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `endodontia` (
  `id` varchar(64) NOT NULL,
  `utenteId` varchar(64) NOT NULL,
  `numeroDente` varchar(10) NOT NULL,
  `numeroCanais` varchar(10) NOT NULL,
  `comprimentoTrabalho` text,
  `tecnicaInstrumentacao` varchar(100) DEFAULT NULL,
  `materialObturacao` varchar(100) DEFAULT NULL,
  `dataInicio` varchar(10) DEFAULT NULL,
  `dataFinalizacao` varchar(10) DEFAULT NULL,
  `status` enum('em_andamento','concluido','retratamento') DEFAULT 'em_andamento',
  `observacoes` text,
  `criadoEm` timestamp NULL DEFAULT (now()),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `formas_pagamento`
--

DROP TABLE IF EXISTS `formas_pagamento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `formas_pagamento` (
  `id` varchar(64) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `tipo` varchar(50) NOT NULL,
  `ativo` tinyint(1) DEFAULT '1',
  `icone` varchar(50) DEFAULT NULL,
  `cor` varchar(7) DEFAULT NULL,
  `ordem` int DEFAULT '0',
  `taxa` text,
  `valorMinimo` decimal(10,2) DEFAULT NULL,
  `valorMaximo` decimal(10,2) DEFAULT NULL,
  `integracao` text,
  `observacoes` text,
  `requerReferencia` tinyint(1) DEFAULT '0',
  `criadoEm` timestamp NULL DEFAULT (now()),
  `atualizadoEm` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `fornecedores`
--

DROP TABLE IF EXISTS `fornecedores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fornecedores` (
  `id` varchar(64) NOT NULL,
  `nome` varchar(200) NOT NULL,
  `razaoSocial` varchar(200) DEFAULT NULL,
  `nif` varchar(9) DEFAULT NULL,
  `tipo` enum('materiais','equipamentos','servicos','laboratorio','outros') NOT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `email` varchar(320) DEFAULT NULL,
  `website` varchar(200) DEFAULT NULL,
  `morada` text,
  `nomeContato` varchar(200) DEFAULT NULL,
  `telefoneContato` varchar(20) DEFAULT NULL,
  `emailContato` varchar(320) DEFAULT NULL,
  `condicoesPagamento` varchar(200) DEFAULT NULL,
  `status` enum('ativo','inativo') NOT NULL DEFAULT 'ativo',
  `observacoes` text,
  `criadoEm` timestamp NULL DEFAULT (now()),
  `atualizadoEm` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `funcionarios`
--

DROP TABLE IF EXISTS `funcionarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `funcionarios` (
  `id` varchar(64) NOT NULL,
  `nome` varchar(200) NOT NULL,
  `foto` text,
  `nif` varchar(9) NOT NULL,
  `numeroSegSocial` varchar(20) DEFAULT NULL,
  `email` varchar(320) NOT NULL,
  `telefone` varchar(20) NOT NULL,
  `cargo` varchar(100) NOT NULL,
  `dataAdmissao` varchar(10) NOT NULL,
  `status` enum('ativo','inativo','ferias','licenca') NOT NULL DEFAULT 'ativo',
  `horarioTrabalho` text,
  `salario` text,
  `usuario` text,
  `criadoEm` timestamp NULL DEFAULT (now()),
  `atualizadoEm` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `imagens`
--

DROP TABLE IF EXISTS `imagens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `imagens` (
  `id` varchar(64) NOT NULL,
  `utenteId` varchar(64) NOT NULL,
  `tipo` enum('raio_x','fotografia','tomografia','scanner_3d','outro') NOT NULL,
  `categoria` varchar(100) DEFAULT NULL,
  `url` text NOT NULL,
  `nomeArquivo` varchar(255) NOT NULL,
  `tamanho` varchar(50) DEFAULT NULL,
  `dataImagem` varchar(10) DEFAULT NULL,
  `descricao` text,
  `criadoEm` timestamp NULL DEFAULT (now()),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `implantes`
--

DROP TABLE IF EXISTS `implantes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `implantes` (
  `id` varchar(64) NOT NULL,
  `utenteId` varchar(64) NOT NULL,
  `posicao` varchar(10) NOT NULL,
  `marca` varchar(100) DEFAULT NULL,
  `modelo` varchar(100) DEFAULT NULL,
  `diametro` varchar(20) DEFAULT NULL,
  `comprimento` varchar(20) DEFAULT NULL,
  `lote` varchar(50) DEFAULT NULL,
  `dataColocacao` varchar(10) DEFAULT NULL,
  `dataCarga` varchar(10) DEFAULT NULL,
  `tipoProtese` varchar(100) DEFAULT NULL,
  `status` enum('planejado','colocado','osseointegrado','protese_instalada','falha') DEFAULT 'planejado',
  `observacoes` text,
  `criadoEm` timestamp NULL DEFAULT (now()),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `laboratorio`
--

DROP TABLE IF EXISTS `laboratorio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `laboratorio` (
  `id` varchar(64) NOT NULL,
  `utenteId` varchar(64) NOT NULL,
  `tipoTrabalho` varchar(100) NOT NULL,
  `dentes` varchar(255) DEFAULT NULL,
  `laboratorioNome` varchar(200) DEFAULT NULL,
  `cor` varchar(50) DEFAULT NULL,
  `material` varchar(100) DEFAULT NULL,
  `dataEnvio` varchar(10) DEFAULT NULL,
  `dataPrevisao` varchar(10) DEFAULT NULL,
  `dataRecepcao` varchar(10) DEFAULT NULL,
  `dataInstalacao` varchar(10) DEFAULT NULL,
  `custo` varchar(20) DEFAULT NULL,
  `status` enum('pendente','enviado','em_producao','recebido','instalado','ajuste_necessario') DEFAULT 'pendente',
  `observacoes` text,
  `criadoEm` timestamp NULL DEFAULT (now()),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `movimentos_caixa`
--

DROP TABLE IF EXISTS `movimentos_caixa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movimentos_caixa` (
  `id` varchar(64) NOT NULL,
  `tipo` enum('entrada','saida','abertura','fechamento','sangria','reforco') NOT NULL,
  `contaReceberId` varchar(64) DEFAULT NULL,
  `contaPagarId` varchar(64) DEFAULT NULL,
  `descricao` varchar(255) NOT NULL,
  `valor` decimal(10,2) NOT NULL,
  `formaPagamento` varchar(50) NOT NULL,
  `dataHora` datetime NOT NULL,
  `saldoAnterior` decimal(10,2) DEFAULT NULL,
  `saldoAtual` decimal(10,2) DEFAULT NULL,
  `observacoes` text,
  `criadoEm` timestamp NULL DEFAULT (now()),
  `criadoPor` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `odontograma`
--

DROP TABLE IF EXISTS `odontograma`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `odontograma` (
  `id` varchar(64) NOT NULL,
  `utenteId` varchar(64) NOT NULL,
  `numeroDente` varchar(10) NOT NULL,
  `faces` text,
  `condicao` varchar(100) DEFAULT NULL,
  `tratamento` varchar(100) DEFAULT NULL,
  `observacoes` text,
  `dataRegistro` varchar(10) DEFAULT NULL,
  `criadoEm` timestamp NULL DEFAULT (now()),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ortodontia`
--

DROP TABLE IF EXISTS `ortodontia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ortodontia` (
  `id` varchar(64) NOT NULL,
  `utenteId` varchar(64) NOT NULL,
  `tipoAparelho` varchar(100) DEFAULT NULL,
  `dataInicio` varchar(10) DEFAULT NULL,
  `dataPrevisaoTermino` varchar(10) DEFAULT NULL,
  `status` enum('ativo','concluido','pausado') DEFAULT 'ativo',
  `observacoes` text,
  `criadoEm` timestamp NULL DEFAULT (now()),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ortodontia_consultas`
--

DROP TABLE IF EXISTS `ortodontia_consultas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ortodontia_consultas` (
  `id` varchar(64) NOT NULL,
  `ortodontiaId` varchar(64) NOT NULL,
  `dataConsulta` varchar(10) NOT NULL,
  `procedimentos` text,
  `observacoes` text,
  `proximaConsulta` varchar(10) DEFAULT NULL,
  `criadoEm` timestamp NULL DEFAULT (now()),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `pagamentos_contas_pagar`
--

DROP TABLE IF EXISTS `pagamentos_contas_pagar`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pagamentos_contas_pagar` (
  `id` varchar(64) NOT NULL,
  `contaPagarId` varchar(64) NOT NULL,
  `valor` decimal(10,2) NOT NULL,
  `dataPagamento` varchar(10) NOT NULL,
  `formaPagamento` varchar(50) NOT NULL,
  `referencia` varchar(100) DEFAULT NULL,
  `comprovante` text,
  `observacoes` text,
  `criadoEm` timestamp NULL DEFAULT (now()),
  `criadoPor` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `pagamentos_contas_receber`
--

DROP TABLE IF EXISTS `pagamentos_contas_receber`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pagamentos_contas_receber` (
  `id` varchar(64) NOT NULL,
  `contaReceberId` varchar(64) NOT NULL,
  `valor` decimal(10,2) NOT NULL,
  `dataPagamento` varchar(10) NOT NULL,
  `formaPagamentoId` varchar(64) NOT NULL,
  `referencia` varchar(100) DEFAULT NULL,
  `comprovante` text,
  `taxaOperacao` decimal(10,2) DEFAULT '0.00',
  `valorLiquido` decimal(10,2) NOT NULL,
  `observacoes` text,
  `criadoEm` timestamp NULL DEFAULT (now()),
  `criadoPor` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `periodontograma`
--

DROP TABLE IF EXISTS `periodontograma`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `periodontograma` (
  `id` varchar(64) NOT NULL,
  `utenteId` varchar(64) NOT NULL,
  `numeroDente` varchar(10) NOT NULL,
  `medicoes` text NOT NULL,
  `dataAvaliacao` varchar(10) NOT NULL,
  `criadoEm` timestamp NULL DEFAULT (now()),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `prescricoes`
--

DROP TABLE IF EXISTS `prescricoes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prescricoes` (
  `id` varchar(64) NOT NULL,
  `utenteId` varchar(64) NOT NULL,
  `dataPrescricao` varchar(10) NOT NULL,
  `medicamentos` text NOT NULL,
  `diagnostico` text,
  `observacoes` text,
  `criadoEm` timestamp NULL DEFAULT (now()),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `trabalhos_laboratorio`
--

DROP TABLE IF EXISTS `trabalhos_laboratorio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trabalhos_laboratorio` (
  `id` varchar(64) NOT NULL,
  `laboratorioId` varchar(64) NOT NULL,
  `utenteId` varchar(64) NOT NULL,
  `dentistaId` varchar(64) NOT NULL,
  `consultaId` varchar(64) DEFAULT NULL,
  `tipoTrabalho` varchar(100) NOT NULL,
  `descricao` text NOT NULL,
  `dentes` varchar(255) DEFAULT NULL,
  `cor` varchar(50) DEFAULT NULL,
  `material` varchar(100) DEFAULT NULL,
  `dataEnvio` varchar(10) DEFAULT NULL,
  `dataPrevisaoEntrega` varchar(10) DEFAULT NULL,
  `dataEntregaReal` varchar(10) DEFAULT NULL,
  `dataInstalacao` varchar(10) DEFAULT NULL,
  `custoLaboratorio` decimal(10,2) NOT NULL,
  `valorCobradoUtente` decimal(10,2) DEFAULT NULL,
  `margemLucro` decimal(10,2) DEFAULT NULL,
  `status` enum('orcamento','enviado','em_producao','recebido','instalado','ajuste_necessario','cancelado') DEFAULT 'orcamento',
  `avaliacaoQualidade` int DEFAULT NULL,
  `necessitouAjuste` tinyint(1) DEFAULT '0',
  `observacoes` text,
  `observacoesInternas` text,
  `criadoEm` timestamp NULL DEFAULT (now()),
  `criadoPor` varchar(64) DEFAULT NULL,
  `atualizadoEm` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` varchar(64) NOT NULL,
  `name` text,
  `email` varchar(320) DEFAULT NULL,
  `loginMethod` varchar(64) DEFAULT NULL,
  `role` enum('user','admin') NOT NULL DEFAULT 'user',
  `createdAt` timestamp NULL DEFAULT (now()),
  `lastSignedIn` timestamp NULL DEFAULT (now()),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `utentes`
--

DROP TABLE IF EXISTS `utentes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `utentes` (
  `id` varchar(36) NOT NULL,
  `numeroUtente` varchar(20) NOT NULL,
  `nomeCompleto` varchar(200) NOT NULL,
  `dataNascimento` varchar(10) NOT NULL,
  `genero` enum('M','F','Outro') NOT NULL,
  `nif` varchar(9) DEFAULT NULL,
  `numUtenteSns` varchar(9) DEFAULT NULL,
  `fotoPerfil` text,
  `contacto` text,
  `morada` text,
  `infoMedica` text NOT NULL,
  `status` enum('ativo','inativo','arquivado') NOT NULL DEFAULT 'ativo',
  `tags` text,
  `criadoPor` varchar(64) NOT NULL,
  `criadoEm` timestamp NULL DEFAULT (now()),
  `atualizadoEm` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `utentes_numeroUtente_unique` (`numeroUtente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-17 14:12:50
