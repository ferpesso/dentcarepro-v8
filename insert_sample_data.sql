-- Inserir dados de exemplo para testes
-- DentCarePRO PostgreSQL

-- Inserir dentistas de exemplo
INSERT INTO dentistas (id, nome, especialidade, numero_ordem, email, telefone, ativo, cor_agenda) VALUES
('dentista-001', 'Dr. João Costa', 'Ortodontia', 'OMD12345', 'joao.costa@clinica.pt', '+351 91 234 5678', true, '#3b82f6'),
('dentista-002', 'Dra. Ana Ferreira', 'Endodontia', 'OMD12346', 'ana.ferreira@clinica.pt', '+351 92 345 6789', true, '#10b981'),
('dentista-003', 'Dr. Carlos Silva', 'Implantologia', 'OMD12347', 'carlos.silva@clinica.pt', '+351 93 456 7890', true, '#f59e0b')
ON CONFLICT (id) DO NOTHING;

-- Inserir utentes de exemplo
INSERT INTO utentes (id, codigo, nome, data_nascimento, genero, nif, numero_sns, email, telefone, telemovel, 
                     rua, numero, codigo_postal, cidade, pais, estado, alergias, medicamentos) VALUES
('utente-001', 'U001', 'Maria Silva Santos', '1983-05-15', 'F', '123456789', '123456789', 
 'maria.silva@email.pt', '212345678', '912345678', 
 'Rua das Flores', '45', '1000-100', 'Lisboa', 'Portugal', 'ativo',
 'Penicilina', 'Paracetamol'),
 
('utente-002', 'U002', 'João Pedro Costa', '1990-08-22', 'M', '234567890', '234567890',
 'joao.costa@email.pt', '213456789', '923456789',
 'Avenida da Liberdade', '123', '1250-140', 'Lisboa', 'Portugal', 'ativo',
 '', ''),
 
('utente-003', 'U003', 'Ana Rita Ferreira', '1978-12-10', 'F', '345678901', '345678901',
 'ana.ferreira@email.pt', '214567890', '934567890',
 'Rua do Comércio', '78', '4000-200', 'Porto', 'Portugal', 'ativo',
 'Látex', 'Ibuprofeno'),
 
('utente-004', 'U004', 'Carlos Manuel Oliveira', '1965-03-28', 'M', '456789012', '456789012',
 'carlos.oliveira@email.pt', '215678901', '945678901',
 'Praça da República', '12', '3000-343', 'Coimbra', 'Portugal', 'ativo',
 '', ''),
 
('utente-005', 'U005', 'Sofia Marques Rodrigues', '2000-07-05', 'F', '567890123', '567890123',
 'sofia.rodrigues@email.pt', '216789012', '956789012',
 'Rua Nova', '56', '2500-123', 'Caldas da Rainha', 'Portugal', 'ativo',
 '', '')
ON CONFLICT (id) DO NOTHING;

-- Inserir consultas de exemplo
INSERT INTO consultas (id, utente_id, dentista_id, data_hora, duracao, tipo, status, valor) VALUES
('consulta-001', 'utente-001', 'dentista-001', '2025-10-18 09:00:00', 30, 'Consulta de Rotina', 'agendada', 50.00),
('consulta-002', 'utente-002', 'dentista-002', '2025-10-18 10:00:00', 60, 'Tratamento de Canal', 'agendada', 150.00),
('consulta-003', 'utente-003', 'dentista-001', '2025-10-18 14:00:00', 30, 'Limpeza', 'agendada', 40.00),
('consulta-004', 'utente-004', 'dentista-003', '2025-10-19 09:30:00', 90, 'Implante', 'agendada', 800.00),
('consulta-005', 'utente-005', 'dentista-002', '2025-10-19 11:00:00', 30, 'Avaliação', 'agendada', 35.00),
('consulta-006', 'utente-001', 'dentista-001', '2025-10-15 10:00:00', 30, 'Consulta de Rotina', 'realizada', 50.00),
('consulta-007', 'utente-002', 'dentista-002', '2025-10-14 15:00:00', 45, 'Limpeza', 'realizada', 45.00)
ON CONFLICT (id) DO NOTHING;

