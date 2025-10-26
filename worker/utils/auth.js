/**
 * Authentication Utilities - Cloudflare Workers Compatible
 * NO btoa/atob - pure implementation
 */

// Base64 encode without btoa (Workers compatible)
function base64encode(str) {
    const base64chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    const bytes = new TextEncoder().encode(str);
    let result = '';
    let i;

    for (i = 0; i < bytes.length; i += 3) {
        const a = bytes[i];
        const b = i + 1 < bytes.length ? bytes[i + 1] : 0;
        const c = i + 2 < bytes.length ? bytes[i + 2] : 0;

        const bitmap = (a << 16) | (b << 8) | c;

        result += base64chars[(bitmap >> 18) & 63];
        result += base64chars[(bitmap >> 12) & 63];
        result += i + 1 < bytes.length ? base64chars[(bitmap >> 6) & 63] : '';
        result += i + 2 < bytes.length ? base64chars[bitmap & 63] : '';
    }

    return result;
}

// Base64 decode without atob (Workers compatible)
function base64decode(str) {
    const base64chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    const bytes = [];

    for (let i = 0; i < str.length; i += 4) {
        const a = base64chars.indexOf(str[i]);
        const b = base64chars.indexOf(str[i + 1]);
        const c = i + 2 < str.length ? base64chars.indexOf(str[i + 2]) : 0;
        const d = i + 3 < str.length ? base64chars.indexOf(str[i + 3]) : 0;

        const bitmap = (a << 18) | (b << 12) | (c << 6) | d;

        bytes.push((bitmap >> 16) & 255);
        if (i + 2 < str.length) bytes.push((bitmap >> 8) & 255);
        if (i + 3 < str.length) bytes.push(bitmap & 255);
    }

    return new TextDecoder().decode(new Uint8Array(bytes));
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
