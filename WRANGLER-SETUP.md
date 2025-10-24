# 🚀 GUIA RÁPIDO - WRANGLER CLI SETUP

## 1️⃣ INSTALAR WRANGLER

### Opção 1: Global (Recomendado)
```bash
npm install -g wrangler
```

### Opção 2: No Projeto
```bash
npm install wrangler --save-dev
```

## 2️⃣ LOGIN NO CLOUDFLARE

### Comando para Login
```bash
wrangler login
```

**O que vai acontecer:**
1. ✅ Abre automaticamente o navegador
2. ✅ Pede para autorizar Wrangler
3. ✅ Clique em "Allow" / "Autorizar"
4. ✅ Pronto! Você está logado

### Se o navegador não abrir automaticamente:
```bash
wrangler login --browser=false
```
Ele vai dar um link que você copia e cola no navegador.

## 3️⃣ VERIFICAR LOGIN

```bash
wrangler whoami
```

**Deve mostrar:**
```
👋 You are logged in with an OAuth Token, associated with the email <seu-email@cloudflare.com>
```

## 4️⃣ CRIAR KV NAMESPACES

### Criar Users KV
```bash
wrangler kv:namespace create "USERS_KV"
```

**Output:**
```
✨ Creating namespace with title "malu-digital-services-USERS_KV"
✨ Success!
Add the following to your wrangler.toml:
[[kv_namespaces]]
binding = "USERS_KV"
id = "abc123def456..." ← COPIE ESTE ID
```

### Criar Orders KV
```bash
wrangler kv:namespace create "ORDERS_KV"
```

**Output:**
```
✨ Creating namespace with title "malu-digital-services-ORDERS_KV"
✨ Success!
Add the following to your wrangler.toml:
[[kv_namespaces]]
binding = "ORDERS_KV"
id = "xyz789uvw012..." ← COPIE ESTE ID
```

### Criar Preview Namespaces (para dev)
```bash
wrangler kv:namespace create "USERS_KV" --preview
wrangler kv:namespace create "ORDERS_KV" --preview
```

## 5️⃣ ATUALIZAR WRANGLER.TOML

Edite o arquivo `wrangler.toml` e cole os IDs:

```toml
[[kv_namespaces]]
binding = "USERS_KV"
id = "abc123def456..."  ← Cole aqui o ID do USERS_KV
preview_id = "preview123..." ← Cole aqui o Preview ID

[[kv_namespaces]]
binding = "ORDERS_KV"
id = "xyz789uvw012..." ← Cole aqui o ID do ORDERS_KV
preview_id = "preview456..." ← Cole aqui o Preview ID
```

## 6️⃣ CONFIGURAR SECRETS

### API Key do Asaas
```bash
wrangler secret put ASAAS_API_KEY
```
**Pergunta:** Enter a secret value:
**Você:** Cola a API Key do Asaas e pressiona Enter

### JWT Secret
```bash
wrangler secret put JWT_SECRET
```
**Pergunta:** Enter a secret value:
**Você:** Cola uma string aleatória forte (32+ caracteres)

**Exemplo de JWT Secret:**
```
malu-jwt-secret-super-forte-12345-abcdef-xyz789
```

## 7️⃣ TESTAR LOCALMENTE

```bash
wrangler dev
```

**Deve abrir em:** http://localhost:8787

## 8️⃣ FAZER DEPLOY

```bash
wrangler publish
```

**Output esperado:**
```
✨ Built successfully!
✨ Successfully published your script to
   https://malu-digital-services.seu-usuario.workers.dev
```

## 🎯 COMANDOS ÚTEIS

### Ver logs em tempo real
```bash
wrangler tail
```

### Ver apenas erros
```bash
wrangler tail --status error
```

### Listar Workers
```bash
wrangler list
```

### Deletar Worker
```bash
wrangler delete
```

### Ver KV namespaces
```bash
wrangler kv:namespace list
```

### Listar chaves do KV
```bash
wrangler kv:key list --binding=USERS_KV
```

### Ver valor de uma chave
```bash
wrangler kv:key get --binding=USERS_KV "user:email:teste@email.com"
```

### Adicionar chave no KV
```bash
wrangler kv:key put --binding=USERS_KV "chave" "valor"
```

## ⚠️ TROUBLESHOOTING

### Erro: "Not logged in"
```bash
wrangler logout
wrangler login
```

### Erro: "KV namespace not found"
```bash
# Verificar namespaces
wrangler kv:namespace list

# Recriar se necessário
wrangler kv:namespace create "USERS_KV"
```

### Erro: "Unauthorized"
```bash
# Verificar se está na conta certa
wrangler whoami

# Re-login
wrangler logout
wrangler login
```

### Erro: "Secret not found"
```bash
# Listar secrets
wrangler secret list

# Adicionar novamente
wrangler secret put ASAAS_API_KEY
wrangler secret put JWT_SECRET
```

## 📝 CHECKLIST COMPLETO

- [ ] ✅ Wrangler instalado (`npm install -g wrangler`)
- [ ] ✅ Login feito (`wrangler login`)
- [ ] ✅ Login verificado (`wrangler whoami`)
- [ ] ✅ USERS_KV criado
- [ ] ✅ ORDERS_KV criado
- [ ] ✅ Preview namespaces criados
- [ ] ✅ IDs copiados para wrangler.toml
- [ ] ✅ ASAAS_API_KEY configurado
- [ ] ✅ JWT_SECRET configurado
- [ ] ✅ Testado local (`wrangler dev`)
- [ ] ✅ Deploy feito (`wrangler publish`)
- [ ] ✅ URL funciona

## 🎉 PRONTO!

Agora você tem:
- ✅ Wrangler CLI configurado
- ✅ Login no Cloudflare
- ✅ KV Namespaces criados
- ✅ Secrets configurados
- ✅ Deploy funcionando

**Acesse seu app em:**
`https://malu-digital-services.seu-usuario.workers.dev`

---

## 🆘 PRECISA DE AJUDA?

1. Ver documentação oficial: https://developers.cloudflare.com/workers/wrangler/
2. Verificar status: https://www.cloudflarestatus.com/
3. Suporte: https://community.cloudflare.com/

---

**PRÓXIMO PASSO:** Configurar domínio customizado (opcional)
