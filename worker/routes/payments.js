/**
 * Payments Routes - Asaas Integration
 */

import { Router } from 'itty-router';
import { jsonResponse } from '../index';
import { verifyToken } from '../utils/auth';
import { createAsaasPayment, getAsaasPaymentStatus } from '../utils/asaas';
import { addCredits } from './credits';

const router = Router({ base: '/api/payments' });

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

// Process PIX payment
router.post('/pix', requireAuth, async (request) => {
    try {
        const { amount, description } = await request.json();

        // Get user data
        const userData = await request.env.USERS_KV.get(`user:${request.userId}`);
        const user = JSON.parse(userData);

        // Create payment with Asaas
        const paymentData = {
            customer: user.email,
            billingType: 'PIX',
            value: amount,
            dueDate: new Date().toISOString().split('T')[0],
            description,
        };

        const asaasResponse = await createAsaasPayment(request.env.ASAAS_API_KEY, paymentData);

        // Store payment record
        const payment = {
            id: crypto.randomUUID(),
            userId: request.userId,
            asaasId: asaasResponse.id,
            amount,
            description,
            method: 'pix',
            status: 'PENDING',
            createdAt: new Date().toISOString(),
        };

        await request.env.ORDERS_KV.put(`payment:${payment.id}`, JSON.stringify(payment));

        return jsonResponse({
            paymentId: payment.id,
            pixCode: asaasResponse.pixCode,
            qrCode: asaasResponse.qrCodeBase64,
            expiresAt: asaasResponse.expirationDate,
        });
    } catch (error) {
        return jsonResponse({ error: error.message }, 500);
    }
});

// Process credit card payment
router.post('/credit-card', requireAuth, async (request) => {
    try {
        const {
            packageId,
            amount,
            cardNumber,
            expiryMonth,
            expiryYear,
            cvv,
            holderName,
            holderCPF,
            installments,
        } = await request.json();

        // Get user data
        const userData = await request.env.USERS_KV.get(`user:${request.userId}`);
        const user = JSON.parse(userData);

        // Create payment with Asaas
        const paymentData = {
            customer: user.email,
            billingType: 'CREDIT_CARD',
            value: amount,
            dueDate: new Date().toISOString().split('T')[0],
            description: `Compra de créditos - ${packageId}`,
            installmentCount: installments,
            creditCard: {
                holderName,
                number: cardNumber,
                expiryMonth,
                expiryYear,
                ccv: cvv,
            },
            creditCardHolderInfo: {
                name: holderName,
                cpfCnpj: holderCPF,
            },
        };

        const asaasResponse = await createAsaasPayment(request.env.ASAAS_API_KEY, paymentData);

        // Store payment record
        const payment = {
            id: crypto.randomUUID(),
            userId: request.userId,
            asaasId: asaasResponse.id,
            amount,
            packageId,
            method: 'credit_card',
            installments,
            status: asaasResponse.status === 'CONFIRMED' ? 'CONFIRMED' : 'PENDING',
            createdAt: new Date().toISOString(),
        };

        await request.env.ORDERS_KV.put(`payment:${payment.id}`, JSON.stringify(payment));

        // If confirmed, add credits immediately
        if (payment.status === 'CONFIRMED') {
            // Get package credits
            const packages = {
                'starter': 600,
                'business': 1400,
                'premium': 5000,
                'empire': 10000,
            };

            const credits = packages[packageId];
            if (credits) {
                await addCredits(
                    request.env,
                    request.userId,
                    credits,
                    `Compra do Pacote ${packageId}`
                );
            }
        }

        return jsonResponse({
            paymentId: payment.id,
            status: payment.status,
        });
    } catch (error) {
        return jsonResponse({ error: error.message }, 500);
    }
});

// Get payment status
router.get('/:paymentId/status', requireAuth, async (request) => {
    try {
        const { paymentId } = request.params;

        const paymentData = await request.env.ORDERS_KV.get(`payment:${paymentId}`);
        if (!paymentData) {
            return jsonResponse({ error: 'Payment not found' }, 404);
        }

        const payment = JSON.parse(paymentData);

        // Verify payment belongs to user
        if (payment.userId !== request.userId) {
            return jsonResponse({ error: 'Forbidden' }, 403);
        }

        // Check status with Asaas
        if (payment.status === 'PENDING' && payment.asaasId) {
            const asaasStatus = await getAsaasPaymentStatus(
                request.env.ASAAS_API_KEY,
                payment.asaasId
            );

            if (asaasStatus.status !== payment.status) {
                payment.status = asaasStatus.status;
                await request.env.ORDERS_KV.put(`payment:${paymentId}`, JSON.stringify(payment));

                // If confirmed, add credits
                if (payment.status === 'CONFIRMED' && payment.packageId) {
                    const packages = {
                        'starter': 600,
                        'business': 1400,
                        'premium': 5000,
                        'empire': 10000,
                    };

                    const credits = packages[payment.packageId];
                    if (credits) {
                        await addCredits(
                            request.env,
                            payment.userId,
                            credits,
                            `Compra do Pacote ${payment.packageId}`
                        );
                    }
                }
            }
        }

        return jsonResponse({
            status: payment.status,
            updatedAt: new Date().toISOString(),
        });
    } catch (error) {
        return jsonResponse({ error: error.message }, 500);
    }
});

// Get payment history
router.get('/history', requireAuth, async (request) => {
    try {
        // This would query all payments for the user
        // For simplicity, returning empty array
        return jsonResponse({ payments: [] });
    } catch (error) {
        return jsonResponse({ error: error.message }, 500);
    }
});

// Webhook handler for Asaas callbacks
router.post('/webhook/asaas', async (request) => {
    try {
        const event = await request.json();

        // Handle payment confirmation
        if (event.event === 'PAYMENT_CONFIRMED') {
            // Find payment by Asaas ID and process
            // This is simplified - in production, you'd search KV or use a database
        }

        return jsonResponse({ received: true });
    } catch (error) {
        return jsonResponse({ error: error.message }, 500);
    }
});

export const paymentsRoutes = router;
