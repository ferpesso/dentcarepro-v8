CREATE TABLE `consultas` (
	`id` varchar(255) NOT NULL,
	`utente_id` varchar(255) NOT NULL,
	`medico_id` varchar(255),
	`data_hora` datetime NOT NULL,
	`duracao` int DEFAULT 30,
	`tipo_consulta` varchar(100),
	`procedimento` text,
	`status` enum('agendada','confirmada','realizada','cancelada','faltou','em_atendimento') DEFAULT 'agendada',
	`observacoes` text,
	`valor_estimado` decimal(10,2),
	`classificacao_risco` varchar(10),
	`criado_em` timestamp DEFAULT (now()),
	`atualizado_em` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `consultas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `endodontia` (
	`id` varchar(64) NOT NULL,
	`utenteId` varchar(64) NOT NULL,
	`numeroDente` varchar(10) NOT NULL,
	`numeroCanais` varchar(10) NOT NULL,
	`comprimentoTrabalho` text,
	`tecnicaInstrumentacao` varchar(100),
	`materialObturacao` varchar(100),
	`dataInicio` varchar(10),
	`dataFinalizacao` varchar(10),
	`status` enum('em_andamento','concluido','retratamento') DEFAULT 'em_andamento',
	`observacoes` text,
	`criadoEm` timestamp DEFAULT (now()),
	CONSTRAINT `endodontia_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `imagens` (
	`id` varchar(64) NOT NULL,
	`utenteId` varchar(64) NOT NULL,
	`tipo` enum('raio_x','fotografia','tomografia','scanner_3d','outro') NOT NULL,
	`categoria` varchar(100),
	`url` text NOT NULL,
	`nomeArquivo` varchar(255) NOT NULL,
	`tamanho` varchar(50),
	`dataImagem` varchar(10),
	`descricao` text,
	`criadoEm` timestamp DEFAULT (now()),
	CONSTRAINT `imagens_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `implantes` (
	`id` varchar(64) NOT NULL,
	`utenteId` varchar(64) NOT NULL,
	`posicao` varchar(10) NOT NULL,
	`marca` varchar(100),
	`modelo` varchar(100),
	`diametro` varchar(20),
	`comprimento` varchar(20),
	`lote` varchar(50),
	`dataColocacao` varchar(10),
	`dataCarga` varchar(10),
	`tipoProtese` varchar(100),
	`status` enum('planejado','colocado','osseointegrado','protese_instalada','falha') DEFAULT 'planejado',
	`observacoes` text,
	`criadoEm` timestamp DEFAULT (now()),
	CONSTRAINT `implantes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `laboratorio` (
	`id` varchar(64) NOT NULL,
	`utenteId` varchar(64) NOT NULL,
	`tipoTrabalho` varchar(100) NOT NULL,
	`dentes` varchar(255),
	`laboratorioNome` varchar(200),
	`cor` varchar(50),
	`material` varchar(100),
	`dataEnvio` varchar(10),
	`dataPrevisao` varchar(10),
	`dataRecepcao` varchar(10),
	`dataInstalacao` varchar(10),
	`custo` varchar(20),
	`status` enum('pendente','enviado','em_producao','recebido','instalado','ajuste_necessario') DEFAULT 'pendente',
	`observacoes` text,
	`criadoEm` timestamp DEFAULT (now()),
	CONSTRAINT `laboratorio_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `odontograma` (
	`id` varchar(64) NOT NULL,
	`utenteId` varchar(64) NOT NULL,
	`numeroDente` varchar(10) NOT NULL,
	`faces` text,
	`condicao` varchar(100),
	`tratamento` varchar(100),
	`observacoes` text,
	`dataRegistro` varchar(10),
	`criadoEm` timestamp DEFAULT (now()),
	CONSTRAINT `odontograma_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ortodontia` (
	`id` varchar(64) NOT NULL,
	`utenteId` varchar(64) NOT NULL,
	`tipoAparelho` varchar(100),
	`dataInicio` varchar(10),
	`dataPrevisaoTermino` varchar(10),
	`status` enum('ativo','concluido','pausado') DEFAULT 'ativo',
	`observacoes` text,
	`criadoEm` timestamp DEFAULT (now()),
	CONSTRAINT `ortodontia_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ortodontia_consultas` (
	`id` varchar(64) NOT NULL,
	`ortodontiaId` varchar(64) NOT NULL,
	`dataConsulta` varchar(10) NOT NULL,
	`procedimentos` text,
	`observacoes` text,
	`proximaConsulta` varchar(10),
	`criadoEm` timestamp DEFAULT (now()),
	CONSTRAINT `ortodontia_consultas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `periodontograma` (
	`id` varchar(64) NOT NULL,
	`utenteId` varchar(64) NOT NULL,
	`numeroDente` varchar(10) NOT NULL,
	`medicoes` text NOT NULL,
	`dataAvaliacao` varchar(10) NOT NULL,
	`criadoEm` timestamp DEFAULT (now()),
	CONSTRAINT `periodontograma_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `prescricoes` (
	`id` varchar(64) NOT NULL,
	`utenteId` varchar(64) NOT NULL,
	`dataPrescricao` varchar(10) NOT NULL,
	`medicamentos` text NOT NULL,
	`diagnostico` text,
	`observacoes` text,
	`criadoEm` timestamp DEFAULT (now()),
	CONSTRAINT `prescricoes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `utentes` (
	`id` varchar(36) NOT NULL,
	`numeroUtente` varchar(20) NOT NULL,
	`nomeCompleto` varchar(200) NOT NULL,
	`dataNascimento` varchar(10) NOT NULL,
	`genero` enum('M','F','Outro') NOT NULL,
	`nif` varchar(9),
	`numUtenteSns` varchar(9),
	`fotoPerfil` text,
	`contacto` text,
	`morada` text,
	`infoMedica` text NOT NULL,
	`status` enum('ativo','inativo','arquivado') NOT NULL DEFAULT 'ativo',
	`tags` text,
	`criadoPor` varchar(64) NOT NULL,
	`criadoEm` timestamp DEFAULT (now()),
	`atualizadoEm` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `utentes_id` PRIMARY KEY(`id`),
	CONSTRAINT `utentes_numeroUtente_unique` UNIQUE(`numeroUtente`)
);