-- Inserir laboratórios de exemplo
INSERT INTO laboratorios (id, nome, responsavel, email, telefone, cidade, ativo) VALUES
('lab-001', 'Laboratório DentalTech', 'Pedro Santos', 'geral@dentaltech.pt', '+351 21 234 5678', 'Lisboa', true),
('lab-002', 'ProLab Dental', 'Maria Costa', 'info@prolabdental.pt', '+351 22 345 6789', 'Porto', true)
ON CONFLICT (id) DO NOTHING;

-- Inserir fornecedores de exemplo
INSERT INTO fornecedores (id, nome, nif, email, telefone, cidade, ativo) VALUES
('forn-001', 'Dental Supply Lda', '500123456', 'vendas@dentalsupply.pt', '+351 21 345 6789', 'Lisboa', true),
('forn-002', 'MediDental Portugal', '500234567', 'comercial@medidental.pt', '+351 22 456 7890', 'Porto', true)
ON CONFLICT (id) DO NOTHING;

-- Inserir faturas de exemplo
INSERT INTO faturas (id, numero_fatura, utente_id, data_emissao, data_vencimento, valor_total, valor_pago, status) VALUES
('fatura-001', 'FT2025/00001', 'utente-001', '2025-10-15', '2025-11-15', 50.00, 50.00, 'paga'),
('fatura-002', 'FT2025/00002', 'utente-002', '2025-10-14', '2025-11-14', 45.00, 45.00, 'paga'),
('fatura-003', 'FT2025/00003', 'utente-003', '2025-10-16', '2025-11-16', 120.00, 0.00, 'pendente'),
('fatura-004', 'FT2025/00004', 'utente-004', '2025-10-17', '2025-11-17', 800.00, 400.00, 'parcial')
ON CONFLICT (id) DO NOTHING;

-- Inserir itens de fatura
INSERT INTO itens_fatura (id, fatura_id, descricao, quantidade, valor_unitario, valor_total) VALUES
('item-001', 'fatura-001', 'Consulta de Rotina', 1, 50.00, 50.00),
('item-002', 'fatura-002', 'Limpeza Dentária', 1, 45.00, 45.00),
('item-003', 'fatura-003', 'Tratamento de Canal', 1, 120.00, 120.00),
('item-004', 'fatura-004', 'Implante Dentário', 1, 800.00, 800.00)
ON CONFLICT (id) DO NOTHING;

-- Inserir pagamentos
INSERT INTO pagamentos (id, fatura_id, data_pagamento, valor, forma_pagamento) VALUES
('pag-001', 'fatura-001', '2025-10-15', 50.00, 'Multibanco'),
('pag-002', 'fatura-002', '2025-10-14', 45.00, 'MB WAY'),
('pag-003', 'fatura-004', '2025-10-17', 400.00, 'Transferência Bancária')
ON CONFLICT (id) DO NOTHING;

-- Inserir configurações de comissão
INSERT INTO config_comissoes (id, dentista_id, percentual, ativo) VALUES
('config-com-001', 'dentista-001', 20.00, true),
('config-com-002', 'dentista-002', 25.00, true),
('config-com-003', 'dentista-003', 30.00, true)
ON CONFLICT (id) DO NOTHING;

-- Inserir comissões
INSERT INTO comissoes (id, dentista_id, fatura_id, valor, percentual, status) VALUES
('com-001', 'dentista-001', 'fatura-001', 10.00, 20.00, 'pendente'),
('com-002', 'dentista-002', 'fatura-002', 11.25, 25.00, 'pendente')
ON CONFLICT (id) DO NOTHING;

-- Inserir contas a pagar
INSERT INTO contas_pagar (id, fornecedor_id, categoria_id, descricao, valor, data_vencimento, status) VALUES
('cp-001', 'forn-001', 'cat-1', 'Material dentário - Outubro', 450.00, '2025-10-30', 'pendente'),
('cp-002', 'forn-002', 'cat-1', 'Equipamentos diversos', 1200.00, '2025-11-05', 'pendente'),
('cp-003', 'forn-001', 'cat-1', 'Material dentário - Setembro', 380.00, '2025-09-30', 'paga')
ON CONFLICT (id) DO NOTHING;

-- Atualizar conta paga
UPDATE contas_pagar SET data_pagamento = '2025-09-28', forma_pagamento = 'Transferência Bancária' WHERE id = 'cp-003';

