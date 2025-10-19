# 📘 Guia Completo de Instalação e Deploy - DentCarePRO

**Para utilizadores SEM conhecimentos de programação**

---

## 🎯 O QUE VAI FAZER

Vai instalar e executar o sistema DentCarePRO no seu computador. No final, terá um sistema web funcionando que pode aceder através do navegador.

**Tempo estimado:** 15-30 minutos

---

## 📋 PRÉ-REQUISITOS

### 1. Sistema Operacional

✅ **Windows 10/11**  
✅ **macOS** (qualquer versão recente)  
✅ **Linux** (Ubuntu, Debian, Fedora, etc.)

### 2. Software Necessário

Precisa instalar 2 programas antes de começar:

#### A) Node.js (Motor JavaScript)

**O que é:** Software que permite executar aplicações JavaScript no computador

**Como instalar:**

1. Aceder a: https://nodejs.org/
2. Descarregar a versão **LTS** (recomendada)
3. Executar o instalador
4. Seguir as instruções (deixar opções padrão)
5. Reiniciar o computador

**Verificar instalação:**
- Abrir terminal/linha de comandos
- Escrever: `node --version`
- Deve aparecer algo como: `v22.13.0`

#### B) pnpm (Gestor de Pacotes)

**O que é:** Ferramenta que instala as bibliotecas necessárias

**Como instalar:**

**Windows:**
```cmd
npm install -g pnpm
```

**macOS/Linux:**
```bash
npm install -g pnpm
```

**Verificar instalação:**
```bash
pnpm --version
```

Deve aparecer algo como: `10.4.1`

---

## 📦 PASSO 1: EXTRAIR O FICHEIRO ZIP

1. Localizar o ficheiro: `DentCarePro_FINAL_FUNCIONANDO.zip`
2. Clicar com botão direito → **Extrair tudo...**
3. Escolher uma pasta (exemplo: `C:\DentCarePRO` ou `~/DentCarePRO`)
4. Aguardar extração completa

**Resultado:** Pasta `dentcarepro` com todos os ficheiros

---

## 💻 PASSO 2: ABRIR TERMINAL NA PASTA DO PROJETO

### Windows

1. Abrir a pasta `dentcarepro` no Explorador de Ficheiros
2. Clicar na barra de endereço (onde está o caminho)
3. Escrever: `cmd` e pressionar Enter
4. Abre-se uma janela preta (terminal)

**OU**

1. Abrir Menu Iniciar
2. Escrever: `cmd`
3. Abrir "Linha de Comandos"
4. Navegar para a pasta:
```cmd
cd C:\caminho\para\dentcarepro
```

### macOS

1. Abrir **Terminal** (Applications → Utilities → Terminal)
2. Navegar para a pasta:
```bash
cd ~/caminho/para/dentcarepro
```

**OU**

1. Abrir **Finder**
2. Ir para a pasta `dentcarepro`
3. Clicar com botão direito → **Services** → **New Terminal at Folder**

### Linux

1. Abrir a pasta `dentcarepro` no gestor de ficheiros
2. Clicar com botão direito → **Abrir no Terminal**

**OU**

1. Abrir Terminal
2. Navegar:
```bash
cd ~/caminho/para/dentcarepro
```

---

## 📥 PASSO 3: INSTALAR DEPENDÊNCIAS

No terminal, escrever:

```bash
pnpm install
```

Pressionar **Enter**

**O que vai acontecer:**
- Vai descarregar ~500MB de bibliotecas
- Vai demorar 2-5 minutos
- Vai aparecer muitas mensagens a passar

**Aguardar até aparecer:**
```
Done in X.Xs
```

⚠️ **AVISOS NORMAIS (pode ignorar):**
- `WARN deprecated ...`
- `WARN Issues with peer dependencies`

❌ **ERROS A VERIFICAR:**
- `ERR! network` → Problema de internet
- `ERR! permission denied` → Precisa executar como administrador

---

## 🔨 PASSO 4: COMPILAR O PROJETO

No terminal, escrever:

```bash
pnpm build
```

Pressionar **Enter**

**O que vai acontecer:**
- Vai compilar o código
- Vai demorar 10-30 segundos
- Vai criar pasta `dist/`

**Aguardar até aparecer:**
```
dist/index.js  XXX.Xkb
⚡ Done in XXms
```

✅ **SUCESSO!** O projeto está compilado

---

## 🚀 PASSO 5: INICIAR O SERVIDOR

