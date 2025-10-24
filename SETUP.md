# Guia de Configuração - Malu Digital Services

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter:

1. **Conta Cloudflare**
   - Plano Workers (Free ou Paid)
   - KV Storage habilitado
   - Domain configurado (opcional para produção)

2. **Conta Asaas**
   - Conta criada em https://www.asaas.com/
   - API Key gerada
   - Webhook configurado

3. **Ferramentas de Desenvolvimento**
   - Node.js 18+ instalado
   - Git instalado
   - Editor de código (VS Code recomendado)

## 🚀 Passo a Passo

### 1. Setup Inicial

```bash
# Clonar repositório
git clone <repository-url>
cd malu

# Instalar dependências
npm install

# Fazer login na Cloudflare
npx wrangler login
```

### 2. Configurar KV Namespaces

```bash
# Criar namespace para usuários
npx wrangler kv:namespace create "USERS_KV"
# Output: id = "abc123..."

# Criar namespace para pedidos
npx wrangler kv:namespace create "ORDERS_KV"
# Output: id = "def456..."

# Criar namespaces de preview (para desenvolvimento)
npx wrangler kv:namespace create "USERS_KV" --preview
npx wrangler kv:namespace create "ORDERS_KV" --preview
```

Copie os IDs gerados e atualize `wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "USERS_KV"
id = "abc123..."  # Cole o ID real aqui
preview_id = "xyz789..."

[[kv_namespaces]]
binding = "ORDERS_KV"
id = "def456..."  # Cole o ID real aqui
preview_id = "uvw012..."
```

### 3. Configurar Asaas

#### 3.1 Obter API Key

1. Acesse https://www.asaas.com/
2. Faça login na sua conta
3. Vá em **Integrações > API**
4. Copie sua API Key

#### 3.2 Configurar Secrets

```bash
# Adicionar API Key do Asaas
npx wrangler secret put ASAAS_API_KEY
# Cole a API Key quando solicitado

# Adicionar JWT Secret (gere uma string aleatória segura)
npx wrangler secret put JWT_SECRET
# Cole uma string secreta quando solicitado
```

#### 3.3 Configurar Webhook

1. No Asaas, vá em **Configurações > Webhooks**
2. Adicione a URL: `https://seu-worker.workers.dev/api/payments/webhook/asaas`
3. Selecione eventos:
   - PAYMENT_CONFIRMED
   - PAYMENT_RECEIVED
   - PAYMENT_OVERDUE

### 4. Configurar Ícones do PWA

Os ícones do PWA devem estar em `/public/assets/`. Você pode gerar em https://realfavicongenerator.net/

Tamanhos necessários:
- 72x72
- 96x96
- 128x128
- 144x144
- 152x152
- 192x192
- 384x384
- 512x512

### 5. Deploy

```bash
# Deploy para produção
npm run deploy

# Ou com ambiente específico
npx wrangler publish --env production
```

### 6. Verificar Deploy

```bash
# Ver logs em tempo real
npm run tail

# Ou
npx wrangler tail
```

Acesse sua aplicação em: `https://seu-worker.workers.dev`

## 🔧 Configurações Adicionais

### Domínio Customizado

1. No painel da Cloudflare, vá em **Workers & Pages**
2. Selecione seu Worker
3. Vá em **Triggers > Custom Domains**
4. Adicione seu domínio (ex: app.malu.digital)

### Variáveis de Ambiente

Edite `wrangler.toml` para adicionar variáveis:

```toml
[vars]
ASAAS_ENVIRONMENT = "production"
APP_NAME = "Malu Digital"
SUPPORT_EMAIL = "suporte@malu.digital"
```

### Criar Usuário Admin

Execute este script no Wrangler CLI:

```bash
npx wrangler kv:key put --binding=USERS_KV "user:admin@malu.digital" "admin-user-id"
npx wrangler kv:key put --binding=USERS_KV "user:admin-user-id" '{
  "id": "admin-user-id",
  "name": "Admin",
  "email": "admin@malu.digital",
  "password": "hash-da-senha",
  "credits": 999999,
  "isAdmin": true,
  "createdAt": "2024-01-01T00:00:00.000Z"
}'
```

