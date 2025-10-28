# 🏗️ Arquitetura de Integração - DentCare PRO v8

**Data:** 28 de Outubro de 2025  
**Objetivo:** Sistema completo de integração entre módulos clínicos, financeiros e administrativos

---

## 📋 Visão Geral

O sistema DentCare PRO v8 possui diversos módulos que precisam estar integrados para proporcionar uma experiência completa e automatizada. A integração garante que informações fluam automaticamente entre os módulos, eliminando trabalho manual e reduzindo erros.

---

## 🔄 Fluxo de Integração Principal

### **Fluxo Completo de um Procedimento:**

```
1. AGENDA
   ↓ Consulta agendada
   
2. ATENDIMENTO
   ↓ Procedimento realizado (Odontograma, Endodontia, Implante, etc)
   
3. FATURAÇÃO AUTOMÁTICA
   ↓ Fatura gerada automaticamente
   ↓ Itens baseados nos procedimentos
   
4. PAGAMENTO
   ↓ Utente paga (total ou parcial)
   
5. COMISSÃO DENTISTA
   ↓ Comissão calculada automaticamente
   ↓ Baseada na configuração do dentista
   
6. HISTÓRICO UNIFICADO
   ↓ Tudo registado na timeline do utente
   ↓ Procedimento + Fatura + Pagamento
   
7. RELATÓRIOS
   ↓ Dentista: Comissões a receber
   ↓ Clínica: Faturação e lucro
   ↓ Utente: Histórico completo
```

---

## 🗄️ Estrutura de Dados Integrada

### **1. Procedimento Clínico**

```typescript
interface ProcedimentoClinico {
  id: string;
  utenteId: string;
  dentistaId: string;
  consultaId?: string; // Ligação com agenda
  
  // Tipo de procedimento
  tipo: "odontograma" | "periodontograma" | "endodontia" | "implante" | "ortodontia" | "outro";
  
  // Dados específicos do procedimento
  dados: {
    // Para Odontograma
    dente?: string;
    faces?: string[];
    status?: string;
    
    // Para Endodontia
    canais?: number;
    sessoes?: number;
    
    // Para Implante
    posicao?: string;
    marca?: string;
    modelo?: string;
    
    // Para Ortodontia
    fase?: string;
    
    // Comum
    descricao: string;
    observacoes?: string;
  };
  
  // Faturação
  valorProcedimento: number;
  faturaId?: string; // Ligação com fatura
  faturado: boolean;
  
  // Auditoria
  data: string;
  criadoPor: string;
  criadoEm: string;
}
```

### **2. Fatura Integrada**

```typescript
interface FaturaIntegrada extends Fatura {
  // Ligações
  procedimentos: ProcedimentoClinico[]; // Procedimentos que geraram a fatura
  consultaId?: string; // Consulta relacionada
  
  // Comissão
  dentistaId: string;
  dentistaPercentagem: number;
  dentistaComissao: number;
  comissaoId?: string; // Ligação com comissão criada
  
  // Clínica
  valorClinica: number; // Total - Comissão
}
```

### **3. Histórico Unificado do Utente**

```typescript
interface EventoHistorico {
  id: string;
  utenteId: string;
  tipo: "consulta" | "procedimento" | "fatura" | "pagamento" | "observacao";
  
  // Dados do evento
  titulo: string;
  descricao: string;
  data: string;
  
  // Ligações
  consultaId?: string;
  procedimentoId?: string;
  faturaId?: string;
  pagamentoId?: string;
  
  // Financeiro
  valor?: number;
  
  // Responsável
  dentistaId?: string;
  dentistaNome?: string;
  
  // Metadados
  icone: string; // Para UI
  cor: string; // Para UI
  
  criadoEm: string;
}
```

### **4. Relatório de Dentista**

```typescript
interface RelatorioDentista {
  dentistaId: string;
  dentistaNome: string;
  periodo: {
    inicio: string;
    fim: string;
  };
  
  // Procedimentos
  procedimentos: {
    total: number;
    porTipo: Record<string, number>;
    lista: ProcedimentoClinico[];
  };
  
  // Financeiro
  faturacao: {
    totalFaturado: number;
    totalRecebido: number;
    totalPendente: number;
  };
  
  // Comissões
  comissoes: {
    totalComissoes: number;
    totalPago: number;
    totalPendente: number;
    lista: Comissao[];
  };
  
  // Estatísticas
  estatisticas: {
    mediaComissaoPorProcedimento: number;
    procedimentoMaisRealizado: string;
    ticketMedio: number;
  };
}
```

### **5. Relatório da Clínica**

