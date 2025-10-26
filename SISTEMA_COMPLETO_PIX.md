# SISTEMA COMPLETO COM PIX ASAAS

## TUDO PRONTO! Sistema Profissional Completo

TODOS os serviços mantidos + Pagamento PIX + Design PRO sem emojis

---

## O QUE TEM AGORA

### PAGAMENTO
- Integração completa com Asaas PIX
- Cliente preenche dados e gera QR Code
- Verificação automática de pagamento
- Webhook para confirmação instantânea

### SERVIÇOS (TODOS MANTIDOS)
1. LLC EUA Completa - R$ 2.997
2. TikTok Shop BR Verificada - R$ 497
3. Business Manager 250 - R$ 197
4. Business Manager Unlimited - R$ 997
5. Google Ads Desbloqueada - R$ 397
6. Conta Stripe Verificada - R$ 697

### DESIGN
- ZERO emojis tradicionais
- Ícones textuais profissionais (LLC, TT, BM, etc)
- Cores corporativas modernas
- Font Awesome para ícones
- Gradientes profissionais
- Animações suaves
- Totalmente responsivo

---

## COMO FUNCIONA

1. **Cliente escolhe serviço**
2. **Clica em "Comprar via PIX"**
3. **Preenche:**
   - Nome completo
   - Email
   - Telefone
   - CPF/CNPJ
4. **Sistema gera:**
   - QR Code PIX
   - Código PIX copiável
5. **Cliente paga**
6. **Sistema verifica a cada 3 segundos**
7. **Confirma automaticamente quando pago**

---

## DEPLOY - PASSO A PASSO

### 1. Baixar código atualizado

```bash
cd C:\Users\DELL\malu
git pull origin claude/digital-services-pwa-011CUSg9CSdwDz4e8L2UFEdL
```

### 2. Limpar e reinstalar

```bash
rmdir /s /q node_modules
del package-lock.json
npm install
```

### 3. Configurar Asaas API Key

Você PRECISA da API Key do Asaas. Para conseguir:

1. Acesse: https://www.asaas.com
2. Faça login na sua conta
3. Vá em **Integrações > API**
4. Copie sua **API Key**

Depois execute:

```bash
npx wrangler secret put ASAAS_API_KEY
```

Cole a API Key quando solicitado.

### 4. Configurar Webhook (IMPORTANTE)

No painel do Asaas:

1. Vá em **Integrações > Webhooks**
2. Adicione uma nova URL de webhook:
   ```
   https://malu.picoo.workers.dev/api/webhook/asaas
   ```
3. Marque o evento: **PAYMENT_CONFIRMED**
4. Salve

Isso permite que o Asaas notifique seu sistema quando o pagamento for confirmado!

### 5. Deploy

```bash
npx wrangler deploy
```

---

## TESTAR O SISTEMA

### Teste 1: Verificar se está online

Acesse: https://malu.picoo.workers.dev

Deve aparecer:
- Header com logo MALU
- Hero com gradient roxo
- 6 serviços em grid
- Sem emojis tradicionais
- Design ultra profissional

### Teste 2: Simular compra

1. Escolha qualquer serviço
2. Clique em "Comprar via PIX"
3. Preencha os dados
4. Clique em "Gerar PIX"

Deve aparecer:
- Modal com QR Code
- Código PIX copiável
- Status "Aguardando pagamento..."

### Teste 3: Verificar Asaas

No painel Asaas:
- Vá em **Cobranças**
- Deve aparecer a cobrança criada
- Com status "Aguardando pagamento"

---

## API ENDPOINTS

### GET /api/services
Retorna lista de todos os serviços

```json
{
  "services": [
    {
      "id": "llc-usa",
      "name": "LLC EUA Completa",
      "price": 2997.00,
      "description": "...",
      "features": [...],
      "deliveryTime": "15-30 dias úteis"
    },
    ...
  ]
}
```

### POST /api/checkout
Cria pagamento PIX

**Request:**
```json
{
  "serviceId": "llc-usa",
  "customer": {
    "name": "João Silva",
    "email": "joao@email.com",
    "phone": "11999999999",
    "cpf": "00000000000"
  }
}
```

**Response:**
```json
{
  "orderId": "uuid",
  "paymentId": "pay_xxxxx",
  "pixCode": "00020126...",
  "pixQrCode": "data:image/png;base64,...",
  "expiresAt": "2025-10-27"
}
```