## 📊 Monitoramento

### Cloudflare Dashboard

1. Workers & Pages > seu-worker
2. Métricas disponíveis:
   - Requests por segundo
   - Erros
   - Latência
   - CPU time

### Logs

```bash
# Ver logs em tempo real
npx wrangler tail

# Filtrar por status
npx wrangler tail --status error
```

## 🧪 Testes

### Testar Localmente

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Acesse http://localhost:8787
```

### Testar Pagamentos (Sandbox)

Use os cartões de teste do Asaas:

- **Aprovado**:
  - Número: 5162 3060 8285 9090
  - CVV: 318
  - Validade: qualquer data futura

- **Recusado**:
  - Número: 5105 1051 0510 5100
  - CVV: qualquer
  - Validade: qualquer data futura

### Testar PIX (Sandbox)

No ambiente sandbox, o PIX é aprovado automaticamente após 10 segundos.

## 🔐 Segurança

### Checklist de Segurança

- [ ] API Keys armazenadas como secrets (não em código)
- [ ] CORS configurado corretamente
- [ ] JWT secret forte e aleatório
- [ ] Validação de entrada em todas as rotas
- [ ] Rate limiting configurado (Cloudflare)
- [ ] HTTPS enforced
- [ ] Passwords hasheados
- [ ] Autorização verificada em rotas admin

### Rate Limiting

Configure no Cloudflare Dashboard:
1. Security > WAF
2. Rate limiting rules
3. Criar regra para API:
   - Path: `/api/*`
   - Requests: 100 per minute
   - Action: Block

## 🚨 Troubleshooting

### Erro: "KV namespace not found"

```bash
# Verificar namespaces
npx wrangler kv:namespace list

# Recriar se necessário
npx wrangler kv:namespace create "USERS_KV"
```

### Erro: "Unauthorized" em todas as rotas

```bash
# Verificar se JWT_SECRET está configurado
npx wrangler secret list

# Se não estiver, adicionar
npx wrangler secret put JWT_SECRET
```

### Service Worker não atualiza

1. Incrementar versão em `sw.js`:
```javascript
const CACHE_NAME = 'malu-digital-v1.0.1'; // Incrementar versão
```

2. Limpar cache do navegador (Ctrl+Shift+Delete)

### Pagamentos não confirmam

1. Verificar webhook no Asaas
2. Checar logs: `npx wrangler tail`
3. Verificar se ASAAS_API_KEY está correto

## 📝 Notas Importantes

1. **Ambiente Sandbox**: Use para testes, não processa pagamentos reais
2. **Ambiente Production**: Requer aprovação da Asaas para processar pagamentos
3. **KV Limits**:
   - Free tier: 100.000 leituras/dia
   - Paid: ilimitado
4. **Worker Limits**:
   - Free tier: 100.000 requests/dia
   - Paid: ilimitado

## 📞 Suporte

Se encontrar problemas:

1. Verificar logs: `npx wrangler tail`
2. Consultar documentação Cloudflare: https://developers.cloudflare.com/workers/
3. Consultar documentação Asaas: https://docs.asaas.com/
4. Abrir issue no repositório

## ✅ Checklist de Deploy

- [ ] KV namespaces criados e configurados
- [ ] Secrets configurados (ASAAS_API_KEY, JWT_SECRET)
- [ ] Ícones do PWA adicionados
- [ ] Domain configurado (se aplicável)
- [ ] Webhook Asaas configurado
- [ ] Usuário admin criado
- [ ] Testes de pagamento realizados
- [ ] Rate limiting configurado
- [ ] Monitoramento ativo
- [ ] Backup/export dos dados (se migração)

## 🎉 Pronto!

Sua aplicação Malu Digital Services está configurada e pronta para uso!

Acesse: `https://seu-worker.workers.dev` ou seu domínio customizado.
