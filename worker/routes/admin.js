/**
 * Admin Routes
 */

import { Router } from 'itty-router';
import { jsonResponse } from '../index';
import { verifyToken } from '../utils/auth';

const router = Router({ base: '/api/admin' });

// Middleware to verify admin authentication
async function requireAdmin(request) {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return jsonResponse({ error: 'Unauthorized' }, 401);
    }

    const payload = await verifyToken(token, request.env);
    if (!payload) {
        return jsonResponse({ error: 'Invalid token' }, 401);
    }

    // Get user and check if admin
    const userData = await request.env.USERS_KV.get(`user:${payload.userId}`);
    const user = JSON.parse(userData);

    if (!user.isAdmin) {
        return jsonResponse({ error: 'Forbidden' }, 403);
    }

    request.userId = payload.userId;
}

// Get dashboard stats
router.get('/dashboard', requireAdmin, async (request) => {
    try {
        // Calculate stats from KV
        // This is simplified - in production, you'd use analytics or aggregated data

        const stats = {
            totalRevenue: 0,
            revenueGrowth: 0,
            activeOrders: 0,
            pendingOrders: 0,
            activeUsers: 0,
            newUsers: 0,
            totalCredits: 0,
            creditsValue: 0,
            recentOrders: [],
        };

        return jsonResponse(stats);
    } catch (error) {
        return jsonResponse({ error: error.message }, 500);
    }
});

// Get all orders
router.get('/orders', requireAdmin, async (request) => {
    try {
        // Get all orders
        // This is simplified - in production, implement pagination
        const orders = [];

        return jsonResponse({ orders });
    } catch (error) {
        return jsonResponse({ error: error.message }, 500);
    }
});

// Update order status
router.put('/orders/:orderId/status', requireAdmin, async (request) => {
    try {
        const { orderId } = request.params;
        const { status, notes } = await request.json();

        const orderData = await request.env.ORDERS_KV.get(`order:${orderId}`);
        if (!orderData) {
            return jsonResponse({ error: 'Order not found' }, 404);
        }

        const order = JSON.parse(orderData);

        // Update status
        order.status = status;
        order.updatedAt = new Date().toISOString();

        // Add update note
        if (!order.updates) {
            order.updates = [];
        }

        order.updates.push({
            date: new Date().toISOString(),
            message: notes || `Status alterado para ${status}`,
            important: true,
        });

        await request.env.ORDERS_KV.put(`order:${orderId}`, JSON.stringify(order));

        // Send notification to user
        // ... notification logic

        return jsonResponse({ success: true, order });
    } catch (error) {
        return jsonResponse({ error: error.message }, 500);
    }
});

// Get all users
router.get('/users', requireAdmin, async (request) => {
    try {
        // Get all users
        // This is simplified - in production, implement pagination
        const users = [];

        return jsonResponse({ users });
    } catch (error) {
        return jsonResponse({ error: error.message }, 500);
    }
});

// Update user credits
router.put('/users/:userId/credits', requireAdmin, async (request) => {
    try {
        const { userId } = request.params;
        const { credits, reason } = await request.json();

        const userData = await request.env.USERS_KV.get(`user:${userId}`);
        if (!userData) {
            return jsonResponse({ error: 'User not found' }, 404);
        }

        const user = JSON.parse(userData);
        user.credits = credits;

        await request.env.USERS_KV.put(`user:${userId}`, JSON.stringify(user));

        return jsonResponse({ success: true });
    } catch (error) {
        return jsonResponse({ error: error.message }, 500);
    }
});

export const adminRoutes = router;
