# ✅ CHECKLIST DE DEPLOY - PRODUÇÃO

## PRÉ-REQUISITOS

### Contas e Credenciais
- [ ] Conta Cloudflare criada
- [ ] Conta Asaas criada e aprovada
- [ ] API Key do Asaas obtida
- [ ] Domínio registrado (opcional)

### Ambiente Local
- [ ] Node.js 18+ instalado
- [ ] Git configurado
- [ ] Wrangler CLI instalado (`npm install -g wrangler`)

## FASE 1: CONFIGURAÇÃO INICIAL

### 1.1 Clone e Install
```bash
- [ ] git clone <repository-url>
- [ ] cd malu
- [ ] npm install
```

### 1.2 Cloudflare Login
```bash
- [ ] npx wrangler login
- [ ] Navegador abre automaticamente
- [ ] Autorizar acesso
```

### 1.3 Criar KV Namespaces
```bash
- [ ] npx wrangler kv:namespace create "USERS_KV"
- [ ] Copiar ID: _________________
- [ ] npx wrangler kv:namespace create "ORDERS_KV"
- [ ] Copiar ID: _________________
- [ ] npx wrangler kv:namespace create "USERS_KV" --preview
- [ ] Copiar Preview ID: _________________
- [ ] npx wrangler kv:namespace create "ORDERS_KV" --preview
- [ ] Copiar Preview ID: _________________
```

### 1.4 Atualizar wrangler.toml
```toml
- [ ] Colar IDs dos KV namespaces
- [ ] Verificar nome do worker
- [ ] Configurar domínio (se houver)
```

### 1.5 Configurar Secrets
```bash
- [ ] npx wrangler secret put ASAAS_API_KEY
- [ ] Colar API Key do Asaas
- [ ] npx wrangler secret put JWT_SECRET
- [ ] Colar secret aleatório forte (min 32 chars)
```

## FASE 2: ASSETS E CONTEÚDO

### 2.1 Ícones PWA
- [ ] Gerar ícones em https://realfavicongenerator.net/
- [ ] Baixar arquivo .zip
- [ ] Extrair para /public/assets/
- [ ] Verificar que existem:
  - [ ] icon-72.png
  - [ ] icon-96.png
  - [ ] icon-128.png
  - [ ] icon-144.png
  - [ ] icon-152.png
  - [ ] icon-192.png
  - [ ] icon-384.png
  - [ ] icon-512.png

### 2.2 Screenshot do App
- [ ] Capturar screenshot da tela inicial
- [ ] Renomear para screenshot1.png
- [ ] Colocar em /public/assets/
- [ ] Tamanho mínimo: 540x720px

### 2.3 Personalização
- [ ] Atualizar nome da empresa em config.js
- [ ] Atualizar cores (se necessário)
- [ ] Atualizar emails de contato
- [ ] Atualizar telefones de contato

## FASE 3: ASAAS CONFIGURATION

### 3.1 Ambiente Asaas
- [ ] Decidir: Sandbox ou Produção
- [ ] Atualizar ASAAS_ENVIRONMENT em wrangler.toml
- [ ] Verificar API Key correspondente

### 3.2 Webhook Configuration
- [ ] Acessar Asaas Dashboard
- [ ] Ir em Configurações > Webhooks
- [ ] Adicionar URL: `https://seu-worker.workers.dev/api/payments/webhook/asaas`
- [ ] Selecionar eventos:
  - [ ] PAYMENT_CONFIRMED
  - [ ] PAYMENT_RECEIVED
  - [ ] PAYMENT_OVERDUE
- [ ] Salvar webhook

### 3.3 Testar Integração Asaas
- [ ] Fazer chamada de teste à API
- [ ] Verificar resposta 200 OK
- [ ] Confirmar webhook funciona

## FASE 4: PRIMEIRO DEPLOY

### 4.1 Deploy Teste
```bash
- [ ] npm run deploy
- [ ] Aguardar finalização
- [ ] Anotar URL: _________________
```

### 4.2 Verificação Inicial
- [ ] Acessar URL do worker
- [ ] Verificar que PWA carrega
- [ ] Testar registro de usuário
- [ ] Verificar KV Storage funcionando

### 4.3 Teste de Funcionalidades
- [ ] Login funciona
- [ ] Logout funciona
- [ ] Créditos aparecem
- [ ] Serviços carregam
- [ ] Formulários abrem

## FASE 5: DOMÍNIO CUSTOMIZADO (OPCIONAL)

### 5.1 Configurar DNS
- [ ] Adicionar domínio à Cloudflare
- [ ] Configurar DNS Records
- [ ] Aguardar propagação (até 24h)

### 5.2 Workers Route
- [ ] Workers & Pages > seu-worker
- [ ] Triggers > Custom Domains
- [ ] Add Custom Domain
- [ ] Inserir: app.seudominio.com
- [ ] Aguardar SSL provision (alguns minutos)

### 5.3 Atualizar Configurações
- [ ] Atualizar webhook do Asaas
- [ ] Atualizar manifest.json (start_url)
- [ ] Deploy novamente

## FASE 6: CRIAR USUÁRIO ADMIN

### 6.1 Gerar Hash de Senha
```javascript
// Execute no console do navegador ou Node.js
const crypto = require('crypto');
const password = 'SUA_SENHA_ADMIN';
const hash = crypto.createHash('sha256').update(password).digest('hex');
console.log(hash);
```

### 6.2 Criar Admin via Wrangler
```bash
- [ ] npx wrangler kv:key put --binding=USERS_KV "user:email:admin@malu.digital" "admin-user-id"
- [ ] npx wrangler kv:key put --binding=USERS_KV "user:admin-user-id" '<JSON>'
```