### Opção A: Comando Manual

No terminal, escrever:

```bash
node dist/index.js
```

### Opção B: Script Automático (Linux/macOS)

```bash
chmod +x start.sh
./start.sh
```

### Opção B: Script Automático (Windows)

```cmd
start.bat
```

**O que vai aparecer:**
```
[OAuth] Initialized with baseURL: 
[OAuth] ERROR: OAUTH_SERVER_URL is not configured! Set OAUTH_SERVER_URL environment variable.
Server running on http://localhost:3000/
```

✅ **ISTO É NORMAL!** O erro de OAuth pode ser ignorado.

**IMPORTANTE:** NÃO fechar esta janela! O servidor está a correr.

---

## 🌐 PASSO 6: ACEDER AO SISTEMA

1. Abrir navegador (Chrome, Firefox, Edge, Safari)
2. Ir para: **http://localhost:3000**

**Deve aparecer:**
- Dashboard do DentCarePRO
- Menu lateral com opções
- Cards com estatísticas

✅ **PARABÉNS! O sistema está a funcionar!**

---

## 🎨 PASSO 7: EXPLORAR O SISTEMA

### Páginas Disponíveis

1. **Dashboard** - Visão geral
2. **Utentes** - Gestão de pacientes
3. **Consultas** - Agenda
4. **Faturação** - Faturas e pagamentos
5. **IA Financeira** - Análise inteligente
6. **Ajustes** - Configurações

### Testar Funcionalidades

1. **Criar Utente:**
   - Ir para **Utentes**
   - Clicar **+ Novo Utente**
   - Preencher formulário
   - Guardar

2. **Ver IA Financeira:**
   - Ir para **IA Financeira**
   - Ver gráficos
   - Testar chatbot
   - Exportar relatório PDF

3. **Ver Odontograma:**
   - Ir para **Utentes**
   - Criar um utente
   - Abrir ficha do utente
   - Ver odontograma 3D

---

## 🛑 PARAR O SERVIDOR

Quando quiser parar o sistema:

1. Ir para a janela do terminal
2. Pressionar **Ctrl + C**
3. Confirmar (se pedir)

O servidor para e o site deixa de funcionar.

---

## 🔄 REINICIAR O SERVIDOR

Para voltar a usar o sistema:

1. Abrir terminal na pasta `dentcarepro`
2. Executar: `node dist/index.js`
3. Aceder a: http://localhost:3000

**NOTA:** Os dados são perdidos quando reinicia! (sistema mock)

---

## ⚠️ PROBLEMAS COMUNS E SOLUÇÕES

### Problema 1: "Port 3000 is busy"

**Significa:** Já existe algo a usar a porta 3000

**Solução A - Mudar porta:**
```bash
PORT=3001 node dist/index.js
```
Depois aceder a: http://localhost:3001

**Solução B - Parar processo:**

**Windows:**
```cmd
netstat -ano | findstr :3000
taskkill /PID XXXX /F
```
(Substituir XXXX pelo número que aparece)

**macOS/Linux:**
```bash
lsof -ti:3000 | xargs kill -9
```

### Problema 2: Página em branco

**Soluções:**
1. Fazer refresh (F5)
2. Fazer hard refresh (Ctrl+Shift+R)
3. Limpar cache do navegador
4. Verificar se servidor está a correr
5. Verificar URL: http://localhost:3000 (não https)

### Problema 3: "Cannot find module"

**Solução:**
```bash
rm -rf node_modules
pnpm install
pnpm build
node dist/index.js
```

### Problema 4: Erros ao instalar dependências

**Solução:**
1. Verificar internet
2. Executar como administrador
3. Limpar cache:
```bash
pnpm store prune
pnpm install
```

### Problema 5: "node: command not found"

**Significa:** Node.js não está instalado ou não está no PATH

**Solução:**
1. Reinstalar Node.js
2. Reiniciar computador
3. Verificar: `node --version`

---

## 📁 ESTRUTURA DE PASTAS

```
dentcarepro/
├── client/          → Frontend (React)
├── server/          → Backend (Node.js)
├── drizzle/         → Schema da base de dados
├── dist/            → Código compilado
├── node_modules/    → Bibliotecas (criado no install)
├── package.json     → Configuração do projeto
├── .env             → Variáveis de ambiente
└── start.sh         → Script de inicialização
```

