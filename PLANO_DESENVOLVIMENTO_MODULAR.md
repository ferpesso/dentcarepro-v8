# 📋 Plano de Desenvolvimento Modular - DentCare PRO v8.0

**Data:** 21 de Outubro de 2025  
**Arquitetura:** Híbrida Cloud + Local (como SimpleDental)  
**Metodologia:** Desenvolvimento modular incremental com testes rigorosos

---

## 🎯 Objetivo

Desenvolver o sistema DentCare PRO de forma modular, garantindo:
- ✅ **Arquitetura híbrida:** Dados na cloud + cache local no computador do cliente
- ✅ **Compatibilidade total:** Sem conflitos entre módulos
- ✅ **Testes rigorosos:** Cada módulo testado antes de avançar
- ✅ **Desenvolvimento incremental:** Um módulo de cada vez

---

## 🏗️ Arquitetura Híbrida (Cloud + Local)

### Camada Cloud (Railway + PostgreSQL)
```
┌─────────────────────────────────────────┐
│         CLOUD (Railway)                 │
│  ┌───────────────────────────────────┐  │
│  │ PostgreSQL Database (Principal)   │  │
│  │ - Dados de todos os clientes      │  │
│  │ - Backup automático               │  │
│  │ - Sincronização em tempo real     │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │ Backend API (Node.js + tRPC)      │  │
│  │ - Endpoints REST/tRPC             │  │
│  │ - Autenticação e autorização      │  │
│  │ - Lógica de negócio               │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
                    ↕
            HTTPS + WebSocket
                    ↕
┌─────────────────────────────────────────┐
│      CLIENTE (Computador Local)         │
│  ┌───────────────────────────────────┐  │
│  │ Frontend Web (React + Vite)       │  │
│  │ - Interface do utilizador         │  │
│  │ - Hosted na Vercel (CDN global)   │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │ Cache Local (IndexedDB/SQLite)    │  │
│  │ - Dados frequentes em cache       │  │
│  │ - Funciona offline                │  │
│  │ - Sincronização automática        │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### Estratégia de Sincronização
- **Online:** Dados lidos/escritos diretamente na cloud
- **Offline:** Dados lidos do cache local, escritas em fila
- **Sincronização:** Automática quando conexão restaurada
- **Conflitos:** Resolução automática com timestamp (último ganha)

---

## 📦 Módulos do Sistema

### FASE 0: Infraestrutura Base ✅
**Status:** Em correção  
**Prioridade:** CRÍTICA

#### Tarefas:
1. ✅ Clonar repositório
2. ✅ Analisar documentação
3. 🔴 Corrigir erro de integração tRPC
4. 🔴 Testar comunicação frontend ↔ backend
5. 🔴 Validar deployment Vercel + Railway
6. 🔴 Configurar ambiente de desenvolvimento local

**Critérios de Sucesso:**
- Frontend carrega sem erros
- Backend responde corretamente
- Dados de teste carregam na interface
- Deploy automático funciona

---

### FASE 1: Módulo de Autenticação 🔐
**Status:** Pendente  
**Prioridade:** ALTA

#### Funcionalidades:
- Login/Logout
- Gestão de sessões
- Recuperação de password
- Autenticação de 2 fatores (opcional)
- Gestão de permissões por utilizador

#### Tecnologias:
- JWT (jose) para tokens
- bcrypt para passwords
- Cookie seguro para sessão
- Rate limiting para segurança

#### Testes:
- Login com credenciais válidas/inválidas
- Logout e expiração de sessão
- Recuperação de password
- Permissões de acesso

---

### FASE 2: Módulo de Utentes (Pacientes) 👥
**Status:** Parcialmente implementado (40%)  
**Prioridade:** ALTA

#### Funcionalidades:
- ✅ Listagem de utentes
- ✅ Visualização de detalhes
- 🔴 Criação de novo utente
- 🔴 Edição de dados
- 🔴 Upload de documentos
- 🔴 Histórico clínico
- 🔴 Anamnese completa
- 🔴 Consentimentos informados

#### Campos do Utente:
```typescript
interface Utente {
  id: number;
  nome: string;
  dataNascimento: Date;
  nif: string;
  email: string;
  telefone: string;
  morada: string;
  codigoPostal: string;
  cidade: string;
  
