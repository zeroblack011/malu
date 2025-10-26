/**
 * SISTEMA COMPLETO - 19 SERVIÇOS + CRÉDITOS
 * Cloudflare Worker Backend
 */

import { Router } from 'itty-router';
import { getAssetFromKV } from '@cloudflare/kv-asset-handler';
import { createAsaasCustomer, createAsaasPayment, getAsaasPaymentStatus } from './utils/asaas';
import { ALL_SERVICES, CREDIT_PACKAGES } from './services-complete';

const router = Router();

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-User-ID',
};

router.options('*', () => new Response(null, { headers: corsHeaders }));

function jsonResponse(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
}

// ==================== USUÁRIOS ====================

// Registrar usuário (simplificado - sem senha por segurança)
router.post('/api/users/register', async (request) => {
    try {
        const { name, email, phone } = await request.json();

        if (!name || !email) {
            return jsonResponse({ error: 'Nome e email obrigatórios' }, 400);
        }

        // Verificar se usuário existe
        const existingUser = await request.env.USERS_KV.get(`user:email:${email}`);
        if (existingUser) {
            return jsonResponse({ error: 'Email já cadastrado' }, 400);
        }

        // Criar usuário
        const userId = crypto.randomUUID();
        const user = {
            id: userId,
            name,
            email,
            phone,
            credits: 0,
            createdAt: new Date().toISOString(),
        };

        await request.env.USERS_KV.put(`user:${userId}`, JSON.stringify(user));
        await request.env.USERS_KV.put(`user:email:${email}`, userId);

        return jsonResponse({ user }, 201);
    } catch (error) {
        return jsonResponse({ error: error.message }, 500);
    }
});

// Obter usuário
router.get('/api/users/:userId', async (request) => {
    try {
        const { userId } = request.params;
        const userData = await request.env.USERS_KV.get(`user:${userId}`);

        if (!userData) {
            return jsonResponse({ error: 'Usuário não encontrado' }, 404);
        }

        return jsonResponse({ user: JSON.parse(userData) });
    } catch (error) {
        return jsonResponse({ error: error.message }, 500);
    }
});

// ==================== SERVIÇOS ====================

// Listar todos os serviços
router.get('/api/services', () => {
    const services = Object.values(ALL_SERVICES);
    return jsonResponse({ services });
});

// Listar por categoria
router.get('/api/services/category/:category', (request) => {
    const { category } = request.params;
    const services = Object.values(ALL_SERVICES).filter(s => s.category === category);
    return jsonResponse({ services });
});

// Detalhes de um serviço
router.get('/api/services/:serviceId', (request) => {
    const { serviceId } = request.params;
    const service = ALL_SERVICES[serviceId];

    if (!service) {
        return jsonResponse({ error: 'Serviço não encontrado' }, 404);
    }

    return jsonResponse({ service });
});

// ==================== PACOTES DE CRÉDITOS ====================

// Listar pacotes
router.get('/api/credits/packages', () => {
    const packages = Object.values(CREDIT_PACKAGES);
    return jsonResponse({ packages });
});

// Comprar créditos via PIX
router.post('/api/credits/purchase', async (request) => {
    try {
        const { userId, packageId, customer } = await request.json();

        const creditPackage = CREDIT_PACKAGES[packageId];
        if (!creditPackage) {
            return jsonResponse({ error: 'Pacote não encontrado' }, 404);
        }

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
            value: creditPackage.price,
            dueDate: new Date().toISOString().split('T')[0],
            description: `Pacote ${creditPackage.name} - ${creditPackage.credits} créditos`,
            externalReference: `credits-${userId}-${Date.now()}`,
        });

        // Salvar transação pendente
        const transactionId = crypto.randomUUID();
        const transaction = {
            id: transactionId,
            userId,
            packageId,
            credits: creditPackage.credits,
            price: creditPackage.price,
            asaasPaymentId: payment.id,
            asaasCustomerId: asaasCustomer.id,
            status: 'PENDING',
            createdAt: new Date().toISOString(),
        };

        await request.env.ORDERS_KV.put(`credit-transaction:${transactionId}`, JSON.stringify(transaction));
        await request.env.ORDERS_KV.put(`payment:${payment.id}`, transactionId);

        return jsonResponse({
            transactionId,
            paymentId: payment.id,
            pixCode: payment.encodedImage || payment.payload,
            pixQrCode: payment.encodedImage,
            expiresAt: payment.dueDate,
        });

    } catch (error) {
        console.error('Credits purchase error:', error);
        return jsonResponse({ error: error.message }, 500);
    }
});

