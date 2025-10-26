/**
 * Notifications Routes
 */

import { Router } from 'itty-router';
import { jsonResponse } from '../index';
import { verifyToken } from '../utils/auth';

const router = Router({ base: '/api/notifications' });

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

// Get notifications
router.get('/', requireAuth, async (request) => {
    try {
        const notificationsKey = `notifications:user:${request.userId}`;
        const notificationsData = await request.env.ORDERS_KV.get(notificationsKey);
        const notifications = notificationsData ? JSON.parse(notificationsData) : [];

        return jsonResponse({ notifications });
    } catch (error) {
        return jsonResponse({ error: error.message }, 500);
    }
});

// Get unread count
router.get('/unread-count', requireAuth, async (request) => {
    try {
        const notificationsKey = `notifications:user:${request.userId}`;
        const notificationsData = await request.env.ORDERS_KV.get(notificationsKey);
        const notifications = notificationsData ? JSON.parse(notificationsData) : [];

        const unreadCount = notifications.filter(n => !n.read).length;

        return jsonResponse({ count: unreadCount });
    } catch (error) {
        return jsonResponse({ error: error.message }, 500);
    }
});

// Mark as read
router.put('/:notificationId/read', requireAuth, async (request) => {
    try {
        const { notificationId } = request.params;

        const notificationsKey = `notifications:user:${request.userId}`;
        const notificationsData = await request.env.ORDERS_KV.get(notificationsKey);
        const notifications = notificationsData ? JSON.parse(notificationsData) : [];

        const notification = notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
            await request.env.ORDERS_KV.put(notificationsKey, JSON.stringify(notifications));
        }

        return jsonResponse({ success: true });
    } catch (error) {
        return jsonResponse({ error: error.message }, 500);
    }
});

// Mark all as read
router.put('/read-all', requireAuth, async (request) => {
    try {
        const notificationsKey = `notifications:user:${request.userId}`;
        const notificationsData = await request.env.ORDERS_KV.get(notificationsKey);
        const notifications = notificationsData ? JSON.parse(notificationsData) : [];

        notifications.forEach(n => n.read = true);
        await request.env.ORDERS_KV.put(notificationsKey, JSON.stringify(notifications));

        return jsonResponse({ success: true });
    } catch (error) {
        return jsonResponse({ error: error.message }, 500);
    }
});

export const notificationsRoutes = router;