  // Dados clínicos
  numeroUtente: string;
  medicoFamilia?: string;
  alergias?: string[];
  medicacaoAtual?: string[];
  condicoesPreexistentes?: string[];
  
  // Metadados
  criadoEm: Date;
  atualizadoEm: Date;
  ativo: boolean;
}
```

#### Testes:
- CRUD completo
- Validação de campos obrigatórios
- Upload de documentos
- Busca e filtros

---

### FASE 3: Módulo de Agenda 📅
**Status:** Parcialmente implementado (30%)  
**Prioridade:** ALTA

#### Funcionalidades:
- 🔴 Visualização de agenda (dia/semana/mês)
- 🔴 Criação de consultas
- 🔴 Edição/cancelamento de consultas
- 🔴 Notificações automáticas (SMS/Email)
- 🔴 Gestão de salas/cadeiras
- 🔴 Lista de espera
- 🔴 Confirmação de presença

#### Campos da Consulta:
```typescript
interface Consulta {
  id: number;
  utenteId: number;
  medicoId: number;
  dataHora: Date;
  duracao: number; // minutos
  tipo: 'consulta' | 'tratamento' | 'urgencia';
  estado: 'agendada' | 'confirmada' | 'realizada' | 'cancelada' | 'faltou';
  sala?: string;
  notas?: string;
  
  // Metadados
  criadoEm: Date;
  atualizadoEm: Date;
}
```

#### Testes:
- Criação de consultas
- Conflitos de horário
- Notificações
- Filtros por médico/utente/data

---

### FASE 4: Módulo de Tratamentos 🦷
**Status:** Não implementado  
**Prioridade:** MÉDIA

#### Funcionalidades:
- Odontograma interativo
- Plano de tratamento
- Orçamentos
- Histórico de tratamentos
- Imagens e radiografias
- Notas clínicas por dente

#### Componentes:
- Odontograma visual (React Konva)
- Editor de plano de tratamento
- Galeria de imagens
- Geração de orçamentos PDF

#### Testes:
- Odontograma interativo
- Criação de planos de tratamento
- Upload de radiografias
- Geração de PDF

---

### FASE 5: Módulo Financeiro 💰
**Status:** Não implementado  
**Prioridade:** MÉDIA

#### Funcionalidades:
- Faturação
- Recibos
- Pagamentos (dinheiro, MB, cartão)
- Prestações
- Relatórios financeiros
- Integração com contabilidade

#### Campos:
```typescript
interface Fatura {
  id: number;
  utenteId: number;
  numero: string;
  data: Date;
  itens: ItemFatura[];
  subtotal: number;
  iva: number;
  total: number;
  estado: 'pendente' | 'paga' | 'cancelada';
  metodoPagamento?: string;
  
