-- Rollback Migration: Sistema de Integração - PostgreSQL
-- Data: 2025-10-28
-- Descrição: Reverter criação de tabelas de integração

-- ========================================
-- REMOVER TRIGGERS
-- ========================================

DROP TRIGGER IF EXISTS update_procedimentos_updated_at ON procedimentos_clinicos;
DROP TRIGGER IF EXISTS update_tabela_precos_updated_at ON tabela_precos;
DROP TRIGGER IF EXISTS update_dentistas_updated_at ON dentistas;
DROP TRIGGER IF EXISTS update_comissoes_updated_at ON comissoes;
DROP TRIGGER IF EXISTS update_config_comissoes_updated_at ON config_comissoes;

DROP FUNCTION IF EXISTS update_updated_at_column();

-- ========================================
-- REMOVER TABELAS (ordem inversa para respeitar FKs)
-- ========================================

DROP TABLE IF EXISTS config_comissoes CASCADE;
DROP TABLE IF EXISTS comissoes CASCADE;
DROP TABLE IF EXISTS historico_utente CASCADE;
DROP TABLE IF EXISTS procedimentos_clinicos CASCADE;
DROP TABLE IF EXISTS tabela_precos CASCADE;
DROP TABLE IF EXISTS dentistas CASCADE;

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