```typescript
interface RelatorioClinica {
  periodo: {
    inicio: string;
    fim: string;
  };
  
  // Faturação
  faturacao: {
    totalFaturado: number;
    totalRecebido: number;
    totalPendente: number;
    totalVencido: number;
  };
  
  // Custos
  custos: {
    comissoesDentistas: number;
    contasPagar: number;
    laboratorios: number;
    estoque: number;
    outros: number;
    total: number;
  };
  
  // Lucro
  lucro: {
    bruto: number; // Faturado - Custos
    liquido: number; // Recebido - Custos
    margem: number; // %
  };
  
  // Por Dentista
  porDentista: Array<{
    dentistaId: string;
    nome: string;
    faturacao: number;
    comissoes: number;
    procedimentos: number;
  }>;
  
  // Por Tipo de Procedimento
  porProcedimento: Array<{
    tipo: string;
    quantidade: number;
    faturacao: number;
  }>;
}
```

---

## 🔌 Integrações a Implementar

### **1. Procedimento → Faturação Automática**

**Quando:** Um procedimento clínico é marcado como "concluído"  
**O que fazer:**
1. Verificar se já existe fatura para esta consulta
2. Se não existir, criar nova fatura
3. Adicionar item na fatura com:
   - Descrição do procedimento
   - Valor do procedimento
   - Categoria apropriada
4. Calcular totais da fatura
5. Marcar procedimento como "faturado"
6. Registar no histórico do utente

**Implementação:**
- Criar função `gerarFaturaAutomatica(procedimento)`
- Chamar ao salvar procedimento clínico
- Usar tabela de preços configurável

---

### **2. Pagamento → Comissão Dentista**

**Quando:** Um pagamento é registado numa fatura  
**O que fazer:**
1. Obter configuração de comissão do dentista
2. Calcular valor da comissão baseado em:
   - Tipo: percentagem, fixo ou misto
   - Percentagem configurada
   - Valor fixo configurado
   - Limites mínimo/máximo
3. Criar registo de comissão
4. Atualizar totais do dentista
5. Registar no histórico

**Implementação:**
- Já existe função `calcularECriarComissao()` no router financeiro
- Melhorar para suportar pagamentos parciais
- Adicionar validações

---

### **3. Histórico Unificado do Utente**

**Quando:** Qualquer evento importante acontece  
**O que fazer:**
1. Criar evento no histórico unificado
2. Incluir todas as ligações relevantes
3. Definir ícone e cor apropriados
4. Ordenar cronologicamente

**Eventos a registar:**
- Consulta agendada
- Consulta realizada
- Procedimento clínico realizado
- Fatura emitida
- Pagamento recebido
- Observação adicionada
- Documento anexado

**Implementação:**
- Criar tabela `historico_utente`
- Criar função `registarEvento()`
- Criar componente `TimelineUtente`

---

### **4. Relatórios Integrados**

**Relatório do Dentista:**
- Procedimentos realizados no período
- Faturação gerada
- Comissões a receber
- Comissões já pagas
- Estatísticas de desempenho

**Relatório da Clínica:**
- Faturação total
- Custos totais (comissões, laboratórios, etc)
- Lucro bruto e líquido
- Análise por dentista
- Análise por tipo de procedimento
- Tendências e gráficos

**Implementação:**
- Criar queries SQL otimizadas
- Criar componentes de visualização
- Adicionar exportação PDF/Excel

---

## 📊 Tabelas de Banco de Dados Necessárias

### **Novas Tabelas:**

```sql
-- Procedimentos Clínicos
CREATE TABLE procedimentos_clinicos (
  id TEXT PRIMARY KEY,
  utenteId TEXT NOT NULL,
  dentistaId TEXT NOT NULL,
  consultaId TEXT,
  tipo TEXT NOT NULL,
  dados TEXT NOT NULL, -- JSON
  valorProcedimento REAL NOT NULL,
  faturaId TEXT,
  faturado INTEGER DEFAULT 0,
  data TEXT NOT NULL,
  criadoPor TEXT NOT NULL,
  criadoEm TEXT NOT NULL,
  FOREIGN KEY (utenteId) REFERENCES utentes(id),
  FOREIGN KEY (dentistaId) REFERENCES dentistas(id),
  FOREIGN KEY (faturaId) REFERENCES faturas(id)
);

-- Histórico Unificado
CREATE TABLE historico_utente (
  id TEXT PRIMARY KEY,
  utenteId TEXT NOT NULL,
  tipo TEXT NOT NULL,
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  data TEXT NOT NULL,
  consultaId TEXT,
  procedimentoId TEXT,
  faturaId TEXT,
  pagamentoId TEXT,
  valor REAL,
  dentistaId TEXT,
  dentistaNome TEXT,
  icone TEXT NOT NULL,
  cor TEXT NOT NULL,
  criadoEm TEXT NOT NULL,
  FOREIGN KEY (utenteId) REFERENCES utentes(id)
);

-- Tabela de Preços (para faturação automática)
CREATE TABLE tabela_precos (
  id TEXT PRIMARY KEY,
  codigo TEXT UNIQUE NOT NULL,
  descricao TEXT NOT NULL,
  categoria TEXT NOT NULL,
  valor REAL NOT NULL,
  iva REAL DEFAULT 23,
  ativo INTEGER DEFAULT 1,
  criadoEm TEXT NOT NULL,
  atualizadoEm TEXT NOT NULL
);
```

