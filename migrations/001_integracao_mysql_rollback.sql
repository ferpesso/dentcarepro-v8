-- Rollback Migration: Sistema de Integração - MySQL
-- Data: 2025-10-28
-- Descrição: Reverter criação de tabelas de integração

-- ========================================
-- REMOVER TABELAS (ordem inversa para respeitar FKs)
-- ========================================

DROP TABLE IF EXISTS config_comissoes;
DROP TABLE IF EXISTS comissoes;
DROP TABLE IF EXISTS historico_utente;
DROP TABLE IF EXISTS procedimentos_clinicos;
DROP TABLE IF EXISTS tabela_precos;
DROP TABLE IF EXISTS dentistas;

-- ========================================
-- REMOVER COLUNAS ADICIONADAS EM FATURAS
-- ========================================

ALTER TABLE faturas DROP COLUMN IF EXISTS dentista_id;
ALTER TABLE faturas DROP COLUMN IF EXISTS dentista_nome;
ALTER TABLE faturas DROP COLUMN IF EXISTS dentista_percentagem;
ALTER TABLE faturas DROP COLUMN IF EXISTS dentista_comissao;
ALTER TABLE faturas DROP COLUMN IF EXISTS comissao_id;
ALTER TABLE faturas DROP COLUMN IF EXISTS valor_clinica;
ALTER TABLE faturas DROP COLUMN IF EXISTS consulta_id;

-- ========================================
-- FIM DO ROLLBACK
-- ========================================
