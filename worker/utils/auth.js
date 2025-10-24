/**
 * Authentication Utilities
 */

// Hash password using Web Crypto API
export async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Verify password
export async function verifyPassword(password, hash) {
    const passwordHash = await hashPassword(password);
    return passwordHash === hash;
}

// Generate JWT token
export async function generateToken(payload) {
    const header = {
        alg: 'HS256',
        typ: 'JWT',
    };

    const data = {
        ...payload,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 days
    };

    const encodedHeader = btoa(JSON.stringify(header));
    const encodedData = btoa(JSON.stringify(data));

    const token = `${encodedHeader}.${encodedData}`;

    // In production, sign with secret key
    const signature = await createSignature(token, 'your-secret-key');

    return `${token}.${signature}`;
}

// Verify JWT token
export async function verifyToken(token) {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) {
            return null;
        }

        const [encodedHeader, encodedData, signature] = parts;

        // In production, verify signature
        const expectedSignature = await createSignature(`${encodedHeader}.${encodedData}`, 'your-secret-key');

        if (signature !== expectedSignature) {
            return null;
        }

        const data = JSON.parse(atob(encodedData));

        // Check expiration
        if (data.exp && data.exp < Math.floor(Date.now() / 1000)) {
            return null;
        }

        return data;
    } catch (error) {
        return null;
    }
}

// Create signature
async function createSignature(message, secret) {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );

    const signature = await crypto.subtle.sign(
        'HMAC',
        key,
        encoder.encode(message)
    );

    const hashArray = Array.from(new Uint8Array(signature));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
