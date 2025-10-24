# Malu Digital Services - PWA Platform

Sistema completo de venda de serviços digitais com sistema de créditos, desenvolvido como Progressive Web App (PWA) com backend em Cloudflare Workers.

## 📋 Sobre o Projeto

Plataforma mobile-first para venda de serviços digitais onde usuários devem comprar créditos antes de acessar os serviços. O sistema foi projetado para alta conversão e inclui processamento manual de pedidos nos bastidores.

### Principais Características

- ✅ **PWA Mobile-First**: Aplicativo instalável com experiência nativa
- 💎 **Sistema de Créditos**: Compra obrigatória de créditos para acessar serviços
- 💳 **Pagamentos**: Integração com Asaas (PIX e Cartão de Crédito)
- 📦 **14 Serviços Disponíveis**: LLC EUA, TikTok Shop, Proxies, e muito mais
- 📝 **Formulários Inteligentes**: Formulários específicos para cada serviço
- 📊 **Painel Administrativo**: Gestão completa de pedidos e usuários
- 🔔 **Notificações**: Sistema de notificações em tempo real
- 🌐 **Cloudflare Workers**: Backend serverless de alta performance

## 🏗️ Arquitetura do Sistema

```
Frontend: PWA (HTML, CSS, JavaScript)
Backend: Cloudflare Workers + KV Storage
Pagamentos: Asaas API
Design: Mobile-first, focado em conversão
```

## 💰 Pacotes de Créditos

| Pacote | Créditos | Valor | Destaque |
|--------|----------|-------|----------|
| Starter | 600 | R$ 497,00 | - |
| Business | 1.400 | R$ 997,00 | ⭐ Mais Popular |
| Premium | 5.000 | R$ 2.997,00 | - |
| Empire | 10.000 | R$ 4.997,00 | - |

## 🛍️ Catálogo de Serviços

### Serviços Empresariais
- **LLC EUA Completa** - 2.997 créditos
- **Business Manager Facebook** - 350 créditos
- **Business Manager TikTok** - 300 créditos
- **Business Manager Google** - 450 créditos

### E-commerce
- **TikTok Shop BR** - 497 créditos
- **TikTok Shop US** - 997 créditos
- **TikTok Shop UK** - 997 créditos
- **Site Ecommerce** - 1.997 créditos
- **Fabricante Dropshipping** - 97 créditos

### Marketing e Desenvolvimento
- **IA Anúncios** - 147 créditos/mês
- **App Personalizado** - 4.997 créditos

### Infraestrutura
- **Proxy Brasil** - 37 créditos/mês
- **Proxy USA** - 65 créditos/mês

### Consultoria
- **Consultoria Jurídica** - 180 créditos/consulta

## 🚀 Instalação e Configuração

### Pré-requisitos

- Node.js 18+
- Conta Cloudflare (com Workers e KV habilitados)
- Conta Asaas (Sandbox ou Produção)

### 1. Clonar o Repositório

```bash
git clone <repository-url>
cd malu
```

### 2. Instalar Dependências

```bash
npm install
```

### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz:

```env
ASAAS_API_KEY=your_asaas_api_key
ASAAS_ENVIRONMENT=sandbox # ou production
JWT_SECRET=your_secret_key_here
```

### 4. Configurar Cloudflare

Edite `wrangler.toml` com suas configurações:

```toml
name = "malu-digital"
main = "worker/index.js"
compatibility_date = "2024-01-01"

[[kv_namespaces]]
binding = "USERS_KV"
id = "your_kv_namespace_id"

[[kv_namespaces]]
binding = "ORDERS_KV"
id = "your_kv_namespace_id"

[vars]
ASAAS_ENVIRONMENT = "sandbox"
```

### 5. Deploy para Cloudflare

```bash
# Fazer login na Cloudflare
npx wrangler login

# Criar KV namespaces
npx wrangler kv:namespace create "USERS_KV"
npx wrangler kv:namespace create "ORDERS_KV"

# Deploy
npx wrangler publish
```

