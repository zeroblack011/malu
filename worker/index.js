/**
 * Cloudflare Worker - Malu Digital Services
 * VERSÃO SIMPLIFICADA - SEM LOGIN/REGISTRO
 * Catálogo direto de serviços com contato via WhatsApp
 */

import { Router } from 'itty-router';
import { getAssetFromKV } from '@cloudflare/kv-asset-handler';
import { getIndexHTML } from './static-app';

// Create router
const router = Router();

// CORS headers
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle CORS preflight
router.options('*', () => {
    return new Response(null, { headers: corsHeaders });
});

// API: Listar serviços disponíveis
router.get('/api/services', () => {
    const services = [
        {
            id: 'llc-usa',
            name: 'LLC EUA Completa',
            description: 'Abertura de LLC nos Estados Unidos com EIN, conta bancária Mercury e endereço comercial. Processo 100% online e documentado.',
            price: 'R$ 2.997',
            features: [
                'Registro oficial da LLC em Delaware/Wyoming',
                'EIN (Employer Identification Number)',
                'Conta bancária Mercury aprovada',
                'Endereço comercial nos EUA',
                'Operating Agreement profissional',
                'Suporte completo durante 90 dias'
            ],
            deliveryTime: '15-30 dias úteis',
            whatsappMessage: 'Olá! Tenho interesse na abertura de LLC EUA Completa'
        },
        {
            id: 'tiktok-shop',
            name: 'TikTok Shop BR Verificada',
            description: 'Conta TikTok Shop Brasil 100% verificada e pronta para vender. Inclui configuração completa e tutorial de uso.',
            price: 'R$ 497',
            features: [
                'Conta verificada e ativa',
                'Configuração completa de loja',
                'Tutorial de integração com produtos',
                'Suporte para primeiras vendas',
                'Garantia de 30 dias'
            ],
            deliveryTime: '24-48 horas',
            whatsappMessage: 'Olá! Quero uma conta TikTok Shop BR verificada'
        },
        {
            id: 'bm-250',
            name: 'Business Manager 250',
            description: 'Facebook Business Manager com limite de R$ 250/dia para anúncios. Ideal para começar campanhas.',
            price: 'R$ 197',
            features: [
                'Limite inicial de R$ 250/dia',
                'Página do Facebook incluída',
                'Pixel configurado',
                'Tutorial de uso completo',
                'Suporte de 15 dias'
            ],
            deliveryTime: '12-24 horas',
            whatsappMessage: 'Olá! Preciso de um BM 250 para anúncios'
        },
        {
            id: 'bm-unlimited',
            name: 'Business Manager Unlimited',
            description: 'Business Manager sem limite de gastos em anúncios. Para operações de grande escala.',
            price: 'R$ 997',
            features: [
                'Sem limite de gastos diários',
                'Múltiplas páginas e pixels',
                'Histórico de gastos estabelecido',
                'Conta aquecida e estável',
                'Suporte prioritário 30 dias'
            ],
            deliveryTime: '24-72 horas',
            whatsappMessage: 'Olá! Quero um BM Unlimited para escalar campanhas'
        },
        {
            id: 'google-ads',
            name: 'Google Ads Desbloqueada',
            description: 'Conta Google Ads 100% funcional, desbloqueada e pronta para campanhas ilimitadas.',
            price: 'R$ 397',
            features: [
                'Conta desbloqueada e verificada',
                'Sem restrições de gastos',
                'Histórico limpo',
                'Tutorial de configuração',
                'Garantia de 15 dias'
            ],
            deliveryTime: '24-48 horas',
            whatsappMessage: 'Olá! Preciso de uma conta Google Ads desbloqueada'
        },
        {
            id: 'stripe',
            name: 'Conta Stripe Verificada',
            description: 'Conta Stripe 100% verificada para receber pagamentos internacionais. Aprovação garantida.',
            price: 'R$ 697',
            features: [
                'Conta totalmente verificada',
                'Recebimento internacional',
                'Sem limite de transações',
                'Documentação completa',
                'Suporte de integração 30 dias'
            ],
            deliveryTime: '2-5 dias úteis',
            whatsappMessage: 'Olá! Quero uma conta Stripe verificada'
        }
    ];

    return jsonResponse({ services });
});

// API: Enviar interesse de compra (apenas retorna WhatsApp link)
router.post('/api/contact', async (request) => {
    try {
        const { serviceId, name, email, phone } = await request.json();

        // WhatsApp number (SUBSTITUA PELO SEU NÚMERO)
        const whatsappNumber = '5511999999999'; // MUDE AQUI!

        // Encontrar serviço
        const services = {
            'llc-usa': 'LLC EUA Completa',
            'tiktok-shop': 'TikTok Shop BR',
            'bm-250': 'Business Manager 250',
            'bm-unlimited': 'Business Manager Unlimited',
            'google-ads': 'Google Ads Desbloqueada',
            'stripe': 'Conta Stripe Verificada'
        };

        const serviceName = services[serviceId] || serviceId;
        const message = `Olá! Tenho interesse em: *${serviceName}*\n\nMeus dados:\nNome: ${name}\nEmail: ${email}\nTelefone: ${phone}`;

        const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

        return jsonResponse({
            success: true,
            whatsappLink,
            message: 'Redirecionando para WhatsApp...'
        });
    } catch (error) {
        return jsonResponse({ error: 'Dados inválidos' }, 400);
    }
});

// Health check
router.get('/api/health', () => {
    return jsonResponse({
        status: 'ok',
        version: '2.0-simplified',
        timestamp: new Date().toISOString()
    });
});

// Static assets (PWA)
router.get('/', async (request, env, ctx) => {
    // Serve inline PWA app
    return new Response(getIndexHTML(), {
        headers: {
            'Content-Type': 'text/html;charset=UTF-8',
            ...corsHeaders,
        },
    });
});

// Other static assets
router.get('*', async (request, env, ctx) => {
    // Workers Sites: serve static assets from KV
    if (env.__STATIC_CONTENT) {
        try {
            // Use proper binding for Workers Sites
            const asset = await getAssetFromKV(
                {
                    request,
                    waitUntil: ctx.waitUntil.bind(ctx),
                },
                {
                    ASSET_NAMESPACE: env.__STATIC_CONTENT,
                    ASSET_MANIFEST: typeof __STATIC_CONTENT_MANIFEST !== 'undefined'
                        ? JSON.parse(__STATIC_CONTENT_MANIFEST)
                        : {},
                }
            );
            return asset;
        } catch (e) {
            console.error('Asset fetch error:', e);
            return new Response('Asset Not Found', { status: 404 });
        }
    }

    return new Response('Workers Sites not configured', { status: 404 });
});

// 404 handler
router.all('*', () => {
    return jsonResponse({ error: 'Not Found' }, 404);
});

// Main handler
export default {
    async fetch(request, env, ctx) {
        try {
            // Add environment to request for route handlers
            request.env = env;

            return await router.handle(request, env, ctx);
        } catch (error) {
            console.error('Worker error:', error);
            return jsonResponse({
                error: 'Internal Server Error',
                message: error.message
            }, 500);
        }
    },
};

// Helper function for JSON responses
export function jsonResponse(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
        },
    });
}
