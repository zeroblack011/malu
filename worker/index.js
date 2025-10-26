/**
 * Cloudflare Worker - Malu Digital Services API
 * Backend for PWA application with KV Storage and Asaas integration
 */

import { Router } from 'itty-router';
import { getAssetFromKV } from '@cloudflare/kv-asset-handler';
import { getIndexHTML } from './static-app';
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