## 📱 Estrutura do Projeto

```
malu/
├── public/                 # Frontend PWA
│   ├── index.html         # Página principal
│   ├── admin/             # Painel administrativo
│   │   └── index.html
│   ├── css/               # Estilos
│   │   ├── main.css
│   │   ├── mobile.css
│   │   └── admin.css
│   ├── js/                # JavaScript
│   │   ├── config.js      # Configurações
│   │   ├── utils.js       # Utilitários
│   │   ├── api.js         # API client
│   │   ├── auth.js        # Autenticação
│   │   ├── credits.js     # Sistema de créditos
│   │   ├── services.js    # Catálogo de serviços
│   │   ├── forms.js       # Formulários
│   │   ├── orders.js      # Pedidos
│   │   ├── payment.js     # Pagamentos
│   │   ├── notifications.js # Notificações
│   │   ├── app.js         # App principal
│   │   ├── admin.js       # Painel admin
│   │   └── sw-register.js # Service Worker
│   ├── sw.js              # Service Worker
│   ├── manifest.json      # PWA Manifest
│   └── assets/            # Ícones e imagens
│
├── worker/                # Backend Cloudflare Workers
│   ├── index.js           # Entry point
│   ├── routes/            # API routes
│   │   ├── auth.js
│   │   ├── credits.js
│   │   ├── services.js
│   │   ├── orders.js
│   │   ├── payments.js
│   │   ├── notifications.js
│   │   └── admin.js
│   └── utils/             # Utilidades
│       ├── auth.js
│       └── asaas.js
│
├── package.json           # Dependências Node.js
├── wrangler.toml          # Configuração Cloudflare
└── README.md              # Este arquivo
```

## 🔐 Autenticação e Segurança

- JWT tokens para autenticação
- Passwords hasheados com SHA-256
- CORS configurado
- Validação de dados no backend
- Autorização por roles (user/admin)

## 💳 Integração com Asaas

### Funcionalidades Implementadas

- ✅ Pagamento via PIX (QR Code)
- ✅ Pagamento via Cartão de Crédito (até 12x)
- ✅ Verificação de status de pagamento
- ✅ Webhooks para confirmação automática
- ✅ Gestão de clientes

### Configurar Asaas

1. Criar conta em https://www.asaas.com/
2. Obter API Key em Configurações > Integrações
3. Configurar webhook URL: `https://seu-dominio.workers.dev/api/payments/webhook/asaas`
4. Ativar eventos: PAYMENT_CONFIRMED

## 📊 Painel Administrativo

Acesse: `https://seu-dominio.workers.dev/admin`

### Funcionalidades

- Dashboard com métricas em tempo real
- Gestão de pedidos
- Atualização de status
- Atribuição de pedidos para equipe
- Visualização de usuários
- Relatórios financeiros
- Gestão de créditos

## 🎨 Design e UX

### Paleta de Cores

- **Primária**: `#2563eb` (Azul profissional)
- **Secundária**: `#059669` (Verde confiança)
- **Neutro**: `#4b5563` (Cinza profissional)
- **Fundo**: `#ffffff` (Branco puro)
- **Texto**: `#1f2937` (Preto suave)

### Responsividade

- Mobile-first approach
- Breakpoints: 576px, 768px, 992px, 1200px
- Suporte a orientação landscape
- iOS Safe Area support
- Dark mode support

## 📝 Formulários por Serviço

Cada serviço possui um formulário específico com validações:

- **LLC EUA**: Documentos, endereço, estado preferido
- **TikTok Shop**: CPF/CNPJ, categorias, documentos
- **Business Managers**: Dados da empresa, CNPJ
- **Proxy**: Tipo, quantidade de IPs, protocolo
- **Dropshipping**: Marca, nicho, público-alvo
- **IA Anúncios**: Negócio, produto, plataformas
- **App Personalizado**: Funcionalidades, design, prazo
- **E-commerce**: Domínio, cores, produtos
- **Consultoria**: Assunto, descrição, data preferida

