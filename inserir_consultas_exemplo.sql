-- Script para inserir consultas de exemplo
-- Data: 28 de Outubro de 2025

-- Primeiro, vamos verificar os IDs disponíveis
SELECT 'USERS DISPONÍVEIS:' as info;
SELECT id, name, email, role FROM users;

SELECT 'UTENTES DISPONÍVEIS:' as info;
SELECT id, nome, telefone FROM utentes;

-- Inserir consultas de exemplo
-- Consulta 1: Hoje, manhã
INSERT INTO consultas (id, utente_id, dentista_id, data_hora, duracao, tipo, status, notas, valor)
SELECT 
  'consulta-001',
  (SELECT id FROM utentes LIMIT 1),
  (SELECT id FROM users WHERE role IN ('admin', 'dentista') LIMIT 1),
  CURRENT_TIMESTAMP + INTERVAL '2 hours',
  30,
  'Consulta de Rotina',
  'agendada',
  'Primeira consulta de exemplo - Checkup geral',
  50.00
WHERE NOT EXISTS (SELECT 1 FROM consultas WHERE id = 'consulta-001');

-- Consulta 2: Hoje, tarde
INSERT INTO consultas (id, utente_id, dentista_id, data_hora, duracao, tipo, status, notas, valor)
SELECT 
  'consulta-002',
  (SELECT id FROM utentes LIMIT 1 OFFSET 1),
  (SELECT id FROM users WHERE role IN ('admin', 'dentista') LIMIT 1),
  CURRENT_TIMESTAMP + INTERVAL '5 hours',
  45,
  'Limpeza',
  'confirmada',
  'Limpeza dentária completa',
  75.00
WHERE NOT EXISTS (SELECT 1 FROM consultas WHERE id = 'consulta-002');

-- Consulta 3: Amanhã
INSERT INTO consultas (id, utente_id, dentista_id, data_hora, duracao, tipo, status, notas, valor)
SELECT 
  'consulta-003',
  (SELECT id FROM utentes LIMIT 1 OFFSET 2),
  (SELECT id FROM users WHERE role IN ('admin', 'dentista') LIMIT 1),
  CURRENT_TIMESTAMP + INTERVAL '1 day' + INTERVAL '3 hours',
  60,
  'Tratamento de Canal',
  'agendada',
  'Endodontia - dente 16',
  250.00
WHERE NOT EXISTS (SELECT 1 FROM consultas WHERE id = 'consulta-003');

-- Consulta 4: Próxima semana
INSERT INTO consultas (id, utente_id, dentista_id, data_hora, duracao, tipo, status, notas, valor)
SELECT 
  'consulta-004',
  (SELECT id FROM utentes LIMIT 1 OFFSET 3),
  (SELECT id FROM users WHERE role IN ('admin', 'dentista') LIMIT 1),
  CURRENT_TIMESTAMP + INTERVAL '7 days' + INTERVAL '2 hours',
  30,
  'Avaliação Ortodôntica',
  'agendada',
  'Primeira avaliação para aparelho',
  80.00
WHERE NOT EXISTS (SELECT 1 FROM consultas WHERE id = 'consulta-004');

-- Consulta 5: Consulta realizada (passado)
INSERT INTO consultas (id, utente_id, dentista_id, data_hora, duracao, tipo, status, notas, valor)
SELECT 
  'consulta-005',
  (SELECT id FROM utentes LIMIT 1 OFFSET 4),
  (SELECT id FROM users WHERE role IN ('admin', 'dentista') LIMIT 1),
  CURRENT_TIMESTAMP - INTERVAL '2 days',
  45,
  'Extração',
  'realizada',
  'Extração dente 48 - sem complicações',
  120.00
WHERE NOT EXISTS (SELECT 1 FROM consultas WHERE id = 'consulta-005');

-- Consulta 6: Consulta cancelada
INSERT INTO consultas (id, utente_id, dentista_id, data_hora, duracao, tipo, status, notas, valor)
SELECT 
  'consulta-006',
  (SELECT id FROM utentes LIMIT 1),
  (SELECT id FROM users WHERE role IN ('admin', 'dentista') LIMIT 1),
  CURRENT_TIMESTAMP - INTERVAL '1 day',
  30,
  'Consulta de Rotina',
  'cancelada',
  'Paciente cancelou por motivo pessoal',
  50.00
WHERE NOT EXISTS (SELECT 1 FROM consultas WHERE id = 'consulta-006');

-- Verificar consultas inseridas
SELECT 'CONSULTAS INSERIDAS:' as info;
SELECT 
  c.id,
  u.nome as paciente,
  us.name as dentista,
  c.data_hora,
  c.tipo,
  c.status,
  c.valor
FROM consultas c
LEFT JOIN utentes u ON c.utente_id = u.id
LEFT JOIN users us ON c.dentista_id = us.id
ORDER BY c.data_hora DESC;

-- Estatísticas
SELECT 'ESTATÍSTICAS:' as info;
SELECT 
  COUNT(*) as total_consultas,
  SUM(CASE WHEN status = 'agendada' THEN 1 ELSE 0 END) as agendadas,
  SUM(CASE WHEN status = 'confirmada' THEN 1 ELSE 0 END) as confirmadas,
  SUM(CASE WHEN status = 'realizada' THEN 1 ELSE 0 END) as realizadas,
  SUM(CASE WHEN status = 'cancelada' THEN 1 ELSE 0 END) as canceladas,
  SUM(valor) as valor_total
FROM consultas;
