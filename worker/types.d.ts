/**
 * Cloudflare Workers Global Types
 * Declares global variables injected by Wrangler during build
 */

// Workers Sites globals - injected by Wrangler when using [site] config
declare const __STATIC_CONTENT: KVNamespace;
declare const __STATIC_CONTENT_MANIFEST: string;

// Worker environment bindings
interface Env {
    USERS_KV: KVNamespace;
    ORDERS_KV: KVNamespace;
    ASAAS_API_KEY: string;
    JWT_SECRET: string;
    ASAAS_ENVIRONMENT: string;
    __STATIC_CONTENT?: KVNamespace;
}

// Extend Request to include env (used in routes)
declare global {
    interface Request {
        env?: Env;
        userId?: string;
        params?: Record<string, string>;
    }
}

export {};