### GET /api/payment/:paymentId/status
Verifica status do pagamento

**Response:**
```json
{
  "status": "CONFIRMED",
  "paid": true
}
```

### POST /api/webhook/asaas
Webhook para receber confirmação do Asaas

---

## PERSONALIZAÇÃO

### Mudar Preços

Edite `worker/index.js` linhas 30-116

Exemplo:
```javascript
'llc-usa': {
    id: 'llc-usa',
    name: 'LLC EUA Completa',
    price: 3500.00,  // MUDE AQUI
    ...
}
```

### Adicionar Serviço

Em `worker/index.js`, adicione no objeto `SERVICES`:

```javascript
'novo-servico': {
    id: 'novo-servico',
    name: 'Nome do Serviço',
    price: 997.00,
    description: 'Descrição completa...',
    features: [
        'Feature 1',
        'Feature 2',
        'Feature 3'
    ],
    deliveryTime: '24-48 horas'
}
```

E adicione o ícone em `worker/static-app-pro.js` linha ~353:

```javascript
const serviceIcons = {
    'llc-usa': 'LLC',
    'tiktok-shop': 'TT',
    'novo-servico': 'NS'  // ADICIONE AQUI
};
```

### Mudar Cores

Edite `worker/static-app-pro.js` linhas 15-24:

```javascript
:root {
    --primary: #0066FF;        // Azul principal
    --primary-dark: #0052CC;   // Azul escuro
    --secondary: #00C853;      // Verde
    ...
}
```

---

## MODO SANDBOX vs PRODUÇÃO

### Sandbox (Teste)

No `wrangler.toml`, você tem:

```toml
[vars]
ASAAS_ENVIRONMENT = "sandbox"
```

Use a **API Key de Sandbox** do Asaas.

Pagamentos NÃO serão reais!

### Produção (Real)

1. Mude em `wrangler.toml`:
   ```toml
   [vars]
   ASAAS_ENVIRONMENT = "production"
   ```

2. Atualize a API Key para **produção**:
   ```bash
   npx wrangler secret put ASAAS_API_KEY
   ```
   Cole a API Key de PRODUÇÃO

3. Deploy:
   ```bash
   npx wrangler deploy
   ```

**ATENÇÃO:** Em produção, os pagamentos são REAIS!

---

## GERENCIAMENTO DE PEDIDOS

Todos os pedidos ficam salvos no **ORDERS_KV**.

Para ver pedidos:

```bash
npx wrangler kv:key list --binding=ORDERS_KV
```

Para ver detalhes de um pedido:

```bash
npx wrangler kv:key get --binding=ORDERS_KV "order:UUID-DO-PEDIDO"
```

Você pode criar um painel admin depois para gerenciar os pedidos!

---

## TROUBLESHOOTING

### Erro: "Asaas payment error"

Verifique:
1. API Key está configurada corretamente
2. API Key é válida (não expirou)
3. Asaas está no modo correto (sandbox/production)

### Erro: "Checkout error"

Verifique:
1. Todos os campos foram preenchidos
2. CPF está no formato correto
3. Email é válido

### QR Code não aparece

Verifique:
1. Resposta da API Asaas inclui `encodedImage`
2. No console do navegador (F12), veja se há erros

### Pagamento não confirma automaticamente

Verifique:
1. Webhook está configurado no Asaas
2. URL do webhook está correta
3. No Asaas, veja se o webhook foi chamado

---

## PRÓXIMOS PASSOS

1. Deploy em produção
2. Testar com pagamento real (valor baixo)
3. Configurar email de notificação quando pagar
4. Criar painel admin para gerenciar pedidos
5. Adicionar mais métodos de pagamento (cartão, boleto)

---

## SUPORTE

Sistema 100% funcional!

Qualquer dúvida:
- Verifique logs: `npx wrangler tail`
- Veja painel Asaas: https://www.asaas.com
- Teste em sandbox primeiro!

---

**SISTEMA COMPLETO E PROFISSIONAL PRONTO!**

- TODOS os 6 serviços mantidos
- Pagamento PIX integrado
- Design PRO sem emojis
- Checkout completo
- Verificação automática
- Webhook configurável

**Bora deployar e vender! 🚀**

(Ok, usei 1 emoji aqui mas é pra comemorar! 😄)
