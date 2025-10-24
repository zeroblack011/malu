// Payment Manager
const Payment = {
    // Process payment
    async processPayment(amount, description, method = 'pix') {
        try {
            const paymentData = {
                amount,
                description,
                method
            };

            const response = await PaymentAPI.createPayment(paymentData);

            return response;
        } catch (error) {
            console.error('Payment processing error:', error);
            throw error;
        }
    },

    // Show payment history
    async showHistory() {
        try {
            Utils.showLoading();

            const response = await PaymentAPI.getPaymentHistory();
            const payments = response.payments || [];

            const html = `
                <div class="payments-page">
                    <div class="page-header">
                        <h2 class="page-title">Histórico de Pagamentos</h2>
                    </div>

                    <div class="payments-list">
                        ${this.renderPaymentsList(payments)}
                    </div>
                </div>
            `;

            document.getElementById('main-content').innerHTML = html;
        } catch (error) {
            Utils.showToast('Erro ao carregar histórico', 'error');
        } finally {
            Utils.hideLoading();
        }
    },

    // Render payments list
    renderPaymentsList(payments) {
        if (payments.length === 0) {
            return `
                <div class="empty-state">
                    <div class="empty-icon">💳</div>
                    <h3 class="empty-title">Nenhum pagamento</h3>
                    <p class="empty-description">Seu histórico de pagamentos aparecerá aqui</p>
                </div>
            `;
        }

        return payments.map(payment => {
            const statusClass = {
                'CONFIRMED': 'success',
                'PENDING': 'warning',
                'FAILED': 'error',
                'CANCELLED': 'error'
            };

            return `
                <div class="payment-card">
                    <div class="payment-header">
                        <div class="payment-info">
                            <h4 class="payment-description">${payment.description}</h4>
                            <p class="payment-date">${Utils.formatDateTime(payment.createdAt)}</p>
                        </div>
                        <span class="badge badge-${statusClass[payment.status] || 'info'}">
                            ${payment.status}
                        </span>
                    </div>

                    <div class="payment-details">
                        <div class="detail-item">
                            <span class="detail-label">Método:</span>
                            <span class="detail-value">${this.getPaymentMethodLabel(payment.method)}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Valor:</span>
                            <span class="detail-value">${Utils.formatCurrency(payment.amount)}</span>
                        </div>
                        ${payment.installments > 1 ? `
                            <div class="detail-item">
                                <span class="detail-label">Parcelas:</span>
                                <span class="detail-value">${payment.installments}x</span>
                            </div>
                        ` : ''}
                    </div>

                    ${payment.invoice ? `
                        <button
                            class="btn btn-sm btn-outline mt-2"
                            onclick="Payment.downloadInvoice('${payment.id}')"
                        >
                            📄 Download Comprovante
                        </button>
                    ` : ''}
                </div>
            `;
        }).join('');
    },

    // Get payment method label
    getPaymentMethodLabel(method) {
        const labels = {
            'pix': 'PIX',
            'credit_card': 'Cartão de Crédito',
            'boleto': 'Boleto',
            'debit_card': 'Cartão de Débito'
        };

        return labels[method] || method;
    },

    // Download invoice
    async downloadInvoice(paymentId) {
        try {
            Utils.showLoading();

            const response = await fetch(`${API.baseURL}/payments/${paymentId}/invoice`, {
                headers: {
                    'Authorization': `Bearer ${Utils.storage.get(CONFIG.STORAGE_KEYS.AUTH_TOKEN)}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to download invoice');
            }

            const blob = await response.blob();
            Utils.downloadFile(blob, `invoice-${paymentId}.pdf`, 'application/pdf');

            Utils.showToast('Comprovante baixado com sucesso!', 'success');
        } catch (error) {
            Utils.showToast('Erro ao baixar comprovante', 'error');
        } finally {
            Utils.hideLoading();
        }
    }
};
