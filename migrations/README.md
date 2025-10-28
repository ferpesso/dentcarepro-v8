# 📦 Migrations - DentCare PRO v8

Documentação completa das migrations do banco de dados.

---

## 📋 Lista de Migrations

### **001_integracao** - Sistema de Integração

**Data:** 28 de Outubro de 2025  
**Versão:** 8.0.0  
**Status:** ✅ Pronto para produção

**Descrição:**  
Criação de tabelas para integração entre módulos clínicos, financeiros e administrativos.

**Tabelas Criadas:**
1. `procedimentos_clinicos` - Registro de procedimentos clínicos
2. `historico_utente` - Timeline unificada de eventos
3. `tabela_precos` - Preços configuráveis de procedimentos
4. `dentistas` - Cadastro de dentistas
5. `comissoes` - Comissões dos dentistas
6. `config_comissoes` - Configuração de comissões

**Tabelas Modificadas:**
- `faturas` - Adicionadas 7 colunas para integração

**Arquivos:**
- `001_integracao_postgres.sql` - Migration para PostgreSQL
- `001_integracao_mysql.sql` - Migration para MySQL
- `001_integracao_postgres_rollback.sql` - Rollback PostgreSQL
- `001_integracao_mysql_rollback.sql` - Rollback MySQL

---

## 🚀 Como Executar

### **PostgreSQL**

#### **Aplicar Migration:**

```bash
# Via psql
psql -U postgres -d dentcarepro -f migrations/001_integracao_postgres.sql

# Via Docker
docker exec -i postgres_container psql -U postgres -d dentcarepro < migrations/001_integracao_postgres.sql

# Via Railway CLI
railway run psql < migrations/001_integracao_postgres.sql
```

#### **Reverter Migration:**

```bash
psql -U postgres -d dentcarepro -f migrations/001_integracao_postgres_rollback.sql
```

---

### **MySQL**

#### **Aplicar Migration:**

```bash
# Via mysql
mysql -u root -p dentcarepro < migrations/001_integracao_mysql.sql

# Via Docker
docker exec -i mysql_container mysql -u root -p dentcarepro < migrations/001_integracao_mysql.sql

# Via Railway CLI
railway run mysql < migrations/001_integracao_mysql.sql
```

#### **Reverter Migration:**

```bash
mysql -u root -p dentcarepro < migrations/001_integracao_mysql_rollback.sql
```

---

## 📊 Estrutura das Tabelas

### **1. procedimentos_clinicos**

Armazena todos os procedimentos clínicos realizados.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | VARCHAR(64) | Chave primária |
| utente_id | VARCHAR(64) | FK para utentes |
| dentista_id | VARCHAR(64) | FK para dentistas |
| consulta_id | VARCHAR(64) | FK para consultas (opcional) |
| tipo | ENUM | Tipo de procedimento |
| dados | TEXT (JSON) | Dados específicos do procedimento |
| descricao | TEXT | Descrição do procedimento |
| observacoes | TEXT | Observações adicionais |
| valor_procedimento | DECIMAL(10,2) | Valor do procedimento |
| fatura_id | VARCHAR(64) | FK para faturas (opcional) |
| faturado | INTEGER/TINYINT | 0 = não, 1 = sim |
| data | DATE | Data do procedimento |
| criado_por | VARCHAR(64) | Quem criou o registro |
| criado_em | TIMESTAMP | Data de criação |
| atualizado_em | TIMESTAMP | Data de atualização |

**Índices:**
- `idx_proc_utente` - utente_id
- `idx_proc_dentista` - dentista_id
- `idx_proc_data` - data
- `idx_proc_tipo` - tipo
- `idx_proc_fatura` - fatura_id

---

### **2. historico_utente**