### **Tabelas Existentes a Modificar:**

```sql
-- Adicionar campos em faturas
ALTER TABLE faturas ADD COLUMN dentistaId TEXT;
ALTER TABLE faturas ADD COLUMN dentistaPercentagem REAL DEFAULT 0;
ALTER TABLE faturas ADD COLUMN dentistaComissao REAL DEFAULT 0;
ALTER TABLE faturas ADD COLUMN comissaoId TEXT;
ALTER TABLE faturas ADD COLUMN valorClinica REAL DEFAULT 0;
ALTER TABLE faturas ADD COLUMN consultaId TEXT;

-- Adicionar campos em comissoes
ALTER TABLE comissoes ADD COLUMN procedimentoId TEXT;
```

---

## 🎯 Prioridades de Implementação

### **Fase 1: Integração Básica (2-3 dias)**
1. ✅ Criar tabelas de banco de dados
2. ✅ Implementar procedimentos clínicos
3. ✅ Integrar procedimento → faturação automática
4. ✅ Melhorar cálculo de comissões

### **Fase 2: Histórico Unificado (1-2 dias)**
1. ✅ Criar tabela de histórico
2. ✅ Implementar função de registro de eventos
3. ✅ Criar componente Timeline
4. ✅ Integrar com todos os módulos

### **Fase 3: Relatórios (2-3 dias)**
1. ✅ Implementar relatório do dentista
2. ✅ Implementar relatório da clínica
3. ✅ Criar visualizações e gráficos
4. ✅ Adicionar exportação

### **Fase 4: Testes e Ajustes (1 dia)**
1. ✅ Testar todos os fluxos
2. ✅ Corrigir bugs
3. ✅ Otimizar queries
4. ✅ Documentar

---

## 🔧 Melhorias Adicionais Sugeridas

### **1. Tabela de Preços Configurável**
- Permitir que a clínica configure preços de procedimentos
- Usar na faturação automática
- Histórico de alterações de preços

### **2. Alertas e Notificações**
- Fatura vencida
- Comissão pendente
- Procedimento sem faturação
- Pagamento recebido

### **3. Dashboard Integrado**
- Métricas em tempo real
- Gráficos de tendências
- Alertas importantes
- Resumo financeiro

### **4. Exportações**
- PDF de relatórios
- Excel de dados
- Backup de informações

### **5. Auditoria Completa**
- Log de todas as alterações
- Quem fez o quê e quando
- Rastreabilidade total

---

## 📝 Notas de Implementação

### **Considerações Importantes:**

1. **Transações:** Usar transações SQL para garantir consistência
2. **Validações:** Validar todos os dados antes de salvar
3. **Performance:** Criar índices apropriados nas tabelas
4. **Segurança:** Verificar permissões em todas as operações
5. **Logs:** Registar todas as operações importantes

### **Padrões a Seguir:**

1. **Nomenclatura:** Usar nomes claros e consistentes
2. **Tipos:** Usar TypeScript para type safety
3. **Erros:** Tratar todos os erros apropriadamente
4. **Documentação:** Documentar funções complexas
5. **Testes:** Criar testes para fluxos críticos

---

## ✅ Checklist de Implementação

### **Backend:**
- [ ] Criar schemas de banco de dados
- [ ] Implementar funções de procedimentos clínicos
- [ ] Implementar histórico unificado
- [ ] Melhorar cálculo de comissões
- [ ] Criar queries de relatórios
- [ ] Adicionar validações
- [ ] Criar testes

### **Frontend:**
- [ ] Criar componente Timeline
- [ ] Criar componente Relatório Dentista
- [ ] Criar componente Relatório Clínica
- [ ] Integrar com procedimentos clínicos
- [ ] Adicionar feedback visual
- [ ] Melhorar UX

### **Integração:**
- [ ] Testar fluxo completo
- [ ] Verificar cálculos
- [ ] Validar dados
- [ ] Corrigir bugs
- [ ] Otimizar performance

### **Documentação:**
- [ ] Documentar APIs
- [ ] Criar manual do utilizador
- [ ] Documentar fluxos
- [ ] Criar exemplos

---

## 🚀 Resultado Esperado

Ao final da implementação, o sistema terá:

✅ **Faturação automática** baseada em procedimentos clínicos  
✅ **Cálculo automático de comissões** para dentistas  
✅ **Histórico unificado** do utente com todos os eventos  
✅ **Relatórios completos** para dentistas e clínica  
✅ **Integração total** entre todos os módulos  
✅ **Rastreabilidade completa** de todas as operações  
✅ **Dashboard integrado** com métricas em tempo real  

---

**Próximo Passo:** Implementar Fase 1 - Integração Básica