## 🔔 Sistema de Notificações

- Notificações in-app
- Push notifications (browser)
- Badges de notificações não lidas
- Notificações de:
  - Confirmação de pagamento
  - Atualização de pedido
  - Créditos adicionados
  - Entrega concluída

## 🚀 Fluxo do Usuário

1. **Acesso**: Usuário acessa o app
2. **Cadastro/Login**: Cria conta ou faz login
3. **Compra de Créditos**: Escolhe pacote e método de pagamento
4. **Confirmação**: Pagamento confirmado, créditos adicionados
5. **Explorar Serviços**: Navega pelo catálogo
6. **Solicitar Serviço**: Preenche formulário específico
7. **Processamento**: Equipe processa manualmente
8. **Acompanhamento**: Recebe atualizações e notificações
9. **Entrega**: Recebe arquivos e conclusão do serviço

## 🛠️ Desenvolvimento

### Comandos Úteis

```bash
# Desenvolvimento local
npm run dev

# Build para produção
npm run build

# Deploy para Cloudflare
npm run deploy

# Logs do Worker
npx wrangler tail

# Visualizar KV
npx wrangler kv:key list --binding=USERS_KV
```

### Estrutura de Dados (KV Storage)

#### Users
```javascript
{
  id: "uuid",
  name: "Nome Completo",
  email: "email@example.com",
  phone: "11999999999",
  cpf: "12345678900",
  password: "hash",
  credits: 1000,
  isAdmin: false,
  createdAt: "2024-01-01T00:00:00.000Z"
}
```

#### Orders
```javascript
{
  id: "uuid",
  userId: "user-uuid",
  serviceId: "llc-usa",
  serviceName: "LLC EUA Completa",
  credits: 2997,
  formData: {},
  status: "PENDING|PROCESSING|COMPLETED|CANCELLED",
  files: [],
  updates: [],
  deliverables: [],
  createdAt: "2024-01-01T00:00:00.000Z"
}
```

#### Payments
```javascript
{
  id: "uuid",
  userId: "user-uuid",
  asaasId: "asaas-payment-id",
  amount: 497.00,
  packageId: "starter",
  method: "pix|credit_card",
  status: "PENDING|CONFIRMED|FAILED",
  createdAt: "2024-01-01T00:00:00.000Z"
}
```

## 📈 Monitoramento e Analytics

- Logs do Cloudflare Workers
- Métricas de performance
- Taxa de conversão
- Serviços mais vendidos
- Análise de uso de créditos

## 🔧 Troubleshooting

### Problemas Comuns

**Erro de CORS**
```javascript
// Verificar corsHeaders em worker/index.js
```

**Pagamento não confirmado**
```javascript
// Verificar webhook configurado no Asaas
// Checar logs: npx wrangler tail
```

**Service Worker não atualiza**
```javascript
// Limpar cache do navegador
// Incrementar versão em sw.js
```

## 📄 Licença

Este projeto é proprietário e confidencial.

## 👥 Suporte

Para suporte, entre em contato:
- Email: suporte@malu.com.br
- WhatsApp: +55 11 99999-9999

## 🎯 Roadmap

### Fase 1 - MVP ✅
- [x] Sistema de créditos
- [x] Integração Asaas
- [x] Formulários de serviços
- [x] Painel do cliente
- [x] Painel administrativo

### Fase 2 - Melhorias 🔄
- [ ] Sistema de tickets
- [ ] Chat em tempo real
- [ ] Assinaturas recorrentes
- [ ] Programa de afiliados
- [ ] Multi-idioma

### Fase 3 - Expansão 📅
- [ ] App nativo (React Native)
- [ ] Marketplace de serviços
- [ ] API pública
- [ ] Integrações adicionais

## 📞 Contato

Desenvolvido por Malu Digital Services
Website: https://malu.digital