Timeline unificada de todos os eventos do utente.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | VARCHAR(64) | Chave primária |
| utente_id | VARCHAR(64) | FK para utentes |
| tipo | ENUM | Tipo de evento |
| titulo | VARCHAR(255) | Título do evento |
| descricao | TEXT | Descrição detalhada |
| data | DATE | Data do evento |
| consulta_id | VARCHAR(64) | FK para consultas (opcional) |
| procedimento_id | VARCHAR(64) | FK para procedimentos (opcional) |
| fatura_id | VARCHAR(64) | FK para faturas (opcional) |
| pagamento_id | VARCHAR(64) | FK para pagamentos (opcional) |
| valor | DECIMAL(10,2) | Valor relacionado (opcional) |
| dentista_id | VARCHAR(64) | FK para dentistas (opcional) |
| dentista_nome | VARCHAR(255) | Nome do dentista |
| icone | VARCHAR(50) | Ícone para UI |
| cor | VARCHAR(50) | Cor para UI |
| criado_em | TIMESTAMP | Data de criação |

**Tipos de Evento:**
- `consulta` - Consultas agendadas/realizadas
- `procedimento` - Procedimentos clínicos
- `fatura` - Faturas emitidas
- `pagamento` - Pagamentos recebidos
- `observacao` - Observações clínicas
- `documento` - Documentos anexados
- `comunicacao` - Ligações, emails, mensagens

**Índices:**
- `idx_hist_utente` - utente_id
- `idx_hist_data` - data
- `idx_hist_tipo` - tipo
- `idx_hist_criado` - criado_em

---

### **3. tabela_precos**

Tabela de preços configurável para procedimentos.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | VARCHAR(64) | Chave primária |
| codigo | VARCHAR(50) | Código único do procedimento |
| descricao | VARCHAR(255) | Descrição do procedimento |
| categoria | ENUM | Categoria do procedimento |
| valor | DECIMAL(10,2) | Valor base |
| iva | DECIMAL(5,2) | Taxa de IVA (%) |
| ativo | INTEGER/TINYINT | 0 = inativo, 1 = ativo |
| criado_em | TIMESTAMP | Data de criação |
| atualizado_em | TIMESTAMP | Data de atualização |

**Categorias:**
- `consulta`, `tratamento`, `cirurgia`, `protese`, `ortodontia`, `implante`, `estetica`, `urgencia`, `material`, `laboratorio`, `outro`

**Índices:**
- `idx_preco_codigo` - codigo (UNIQUE)
- `idx_preco_categoria` - categoria
- `idx_preco_ativo` - ativo

**Dados Iniciais:**
- 8 procedimentos padrão já inseridos

---

### **4. dentistas**

Cadastro de dentistas da clínica.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | VARCHAR(64) | Chave primária |
| nome | VARCHAR(255) | Nome completo |
| email | VARCHAR(255) | Email |
| telefone | VARCHAR(20) | Telefone |
| nif | VARCHAR(9) | NIF |
| numero_ordem | VARCHAR(20) | Número da Ordem dos Médicos Dentistas |
| especialidade | VARCHAR(100) | Especialidade |
| ativo | INTEGER/TINYINT | 0 = inativo, 1 = ativo |
| criado_em | TIMESTAMP | Data de criação |
| atualizado_em | TIMESTAMP | Data de atualização |

**Índices:**
- `idx_dent_nome` - nome
- `idx_dent_email` - email
- `idx_dent_ativo` - ativo

---

### **5. comissoes**

Comissões dos dentistas.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | VARCHAR(64) | Chave primária |
| dentista_id | VARCHAR(64) | FK para dentistas |
| fatura_id | VARCHAR(64) | FK para faturas |
| procedimento_id | VARCHAR(64) | FK para procedimentos (opcional) |
| valor | DECIMAL(10,2) | Valor da comissão |
| percentagem | DECIMAL(5,2) | Percentagem aplicada |
| mes | VARCHAR(7) | Mês (YYYY-MM) |
| status | ENUM | Status da comissão |
| data_pagamento | DATE | Data do pagamento |
| forma_pagamento | VARCHAR(50) | Forma de pagamento |
| referencia | VARCHAR(100) | Referência do pagamento |
| observacoes | TEXT | Observações |
| criado_em | TIMESTAMP | Data de criação |
| atualizado_em | TIMESTAMP | Data de atualização |

**Status:**
- `pendente` - Aguardando pagamento
- `pago` - Pago
- `cancelado` - Cancelado

**Índices:**
- `idx_com_dentista` - dentista_id
- `idx_com_fatura` - fatura_id
- `idx_com_mes` - mes
- `idx_com_status` - status