// Verificar saldo
router.get('/api/credits/balance/:userId', async (request) => {
    try {
        const { userId } = request.params;
        const userData = await request.env.USERS_KV.get(`user:${userId}`);

        if (!userData) {
            return jsonResponse({ error: 'Usuário não encontrado' }, 404);
        }

        const user = JSON.parse(userData);
        return jsonResponse({ balance: user.credits || 0 });
    } catch (error) {
        return jsonResponse({ error: error.message }, 500);
    }
});

// Verificar status do pagamento de créditos
router.get('/api/credits/payment/:paymentId/status', async (request) => {
    try {
        const { paymentId } = request.params;

        const payment = await getAsaasPaymentStatus(request.env.ASAAS_API_KEY, paymentId);

        // Atualizar transação se pago
        const transactionId = await request.env.ORDERS_KV.get(`payment:${paymentId}`);
        if (transactionId && payment.status === 'CONFIRMED') {
            const transactionData = await request.env.ORDERS_KV.get(`credit-transaction:${transactionId}`);
            if (transactionData) {
                const transaction = JSON.parse(transactionData);

                if (transaction.status === 'PENDING') {
                    // Atualizar transação
                    transaction.status = 'CONFIRMED';
                    transaction.confirmedAt = new Date().toISOString();
                    await request.env.ORDERS_KV.put(`credit-transaction:${transactionId}`, JSON.stringify(transaction));

                    // Adicionar créditos ao usuário
                    const userData = await request.env.USERS_KV.get(`user:${transaction.userId}`);
                    if (userData) {
                        const user = JSON.parse(userData);
                        user.credits = (user.credits || 0) + transaction.credits;
                        await request.env.USERS_KV.put(`user:${transaction.userId}`, JSON.stringify(user));
                    }
                }
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

// ==================== PEDIDOS DE SERVIÇOS ====================

// Criar pedido (debita créditos)
router.post('/api/orders', async (request) => {
    try {
        const { userId, serviceId, formData, files } = await request.json();

        const service = ALL_SERVICES[serviceId];
        if (!service) {
            return jsonResponse({ error: 'Serviço não encontrado' }, 404);
        }

        // Verificar saldo
        const userData = await request.env.USERS_KV.get(`user:${userId}`);
        if (!userData) {
            return jsonResponse({ error: 'Usuário não encontrado' }, 404);
        }

        const user = JSON.parse(userData);
        if ((user.credits || 0) < service.credits) {
            return jsonResponse({
                error: 'Créditos insuficientes',
                required: service.credits,
                available: user.credits || 0,
            }, 400);
        }

        // Debitar créditos
        user.credits -= service.credits;
        await request.env.USERS_KV.put(`user:${userId}`, JSON.stringify(user));

        // Criar pedido
        const orderId = crypto.randomUUID();
        const order = {
            id: orderId,
            userId,
            serviceId,
            serviceName: service.name,
            creditsUsed: service.credits,
            formData,
            files,
            status: 'PENDING',
            createdAt: new Date().toISOString(),
            updates: [],
        };

        await request.env.ORDERS_KV.put(`order:${orderId}`, JSON.stringify(order));

        // Adicionar à lista de pedidos do usuário
        const userOrdersKey = `user-orders:${userId}`;
        const userOrdersData = await request.env.ORDERS_KV.get(userOrdersKey);
        const userOrders = userOrdersData ? JSON.parse(userOrdersData) : [];
        userOrders.push(orderId);
        await request.env.ORDERS_KV.put(userOrdersKey, JSON.stringify(userOrders));

        return jsonResponse({
            order: {
                id: orderId,
                serviceName: service.name,
                creditsUsed: service.credits,
                status: 'PENDING',
                estimatedDelivery: service.deliveryTime,
            },
            newBalance: user.credits,
        }, 201);

    } catch (error) {
        console.error('Order creation error:', error);
        return jsonResponse({ error: error.message }, 500);
    }
});

// Listar pedidos do usuário
router.get('/api/orders/user/:userId', async (request) => {
    try {
        const { userId } = request.params;

        const userOrdersKey = `user-orders:${userId}`;
        const userOrdersData = await request.env.ORDERS_KV.get(userOrdersKey);
        const orderIds = userOrdersData ? JSON.parse(userOrdersData) : [];

        const orders = [];
        for (const orderId of orderIds) {
            const orderData = await request.env.ORDERS_KV.get(`order:${orderId}`);
            if (orderData) {
                const order = JSON.parse(orderData);
                // Não enviar dados sensíveis do formulário
                orders.push({
                    id: order.id,
                    serviceName: order.serviceName,
                    creditsUsed: order.creditsUsed,
                    status: order.status,
                    createdAt: order.createdAt,
                    updates: order.updates || [],
                });
            }
        }

        orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        return jsonResponse({ orders });
    } catch (error) {
        return jsonResponse({ error: error.message }, 500);
    }
});

// Detalhes do pedido
router.get('/api/orders/:orderId', async (request) => {
    try {
        const { orderId } = request.params;
        const userId = request.headers.get('X-User-ID');

        const orderData = await request.env.ORDERS_KV.get(`order:${orderId}`);
        if (!orderData) {
            return jsonResponse({ error: 'Pedido não encontrado' }, 404);
        }

        const order = JSON.parse(orderData);

        // Verificar se é o dono
        if (order.userId !== userId) {
            return jsonResponse({ error: 'Não autorizado' }, 403);
        }

        return jsonResponse({ order });
    } catch (error) {
        return jsonResponse({ error: error.message }, 500);
    }
});

// ==================== WEBHOOK ASAAS ====================

router.post('/api/webhook/asaas', async (request) => {
    try {
        const event = await request.json();

        if (event.event === 'PAYMENT_CONFIRMED') {
            const paymentId = event.payment.id;
            const transactionId = await request.env.ORDERS_KV.get(`payment:${paymentId}`);

            if (transactionId) {
                const transactionData = await request.env.ORDERS_KV.get(`credit-transaction:${transactionId}`);
                if (transactionData) {
                    const transaction = JSON.parse(transactionData);

                    if (transaction.status === 'PENDING') {
                        // Confirmar transação
                        transaction.status = 'CONFIRMED';
                        transaction.confirmedAt = new Date().toISOString();
                        await request.env.ORDERS_KV.put(`credit-transaction:${transactionId}`, JSON.stringify(transaction));

                        // Adicionar créditos
                        const userData = await request.env.USERS_KV.get(`user:${transaction.userId}`);
                        if (userData) {
                            const user = JSON.parse(userData);
                            user.credits = (user.credits || 0) + transaction.credits;
                            await request.env.USERS_KV.put(`user:${transaction.userId}`, JSON.stringify(user));
                        }
                    }
                }
            }
        }

        return jsonResponse({ received: true });
    } catch (error) {
        console.error('Webhook error:', error);
        return jsonResponse({ error: 'Webhook error' }, 500);
    }
});

// ==================== HEALTH CHECK ====================

router.get('/api/health', () => {
    return jsonResponse({
        status: 'ok',
        version: '4.0-complete-19-services',
        timestamp: new Date().toISOString(),
        services: Object.keys(ALL_SERVICES).length,
        packages: Object.keys(CREDIT_PACKAGES).length,
    });
});

// ==================== STATIC ASSETS ====================

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

// ==================== MAIN HANDLER ====================

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