  // Metadados
  criadoEm: Date;
  atualizadoEm: Date;
}
```

#### Testes:
- Criação de faturas
- Cálculo de IVA
- Pagamentos parciais
- Relatórios financeiros

---

### FASE 6: Módulo de Relatórios 📊
**Status:** Não implementado  
**Prioridade:** BAIXA

#### Funcionalidades:
- Dashboard executivo
- Relatórios de produtividade
- Estatísticas de utentes
- Análise financeira
- Exportação Excel/PDF

#### Gráficos:
- Consultas por período
- Receita por mês
- Tratamentos mais comuns
- Taxa de ocupação

#### Testes:
- Geração de relatórios
- Exportação de dados
- Filtros e períodos

---

### FASE 7: Módulo de Configurações ⚙️
**Status:** Não implementado  
**Prioridade:** BAIXA

#### Funcionalidades:
- Gestão de utilizadores
- Configurações da clínica
- Tabelas de preços
- Templates de documentos
- Backup e restauro
- Logs de auditoria

#### Testes:
- Gestão de utilizadores
- Alteração de configurações
- Backup/restauro

---

## 🔄 Metodologia de Desenvolvimento

### Para Cada Módulo:

#### 1. Planeamento (1 dia)
- Definir funcionalidades
- Desenhar interface
- Definir API endpoints
- Criar schema de base de dados

#### 2. Desenvolvimento Backend (2-3 dias)
- Criar routers tRPC
- Implementar lógica de negócio
- Criar migrations de BD
- Testes unitários

#### 3. Desenvolvimento Frontend (2-3 dias)
- Criar componentes React
- Integrar com API
- Estilização TailwindCSS
- Testes de interface

#### 4. Integração (1 dia)
- Conectar frontend ↔ backend
- Implementar cache local
- Sincronização de dados
- Testes de integração

#### 5. Testes e Validação (1 dia)
- Testes manuais completos
- Testes automatizados
- Correção de bugs
- Validação com utilizador

#### 6. Deploy (0.5 dia)
- Deploy para produção
- Testes em produção
- Monitorização
- Documentação

**Total por módulo:** 7-10 dias

---

## 🧪 Estratégia de Testes

### Testes Unitários
```typescript
// Exemplo: Teste de criação de utente
describe('Utentes', () => {
  it('deve criar um novo utente', async () => {
    const utente = await criarUtente({
      nome: 'João Silva',
      email: 'joao@example.com',
      telefone: '912345678'
    });
    
    expect(utente.id).toBeDefined();
    expect(utente.nome).toBe('João Silva');
  });
});
```

### Testes de Integração
```typescript
// Exemplo: Teste de fluxo completo
describe('Fluxo de Consulta', () => {
  it('deve criar consulta para utente existente', async () => {
    const utente = await criarUtente({...});
    const consulta = await agendarConsulta({
      utenteId: utente.id,
      dataHora: new Date(),
      tipo: 'consulta'
    });
    
    expect(consulta.utenteId).toBe(utente.id);
  });
});
```

### Testes E2E
```typescript
// Exemplo: Teste de interface
describe('Interface de Utentes', () => {
  it('deve listar utentes na página', async () => {
    await page.goto('/utentes');
    const utentes = await page.$$('.utente-card');
    expect(utentes.length).toBeGreaterThan(0);
  });
});
```

---

## 📊 Cronograma Estimado

| Fase | Módulo | Duração | Início | Fim |
|------|--------|---------|--------|-----|
| 0 | Infraestrutura Base | 2 dias | Hoje | +2 dias |
| 1 | Autenticação | 7 dias | +2 | +9 |
| 2 | Utentes | 10 dias | +9 | +19 |
| 3 | Agenda | 10 dias | +19 | +29 |
| 4 | Tratamentos | 14 dias | +29 | +43 |
| 5 | Financeiro | 10 dias | +43 | +53 |
| 6 | Relatórios | 7 dias | +53 | +60 |
| 7 | Configurações | 7 dias | +60 | +67 |

**Total estimado:** ~67 dias úteis (~3 meses)

---

## 🚀 Próximos Passos Imediatos

### Hoje (FASE 0):
1. ✅ Clonar repositório
2. ✅ Analisar documentação
3. 🔴 Instalar dependências
4. 🔴 Corrigir erro tRPC
5. 🔴 Testar localmente
6. 🔴 Validar deploy

### Amanhã:
- Continuar FASE 0 se necessário
- Ou iniciar FASE 1 (Autenticação)

---

## 📝 Notas Importantes

### Compatibilidade
- Todos os módulos usam a mesma stack (React + tRPC + PostgreSQL)
- Sem conflitos de dependências
- Versionamento semântico rigoroso

### Testes
- Cada módulo tem suite de testes completa
- CI/CD com testes automáticos
- Code coverage mínimo de 80%

### Documentação
- Cada módulo tem documentação própria
- API documentada com exemplos
- Guias de utilizador por módulo

### Performance
- Cache local para dados frequentes
- Lazy loading de módulos
- Otimização de queries
- CDN para assets estáticos

---

**Criado por:** Assistente Manus  
**Data:** 21 de Outubro de 2025  
**Versão:** 1.0

