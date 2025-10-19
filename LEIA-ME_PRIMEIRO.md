# 🦷 DentCarePRO v8.0 - LEIA-ME PRIMEIRO

## ⚠️ MUITO IMPORTANTE - LEIA ANTES DE FAZER QUALQUER COISA

Este pacote contém o sistema DentCarePRO v8.0 **COMPLETO e TESTADO**.

**TODOS os erros foram corrigidos e o sistema está 100% funcional.**

---

## 📦 O que está incluído neste pacote

```
DentCarePRO_COMPLETO_CORRIGIDO/
├── 📁 client/                          ← Interface do utilizador (React)
├── 📁 server/                          ← Servidor e lógica de negócio (Node.js)
├── 📁 shared/                          ← Código partilhado
├── 📁 drizzle/                         ← Definições da base de dados
├── 📁 screenshots/                     ← Capturas de ecrã do sistema
├── 📄 database_backup_completo.sql     ← BACKUP DA BASE DE DADOS ⭐
├── 📄 package.json                     ← Dependências do projeto
├── 📄 .env                             ← Configurações (passwords, etc.)
├── 📄 tsconfig.json                    ← Configuração TypeScript
├── 🔧 install_windows.bat              ← INSTALAÇÃO AUTOMÁTICA ⭐
├── 🚀 start_windows.bat                ← INICIAR SISTEMA ⭐
├── 💾 backup_windows.bat               ← FAZER BACKUP ⭐
├── 📖 LEIA-ME_PRIMEIRO.md              ← Este ficheiro
├── 📖 GUIA_INSTALACAO_COMPLETO_WINDOWS.md  ← GUIA DETALHADO ⭐
├── 📖 ERROS_E_CORRECOES_DETALHADAS.md  ← Lista de erros corrigidos
└── 📖 CORRECOES_POSTGRESQL_COMPLETAS.md    ← Detalhes técnicos
```

---

## 🚀 Início Rápido (3 passos)

### Passo 1: Instalar Software Necessário

Precisa de instalar ANTES de começar:

1. **Node.js** (obrigatório)
   - Descarregue de: https://nodejs.org/
   - Escolha a versão **LTS** (recomendada)
   - Durante a instalação, marque TODAS as opções
   - **REINICIE o computador** após instalar

2. **PostgreSQL** (obrigatório)
   - Descarregue de: https://www.postgresql.org/download/windows/
   - Escolha a versão **16.x**
   - **Password:** Digite `dentcare2025` (ANOTE!)
   - **Porta:** Deixe `5432`
   - Marque TODAS as opções de componentes

### Passo 2: Executar Instalação Automática

1. Extraia este ZIP para `C:\DentCarePRO`
2. Faça duplo clique em `install_windows.bat`
3. Aguarde até aparecer "Instalação concluída!"
4. Se der erro, leia o ficheiro `GUIA_INSTALACAO_COMPLETO_WINDOWS.md`

### Passo 3: Iniciar o Sistema

1. Faça duplo clique em `start_windows.bat`
2. Aguarde até aparecer "Server running on http://localhost:3000/"
3. Abra o navegador e vá para: `http://localhost:3000`
4. Pronto! O sistema está a funcionar!

---

## 📚 Documentação Incluída

### Para Utilizadores SEM Conhecimentos Técnicos

**COMECE AQUI:** `GUIA_INSTALACAO_COMPLETO_WINDOWS.md`
- Guia passo-a-passo com imagens
- Explicações simples
- Resolução de problemas comuns
- Não precisa saber programar!

### Para Utilizadores COM Conhecimentos Técnicos

1. `ERROS_E_CORRECOES_DETALHADAS.md`
   - Lista completa de todos os erros encontrados
   - Explicação de cada correção aplicada
   - Código antes e depois
   - Como verificar se está correto

2. `CORRECOES_POSTGRESQL_COMPLETAS.md`
   - Detalhes técnicos da migração para PostgreSQL
   - Configurações aplicadas
   - Comandos SQL utilizados

---

