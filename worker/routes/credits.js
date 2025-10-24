/**
 * Credits Routes
 */

import { Router } from 'itty-router';
import { jsonResponse } from '../index';
import { verifyToken } from '../utils/auth';

const router = Router({ base: '/api/credits' });

// Middleware to verify authentication
async function requireAuth(request) {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return jsonResponse({ error: 'Unauthorized' }, 401);
    }

    const payload = await verifyToken(token);
    if (!payload) {
        return jsonResponse({ error: 'Invalid token' }, 401);
    }

    request.userId = payload.userId;
}

// Get balance
router.get('/balance', requireAuth, async (request) => {
    try {
        const userData = await request.env.USERS_KV.get(`user:${request.userId}`);
        const user = JSON.parse(userData);

        return jsonResponse({
            balance: user.credits || 0,
        });
    } catch (error) {
        return jsonResponse({ error: error.message }, 500);
    }
});

// Get transactions
router.get('/transactions', requireAuth, async (request) => {
    try {
        const url = new URL(request.url);
        const limit = parseInt(url.searchParams.get('limit') || '50');

        // Get transactions from KV
        const transactionsKey = `transactions:user:${request.userId}`;
        const transactionsData = await request.env.ORDERS_KV.get(transactionsKey);
        const transactions = transactionsData ? JSON.parse(transactionsData) : [];

        // Sort by date and limit
        const sorted = transactions
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, limit);

        return jsonResponse({ transactions: sorted });
    } catch (error) {
        return jsonResponse({ error: error.message }, 500);
    }
});

// Purchase credits
router.post('/purchase', requireAuth, async (request) => {
    try {
        const { packageId, paymentMethod } = await request.json();

        // This endpoint initiates the payment process
        // Actual credit addition happens after payment confirmation

        return jsonResponse({
            message: 'Payment initiated',
            paymentId: crypto.randomUUID(),
        });
    } catch (error) {
        return jsonResponse({ error: error.message }, 500);
    }
});

// Add credits (internal use, called after payment confirmation)
async function addCredits(env, userId, amount, description) {
    // Get user
    const userData = await env.USERS_KV.get(`user:${userId}`);
    const user = JSON.parse(userData);

    // Add credits
    user.credits = (user.credits || 0) + amount;

    // Save user
    await env.USERS_KV.put(`user:${userId}`, JSON.stringify(user));

    // Add transaction record
    const transaction = {
        id: crypto.randomUUID(),
        userId,
        type: 'credit',
        amount,
        description,
        createdAt: new Date().toISOString(),
    };

    const transactionsKey = `transactions:user:${userId}`;
    const transactionsData = await env.ORDERS_KV.get(transactionsKey);
    const transactions = transactionsData ? JSON.parse(transactionsData) : [];
    transactions.push(transaction);

    await env.ORDERS_KV.put(transactionsKey, JSON.stringify(transactions));

    return user.credits;
}

// Deduct credits (internal use)
async function deductCredits(env, userId, amount, description) {
    // Get user
    const userData = await env.USERS_KV.get(`user:${userId}`);
    const user = JSON.parse(userData);

    // Check if sufficient balance
    if (user.credits < amount) {
        throw new Error('Insufficient credits');
    }

    // Deduct credits
    user.credits -= amount;

    // Save user
    await env.USERS_KV.put(`user:${userId}`, JSON.stringify(user));

    // Add transaction record
    const transaction = {
        id: crypto.randomUUID(),
        userId,
        type: 'debit',
        amount,
        description,
        createdAt: new Date().toISOString(),
    };

    const transactionsKey = `transactions:user:${userId}`;
    const transactionsData = await env.ORDERS_KV.get(transactionsKey);
    const transactions = transactionsData ? JSON.parse(transactionsData) : [];
    transactions.push(transaction);

    await env.ORDERS_KV.put(transactionsKey, JSON.stringify(transactions));

    return user.credits;
}

export { router as creditsRoutes, addCredits, deductCredits };