**NÃO APAGAR:**
- `node_modules/` (pode reinstalar com `pnpm install`)
- `dist/` (pode recriar com `pnpm build`)

**NÃO MODIFICAR:**
- `package.json`
- Ficheiros em `server/` e `client/`

---

## 🔐 SEGURANÇA

### Para Testes/Desenvolvimento

✅ Pode usar assim (localhost)

### Para Produção (Dados Reais)

❌ **NÃO usar esta versão!**

Precisa de:
1. Base de dados real (MySQL/PostgreSQL)
2. Autenticação real
3. HTTPS (certificado SSL)
4. Servidor dedicado
5. Backups automáticos

**Contacte um programador para deploy em produção**

---

## 💾 FAZER BACKUP

### Backup do Código

Copiar toda a pasta `dentcarepro` para:
- Disco externo
- Cloud (Google Drive, Dropbox)
- Outro computador

### Backup dos Dados

⚠️ **ATENÇÃO:** Esta versão NÃO guarda dados permanentemente!

Os dados são perdidos quando:
- Reinicia o servidor
- Desliga o computador
- Faz rebuild

Para guardar dados permanentemente, precisa de base de dados real.

---

## 🌍 ACEDER DE OUTRO COMPUTADOR NA MESMA REDE

### Passo 1: Descobrir IP do computador

**Windows:**
```cmd
ipconfig
```
Procurar: `IPv4 Address` (exemplo: 192.168.1.100)

**macOS/Linux:**
```bash
ifconfig
```
OU
```bash
ip addr
```

### Passo 2: Iniciar servidor com IP

```bash
HOST=0.0.0.0 node dist/index.js
```

### Passo 3: Aceder de outro computador

No outro computador, abrir navegador e ir para:
```
http://192.168.1.100:3000
```
(Substituir pelo IP do passo 1)

⚠️ **NOTA:** Firewall pode bloquear. Precisa permitir porta 3000.

---

## 📞 AJUDA ADICIONAL

### Ficheiros de Ajuda Incluídos

1. **README.md** - Visão geral do projeto
2. **ERROS_E_CORRECOES.md** - Problemas técnicos resolvidos
3. **GUIA_INSTALACAO.md** - Este ficheiro
4. **TROUBLESHOOTING.md** - Resolução de problemas

### Logs do Servidor

Se algo não funcionar, verificar mensagens no terminal onde o servidor está a correr.

**Guardar estas mensagens** se precisar de ajuda.

### Console do Navegador

Se a página não carregar:
1. Pressionar **F12**
2. Ir para tab **Console**
3. Ver erros (texto vermelho)
4. **Guardar screenshot** se precisar de ajuda

---

## ✅ CHECKLIST FINAL

Antes de considerar o deploy concluído:

- [ ] Node.js instalado e funcionando
- [ ] pnpm instalado e funcionando
- [ ] Ficheiro ZIP extraído
- [ ] Terminal aberto na pasta correta
- [ ] `pnpm install` executado com sucesso
- [ ] `pnpm build` executado com sucesso
- [ ] Servidor iniciado sem erros críticos
- [ ] Navegador acede a http://localhost:3000
- [ ] Dashboard carrega corretamente
- [ ] Consegue navegar entre páginas
- [ ] Testou criar um utente
- [ ] Testou IA Financeira
- [ ] Sabe como parar o servidor
- [ ] Sabe como reiniciar o servidor

---

## 🎓 PRÓXIMOS PASSOS

### Para Continuar a Usar

1. Sempre que quiser usar:
   - Abrir terminal na pasta
   - Executar: `node dist/index.js`
   - Aceder: http://localhost:3000

2. Quando terminar:
   - Pressionar Ctrl+C no terminal

### Para Melhorar o Sistema

1. **Adicionar base de dados real:**
   - Contratar programador
   - Migrar de mock para MySQL/PostgreSQL
   - Configurar backups

2. **Deploy em servidor:**
   - Contratar hosting
   - Configurar domínio
   - Instalar certificado SSL

3. **Adicionar funcionalidades:**
   - Notificações WhatsApp
   - Relatórios avançados
   - Integração com outros sistemas

---

**FIM DO GUIA**

**Boa sorte com o seu sistema DentCarePRO! 🦷✨**

---

**Última Atualização:** 17/10/2025 15:20 GMT+1  
**Versão:** 1.0  
**Suporte:** Consultar ficheiro ERROS_E_CORRECOES.md para problemas técnicos

