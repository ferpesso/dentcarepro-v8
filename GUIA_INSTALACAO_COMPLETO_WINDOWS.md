# 🦷 DentCarePRO v8.0 - Guia de Instalação Completo para Windows

## ⚠️ IMPORTANTE - LEIA ANTES DE COMEÇAR

Este guia foi criado especificamente para pessoas **SEM conhecimentos de programação**.
Siga TODOS os passos pela ordem indicada. Não salte nenhum passo.

---

## 📋 Índice

1. [Requisitos do Sistema](#requisitos)
2. [Instalação do Software Necessário](#instalacao-software)
3. [Instalação do PostgreSQL](#instalacao-postgresql)
4. [Extração e Configuração do DentCarePRO](#extracao-configuracao)
5. [Criação da Base de Dados](#criacao-base-dados)
6. [Instalação das Dependências](#instalacao-dependencias)
7. [Iniciar o Sistema](#iniciar-sistema)
8. [Resolução de Problemas](#resolucao-problemas)
9. [Manutenção e Backup](#manutencao-backup)

---

## 1. Requisitos do Sistema {#requisitos}

### Hardware Mínimo
- **Processador:** Intel Core i3 ou equivalente
- **RAM:** 4 GB (recomendado 8 GB)
- **Disco:** 10 GB de espaço livre
- **Internet:** Conexão estável para instalação

### Sistema Operativo
- Windows 10 ou superior (64-bit)

---

## 2. Instalação do Software Necessário {#instalacao-software}

### 2.1. Node.js (Obrigatório)

1. Aceda a: https://nodejs.org/
2. Descarregue a versão **LTS** (Long Term Support)
3. Execute o instalador
4. **IMPORTANTE:** Na janela de instalação, marque a opção:
   - ☑️ "Automatically install the necessary tools"
5. Clique em "Next" até finalizar
6. Reinicie o computador

**Verificar instalação:**
1. Abra o "Prompt de Comando" (tecla Windows + R, digite `cmd`, Enter)
2. Digite: `node --version`
3. Deve aparecer algo como: `v22.x.x`
4. Digite: `npm --version`
5. Deve aparecer algo como: `10.x.x`

### 2.2. PostgreSQL (Obrigatório)

1. Aceda a: https://www.postgresql.org/download/windows/
2. Clique em "Download the installer"
3. Descarregue a versão **16.x** (mais recente)
4. Execute o instalador

**Durante a instalação:**
- **Password:** Digite `dentcare2025` (ANOTE ESTA PASSWORD!)
- **Port:** Deixe `5432` (padrão)
- **Locale:** Selecione "Portuguese, Portugal"
- Marque TODAS as opções de componentes

5. Clique em "Next" até finalizar
6. **NÃO** execute o Stack Builder (desmarque a opção no final)

**Verificar instalação:**
1. Procure "pgAdmin 4" no menu Iniciar
2. Abra o pgAdmin 4
3. Digite a password: `dentcare2025`
4. Se aparecer a interface do pgAdmin, está instalado corretamente

---

## 3. Instalação do PostgreSQL - Configuração {#instalacao-postgresql}

### 3.1. Desativar SSL (MUITO IMPORTANTE)

1. Abra o "Prompt de Comando" **como Administrador**:
   - Clique com botão direito no menu Iniciar
   - Selecione "Terminal (Admin)" ou "Prompt de Comando (Admin)"

2. Digite os seguintes comandos (um de cada vez):

```cmd
cd "C:\Program Files\PostgreSQL\16\bin"
psql -U postgres
```

3. Digite a password: `dentcare2025`

4. No prompt do PostgreSQL (postgres=#), digite:

```sql
ALTER SYSTEM SET ssl = off;
SELECT pg_reload_conf();
\q
```

5. Reinicie o serviço PostgreSQL:
   - Abra "Serviços" (tecla Windows + R, digite `services.msc`, Enter)
   - Procure "postgresql-x64-16"
   - Clique com botão direito → "Reiniciar"

---

## 4. Extração e Configuração do DentCarePRO {#extracao-configuracao}

### 4.1. Extrair o Ficheiro ZIP

1. Localize o ficheiro `DentCarePRO_COMPLETO_CORRIGIDO.zip`
2. Clique com botão direito → "Extrair tudo..."
3. Escolha a localização: `C:\DentCarePRO`
4. Clique em "Extrair"

### 4.2. Verificar Estrutura de Pastas

Abra a pasta `C:\DentCarePRO` e verifique se tem:
```
C:\DentCarePRO\
├── client/
├── server/
├── shared/
├── package.json
├── .env
├── database_backup_completo.sql
├── install_windows.bat
└── start_windows.bat
```

Se faltar alguma pasta ou ficheiro, **NÃO CONTINUE**. Contacte o suporte.

---

## 5. Criação da Base de Dados {#criacao-base-dados}

### 5.1. Criar Utilizador e Base de Dados

1. Abra o "Prompt de Comando" **como Administrador**

2. Navegue até à pasta do PostgreSQL:
```cmd
cd "C:\Program Files\PostgreSQL\16\bin"
```

3. Crie o utilizador:
```cmd
psql -U postgres -c "CREATE USER dentcarepro WITH PASSWORD 'dentcare2025';"
```

4. Crie a base de dados:
```cmd
psql -U postgres -c "CREATE DATABASE dentcarepro OWNER dentcarepro;"
```

5. Dê permissões:
```cmd
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE dentcarepro TO dentcarepro;"
```

### 5.2. Restaurar Dados

1. Navegue até à pasta do DentCarePRO:
```cmd
cd C:\DentCarePRO
```

2. Restaure o backup:
```cmd
"C:\Program Files\PostgreSQL\16\bin\psql.exe" -U dentcarepro -d dentcarepro -f database_backup_completo.sql
```

3. Digite a password quando pedido: `dentcare2025`

4. Aguarde até aparecer "COMMIT" no final (pode demorar 1-2 minutos)

---

## 6. Instalação das Dependências {#instalacao-dependencias}

### 6.1. Instalar PNPM (Gestor de Pacotes)

1. Abra o "Prompt de Comando" (NÃO precisa ser Administrador)

2. Digite:
```cmd
npm install -g pnpm
```

3. Aguarde até finalizar (pode demorar 2-3 minutos)

### 6.2. Instalar Dependências do Projeto

**OPÇÃO A: Instalação Automática (Recomendado)**

1. Navegue até à pasta:
```cmd
cd C:\DentCarePRO
```

2. Execute o script de instalação:
```cmd
install_windows.bat
```

3. Aguarde até aparecer "Instalação concluída!" (pode demorar 5-10 minutos)

**OPÇÃO B: Instalação Manual**

Se o script automático falhar:

1. Abra o "Prompt de Comando"
2. Navegue até à pasta:
```cmd
cd C:\DentCarePRO
```

3. Instale as dependências:
```cmd
pnpm install
```

4. Aguarde até finalizar (5-10 minutos)

5. Compile o projeto:
```cmd
pnpm build
```

6. Aguarde até aparecer "Done" (1-2 minutos)

---

## 7. Iniciar o Sistema {#iniciar-sistema}

### 7.1. Primeira Execução

**OPÇÃO A: Iniciar com Script (Recomendado)**

1. Navegue até `C:\DentCarePRO`
2. Faça duplo clique em `start_windows.bat`
3. Uma janela preta (Prompt de Comando) vai abrir
4. Aguarde até aparecer: "Server running on http://localhost:3000/"
5. **NÃO FECHE** esta janela enquanto usar o sistema

**OPÇÃO B: Iniciar Manualmente**

1. Abra o "Prompt de Comando"
2. Digite:
```cmd
cd C:\DentCarePRO
set NODE_ENV=production
set PORT=3000
node dist/index.js
```

3. Aguarde até aparecer: "Server running on http://localhost:3000/"

### 7.2. Aceder ao Sistema

1. Abra o seu navegador (Chrome, Edge, Firefox)
2. Digite na barra de endereços: `http://localhost:3000`
3. Prima Enter
4. O DentCarePRO deve aparecer!

### 7.3. Login Automático

O sistema cria automaticamente um utilizador de demonstração.
Não precisa fazer login - o acesso é automático.

---

## 8. Resolução de Problemas {#resolucao-problemas}

### Problema 1: "node não é reconhecido como comando"

**Causa:** Node.js não foi instalado corretamente

**Solução:**
1. Desinstale o Node.js (Painel de Controlo → Programas)
2. Reinicie o computador
3. Reinstale o Node.js (secção 2.1)
4. Reinicie o computador novamente

### Problema 2: "Erro ao conectar à base de dados"

**Causa:** PostgreSQL não está a correr ou password incorreta

**Solução:**
1. Abra "Serviços" (tecla Windows + R, digite `services.msc`)
2. Procure "postgresql-x64-16"
3. Clique com botão direito → "Iniciar"
4. Verifique se a password no ficheiro `.env` é `dentcare2025`

### Problema 3: "Porta 3000 já está em uso"

**Causa:** Outro programa está a usar a porta 3000

**Solução:**
1. Feche todos os programas
2. Abra o "Prompt de Comando" como Administrador
3. Digite:
```cmd
netstat -ano | findstr :3000
taskkill /PID [NÚMERO_DO_PID] /F
```
4. Substitua [NÚMERO_DO_PID] pelo número que apareceu
5. Tente iniciar o sistema novamente

### Problema 4: "There was an error establishing an SSL connection"

**Causa:** SSL não foi desativado no PostgreSQL

**Solução:**
1. Siga os passos da secção 3.1 novamente
2. Certifique-se de reiniciar o serviço PostgreSQL
3. Reinicie o DentCarePRO

### Problema 5: "Página em branco" ou "Erro 404"

**Causa:** Sistema não foi compilado corretamente

**Solução:**
1. Abra o "Prompt de Comando"
2. Digite:
```cmd
cd C:\DentCarePRO
pnpm build
```
3. Aguarde até finalizar
4. Inicie o sistema novamente

### Problema 6: "pnpm não é reconhecido como comando"

**Causa:** PNPM não foi instalado

**Solução:**
1. Abra o "Prompt de Comando"
2. Digite:
```cmd
npm install -g pnpm
```
3. Feche e abra novamente o Prompt de Comando
4. Tente novamente

---

## 9. Manutenção e Backup {#manutencao-backup}

### 9.1. Fazer Backup da Base de Dados

**IMPORTANTE:** Faça backup regularmente (diariamente recomendado)

1. Abra o "Prompt de Comando"
2. Digite:
```cmd
cd C:\DentCarePRO\backups
"C:\Program Files\PostgreSQL\16\bin\pg_dump.exe" -U dentcarepro -d dentcarepro -F p -f backup_%date:~-4,4%%date:~-7,2%%date:~-10,2%.sql
```

3. Digite a password: `dentcare2025`
4. O backup será guardado em `C:\DentCarePRO\backups\`

### 9.2. Restaurar Backup

1. Abra o "Prompt de Comando"
2. Digite:
```cmd
cd C:\DentCarePRO\backups
"C:\Program Files\PostgreSQL\16\bin\psql.exe" -U dentcarepro -d dentcarepro -f [NOME_DO_FICHEIRO_BACKUP].sql
```

3. Substitua [NOME_DO_FICHEIRO_BACKUP] pelo nome do ficheiro
4. Digite a password: `dentcare2025`

### 9.3. Parar o Sistema

1. Vá à janela do Prompt de Comando onde o sistema está a correr
2. Prima `Ctrl + C`
3. Digite `S` e prima Enter
4. Feche a janela

### 9.4. Atualizar o Sistema

Quando receber uma nova versão:

1. Pare o sistema (secção 9.3)
2. Faça backup da base de dados (secção 9.1)
3. Faça backup da pasta `C:\DentCarePRO` (copie para outro local)
4. Extraia a nova versão para `C:\DentCarePRO` (substitua os ficheiros)
5. Abra o "Prompt de Comando"
6. Digite:
```cmd
cd C:\DentCarePRO
pnpm install
pnpm build
```
7. Inicie o sistema novamente (secção 7)

---

## 📞 Suporte e Ajuda

### Ficheiros de Log

Se tiver problemas, os ficheiros de log estão em:
- `C:\DentCarePRO\server.log` - Logs do servidor
- `C:\DentCarePRO\error.log` - Erros do sistema

### Informações do Sistema

Para reportar problemas, forneça:
1. Versão do Windows (tecla Windows + R, digite `winver`)
2. Versão do Node.js (`node --version` no Prompt de Comando)
3. Conteúdo do ficheiro `error.log`
4. Descrição detalhada do problema
5. Passos para reproduzir o erro

---

## ✅ Checklist Final

Antes de usar o sistema em produção, verifique:

- [ ] Node.js instalado e funcionando
- [ ] PostgreSQL instalado e a correr
- [ ] SSL desativado no PostgreSQL
- [ ] Base de dados criada e restaurada
- [ ] Dependências instaladas sem erros
- [ ] Sistema compilado com sucesso
- [ ] Sistema inicia sem erros
- [ ] Consegue aceder via navegador
- [ ] Backup automático configurado
- [ ] Firewall configurado (se necessário)

---

## 🎉 Conclusão

Se seguiu todos os passos corretamente, o DentCarePRO deve estar a funcionar perfeitamente!

**URL de Acesso:** http://localhost:3000

**Utilizador:** Automático (não precisa login)

**Boa utilização!**

---

**Última atualização:** 17 de Outubro de 2025
**Versão do Guia:** 1.0
**Versão do Sistema:** DentCarePRO v8.0