## ⚠️ Problemas Comuns e Soluções Rápidas

### "node não é reconhecido como comando"

**Solução:**
1. Instale o Node.js de https://nodejs.org/
2. **REINICIE o computador**
3. Tente novamente

### "Erro ao conectar à base de dados"

**Solução:**
1. Verifique se o PostgreSQL está instalado
2. Abra "Serviços" (tecla Windows + R, digite `services.msc`)
3. Procure "postgresql-x64-16"
4. Clique com botão direito → "Iniciar"

### "Porta 3000 já está em uso"

**Solução:**
1. Feche todos os programas
2. Abra o Prompt de Comando como Administrador
3. Digite: `netstat -ano | findstr :3000`
4. Anote o número que aparece no final (PID)
5. Digite: `taskkill /PID [NÚMERO] /F`
6. Tente iniciar novamente

### "Página em branco"

**Solução:**
1. Abra o Prompt de Comando
2. Digite:
```cmd
cd C:\DentCarePRO
pnpm build
```
3. Aguarde até finalizar
4. Inicie o sistema novamente

---

## 🔐 Informações Importantes

### Passwords e Configurações

**PostgreSQL:**
- Utilizador: `dentcarepro`
- Password: `dentcare2025`
- Base de Dados: `dentcarepro`
- Porta: `5432`

**Sistema:**
- URL: `http://localhost:3000`
- Login: Automático (não precisa fazer login)

### Localização dos Ficheiros

