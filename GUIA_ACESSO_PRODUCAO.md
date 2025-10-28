# 🚀 Guia de Acesso e Teste - DentCarePRO v8 em Produção

**Data:** 28 de Outubro de 2025  
**Status:** ✅ Deploy Acionado via GitHub

---

## 🌐 URLs DE PRODUÇÃO

### **Frontend (Vercel)**

**URL Principal:** https://dentcare-5lvot832y-dent-care-pro.vercel.app

**URL de Login:** https://dentcare-5lvot832y-dent-care-pro.vercel.app/login

**Projeto Vercel ID:** `prj_ibwbeu7ho7rpouLMJDndOQuczED2`

### **Backend API (Railway)**

**URL da API:** https://web-production-1be3.up.railway.app

**Banco de Dados:** PostgreSQL no Railway (já configurado)

---

## 🔐 CREDENCIAIS DE ACESSO

### **Usuário Admin**

```
Email: admin@dentcarepro.com
Senha: Admin@123
```

**⚠️ IMPORTANTE:** Alterar esta senha após o primeiro login!

---

## 📊 STATUS DO DEPLOY

### **Último Push para GitHub**

✅ **Commit:** `634c0e18` - "chore: trigger deploy for authentication system"  
✅ **Branch:** main  
✅ **Data/Hora:** 28 de Outubro de 2025  

### **Deploy Automático**

O sistema está configurado para fazer deploy automático quando há push para o branch `main`:

- **Vercel:** Deploy do frontend acontece automaticamente
- **Railway:** Deploy do backend acontece automaticamente

**Tempo estimado de deploy:**
- Frontend (Vercel): 2-5 minutos
- Backend (Railway): 3-7 minutos

---

## 🧪 COMO TESTAR O SISTEMA

### **Passo 1: Aguardar Deploy**

Aguarde **5-10 minutos** após o push para garantir que os deploys foram concluídos.

### **Passo 2: Verificar se o Deploy Concluiu**

#### **Opção A: Verificar no GitHub**

1. Acesse: https://github.com/ferpesso/dentcarepro-v8
2. Vá em **Actions** (aba superior)
3. Veja o status dos workflows de deploy
4. ✅ = Deploy concluído
5. 🔄 = Deploy em andamento
6. ❌ = Deploy falhou

#### **Opção B: Verificar Diretamente no Site**

1. Acesse: https://dentcare-5lvot832y-dent-care-pro.vercel.app
2. Se carregar a página de login = Deploy OK
3. Se mostrar erro 404 ou página antiga = Aguardar mais alguns minutos

### **Passo 3: Acessar a Página de Login**

1. **Abra o navegador** (Chrome, Firefox, Safari, Edge)
2. **Acesse:** https://dentcare-5lvot832y-dent-care-pro.vercel.app/login
3. **Você deve ver:**
   - Logo do DentCare PRO
   - Card de login centralizado
   - Campos de Email e Senha
   - Botão "Entrar"
   - Credenciais de teste visíveis (em desenvolvimento)

### **Passo 4: Fazer Login**

1. **Digite o email:** admin@dentcarepro.com
2. **Digite a senha:** Admin@123
3. **Clique em "Entrar"**

**Resultado esperado:**
- ✅ Loading spinner aparece
- ✅ Redirecionamento para home (`/`)
- ✅ Dashboard carrega
- ✅ Avatar do admin aparece no rodapé da sidebar

### **Passo 5: Testar Funcionalidades**

#### **A. Perfil de Usuário**

1. Vá até o **rodapé da sidebar** (canto inferior esquerdo)
2. Clique no **avatar** com a letra "A" (Administrador)
3. **Menu deve abrir** com opções:
   - Meu Perfil
   - Alterar Senha
   - Notificações
   - Gerenciar Usuários (Admin)
   - Configurações (Admin)
   - Sair (vermelho)

#### **B. Proteção de Rotas**

1. Clique em **"Sair"** no menu do perfil
2. Você será **redirecionado para `/login`**
3. Tente acessar diretamente: https://dentcare-5lvot832y-dent-care-pro.vercel.app/utentes
4. Deve **redirecionar para `/login`** automaticamente

#### **C. Sessão Persistente**

1. Faça login novamente
2. **Feche o navegador** completamente
3. **Abra novamente** e acesse o site
4. Você deve **continuar logado** (sessão salva no localStorage)

#### **D. Navegação**

1. Teste navegar entre as páginas:
   - Dashboard (`/`)
   - Agenda (`/agenda`)
   - Utentes (`/utentes`)
   - Faturação (`/faturacao`)
