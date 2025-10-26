/**
 * Cloudflare Worker - Malu Digital Services
 * Sistema completo com pagamento PIX via Asaas
 */

import { Router } from 'itty-router';
import { getAssetFromKV } from '@cloudflare/kv-asset-handler';
import { getIndexHTML } from './static-app-pro';
import { createAsaasCustomer, createAsaasPayment, getAsaasPaymentStatus } from './utils/asaas';

const router = Router();

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

router.options('*', () => new Response(null, { headers: corsHeaders }));

// Helper function
function jsonResponse(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
}

// Serviços disponíveis
const SERVICES = {
    'llc-usa': {
        id: 'llc-usa',
        name: 'LLC EUA Completa',
        price: 2997.00,
        description: 'Abertura de LLC nos Estados Unidos com EIN, conta bancária Mercury e endereço comercial. Processo 100% online e documentado.',
        features: [
            'Registro oficial da LLC em Delaware ou Wyoming',
            'EIN (Employer Identification Number)',
            'Conta bancária Mercury aprovada',
            'Endereço comercial nos EUA por 1 ano',
            'Operating Agreement profissional',
            'Suporte completo durante 90 dias'
        ],
        deliveryTime: '15-30 dias úteis'
    },
    'tiktok-shop': {
        id: 'tiktok-shop',
        name: 'TikTok Shop BR Verificada',
        price: 497.00,
        description: 'Conta TikTok Shop Brasil 100% verificada e pronta para vender. Inclui configuração completa e tutorial de uso.',
        features: [
            'Conta verificada e ativa',
            'Configuração completa de loja',
            'Tutorial de integração com produtos',
            'Suporte para primeiras vendas',
            'Garantia de 30 dias'
        ],
        deliveryTime: '24-48 horas'
    },
    'bm-250': {
        id: 'bm-250',
        name: 'Business Manager 250',
        price: 197.00,
        description: 'Facebook Business Manager com limite de R$ 250/dia para anúncios. Ideal para começar campanhas.',
        features: [
            'Limite inicial de R$ 250/dia',
            'Página do Facebook incluída',
            'Pixel configurado e instalado',
            'Tutorial de uso completo',
            'Suporte de 15 dias'
        ],
        deliveryTime: '12-24 horas'
    },
    'bm-unlimited': {
        id: 'bm-unlimited',
        name: 'Business Manager Unlimited',
        price: 997.00,
        description: 'Business Manager sem limite de gastos em anúncios. Para operações de grande escala.',
        features: [
            'Sem limite de gastos diários',
            'Múltiplas páginas e pixels',
            'Histórico de gastos estabelecido',
            'Conta aquecida e estável',
            'Suporte prioritário 30 dias'
        ],
        deliveryTime: '24-72 horas'
    },
    'google-ads': {
        id: 'google-ads',
        name: 'Google Ads Desbloqueada',
        price: 397.00,
        description: 'Conta Google Ads 100% funcional, desbloqueada e pronta para campanhas ilimitadas.',
        features: [
            'Conta desbloqueada e verificada',
            'Sem restrições de gastos',
            'Histórico limpo',
            'Tutorial de configuração',
            'Garantia de 15 dias'
        ],
        deliveryTime: '24-48 horas'
    },
    'stripe': {
        id: 'stripe',
        name: 'Conta Stripe Verificada',
        price: 697.00,
        description: 'Conta Stripe 100% verificada para receber pagamentos internacionais. Aprovação garantida.',
        features: [
            'Conta totalmente verificada',
            'Recebimento internacional habilitado',
            'Sem limite de transações',
            'Documentação completa fornecida',
            'Suporte de integração 30 dias'
        ],
        deliveryTime: '2-5 dias úteis'
    }
};

// API: Listar serviços
router.get('/api/services', () => {
    return jsonResponse({ services: Object.values(SERVICES) });
});