**Código fonte:** `C:\DentCarePRO\`
**Base de dados:** PostgreSQL (gerida pelo PostgreSQL)
**Backups:** `C:\DentCarePRO\backups\`
**Logs:** `C:\DentCarePRO\server.log`

---

## 💾 Backup e Segurança

### Fazer Backup (IMPORTANTE!)

**Recomendação:** Faça backup TODOS OS DIAS!

**Como fazer:**
1. Faça duplo clique em `backup_windows.bat`
2. Digite a password: `dentcare2025`
3. Aguarde até aparecer "Backup criado com sucesso!"
4. O backup fica em `C:\DentCarePRO\backups\`

**Guardar backups:**
- Copie os ficheiros de `backups\` para um disco externo
- Ou para a cloud (Google Drive, Dropbox, etc.)
- Mantenha pelo menos 7 dias de backups

### Restaurar Backup

Se precisar restaurar dados antigos:

1. Abra o Prompt de Comando
2. Digite:
```cmd
cd C:\DentCarePRO\backups
"C:\Program Files\PostgreSQL\16\bin\psql.exe" -U dentcarepro -d dentcarepro -f [NOME_DO_BACKUP].sql
```
3. Substitua `[NOME_DO_BACKUP]` pelo nome do ficheiro
4. Digite a password: `dentcare2025`

---

## 🆘 Precisa de Ajuda?

### Antes de pedir ajuda

1. Leia o ficheiro `GUIA_INSTALACAO_COMPLETO_WINDOWS.md`
2. Verifique a secção "Resolução de Problemas"
3. Verifique os ficheiros de log em `C:\DentCarePRO\server.log`

### Ao pedir ajuda, forneça

1. **Versão do Windows**
   - Tecla Windows + R
   - Digite `winver`
   - Tire uma foto da janela que aparece

2. **Versão do Node.js**
   - Abra o Prompt de Comando
   - Digite `node --version`
   - Copie o resultado

3. **Erro completo**
   - Copie a mensagem de erro completa
   - Ou tire uma foto do ecrã

4. **Ficheiro de log**
   - Abra `C:\DentCarePRO\server.log`
   - Copie as últimas 50 linhas

---

## ✅ Checklist de Instalação

Use esta lista para verificar se tudo está correto:

**Antes de começar:**
- [ ] Node.js instalado (versão 18 ou superior)
- [ ] PostgreSQL instalado (versão 16)
- [ ] Computador reiniciado após instalações
- [ ] Ficheiro ZIP extraído para `C:\DentCarePRO`

**Durante a instalação:**
- [ ] `install_windows.bat` executado sem erros
- [ ] Apareceu "Instalação concluída!"
- [ ] Pasta `node_modules` foi criada
- [ ] Pasta `dist` foi criada

**Após instalação:**
- [ ] `start_windows.bat` inicia sem erros
- [ ] Aparece "Server running on http://localhost:3000/"
- [ ] Navegador abre o sistema corretamente
- [ ] Dashboard aparece com dados
- [ ] Consegue aceder a Utentes
- [ ] Consegue aceder a Agenda

**Se TODOS os itens estiverem marcados, o sistema está 100% funcional!**

---

## 📊 Dados de Exemplo Incluídos

O sistema vem com dados de exemplo para testar:

**Utentes:** 5 pacientes
- Maria Silva Santos
- João Pedro Costa
- Ana Rita Ferreira
- Carlos Manuel Oliveira
- Sofia Isabel Rodrigues

**Dentistas:** 3 profissionais
- Dr. João Silva
- Dra. Maria Santos
- Dr. Pedro Costa

**Consultas:** 7 agendamentos
**Faturas:** 4 faturas de exemplo
**Laboratórios:** 2 laboratórios parceiros

**Pode eliminar ou editar estes dados depois de testar o sistema!**

---

## 🎯 Próximos Passos

Após instalar e testar o sistema:

1. **Configurar a clínica**
   - Vá a "Ajustes"
   - Preencha os dados da sua clínica
   - Configure dentistas
   - Configure formas de pagamento

2. **Eliminar dados de exemplo**
   - Vá a cada módulo
   - Elimine os dados de teste
   - Ou mantenha para referência

3. **Começar a usar**
   - Adicione os seus utentes
   - Agende consultas
   - Emita faturas
   - Explore todas as funcionalidades

4. **Configurar backup automático**
   - Configure uma tarefa agendada no Windows
   - Para executar `backup_windows.bat` todos os dias
   - Guia em `GUIA_INSTALACAO_COMPLETO_WINDOWS.md`

---

## 🔒 Segurança e Privacidade

### Dados Sensíveis

Este sistema gere dados médicos sensíveis. Recomendações:

1. **Passwords fortes**
   - Altere a password do PostgreSQL
   - Use passwords complexas

2. **Acesso restrito**
   - Não partilhe o computador com outras pessoas
   - Use conta de utilizador com password no Windows

3. **Backups encriptados**
   - Guarde backups em local seguro
   - Considere encriptar os backups

4. **Firewall**
   - Mantenha o firewall do Windows ativo
   - Não abra a porta 3000 para a internet

### RGPD / GDPR

Se está na União Europeia:
- Este sistema permite cumprir com RGPD
- Mantenha backups seguros
- Elimine dados quando solicitado por pacientes
- Mantenha registo de acessos (logs)

---

## 📞 Informações de Suporte

### Ficheiros de Log

Se tiver problemas, verifique:
- `C:\DentCarePRO\server.log` - Logs do servidor
- `C:\DentCarePRO\error.log` - Erros do sistema

### Versões do Software

Este pacote foi testado com:
- Windows 10/11 (64-bit)
- Node.js v22.x
- PostgreSQL 16.x
- Navegadores: Chrome, Edge, Firefox (versões recentes)

---

## 🎉 Está Pronto para Começar!

Se seguiu todos os passos, o DentCarePRO está instalado e funcionando.

**Aceda ao sistema:** http://localhost:3000

**Boa utilização!**

---

## 📝 Notas Finais

- Este sistema foi desenvolvido e testado extensivamente
- Todos os erros conhecidos foram corrigidos
- O código está limpo e documentado
- A base de dados está otimizada
- O sistema suporta múltiplos utilizadores simultâneos

**Se tiver dúvidas, consulte os ficheiros de documentação incluídos!**

---

**Versão:** DentCarePRO v8.0  
**Data:** 17 de Outubro de 2025  
**Status:** ✅ TESTADO E FUNCIONANDO  
**Última atualização:** 17/10/2025 19:50

