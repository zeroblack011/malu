/**
 * Authentication Routes
 */

import { Router } from 'itty-router';
import { jsonResponse } from '../index';
import { hashPassword, verifyPassword, generateToken, verifyToken } from '../utils/auth';

const router = Router({ base: '/api/auth' });

// Register
router.post('/register', async (request) => {
    try {
        const { name, email, phone, cpf, password } = await request.json();

        // Validate required fields
        if (!name || !email || !password) {
            return jsonResponse({ error: 'Missing required fields' }, 400);
        }

        // Check if user exists
        const existingUser = await request.env.USERS_KV.get(`user:email:${email}`);
        if (existingUser) {
            return jsonResponse({ error: 'Email already registered' }, 400);
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create user
        const userId = crypto.randomUUID();
        const user = {
            id: userId,
            name,
            email,
            phone,
            cpf,
            password: hashedPassword,
            credits: 0,
            createdAt: new Date().toISOString(),
            isAdmin: false,
        };

        // Store user
        await request.env.USERS_KV.put(`user:${userId}`, JSON.stringify(user));
        await request.env.USERS_KV.put(`user:email:${email}`, userId);

        // Remove password from response
        delete user.password;

        return jsonResponse({
            message: 'User registered successfully',
            user,
        }, 201);
    } catch (error) {
        return jsonResponse({ error: error.message }, 500);
    }
});

// Login
router.post('/login', async (request) => {
    try {
        const { email, password } = await request.json();

        // Get user by email
        const userId = await request.env.USERS_KV.get(`user:email:${email}`);
        if (!userId) {
            return jsonResponse({ error: 'Invalid credentials' }, 401);
        }

        const userData = await request.env.USERS_KV.get(`user:${userId}`);
        const user = JSON.parse(userData);

        // Verify password
        const isValid = await verifyPassword(password, user.password);
        if (!isValid) {
            return jsonResponse({ error: 'Invalid credentials' }, 401);
        }

        // Generate token
        const token = await generateToken({ userId: user.id, email: user.email });

        // Remove password from response
        delete user.password;

        return jsonResponse({
            token,
            user,
        });
    } catch (error) {
        return jsonResponse({ error: error.message }, 500);
    }
});

// Get current user
router.get('/me', async (request) => {
    try {
        const token = request.headers.get('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return jsonResponse({ error: 'Unauthorized' }, 401);
        }

        const payload = await verifyToken(token);
        if (!payload) {
            return jsonResponse({ error: 'Invalid token' }, 401);
        }

        const userData = await request.env.USERS_KV.get(`user:${payload.userId}`);
        if (!userData) {
            return jsonResponse({ error: 'User not found' }, 404);
        }

        const user = JSON.parse(userData);
        delete user.password;

        return jsonResponse(user);
    } catch (error) {
        return jsonResponse({ error: error.message }, 500);
    }
});

// Update profile
router.put('/profile', async (request) => {
    try {
        const token = request.headers.get('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return jsonResponse({ error: 'Unauthorized' }, 401);
        }

        const payload = await verifyToken(token);
        if (!payload) {
            return jsonResponse({ error: 'Invalid token' }, 401);
        }

        const { name, phone } = await request.json();

        const userData = await request.env.USERS_KV.get(`user:${payload.userId}`);
        const user = JSON.parse(userData);

        // Update fields
        if (name) user.name = name;
        if (phone) user.phone = phone;
        user.updatedAt = new Date().toISOString();

        // Save user
        await request.env.USERS_KV.put(`user:${user.id}`, JSON.stringify(user));

        delete user.password;

        return jsonResponse({ user });
    } catch (error) {
        return jsonResponse({ error: error.message }, 500);
    }
});

// Request password reset
router.post('/forgot-password', async (request) => {
    try {
        const { email } = await request.json();

        // Check if user exists
        const userId = await request.env.USERS_KV.get(`user:email:${email}`);

        // Always return success for security
        return jsonResponse({
            message: 'If the email exists, a reset link has been sent',
        });
    } catch (error) {
        return jsonResponse({ error: error.message }, 500);
    }
});

export const authRoutes = router;
