# 🚨 INSTRUÇÕES URGENTES - ERRO 500/403

## ⚠️ PROBLEMA IDENTIFICADO

O Worker está retornando erro **403 Access Denied** porque **o código corrigido NÃO foi deployado ainda**.

Todas as correções foram feitas e commitadas no Git, mas você precisa fazer o deploy para que as mudanças entrem em produção.

---

## ✅ SOLUÇÃO - EXECUTE ESTES COMANDOS

### Opção 1: Script Automático (RECOMENDADO)

```bash
cd /home/user/malu
./deploy.sh
```

### Opção 2: Passo a Passo Manual

```bash
# 1. Ir para o diretório do projeto
cd /home/user/malu

# 2. Baixar as correções do Git
git pull origin claude/digital-services-pwa-011CUSg9CSdwDz4e8L2UFEdL

# 3. Limpar dependências antigas
rm -rf node_modules package-lock.json

# 4. Instalar dependências limpas
npm install

# 5. Deploy para Cloudflare
wrangler deploy
```

---

## 🔍 VERIFICAÇÃO

Após o deploy, teste:

```bash
# Teste de health check
curl https://malu.picoo.workers.dev/api/health

# Deve retornar:
# {"status":"ok","timestamp":"2025-10-26T..."}
```

```bash
# Teste de registro
curl -X POST https://malu.picoo.workers.dev/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'

# Deve retornar:
# {
#   "message": "User registered successfully",
#   "token": "uuid-aqui",
#   "user": {...}
# }
```

---

## 📊 MONITORAMENTO

Para ver logs em tempo real durante os testes:

```bash
wrangler tail --format pretty
```

Deixe este comando rodando em um terminal separado enquanto testa o aplicativo.

---

## ❓ SE AINDA DER ERRO

1. **Verificar autenticação:**
   ```bash
   wrangler whoami
   ```
   Se não estiver autenticado:
   ```bash
   wrangler login
   ```

2. **Verificar secrets configurados:**
   ```bash
   wrangler secret list
   ```
   Deve mostrar: `JWT_SECRET` e `ASAAS_API_KEY`

3. **Verificar KV namespaces:**
   ```bash
   wrangler kv:namespace list
   ```
   Deve mostrar os namespaces USERS_KV e ORDERS_KV

---

## 📋 RESUMO DAS CORREÇÕES APLICADAS

✅ **Fix 1:** Desabilitada minificação agressiva (wrangler.toml: minify = false)
✅ **Fix 2:** Corrigida sintaxe crypto.subtle.digest({ name: 'SHA-256' })
✅ **Fix 3:** Adicionadas definições TypeScript (worker/types.d.ts)
✅ **Fix 4:** Runtime check para __STATIC_CONTENT_MANIFEST
✅ **Fix 5:** Prevenção de hoisting de dependências (.npmrc)
✅ **Fix 6:** Token UUID simplificado sem JWT

Todas essas correções estão no Git, mas **PRECISAM SER DEPLOYADAS** para funcionarem!

---

## 🎯 PRÓXIMO PASSO

**EXECUTE AGORA:**

```bash
cd /home/user/malu && ./deploy.sh
```

Ou manualmente execute `wrangler deploy` após `npm install`.

---

⚡️ **IMPORTANTE:** Sem o deploy, o Worker em produção continua com o código antigo e quebrado!
