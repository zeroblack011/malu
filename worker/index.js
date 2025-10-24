/**
 * Cloudflare Worker - Malu Digital Services API
 * Backend for PWA application with KV Storage and Asaas integration
 */

import { Router } from 'itty-router';
import { getAssetFromKV } from '@cloudflare/kv-asset-handler';
import { authRoutes } from './routes/auth';
import { creditsRoutes } from './routes/credits';
import { servicesRoutes } from './routes/services';
import { ordersRoutes } from './routes/orders';
import { paymentsRoutes } from './routes/payments';
import { notificationsRoutes } from './routes/notifications';
import { adminRoutes } from './routes/admin';

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

// API Routes
router.all('/api/auth/*', authRoutes);
router.all('/api/credits/*', creditsRoutes);
router.all('/api/services/*', servicesRoutes);
router.all('/api/orders/*', ordersRoutes);
router.all('/api/payments/*', paymentsRoutes);
router.all('/api/notifications/*', notificationsRoutes);
router.all('/api/admin/*', adminRoutes);

// Health check
router.get('/api/health', () => {
    return jsonResponse({ status: 'ok', timestamp: new Date().toISOString() });
});

// Static assets (PWA)
router.get('/', async (request, env, ctx) => {
    // Try to serve from Workers Sites first
    if (env.__STATIC_CONTENT) {
        try {
            return await getAssetFromKV(
                {
                    request: new Request(`${new URL(request.url).origin}/index.html`, request),
                    waitUntil: ctx.waitUntil.bind(ctx),
                },
                {
                    ASSET_NAMESPACE: env.__STATIC_CONTENT,
                    ASSET_MANIFEST: JSON.parse(__STATIC_CONTENT_MANIFEST),
                }
            );
        } catch (e) {
            console.log('Workers Sites error:', e);
        }
    }

    // Fallback: serve inline HTML
    return new Response(`
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Malu Digital Services</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            background: white;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            max-width: 600px;
            text-align: center;
        }
        h1 {
            color: #667eea;
            margin: 0 0 20px 0;
        }
        .status {
            background: #10b981;
            color: white;
            padding: 10px 20px;
            border-radius: 50px;
            display: inline-block;
            margin: 20px 0;
        }
        .info {
            background: #f3f4f6;
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
            text-align: left;
        }
        a {
            color: #667eea;
            text-decoration: none;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Malu Digital Services</h1>
        <div class="status">✅ Worker Online</div>
        <p>Sua aplicação está funcionando!</p>

        <div class="info">
            <h3>✅ Configurado:</h3>
            <ul style="text-align: left;">
                <li>✅ KV Namespaces (USERS_KV, ORDERS_KV)</li>
                <li>✅ API Routes</li>
                <li>✅ Secrets configurados</li>
            </ul>
        </div>

        <div class="info">
            <h3>🧪 Teste as APIs:</h3>
            <p><a href="/api/health">/api/health</a> - Health check</p>
        </div>

        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            Os arquivos estáticos PWA serão carregados após configuração do Workers Sites.
        </p>
    </div>
</body>
</html>
    `, {
        headers: {
            'Content-Type': 'text/html;charset=UTF-8',
            ...corsHeaders,
        },
    });
});

// Other static assets
router.get('*', async (request, env, ctx) => {
    if (env.__STATIC_CONTENT) {
        try {
            return await getAssetFromKV(
                {
                    request,
                    waitUntil: ctx.waitUntil.bind(ctx),
                },
                {
                    ASSET_NAMESPACE: env.__STATIC_CONTENT,
                    ASSET_MANIFEST: JSON.parse(__STATIC_CONTENT_MANIFEST),
                }
            );
        } catch (e) {
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