// API: Criar pagamento PIX
router.post('/api/checkout', async (request) => {
    try {
        const { serviceId, customer } = await request.json();

        if (!SERVICES[serviceId]) {
            return jsonResponse({ error: 'Serviço não encontrado' }, 404);
        }

        const service = SERVICES[serviceId];

        // Criar cliente no Asaas
        const asaasCustomer = await createAsaasCustomer(request.env.ASAAS_API_KEY, {
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            cpfCnpj: customer.cpf,
        });

        // Criar cobrança PIX
        const payment = await createAsaasPayment(request.env.ASAAS_API_KEY, {
            customer: asaasCustomer.id,
            billingType: 'PIX',
            value: service.price,
            dueDate: new Date().toISOString().split('T')[0],
            description: `${service.name} - Malu Digital Services`,
            externalReference: `${serviceId}-${Date.now()}`,
        });

        // Salvar pedido no KV
        const orderId = crypto.randomUUID();
        const order = {
            id: orderId,
            serviceId,
            serviceName: service.name,
            price: service.price,
            customer,
            asaasPaymentId: payment.id,
            asaasCustomerId: asaasCustomer.id,
            status: 'PENDING',
            createdAt: new Date().toISOString(),
        };

        await request.env.ORDERS_KV.put(`order:${orderId}`, JSON.stringify(order));
        await request.env.ORDERS_KV.put(`payment:${payment.id}`, orderId);

        return jsonResponse({
            orderId,
            paymentId: payment.id,
            pixCode: payment.encodedImage || payment.payload,
            pixQrCode: payment.encodedImage,
            expiresAt: payment.dueDate,
        });

    } catch (error) {
        console.error('Checkout error:', error);
        return jsonResponse({ error: error.message || 'Erro ao processar pagamento' }, 500);
    }
});

// API: Verificar status do pagamento
router.get('/api/payment/:paymentId/status', async (request) => {
    try {
        const { paymentId } = request.params;

        const payment = await getAsaasPaymentStatus(request.env.ASAAS_API_KEY, paymentId);

        // Atualizar pedido se pago
        const orderId = await request.env.ORDERS_KV.get(`payment:${paymentId}`);
        if (orderId && payment.status === 'CONFIRMED') {
            const orderData = await request.env.ORDERS_KV.get(`order:${orderId}`);
            if (orderData) {
                const order = JSON.parse(orderData);
                order.status = 'PAID';
                order.paidAt = new Date().toISOString();
                await request.env.ORDERS_KV.put(`order:${orderId}`, JSON.stringify(order));
            }
        }

        return jsonResponse({
            status: payment.status,
            paid: payment.status === 'CONFIRMED',
        });

    } catch (error) {
        console.error('Payment status error:', error);
        return jsonResponse({ error: 'Erro ao verificar pagamento' }, 500);
    }
});

// Webhook Asaas
router.post('/api/webhook/asaas', async (request) => {
    try {
        const event = await request.json();

        if (event.event === 'PAYMENT_CONFIRMED') {
            const paymentId = event.payment.id;
            const orderId = await request.env.ORDERS_KV.get(`payment:${paymentId}`);

            if (orderId) {
                const orderData = await request.env.ORDERS_KV.get(`order:${orderId}`);
                if (orderData) {
                    const order = JSON.parse(orderData);
                    order.status = 'PAID';
                    order.paidAt = new Date().toISOString();
                    await request.env.ORDERS_KV.put(`order:${orderId}`, JSON.stringify(order));

                    // Aqui você pode enviar email, notificação, etc
                    console.log(`Pedido ${orderId} pago com sucesso!`);
                }
            }
        }

        return jsonResponse({ received: true });
    } catch (error) {
        console.error('Webhook error:', error);
        return jsonResponse({ error: 'Webhook error' }, 500);
    }
});

// Health check
router.get('/api/health', () => {
    return jsonResponse({
        status: 'ok',
        version: '3.0-pro-asaas-pix',
        timestamp: new Date().toISOString()
    });
});

// Página principal
router.get('/', async (request, env, ctx) => {
    return new Response(getIndexHTML(), {
        headers: { 'Content-Type': 'text/html;charset=UTF-8', ...corsHeaders },
    });
});

// Static assets
router.get('*', async (request, env, ctx) => {
    if (env.__STATIC_CONTENT) {
        try {
            const asset = await getAssetFromKV(
                { request, waitUntil: ctx.waitUntil.bind(ctx) },
                {
                    ASSET_NAMESPACE: env.__STATIC_CONTENT,
                    ASSET_MANIFEST: typeof __STATIC_CONTENT_MANIFEST !== 'undefined'
                        ? JSON.parse(__STATIC_CONTENT_MANIFEST)
                        : {},
                }
            );
            return asset;
        } catch (e) {
            return new Response('Not Found', { status: 404 });
        }
    }
    return new Response('Not Found', { status: 404 });
});

// 404
router.all('*', () => jsonResponse({ error: 'Not Found' }, 404));

// Main handler
export default {
    async fetch(request, env, ctx) {
        try {
            request.env = env;
            return await router.handle(request, env, ctx);
        } catch (error) {
            console.error('Worker error:', error);
            return jsonResponse({ error: 'Internal Server Error', message: error.message }, 500);
        }
    },
};