---

### **6. config_comissoes**

Configuração de comissões por dentista.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | VARCHAR(64) | Chave primária |
| dentista_id | VARCHAR(64) | FK para dentistas (UNIQUE) |
| tipo | ENUM | Tipo de comissão |
| percentagem | DECIMAL(5,2) | Percentagem (se aplicável) |
| valor_fixo | DECIMAL(10,2) | Valor fixo (se aplicável) |
| valor_minimo | DECIMAL(10,2) | Valor mínimo (piso) |
| valor_maximo | DECIMAL(10,2) | Valor máximo (teto) |
| observacoes | TEXT | Observações |
| criado_em | TIMESTAMP | Data de criação |
| atualizado_em | TIMESTAMP | Data de atualização |

**Tipos:**
- `percentagem` - X% do valor da fatura
- `fixo` - Valor fixo por procedimento
- `misto` - Percentagem + Valor fixo

**Índices:**
- `idx_config_dentista` - dentista_id (UNIQUE)

---

### **7. faturas (modificada)**

Colunas adicionadas à tabela existente:

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| dentista_id | VARCHAR(64) | FK para dentistas |
| dentista_nome | VARCHAR(255) | Nome do dentista |
| dentista_percentagem | DECIMAL(5,2) | Percentagem de comissão |
| dentista_comissao | DECIMAL(10,2) | Valor da comissão |
| comissao_id | VARCHAR(64) | FK para comissões |
| valor_clinica | DECIMAL(10,2) | Valor da clínica (total - comissão) |
| consulta_id | VARCHAR(64) | FK para consultas |

**Índices Adicionados:**
- `idx_fat_dentista` - dentista_id
- `idx_fat_consulta` - consulta_id

---

## ⚠️ Avisos Importantes

### **Antes de Executar:**

1. ✅ **Fazer backup do banco de dados**
2. ✅ **Testar em ambiente de staging primeiro**
3. ✅ **Verificar se a tabela `faturas` existe**
4. ✅ **Verificar se a tabela `utentes` existe**
5. ✅ **Verificar permissões do usuário do banco**

### **Dependências:**

Esta migration assume que as seguintes tabelas já existem:
- `utentes`
- `faturas`
- `consultas` (opcional)

### **Compatibilidade:**

- ✅ PostgreSQL 12+
- ✅ PostgreSQL 13+
- ✅ PostgreSQL 14+
- ✅ PostgreSQL 15+
- ✅ MySQL 5.7+
- ✅ MySQL 8.0+
- ✅ MariaDB 10.3+

---

## 🔧 Troubleshooting

### **Erro: Tabela já existe**

Se você receber erro de "tabela já existe", a migration pode ser executada novamente com segurança pois usa `CREATE TABLE IF NOT EXISTS`.

### **Erro: Foreign Key constraint fails**

Certifique-se de que as tabelas `utentes` e `faturas` existem antes de executar a migration.

### **Erro: Permission denied**

Verifique se o usuário do banco de dados tem permissões para:
- CREATE TABLE
- ALTER TABLE
- CREATE INDEX
- CREATE TRIGGER (PostgreSQL)

---

## 📝 Changelog

### **v1.0.0 - 2025-10-28**

**Adicionado:**
- Tabela `procedimentos_clinicos`
- Tabela `historico_utente`
- Tabela `tabela_precos`
- Tabela `dentistas`
- Tabela `comissoes`
- Tabela `config_comissoes`
- 7 colunas na tabela `faturas`
- Triggers de atualização automática (PostgreSQL)
- 8 preços padrão na `tabela_precos`
- Índices otimizados em todas as tabelas
- Scripts de rollback completos

---

## 📚 Referências

- [Documentação PostgreSQL](https://www.postgresql.org/docs/)
- [Documentação MySQL](https://dev.mysql.com/doc/)
- [ARQUITETURA_INTEGRACAO.md](../ARQUITETURA_INTEGRACAO.md)
- [INTEGRACAO_COMPLETA.md](../INTEGRACAO_COMPLETA.md)

---

**Desenvolvido com ❤️ por Manus AI**  
**Data:** 28 de Outubro de 2025
