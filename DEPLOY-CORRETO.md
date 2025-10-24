# 🚨 ATENÇÃO: DEPLOY CORRETO

## ❌ ERRO COMUM

Você está tentando fazer deploy via **Cloudflare Pages**, mas este é um projeto **Cloudflare Workers**!

**Cloudflare Pages** = Sites estáticos (React, Vue, etc)
**Cloudflare Workers** = Backend serverless (nosso caso)

## ✅ COMO FAZER O DEPLOY CORRETO

### OPÇÃO 1: VIA WRANGLER CLI (RECOMENDADO)

#### 1. Clone o Repositório
```bash
git clone https://github.com/zeroblack011/malu.git
cd malu
```

#### 2. Instale Dependências
```bash
npm install
```

#### 3. Instale Wrangler Global
```bash
npm install -g wrangler
```

#### 4. Faça Login
```bash
wrangler login
```

Isso vai abrir o navegador para você autorizar.

#### 5. Crie os KV Namespaces
```bash
# Users KV
wrangler kv:namespace create "USERS_KV"

# Copie o ID que aparecer, exemplo:
# id = "abc123def456..."

# Orders KV
wrangler kv:namespace create "ORDERS_KV"

# Copie o ID que aparecer
```

#### 6. Atualize wrangler.toml

Edite o arquivo `wrangler.toml` e cole os IDs:

```toml
[[kv_namespaces]]
binding = "USERS_KV"
id = "cole-aqui-o-id-do-users"  # ← Cole o ID aqui

[[kv_namespaces]]
binding = "ORDERS_KV"
id = "cole-aqui-o-id-do-orders"  # ← Cole o ID aqui
```

#### 7. Configure os Secrets

```bash
# API Key do Asaas
wrangler secret put ASAAS_API_KEY
# Cole sua API Key quando perguntar

# JWT Secret
wrangler secret put JWT_SECRET
# Cole uma string aleatória forte (32+ caracteres)
```

**Exemplo de JWT Secret:**
```
malu-super-secret-jwt-key-2024-production-xyz123abc
```

#### 8. Faça o Deploy
```bash
wrangler deploy
```

**OU use o comando npm:**
```bash
npm run deploy
```

#### 9. Pronto! ✅

Você vai ver algo assim:
```
✨ Built successfully!
✨ Successfully published your script to
   https://malu-digital-services.seu-usuario.workers.dev
```

Acesse a URL e seu app estará funcionando! 🎉

---

## OPÇÃO 2: VIA CLOUDFLARE DASHBOARD (Mais Complexo)

Se preferir fazer pelo dashboard:

### 1. Acesse o Dashboard
https://dash.cloudflare.com/

### 2. Vá em Workers & Pages
- No menu lateral: **Workers & Pages**
- Clique em **Create Application**
- Escolha **Create Worker**

### 3. Configure o Worker
- Nome: `malu-digital-services`
- Clique em **Deploy**

### 4. Edite o Worker
- Clique em **Quick Edit**
- **NÃO USE ISSO!** É muito limitado

### 5. Use Wrangler (Volta para Opção 1)
O dashboard não permite fazer deploy completo. Use Wrangler! 😊

---

## 🔧 TROUBLESHOOTING

### Erro: "Missing KV namespace"
```bash
# Criar namespaces novamente
wrangler kv:namespace create "USERS_KV"
wrangler kv:namespace create "ORDERS_KV"

# Atualizar wrangler.toml com os IDs
```

### Erro: "Not authorized"
```bash
# Fazer login novamente
wrangler logout
wrangler login
```

### Erro: "Secret not found"
```bash
# Configurar secrets novamente
wrangler secret put ASAAS_API_KEY
wrangler secret put JWT_SECRET
```

### Deploy falha
```bash
# Ver logs detalhados
wrangler deploy --verbose
```

### Worker não aparece
```bash
# Listar workers
wrangler list

# Verificar se existe
wrangler whoami
```

---

## 📋 CHECKLIST COMPLETO

- [ ] Git clone feito
- [ ] `npm install` executado
- [ ] Wrangler instalado (`npm install -g wrangler`)
- [ ] Login feito (`wrangler login`)
- [ ] USERS_KV criado
- [ ] ORDERS_KV criado
- [ ] IDs copiados para wrangler.toml
- [ ] ASAAS_API_KEY configurado
- [ ] JWT_SECRET configurado
- [ ] Deploy executado (`wrangler deploy`)
- [ ] URL funcionando

---

## 🎯 COMANDO COMPLETO (COPY/PASTE)

Execute isso no terminal (linha por linha):

```bash
# 1. Clone
git clone https://github.com/zeroblack011/malu.git
cd malu

# 2. Install
npm install

# 3. Wrangler global
npm install -g wrangler

# 4. Login
wrangler login

# 5. Create KV (ATENÇÃO: Copie os IDs!)
wrangler kv:namespace create "USERS_KV"
wrangler kv:namespace create "ORDERS_KV"

# 6. PARE AQUI! Edite wrangler.toml com os IDs acima

# 7. Configure secrets
wrangler secret put ASAAS_API_KEY
wrangler secret put JWT_SECRET

# 8. Deploy
wrangler deploy

# 9. Ver logs
wrangler tail
```

---

## ⚡ SCRIPT AUTOMÁTICO

Se preferir, use o script que criei:

```bash
chmod +x QUICK-START.sh
./QUICK-START.sh
```

---

## 🆘 AINDA COM DÚVIDAS?

### Precisa da API Key do Asaas?
1. Acesse: https://www.asaas.com/
2. Faça login
3. Vá em: **Integrações > API**
4. Copie sua API Key

### Como gerar JWT Secret?
Qualquer string aleatória forte. Exemplos:

```bash
# Linux/Mac
openssl rand -hex 32

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Ou invente uma:
malu-jwt-secret-2024-production-abc123xyz789
```

### Cloudflare Pages vs Workers?
- **Pages**: Para sites estáticos (HTML, CSS, JS)
- **Workers**: Para backend/API (nosso caso)

**Este projeto precisa de Workers!**

---

## 🎉 RESULTADO ESPERADO

Após o deploy com sucesso, você terá:

✅ Worker publicado
✅ URL: `https://malu-digital-services.seu-usuario.workers.dev`
✅ KV Storage funcionando
✅ API rodando
✅ PWA acessível

**Acesse a URL e veja seu app funcionando! 🚀**

---

## 📞 PRÓXIMOS PASSOS

Depois do deploy:
1. Acesse a URL do worker
2. Crie uma conta de teste
3. Teste a compra de créditos (modo sandbox)
4. Verifique os pedidos
5. Acesse `/admin` para painel admin

**Tudo pronto para produção!** 💎