2. Todas devem **carregar normalmente**
3. Avatar deve **permanecer visível** em todas as páginas

---

## 🔍 VERIFICAR LOGS E DADOS

### **A. Verificar Token no Navegador**

1. Abra **DevTools** (F12 ou Ctrl+Shift+I)
2. Vá em **Application** (Chrome) ou **Storage** (Firefox)
3. Clique em **Local Storage**
4. Selecione o domínio do site
5. **Você deve ver:**
   - `authToken` - Token JWT
   - `user` - Dados do usuário (JSON)

**Exemplo:**
```json
{
  "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "admin-default-001",
    "name": "Administrador",
    "email": "admin@dentcarepro.com",
    "role": "admin",
    "status": "ativo"
  }
}
```

### **B. Verificar Requisições na Rede**

1. No DevTools, vá em **Network** (Rede)
2. Faça login
3. **Você deve ver:**
   - `POST /api/trpc/auth.login` - Status 200
   - Response com `token` e `user`

### **C. Verificar Banco de Dados**

Se você quiser verificar diretamente no banco:

```bash
# Conectar ao PostgreSQL
PGPASSWORD='XOSyhNvaHARkdhDoZnyyjZFuCZjwbkaA' psql \
  -h nozomi.proxy.rlwy.net \
  -p 15765 \
  -U postgres \
  -d railway

# Ver usuários
SELECT id, name, email, role, status, last_login FROM users;

# Ver sessões ativas
SELECT 
  s.id, 
  s.user_id, 
  u.name, 
  s.ip_address, 
  s.expires_at, 
  s.is_active 
FROM user_sessions s 
JOIN users u ON s.user_id = u.id 
WHERE s.is_active = 1;

# Ver log de auditoria (últimas ações)
SELECT 
  a.action, 
  a.module, 
  u.name as user_name, 
  a.created_at 
FROM audit_log a 
JOIN users u ON a.user_id = u.id 
ORDER BY a.created_at DESC 
LIMIT 10;
```

---

## ⚠️ PROBLEMAS COMUNS E SOLUÇÕES

### **1. Página de Login Não Aparece**

**Sintomas:**
- Site carrega mas não mostra página de login
- Erro 404 ao acessar `/login`

**Possíveis Causas:**
- Deploy ainda não concluiu
- Cache do navegador

**Soluções:**
1. Aguardar mais 5 minutos
2. Limpar cache do navegador (Ctrl+Shift+Delete)
3. Abrir em aba anônima (Ctrl+Shift+N)
4. Verificar status do deploy no GitHub Actions

### **2. Erro ao Fazer Login**

**Sintomas:**
- Mensagem "Credenciais inválidas"
- Erro de rede

**Possíveis Causas:**
- Backend (Railway) ainda não deployou
- Banco de dados não atualizado
- Erro de conexão

**Soluções:**
1. Verificar se backend está online: https://web-production-1be3.up.railway.app
2. Verificar console do navegador (F12) para erros
3. Verificar se migration foi executada no banco
4. Testar com credenciais corretas (copiar/colar)

### **3. Redirecionamento Infinito**

**Sintomas:**
- Página fica carregando indefinidamente
- Redirecionamento entre `/` e `/login`

**Possíveis Causas:**
- Conflito entre hooks de autenticação
- Token inválido no localStorage

**Soluções:**
1. Abrir DevTools (F12)
2. Application > Local Storage
3. **Deletar** `authToken` e `user`
4. Recarregar página (F5)
5. Fazer login novamente

### **4. Site Pede Senha do Vercel**

**Sintomas:**
- Página de "Login to Vercel" aparece
- Não consegue acessar o site

**Possíveis Causas:**
- Projeto configurado com Password Protection
- Preview deployment ao invés de production

**Soluções:**
1. Usar URL de produção principal (não preview)
2. Se você é o dono do projeto, desabilitar Password Protection no Vercel:
   - Vercel Dashboard > Projeto > Settings > Deployment Protection
   - Desabilitar "Password Protection"

### **5. Erro 500 ou Erro de Servidor**

**Sintomas:**
- Erro 500 Internal Server Error
- "Something went wrong"

**Possíveis Causas:**
- Erro no backend
- Variáveis de ambiente não configuradas
- Migration não executada

**Soluções:**
1. Verificar logs do Railway:
   - Railway Dashboard > Projeto > Deployments > Logs
2. Verificar variáveis de ambiente no Railway:
   - `DATABASE_URL` deve estar configurada
   - `JWT_SECRET` deve estar configurada (ou usar default)
