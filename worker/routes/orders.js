/**
 * Orders Routes
 */

import { Router } from 'itty-router';
import { jsonResponse } from '../index';
import { verifyToken } from '../utils/auth';
import { deductCredits } from './credits';

const router = Router({ base: '/api/orders' });

// Middleware to verify authentication
async function requireAuth(request) {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return jsonResponse({ error: 'Unauthorized' }, 401);
    }

    const payload = await verifyToken(token, request.env);
    if (!payload) {
        return jsonResponse({ error: 'Invalid token' }, 401);
    }

    request.userId = payload.userId;
}

// Create order
router.post('/', requireAuth, async (request) => {
    try {
        const { serviceId, formData } = await request.json();

        // Get service details (from config)
        // In production, you'd fetch this from a database
        const services = {
            'llc-usa': { credits: 2997, name: 'LLC EUA Completa' },
            'tiktok-shop-br': { credits: 497, name: 'TikTok Shop BR' },
            // ... other services
        };

        const service = services[serviceId];
        if (!service) {
            return jsonResponse({ error: 'Invalid service' }, 400);
        }

        // Deduct credits
        await deductCredits(
            request.env,
            request.userId,
            service.credits,
            `Serviço: ${service.name}`
        );

        // Create order
        const orderId = crypto.randomUUID();
        const order = {
            id: orderId,
            userId: request.userId,
            serviceId,
            serviceName: service.name,
            credits: service.credits,
            formData,
            status: 'PENDING',
            createdAt: new Date().toISOString(),
            files: [],
            updates: [],
            deliverables: [],
        };

        // Store order
        await request.env.ORDERS_KV.put(`order:${orderId}`, JSON.stringify(order));

        // Add to user's orders list
        const userOrdersKey = `orders:user:${request.userId}`;
        const userOrdersData = await request.env.ORDERS_KV.get(userOrdersKey);
        const userOrders = userOrdersData ? JSON.parse(userOrdersData) : [];
        userOrders.push(orderId);
        await request.env.ORDERS_KV.put(userOrdersKey, JSON.stringify(userOrders));

        return jsonResponse({ order }, 201);
    } catch (error) {
        return jsonResponse({ error: error.message }, 500);
    }
});

// Get user orders
router.get('/', requireAuth, async (request) => {
    try {
        const userOrdersKey = `orders:user:${request.userId}`;
        const userOrdersData = await request.env.ORDERS_KV.get(userOrdersKey);
        const orderIds = userOrdersData ? JSON.parse(userOrdersData) : [];

        // Fetch all orders
        const orders = [];
        for (const orderId of orderIds) {
            const orderData = await request.env.ORDERS_KV.get(`order:${orderId}`);
            if (orderData) {
                orders.push(JSON.parse(orderData));
            }
        }

        // Sort by creation date
        orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        return jsonResponse({ orders });
    } catch (error) {
        return jsonResponse({ error: error.message }, 500);
    }
});

// Get order by ID
router.get('/:orderId', requireAuth, async (request) => {
    try {
        const { orderId } = request.params;

        const orderData = await request.env.ORDERS_KV.get(`order:${orderId}`);
        if (!orderData) {
            return jsonResponse({ error: 'Order not found' }, 404);
        }

        const order = JSON.parse(orderData);

        // Verify order belongs to user
        if (order.userId !== request.userId) {
            return jsonResponse({ error: 'Forbidden' }, 403);
        }

        return jsonResponse(order);
    } catch (error) {
        return jsonResponse({ error: error.message }, 500);
    }
});

// Upload file to order
router.post('/:orderId/files', requireAuth, async (request) => {
    try {
        const { orderId } = request.params;

        // This is a simplified version
        // In production, handle multipart form data and store files in R2

        return jsonResponse({
            message: 'File uploaded successfully',
            fileId: crypto.randomUUID(),
        });
    } catch (error) {
        return jsonResponse({ error: error.message }, 500);
    }
});

// Cancel order
router.post('/:orderId/cancel', requireAuth, async (request) => {
    try {
        const { orderId } = request.params;
        const { reason } = await request.json();

        const orderData = await request.env.ORDERS_KV.get(`order:${orderId}`);
        if (!orderData) {
            return jsonResponse({ error: 'Order not found' }, 404);
        }

        const order = JSON.parse(orderData);

        // Verify order belongs to user
        if (order.userId !== request.userId) {
            return jsonResponse({ error: 'Forbidden' }, 403);
        }

        // Only allow cancellation of pending/processing orders
        if (order.status !== 'PENDING' && order.status !== 'PROCESSING') {
            return jsonResponse({ error: 'Cannot cancel this order' }, 400);
        }

        // Update order status
        order.status = 'CANCELLED';
        order.cancelledAt = new Date().toISOString();
        order.cancellationReason = reason;

        await request.env.ORDERS_KV.put(`order:${orderId}`, JSON.stringify(order));

        // Refund credits (optional, based on business logic)

        return jsonResponse({ message: 'Order cancelled successfully' });
    } catch (error) {
        return jsonResponse({ error: error.message }, 500);
    }
});

export const ordersRoutes = router;
