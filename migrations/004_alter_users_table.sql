-- Migration: 004_alter_users_table.sql
-- Data: 2025-10-28
-- Descrição: Adicionar campos de autenticação à tabela users existente

-- ========================================
-- ALTERAR TABELA: users
-- ========================================

-- Adicionar campos de autenticação
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'bloqueado', 'pendente'));
ALTER TABLE users ADD COLUMN IF NOT EXISTS dentista_id VARCHAR(64);
ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token_expires TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified INTEGER DEFAULT 0 CHECK (email_verified IN (0, 1));
ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_token VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS login_attempts INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS locked_until TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS created_by VARCHAR(64);

-- Adicionar índices
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_dentista ON users(dentista_id);

-- Adicionar foreign key para dentista_id (se tabela dentistas existir)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'dentistas') THEN
        ALTER TABLE users ADD CONSTRAINT fk_user_dentista 
        FOREIGN KEY (dentista_id) REFERENCES dentistas(id) ON DELETE SET NULL;
    END IF;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- ========================================
-- TABELA: user_sessions (Sessões de Usuário)
-- ========================================

CREATE TABLE IF NOT EXISTS user_sessions (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  token VARCHAR(500) NOT NULL UNIQUE,
  
  -- Informações da sessão
  ip_address VARCHAR(45),
  user_agent TEXT,
  device_info TEXT,
  
  -- Validade
  expires_at TIMESTAMP NOT NULL,
  last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Status
  is_active INTEGER DEFAULT 1 CHECK (is_active IN (0, 1)),
  
  -- Auditoria
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Foreign Keys
  CONSTRAINT fk_session_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON user_sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON user_sessions(expires_at);

-- ========================================
-- TABELA: user_permissions (Permissões Granulares)
-- ========================================

CREATE TABLE IF NOT EXISTS user_permissions (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  
  -- Módulo e ação
  module VARCHAR(50) NOT NULL CHECK (module IN (
    'agenda',
    'utentes',
    'odontograma',
    'periodontograma',
    'endodontia',
    'implantes',
    'ortodontia',
    'faturacao',
    'comissoes',
    'relatorios',
    'configuracoes',
    'estoque',
    'laboratorios',
    'prescricoes',
    'imagens'
  )),
  
  action VARCHAR(20) NOT NULL CHECK (action IN ('read', 'create', 'update', 'delete', 'export')),
  
  -- Status
  granted INTEGER DEFAULT 1 CHECK (granted IN (0, 1)),
  
  -- Auditoria
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(64),
  
  -- Foreign Keys
  CONSTRAINT fk_permission_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  
  -- Constraint única
  CONSTRAINT unique_user_module_action UNIQUE (user_id, module, action)
);

CREATE INDEX IF NOT EXISTS idx_permissions_user ON user_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_permissions_module ON user_permissions(module);

-- ========================================
-- TABELA: audit_log (Log de Auditoria)
-- ========================================

-- Verificar se já existe e criar se não
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'audit_log') THEN
        CREATE TABLE audit_log (
          id VARCHAR(64) PRIMARY KEY,
          user_id VARCHAR(64),
          
          -- Ação realizada
          action VARCHAR(100) NOT NULL,
          module VARCHAR(50) NOT NULL,
          entity_type VARCHAR(50),
          entity_id VARCHAR(64),
          
          -- Detalhes
          description TEXT,
          old_values TEXT,
          new_values TEXT,
          
          -- Contexto
          ip_address VARCHAR(45),
          user_agent TEXT,
          
          -- Timestamp
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          
          -- Foreign Keys
          CONSTRAINT fk_audit_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
        );
        
        CREATE INDEX idx_audit_user ON audit_log(user_id);
        CREATE INDEX idx_audit_action ON audit_log(action);
        CREATE INDEX idx_audit_module ON audit_log(module);
        CREATE INDEX idx_audit_created ON audit_log(created_at);
        CREATE INDEX idx_audit_entity ON audit_log(entity_type, entity_id);
    END IF;
END $$;

-- ========================================
-- TABELA: notifications (Notificações)
-- ========================================

CREATE TABLE IF NOT EXISTS notifications (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64),
  
  -- Tipo de notificação
  type VARCHAR(50) NOT NULL CHECK (type IN (
    'consulta_agendada',
    'consulta_cancelada',
    'consulta_lembrete',
    'pagamento_recebido',
    'pagamento_pendente',
    'comissao_disponivel',
    'estoque_baixo',
    'aniversario_utente',
    'sistema',
    'outro'
  )),
  
  -- Conteúdo
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  
  -- Prioridade
  priority VARCHAR(20) CHECK (priority IN ('baixa', 'media', 'alta', 'urgente')) DEFAULT 'media',
  
  -- Status
  is_read INTEGER DEFAULT 0 CHECK (is_read IN (0, 1)),
  read_at TIMESTAMP,
  
  -- Ligação com entidades
  entity_type VARCHAR(50),
  entity_id VARCHAR(64),
  
  -- Ação
  action_url TEXT,
  action_label VARCHAR(100),
  
  -- Auditoria
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,
  
  -- Foreign Keys
  CONSTRAINT fk_notification_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at);

-- ========================================
-- INSERIR/ATUALIZAR USUÁRIO ADMIN PADRÃO
-- ========================================

-- Senha padrão: Admin@123
-- Hash SHA-256: 828deb816e9cd8bbfa1daf1bb1907c0c03fe20b02f7d43524fe1975a2e783d65
-- IMPORTANTE: Alterar após primeiro login!
-- AVISO: Em produção, usar bcrypt ou argon2!

-- Verificar se já existe admin e atualizar, senão inserir
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM users WHERE email = 'admin@dentcarepro.com') THEN
        -- Atualizar usuário existente
        UPDATE users SET
            password_hash = '828deb816e9cd8bbfa1daf1bb1907c0c03fe20b02f7d43524fe1975a2e783d65',
            role = 'admin',
            status = 'ativo',
            email_verified = 1
        WHERE email = 'admin@dentcarepro.com';
    ELSE
        -- Inserir novo usuário
        INSERT INTO users (
            id,
            name,
            email,
            password_hash,
            role,
            status,
            email_verified,
            created_at,
            updated_at
        ) VALUES (
            'admin-default-001',
            'Administrador',
            'admin@dentcarepro.com',
            '828deb816e9cd8bbfa1daf1bb1907c0c03fe20b02f7d43524fe1975a2e783d65',
            'admin',
            'ativo',
            1,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        );
    END IF;
END $$;

-- ========================================
-- COMENTÁRIOS
-- ========================================

COMMENT ON TABLE users IS 'Usuários do sistema com autenticação';
COMMENT ON TABLE user_sessions IS 'Sessões ativas de usuários';
COMMENT ON TABLE user_permissions IS 'Permissões granulares por usuário';
COMMENT ON TABLE audit_log IS 'Log de auditoria de todas as ações';
COMMENT ON TABLE notifications IS 'Notificações para usuários';

-- ========================================
-- FIM DA MIGRATION
-- ========================================

SELECT 'Migration 004 executada com sucesso!' AS status;
