/**
 * Asaas API Integration
 */

const ASAAS_API_URL = 'https://www.asaas.com/api/v3';

// Create payment
export async function createAsaasPayment(apiKey, paymentData) {
    try {
        const response = await fetch(`${ASAAS_API_URL}/payments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'access_token': apiKey,
            },
            body: JSON.stringify(paymentData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Payment creation failed');
        }

        return await response.json();
    } catch (error) {
        console.error('Asaas payment error:', error);
        throw error;
    }
}

// Get payment status
export async function getAsaasPaymentStatus(apiKey, paymentId) {
    try {
        const response = await fetch(`${ASAAS_API_URL}/payments/${paymentId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'access_token': apiKey,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to get payment status');
        }

        return await response.json();
    } catch (error) {
        console.error('Asaas status error:', error);
        throw error;
    }
}

// Create customer
export async function createAsaasCustomer(apiKey, customerData) {
    try {
        const response = await fetch(`${ASAAS_API_URL}/customers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'access_token': apiKey,
            },
            body: JSON.stringify(customerData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Customer creation failed');
        }

        return await response.json();
    } catch (error) {
        console.error('Asaas customer error:', error);
        throw error;
    }
}

// List payments
export async function listAsaasPayments(apiKey, params = {}) {
    try {
        const queryString = new URLSearchParams(params).toString();
        const url = `${ASAAS_API_URL}/payments${queryString ? `?${queryString}` : ''}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'access_token': apiKey,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to list payments');
        }

        return await response.json();
    } catch (error) {
        console.error('Asaas list error:', error);
        throw error;
    }
}
