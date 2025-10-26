/**
 * Authentication Utilities - Fixed for Cloudflare Workers
 */

// Base64 encode for Workers (btoa replacement)
function base64encode(str) {
    const bytes = new TextEncoder().encode(str);
    const binString = String.fromCodePoint(...bytes);
    return btoa(binString)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

// Base64 decode for Workers (atob replacement)
function base64decode(str) {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) {
        str += '=';
    }
    const binString = atob(str);
    const bytes = Uint8Array.from(binString, (m) => m.codePointAt(0));
    return new TextDecoder().decode(bytes);
}

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
export async function generateToken(payload, secret) {
    const header = {
        alg: 'HS256',
        typ: 'JWT',
    };

    const data = {
        ...payload,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 days
    };

    const encodedHeader = base64encode(JSON.stringify(header));
    const encodedData = base64encode(JSON.stringify(data));

    const token = `${encodedHeader}.${encodedData}`;

    // Sign with secret key
    const signature = await createSignature(token, secret);

    return `${token}.${signature}`;
}

// Verify JWT token
export async function verifyToken(token, secret) {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) {
            return null;
        }

        const [encodedHeader, encodedData, signature] = parts;

        // Verify signature
        const expectedSignature = await createSignature(`${encodedHeader}.${encodedData}`, secret);

        if (signature !== expectedSignature) {
            return null;
        }

        const data = JSON.parse(base64decode(encodedData));

        // Check expiration
        if (data.exp && data.exp < Math.floor(Date.now() / 1000)) {
            return null;
        }

        return data;
    } catch (error) {
        console.error('Token verification error:', error);
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
