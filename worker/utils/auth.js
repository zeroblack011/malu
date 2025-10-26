/**
 * Authentication Utilities - Simplified for Workers
 * NO JWT, NO base64 - just simple secure tokens
 */

// Hash password using Web Crypto API
export async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest({ name: 'SHA-256' }, data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Verify password
export async function verifyPassword(password, hash) {
    const passwordHash = await hashPassword(password);
    return passwordHash === hash;
}

// Generate simple token (UUID + timestamp)
export async function generateToken(payload) {
    // Simple token: just a UUID
    // We'll store user data in KV with this token as key
    const token = crypto.randomUUID();
    return token;
}

// Verify token by checking if it exists in KV
export async function verifyToken(token, env) {
    try {
        if (!token) return null;

        // Get token data from KV
        const tokenData = await env.USERS_KV.get(`token:${token}`);
        if (!tokenData) return null;

        const data = JSON.parse(tokenData);

        // Check expiration (30 days)
        const expiresAt = new Date(data.expiresAt);
        if (expiresAt < new Date()) {
            // Token expired, delete it
            await env.USERS_KV.delete(`token:${token}`);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Token verification error:', error);
        return null;
    }
}

// Store token in KV
export async function storeToken(token, payload, env) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

    const tokenData = {
        ...payload,
        expiresAt: expiresAt.toISOString()
    };

    // Store for 30 days (2592000 seconds)
    await env.USERS_KV.put(
        `token:${token}`,
        JSON.stringify(tokenData),
        { expirationTtl: 2592000 }
    );
}
