// API Service
const API = {
    baseURL: CONFIG.API.BASE_URL,

    // Make HTTP request
    async request(endpoint, options = {}) {
        const {
            method = 'GET',
            body = null,
            headers = {},
            timeout = CONFIG.API.TIMEOUT
        } = options;

        const token = Utils.storage.get(CONFIG.STORAGE_KEYS.AUTH_TOKEN);

        const defaultHeaders = {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        };

        const config = {
            method,
            headers: { ...defaultHeaders, ...headers },
            ...(body && { body: JSON.stringify(body) })
        };

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);

            const response = await fetch(`${this.baseURL}${endpoint}`, {
                ...config,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const error = await response.json().catch(() => ({
                    message: 'Erro na requisição'
                }));
                throw new Error(error.message || `HTTP ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('Tempo de requisição esgotado');
            }
            throw error;
        }
    },

    // GET request
    get(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'GET' });
    },

    // POST request
    post(endpoint, body, options = {}) {
        return this.request(endpoint, { ...options, method: 'POST', body });
    },

    // PUT request
    put(endpoint, body, options = {}) {
        return this.request(endpoint, { ...options, method: 'PUT', body });
    },

    // DELETE request
    delete(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'DELETE' });
    },

    // Upload file
    async uploadFile(endpoint, file, onProgress = null) {
        const formData = new FormData();
        formData.append('file', file);

        const token = Utils.storage.get(CONFIG.STORAGE_KEYS.AUTH_TOKEN);

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            if (onProgress) {
                xhr.upload.addEventListener('progress', (e) => {
                    if (e.lengthComputable) {
                        const percentComplete = (e.loaded / e.total) * 100;
                        onProgress(percentComplete);
                    }
                });
            }

            xhr.addEventListener('load', () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        resolve(JSON.parse(xhr.responseText));
                    } catch (e) {
                        resolve(xhr.responseText);
                    }
                } else {
                    reject(new Error(`Upload failed: ${xhr.status}`));
                }
            });

            xhr.addEventListener('error', () => {
                reject(new Error('Upload failed'));
            });

            xhr.open('POST', `${this.baseURL}${endpoint}`);

            if (token) {
                xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            }

            xhr.send(formData);
        });
    }
};

// Auth API
const AuthAPI = {
    // Register
    async register(data) {
        return API.post('/auth/register', data);
    },

    // Login
    async login(credentials) {
        const response = await API.post('/auth/login', credentials);

        if (response.token) {
            Utils.storage.set(CONFIG.STORAGE_KEYS.AUTH_TOKEN, response.token);
            Utils.storage.set(CONFIG.STORAGE_KEYS.USER_DATA, response.user);
        }

        return response;
    },

    // Logout
    logout() {
        Utils.storage.remove(CONFIG.STORAGE_KEYS.AUTH_TOKEN);
        Utils.storage.remove(CONFIG.STORAGE_KEYS.USER_DATA);
        window.location.href = '/';
    },

    // Get current user
    async getCurrentUser() {
        return API.get('/auth/me');
    },

    // Update profile
    async updateProfile(data) {
        const response = await API.put('/auth/profile', data);

        if (response.user) {
            Utils.storage.set(CONFIG.STORAGE_KEYS.USER_DATA, response.user);
        }

        return response;
    },

    // Request password reset
    async requestPasswordReset(email) {
        return API.post('/auth/forgot-password', { email });
    },

    // Reset password
    async resetPassword(token, password) {
        return API.post('/auth/reset-password', { token, password });
    }
};

// Credits API
const CreditsAPI = {
    // Get balance
    async getBalance() {
        return API.get('/credits/balance');
    },

    // Get transactions history
    async getTransactions(params = {}) {
        const query = Utils.buildQueryString(params);
        return API.get(`/credits/transactions?${query}`);
    },

    // Purchase credits
    async purchaseCredits(packageId, paymentMethod) {
        return API.post('/credits/purchase', { packageId, paymentMethod });
    },

    // Verify purchase
    async verifyPurchase(purchaseId) {
        return API.get(`/credits/purchase/${purchaseId}/verify`);
    }
};

// Services API
const ServicesAPI = {
    // Get all services
    async getServices(category = null) {
        const query = category ? `?category=${category}` : '';
        return API.get(`/services${query}`);
    },

    // Get service by ID
    async getService(serviceId) {
        return API.get(`/services/${serviceId}`);
    },

    // Check if user has enough credits
    async checkCredits(serviceId) {
        return API.get(`/services/${serviceId}/check-credits`);
    }
};

// Orders API
const OrdersAPI = {
    // Create order
    async createOrder(serviceId, formData) {
        return API.post('/orders', { serviceId, formData });
    },

    // Get all orders
    async getOrders(params = {}) {
        const query = Utils.buildQueryString(params);
        return API.get(`/orders?${query}`);
    },

    // Get order by ID
    async getOrder(orderId) {
        return API.get(`/orders/${orderId}`);
    },

    // Upload order file
    async uploadFile(orderId, file, fieldName) {
        return API.uploadFile(`/orders/${orderId}/files`, file);
    },

    // Download order file
    async downloadFile(orderId, fileId) {
        const response = await fetch(`${API.baseURL}/orders/${orderId}/files/${fileId}`, {
            headers: {
                'Authorization': `Bearer ${Utils.storage.get(CONFIG.STORAGE_KEYS.AUTH_TOKEN)}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to download file');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const filename = response.headers.get('Content-Disposition')?.split('filename=')[1] || 'download';

        Utils.downloadFile(blob, filename, blob.type);
    },

    // Cancel order
    async cancelOrder(orderId, reason) {
        return API.post(`/orders/${orderId}/cancel`, { reason });
    }
};

// Payment API
const PaymentAPI = {
    // Create payment
    async createPayment(data) {
        return API.post('/payments/create', data);
    },

    // Get payment status
    async getPaymentStatus(paymentId) {
        return API.get(`/payments/${paymentId}/status`);
    },

    // Process PIX payment
    async processPIX(amount, description) {
        return API.post('/payments/pix', { amount, description });
    },

    // Process credit card payment
    async processCreditCard(data) {
        return API.post('/payments/credit-card', data);
    },

    // Get payment history
    async getPaymentHistory(params = {}) {
        const query = Utils.buildQueryString(params);
        return API.get(`/payments/history?${query}`);
    }
};

// Notifications API
const NotificationsAPI = {
    // Get notifications
    async getNotifications(params = {}) {
        const query = Utils.buildQueryString(params);
        return API.get(`/notifications?${query}`);
    },

    // Mark as read
    async markAsRead(notificationId) {
        return API.put(`/notifications/${notificationId}/read`);
    },

    // Mark all as read
    async markAllAsRead() {
        return API.put('/notifications/read-all');
    },

    // Delete notification
    async deleteNotification(notificationId) {
        return API.delete(`/notifications/${notificationId}`);
    },

    // Get unread count
    async getUnreadCount() {
        return API.get('/notifications/unread-count');
    }
};

// Admin API
const AdminAPI = {
    // Dashboard stats
    async getDashboardStats() {
        return API.get('/admin/dashboard');
    },

    // Get all orders (admin)
    async getAllOrders(params = {}) {
        const query = Utils.buildQueryString(params);
        return API.get(`/admin/orders?${query}`);
    },

    // Update order status
    async updateOrderStatus(orderId, status, notes) {
        return API.put(`/admin/orders/${orderId}/status`, { status, notes });
    },

    // Assign order to team member
    async assignOrder(orderId, teamMemberId) {
        return API.put(`/admin/orders/${orderId}/assign`, { teamMemberId });
    },

    // Get all users
    async getUsers(params = {}) {
        const query = Utils.buildQueryString(params);
        return API.get(`/admin/users?${query}`);
    },

    // Update user credits
    async updateUserCredits(userId, credits, reason) {
        return API.put(`/admin/users/${userId}/credits`, { credits, reason });
    },

    // Get reports
    async getReports(type, params = {}) {
        const query = Utils.buildQueryString(params);
        return API.get(`/admin/reports/${type}?${query}`);
    }
};
