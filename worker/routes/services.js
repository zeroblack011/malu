/**
 * Services Routes
 */

import { Router } from 'itty-router';
import { jsonResponse } from '../index';

const router = Router({ base: '/api/services' });

// Get all services
router.get('/', async (request) => {
    try {
        const url = new URL(request.url);
        const category = url.searchParams.get('category');

        // In production, fetch from database
        // For now, returning config data
        return jsonResponse({
            services: [], // Would return CONFIG.SERVICES filtered by category
        });
    } catch (error) {
        return jsonResponse({ error: error.message }, 500);
    }
});

// Get service by ID
router.get('/:serviceId', async (request) => {
    try {
        const { serviceId } = request.params;

        // In production, fetch from database
        return jsonResponse({
            service: null, // Would return service data
        });
    } catch (error) {
        return jsonResponse({ error: error.message }, 500);
    }
});

export const servicesRoutes = router;