JSON do Admin:
```json
{
  "id": "admin-user-id",
  "name": "Admin",
  "email": "admin@malu.digital",
  "password": "HASH_GERADO_ACIMA",
  "credits": 999999,
  "isAdmin": true,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### 6.3 Testar Login Admin
- [ ] Acessar /admin
- [ ] Fazer login com credenciais admin
- [ ] Verificar painel carrega

## FASE 7: TESTES COMPLETOS

### 7.1 Fluxo Completo do Usuário
- [ ] Registrar novo usuário
- [ ] Fazer login
- [ ] Ver catálogo de serviços
- [ ] Tentar comprar serviço sem créditos
- [ ] Redireciona para compra de créditos
- [ ] Selecionar pacote
- [ ] Testar pagamento PIX (sandbox)
- [ ] Verificar créditos adicionados
- [ ] Comprar serviço
- [ ] Preencher formulário
- [ ] Verificar pedido criado
- [ ] Ver pedidos na lista

### 7.2 Painel Admin
- [ ] Acessar /admin
- [ ] Ver dashboard com stats
- [ ] Ver lista de pedidos
- [ ] Atualizar status de pedido
- [ ] Verificar notificações

### 7.3 PWA
- [ ] Instalar PWA no mobile
- [ ] Verificar ícone na home
- [ ] Abrir como app standalone
- [ ] Testar offline (Service Worker)
- [ ] Verificar notificações funcionam

### 7.4 Dispositivos
- [ ] iPhone/iPad Safari
- [ ] Android Chrome
- [ ] Desktop Chrome
- [ ] Desktop Firefox
- [ ] Desktop Safari

### 7.5 Performance
- [ ] Lighthouse Score > 90
- [ ] Page Load < 2s
- [ ] First Paint < 1s
- [ ] Sem erros no Console

## FASE 8: SEGURANÇA

### 8.1 Cloudflare Security
- [ ] Security > WAF
- [ ] Criar Rate Limiting Rule
  - [ ] Path: /api/*
  - [ ] Limit: 100 req/min
  - [ ] Action: Block
- [ ] HTTPS Only
- [ ] Bot Fight Mode: On

### 8.2 Secrets Management
- [ ] Verificar secrets não estão no código
- [ ] .env no .gitignore
- [ ] Secrets configurados via Wrangler

### 8.3 CORS
- [ ] CORS configurado corretamente
- [ ] Apenas domínios permitidos

## FASE 9: MONITORAMENTO

### 9.1 Cloudflare Analytics
- [ ] Workers & Pages > Analytics
- [ ] Verificar métricas
- [ ] Configurar alertas

### 9.2 Error Monitoring
- [ ] Verificar logs: `npx wrangler tail`
- [ ] Configurar alertas de erro
- [ ] Testar error reporting

### 9.3 Uptime Monitoring
- [ ] Configurar UptimeRobot ou similar
- [ ] Monitor: https://seu-dominio.com/api/health
- [ ] Interval: 5 minutos
- [ ] Alert: Email

## FASE 10: BACKUP

### 10.1 Código
- [ ] Repositório Git atualizado
- [ ] Tags de versão criadas
- [ ] README atualizado

### 10.2 Dados
- [ ] Exportar KV data (se necessário)
- [ ] Backup de configurações
- [ ] Documentar procedures

## FASE 11: DOCUMENTAÇÃO

### 11.1 Documentação Interna
- [ ] Credenciais documentadas (seguro)
- [ ] Processos documentados
- [ ] Runbooks criados

### 11.2 Treinamento da Equipe
- [ ] Equipe treinada no painel admin
- [ ] Processos de atendimento definidos
- [ ] SLAs estabelecidos

## FASE 12: LANÇAMENTO

### 12.1 Comunicação
- [ ] Anúncio preparado
- [ ] Redes sociais atualizadas
- [ ] Email marketing pronto

### 12.2 Suporte
- [ ] Canais de suporte ativos
- [ ] WhatsApp respondendo
- [ ] Email configurado
- [ ] FAQ publicada

### 12.3 Go Live
- [ ] Mudar Asaas para Produção
- [ ] Atualizar API Key de produção
- [ ] Deploy final
- [ ] Anunciar lançamento

## MANUTENÇÃO CONTÍNUA

### Diário
- [ ] Verificar pedidos pendentes
- [ ] Responder suporte
- [ ] Monitorar erros

### Semanal
- [ ] Revisar analytics
- [ ] Verificar performance
- [ ] Backup de dados

### Mensal
- [ ] Atualizar dependências
- [ ] Revisar segurança
- [ ] Análise de métricas

---

## COMANDOS ÚTEIS

```bash
# Ver logs em tempo real
npx wrangler tail

# Listar KV keys
npx wrangler kv:key list --binding=USERS_KV

# Get KV value
npx wrangler kv:key get --binding=USERS_KV "key"

# Put KV value
npx wrangler kv:key put --binding=USERS_KV "key" "value"

# Deploy
npm run deploy

# Test local
npm run dev
```

## EMERGÊNCIA

### Se algo der errado:

1. **Reverter Deploy**
```bash
git checkout <previous-commit>
npm run deploy
```

2. **Ver Logs**
```bash
npx wrangler tail --status error
```

3. **Limpar Cache**
```bash
# Cloudflare Dashboard > Caching > Purge Everything
```

---

**✅ CHECKLIST COMPLETO**
**DEPLOY 100% SEGURO**
**PRONTO PARA PRODUÇÃO**
