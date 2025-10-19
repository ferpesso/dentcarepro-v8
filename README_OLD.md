# 🦷 DentCare Pro - Sistema de Gestão Odontológica

**Versão:** 1.0 - Sistema Híbrido  
**Data:** 17 de Outubro de 2025  
**Tecnologias:** React 19 + TypeScript + Express + tRPC + MySQL

---

## 📖 Sobre o Projeto

DentCare Pro é um sistema completo de gestão para clínicas odontológicas, desenvolvido com tecnologias modernas e arquitetura type-safe.

### ✨ Funcionalidades Principais

- ✅ **Dashboard Intuitivo** - Visão geral do sistema
- ✅ **Gestão de Utentes** - Cadastro completo de pacientes
- ✅ **Agenda de Consultas** - Calendário interativo
- ✅ **Faturação** - Gestão financeira completa
- ✅ **Gestão de Dentistas** - Cadastro de profissionais
- ✅ **Sistema de Comissões** - Cálculo automático
- ✅ **Configurações** - Personalização da clínica

---

## 🚀 Início Rápido

### Pré-requisitos

- Node.js 22+ ([Download](https://nodejs.org/))
- pnpm (`npm install -g pnpm`)
- MySQL 8.0+ ([Download](https://dev.mysql.com/downloads/))

### Instalação

```bash
# 1. Instalar dependências
pnpm install

# 2. Configurar variáveis de ambiente
# Ver arquivo VARIAVEIS_AMBIENTE.md

# 3. Criar tabelas na base de dados
pnpm db:push

# 4. Iniciar servidor
pnpm dev
```

Aceder: http://localhost:3000

---

## 📚 Documentação Completa

### Guias de Instalação e Configuração

| Documento | Descrição |
|-----------|-----------|
| [INSTALACAO_COMPLETA.md](./INSTALACAO_COMPLETA.md) | Guia passo-a-passo completo |
| [VARIAVEIS_AMBIENTE.md](./VARIAVEIS_AMBIENTE.md) | Configuração de variáveis |
| [DEPENDENCIAS.md](./DEPENDENCIAS.md) | Lista completa de dependências |
| [CORRECOES_ERROS.md](./CORRECOES_ERROS.md) | Erros conhecidos e soluções |

### Scripts SQL

| Arquivo | Descrição |
|---------|-----------|
| [database_init.sql](./database_init.sql) | Script de inicialização da BD |

---

## 🛠️ Comandos Disponíveis

```bash
# Desenvolvimento
pnpm dev              # Iniciar servidor de desenvolvimento
pnpm build            # Compilar para produção
pnpm start            # Iniciar servidor de produção

# Base de Dados
pnpm db:push          # Criar/atualizar tabelas
pnpm db:studio        # Abrir Drizzle Studio (GUI)

# Testes e Qualidade
pnpm typecheck        # Verificar tipos TypeScript
pnpm lint             # Verificar código
```

---

## 📁 Estrutura do Projeto

```
dentcare-pro-hybrid/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── pages/         # Páginas
│   │   ├── components/    # Componentes
│   │   └── lib/           # Bibliotecas
│   └── public/            # Arquivos estáticos
│
├── server/                # Backend Express + tRPC
│   ├── _core/            # Infraestrutura
│   ├── routers/          # APIs tRPC
│   └── db.ts             # Acesso a dados
│
├── drizzle/              # Schema da BD
│   └── schema.ts
│
└── shared/               # Código partilhado
```

---

## 🔐 Segurança

- ✅ Autenticação JWT
- ✅ Cookies seguros (HttpOnly)
- ✅ Validação de dados (Zod)
- ✅ Proteção CORS
- ✅ Sanitização de inputs

**⚠️ IMPORTANTE:**
- Nunca compartilhar arquivo `.env`
- Usar senhas fortes
- Manter dependências atualizadas

---

## 🐛 Problemas Conhecidos

Ver [CORRECOES_ERROS.md](./CORRECOES_ERROS.md) para lista completa de erros conhecidos e soluções.

### Erros Já Corrigidos

- ✅ Query retorna undefined
- ✅ Controlled/Uncontrolled input warning
- ✅ Conexão com base de dados
- ✅ Tipos TypeScript incompatíveis

---

## 📊 Tecnologias Utilizadas

### Frontend
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui
- tRPC Client
- React Query

### Backend
- Node.js
- Express 4
- tRPC 11
- Drizzle ORM
- MySQL 8

### Ferramentas
- Vite (Build tool)
- pnpm (Package manager)
- Drizzle Kit (Migrations)

---

## 🔄 Atualizações e Versões

### Versão 1.0 (17/10/2025)

**Implementado:**
- ✅ Sistema base completo
- ✅ Gestão de utentes
- ✅ Agenda de consultas
- ✅ Faturação
- ✅ Gestão de dentistas
- ✅ Sistema de comissões
- ✅ Configurações da clínica

**Bugs Corrigidos:**
- ✅ Query undefined
- ✅ Controlled input warning

---

## 📞 Suporte

### Documentação

- [Guia de Instalação](./INSTALACAO_COMPLETA.md)
- [Correção de Erros](./CORRECOES_ERROS.md)
- [Variáveis de Ambiente](./VARIAVEIS_AMBIENTE.md)

### Links Úteis

- React: https://react.dev/
- tRPC: https://trpc.io/
- Drizzle ORM: https://orm.drizzle.team/
- Tailwind CSS: https://tailwindcss.com/

### Contacto

- Suporte Manus: https://help.manus.im

---

## 📝 Licença

Propriedade privada. Todos os direitos reservados.

---

## 👥 Créditos

Desenvolvido por **Manus AI** para gestão odontológica profissional.

---

**Última atualização:** 17 de Outubro de 2025