3. Re-executar migration se necessário

---

## 🔧 CONFIGURAÇÕES NECESSÁRIAS

### **Variáveis de Ambiente no Railway**

O backend precisa das seguintes variáveis de ambiente:

```bash
DATABASE_URL=postgresql://postgres:XOSyhNvaHARkdhDoZnyyjZFuCZjwbkaA@nozomi.proxy.rlwy.net:15765/railway
NODE_ENV=production
PORT=8080
JWT_SECRET=seu-secret-super-seguro-aqui  # IMPORTANTE: Configurar!
```

**Como configurar:**
1. Acesse Railway Dashboard
2. Selecione o projeto
3. Vá em **Variables**
4. Adicione/edite as variáveis acima

### **Variáveis de Ambiente no Vercel**

O frontend já está configurado no `vercel.json`:

```json
{
  "env": {
    "NODE_ENV": "production",
    "VITE_API_URL": "https://web-production-1be3.up.railway.app",
    "VITE_APP_ID": "dentcarepro_v8",
    "VITE_APP_TITLE": "DentCare PRO"
  }
}
```

---

## 📱 TESTAR EM DIFERENTES DISPOSITIVOS

### **Desktop**
- ✅ Chrome, Firefox, Safari, Edge
- ✅ Resolução mínima: 1024x768

### **Tablet**
- ✅ iPad, Android Tablets
- ✅ Modo retrato e paisagem

### **Mobile**
- ✅ iPhone, Android
- ✅ Responsividade completa
- ✅ Menu colapsável

---

## 📊 CHECKLIST DE TESTES

### **Autenticação**
- [ ] Página de login carrega corretamente
- [ ] Login com credenciais corretas funciona
- [ ] Login com credenciais incorretas mostra erro
- [ ] Token é salvo no localStorage
- [ ] Redirecionamento após login funciona
- [ ] Logout funciona e limpa sessão
- [ ] Proteção de rotas funciona

### **Interface**
- [ ] Avatar aparece no rodapé da sidebar
- [ ] Menu do perfil abre ao clicar
- [ ] Badge de role (Admin) aparece
- [ ] Todas as opções do menu estão visíveis
- [ ] Navegação entre páginas funciona
- [ ] Sidebar é responsiva

### **Sessão**
- [ ] Sessão persiste após fechar navegador
- [ ] Verificação automática de sessão funciona
- [ ] Logout invalida sessão
- [ ] Múltiplas abas sincronizam sessão

### **Segurança**
- [ ] Rotas protegidas redirecionam para login
- [ ] Token expira após 7 dias
- [ ] Tentativas de login falhas são registradas
- [ ] Bloqueio após 5 tentativas funciona

---

## 🎯 PRÓXIMOS PASSOS APÓS TESTES

### **Se Tudo Funcionar:**

1. **Alterar senha do admin**
2. **Configurar JWT_SECRET** no Railway
3. **Migrar para bcrypt** (segurança)
4. **Criar usuários de teste** para cada role
5. **Implementar recuperação de senha**
6. **Continuar com próximas funcionalidades**

### **Se Houver Problemas:**

1. **Documentar o erro** (screenshot, mensagem, console)
2. **Verificar logs** (Railway e Vercel)
3. **Testar localmente** para comparar
4. **Reportar problemas** com detalhes

---

## 📞 SUPORTE

### **Logs e Debugging**

**Railway Logs:**
```bash
railway logs
```

**Vercel Logs:**
- Acesse Vercel Dashboard > Projeto > Deployments > Logs

**Banco de Dados:**
```bash
# Ver últimos erros
SELECT * FROM audit_log WHERE action LIKE '%error%' ORDER BY created_at DESC LIMIT 10;
```

---

## ✅ RESUMO

**URLs:**
- **Frontend:** https://dentcare-5lvot832y-dent-care-pro.vercel.app
- **Login:** https://dentcare-5lvot832y-dent-care-pro.vercel.app/login
- **Backend:** https://web-production-1be3.up.railway.app

**Credenciais:**
- **Email:** admin@dentcarepro.com
- **Senha:** Admin@123

**Tempo de Deploy:**
- Aguardar **5-10 minutos** após push

**Status:**
- ✅ Código commitado e pushed
- ✅ Deploy automático acionado
- ⏳ Aguardando conclusão dos deploys

---

**Desenvolvido com ❤️ para DentCarePRO v8**

**Data:** 28 de Outubro de 2025  
**Versão:** 1.0  
**Status:** 🚀 Deploy em Andamento
