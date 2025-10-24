// Credits Manager
const Credits = {
    balance: 0,

    // Initialize
    async init() {
        await this.loadBalance();
        this.updateUI();
    },

    // Load balance
    async loadBalance() {
        try {
            const response = await CreditsAPI.getBalance();
            this.balance = response.balance || 0;
            return this.balance;
        } catch (error) {
            console.error('Error loading balance:', error);
            return 0;
        }
    },

    // Update UI
    updateUI() {
        const creditsElement = document.getElementById('user-credits');
        if (creditsElement) {
            creditsElement.textContent = Utils.formatNumber(this.balance);
        }
    },

    // Check if has enough credits
    hasEnoughCredits(amount) {
        return this.balance >= amount;
    },

    // Deduct credits
    async deduct(amount, description) {
        if (!this.hasEnoughCredits(amount)) {
            throw new Error('Créditos insuficientes');
        }

        this.balance -= amount;
        this.updateUI();

        return true;
    },

    // Add credits
    async add(amount, description) {
        this.balance += amount;
        this.updateUI();
    },

    // Show purchase modal
    showPurchaseModal(redirectAfter = false) {
        const modal = this.createPurchaseModal();
        document.getElementById('modal-container').innerHTML = modal;
        this.attachPurchaseEvents(redirectAfter);
    },

    // Create purchase modal
    createPurchaseModal() {
        const packages = CONFIG.CREDIT_PACKAGES.map(pkg => `
            <div class="credit-package ${pkg.popular ? 'popular' : ''}" data-package-id="${pkg.id}">
                ${pkg.popular ? '<div class="package-badge">MAIS POPULAR</div>' : ''}
                <div class="package-header">
                    <h3 class="package-name">${pkg.name}</h3>
                    <div class="package-price">${pkg.priceFormatted}</div>
                </div>
                <div class="package-credits">
                    <span class="credits-amount">${Utils.formatNumber(pkg.credits)}</span>
                    <span class="credits-label">créditos</span>
                </div>
                <ul class="package-benefits">
                    ${pkg.benefits.map(benefit => `<li>✓ ${benefit}</li>`).join('')}
                </ul>
                <button class="btn btn-primary btn-block" onclick="Credits.selectPackage('${pkg.id}')">
                    Comprar Agora
                </button>
            </div>
        `).join('');

        return `
            <div class="modal-overlay">
                <div class="modal modal-wide">
                    <div class="modal-header">
                        <h2 class="modal-title">Adquirir Créditos</h2>
                        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
                    </div>
                    <div class="modal-body">
                        <div class="credit-packages-grid">
                            ${packages}
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // Attach purchase events
    attachPurchaseEvents(redirectAfter) {
        // Store redirect flag
        this.redirectAfterPurchase = redirectAfter;
    },

    // Select package
    async selectPackage(packageId) {
        const pkg = CONFIG.CREDIT_PACKAGES.find(p => p.id === packageId);
        if (!pkg) return;

        this.showPaymentModal(pkg);
    },

    // Show payment modal
    showPaymentModal(pkg) {
        const modal = `
            <div class="modal-overlay">
                <div class="modal">
                    <div class="modal-header">
                        <h2 class="modal-title">Finalizar Compra</h2>
                        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
                    </div>
                    <div class="modal-body">
                        <div class="purchase-summary">
                            <h3>${pkg.name}</h3>
                            <div class="summary-item">
                                <span>Créditos:</span>
                                <strong>${Utils.formatNumber(pkg.credits)}</strong>
                            </div>
                            <div class="summary-item">
                                <span>Total:</span>
                                <strong>${pkg.priceFormatted}</strong>
                            </div>
                        </div>

                        <div class="payment-methods">
                            <h4 class="form-label">Escolha a forma de pagamento:</h4>

                            <button class="payment-method-btn" onclick="Credits.processPayment('${pkg.id}', 'pix')">
                                <span class="payment-icon">📱</span>
                                <div class="payment-info">
                                    <strong>PIX</strong>
                                    <small>Aprovação instantânea</small>
                                </div>
                            </button>

                            <button class="payment-method-btn" onclick="Credits.processPayment('${pkg.id}', 'credit_card')">
                                <span class="payment-icon">💳</span>
                                <div class="payment-info">
                                    <strong>Cartão de Crédito</strong>
                                    <small>Parcele em até 12x</small>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('modal-container').innerHTML = modal;
    },

    // Process payment
    async processPayment(packageId, paymentMethod) {
        const pkg = CONFIG.CREDIT_PACKAGES.find(p => p.id === packageId);
        if (!pkg) return;

        try {
            Utils.showLoading();

            if (paymentMethod === 'pix') {
                await this.processPIXPayment(pkg);
            } else if (paymentMethod === 'credit_card') {
                await this.processCreditCardPayment(pkg);
            }
        } catch (error) {
            Utils.showToast(error.message || 'Erro ao processar pagamento', 'error');
        } finally {
            Utils.hideLoading();
        }
    },

    // Process PIX payment
    async processPIXPayment(pkg) {
        try {
            const response = await PaymentAPI.processPIX(pkg.price, `Compra de ${pkg.credits} créditos`);

            this.showPIXPaymentModal(response, pkg);
        } catch (error) {
            throw error;
        }
    },

    // Show PIX payment modal
    showPIXPaymentModal(paymentData, pkg) {
        const modal = `
            <div class="modal-overlay">
                <div class="modal">
                    <div class="modal-header">
                        <h2 class="modal-title">Pagamento PIX</h2>
                    </div>
                    <div class="modal-body text-center">
                        <p class="mb-3">Escaneie o QR Code abaixo com o app do seu banco:</p>

                        <div class="qrcode-container">
                            ${paymentData.qrCode ? `<img src="${paymentData.qrCode}" alt="QR Code PIX" />` : ''}
                        </div>

                        <div class="pix-code-container">
                            <label class="form-label">Ou copie o código PIX:</label>
                            <div class="pix-code-box">
                                <input type="text" class="form-input" value="${paymentData.pixCode}" readonly id="pix-code-input">
                                <button class="btn btn-secondary" onclick="Credits.copyPIXCode()">
                                    Copiar
                                </button>
                            </div>
                        </div>

                        <div class="payment-info-box">
                            <p><strong>Valor:</strong> ${pkg.priceFormatted}</p>
                            <p><strong>Créditos:</strong> ${Utils.formatNumber(pkg.credits)}</p>
                        </div>

                        <p class="text-secondary mt-3">
                            Aguardando confirmação do pagamento...<br>
                            Os créditos serão adicionados automaticamente após a confirmação.
                        </p>

                        <div class="loading-spinner mt-3"></div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('modal-container').innerHTML = modal;

        // Start polling for payment confirmation
        this.pollPaymentStatus(paymentData.paymentId, pkg);
    },

    // Copy PIX code
    async copyPIXCode() {
        const input = document.getElementById('pix-code-input');
        await Utils.copyToClipboard(input.value);
        Utils.showToast('Código PIX copiado!', 'success');
    },

    // Poll payment status
    async pollPaymentStatus(paymentId, pkg, attempts = 0) {
        const maxAttempts = 120; // 10 minutes (5 seconds interval)

        if (attempts >= maxAttempts) {
            Utils.showToast('Tempo de espera excedido. Verifique seu email.', 'warning');
            document.getElementById('modal-container').innerHTML = '';
            return;
        }

        try {
            const response = await PaymentAPI.getPaymentStatus(paymentId);

            if (response.status === 'CONFIRMED' || response.status === 'RECEIVED') {
                await this.handlePaymentSuccess(pkg);
                return;
            }

            // Continue polling
            setTimeout(() => {
                this.pollPaymentStatus(paymentId, pkg, attempts + 1);
            }, 5000);
        } catch (error) {
            console.error('Error checking payment status:', error);

            // Continue polling even on error
            setTimeout(() => {
                this.pollPaymentStatus(paymentId, pkg, attempts + 1);
            }, 5000);
        }
    },

    // Process credit card payment
    async processCreditCardPayment(pkg) {
        const modal = `
            <div class="modal-overlay">
                <div class="modal">
                    <div class="modal-header">
                        <h2 class="modal-title">Pagamento com Cartão</h2>
                        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
                    </div>
                    <div class="modal-body">
                        <form id="credit-card-form">
                            <div class="form-group">
                                <label class="form-label">Número do Cartão <span class="form-required">*</span></label>
                                <input type="text" name="cardNumber" class="form-input" placeholder="0000 0000 0000 0000" required maxlength="19">
                            </div>

                            <div class="grid grid-cols-2">
                                <div class="form-group">
                                    <label class="form-label">Validade <span class="form-required">*</span></label>
                                    <input type="text" name="expiryDate" class="form-input" placeholder="MM/AA" required maxlength="5">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">CVV <span class="form-required">*</span></label>
                                    <input type="text" name="cvv" class="form-input" placeholder="000" required maxlength="4">
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="form-label">Nome no Cartão <span class="form-required">*</span></label>
                                <input type="text" name="holderName" class="form-input" required>
                            </div>

                            <div class="form-group">
                                <label class="form-label">CPF do Titular <span class="form-required">*</span></label>
                                <input type="text" name="holderCPF" class="form-input" placeholder="000.000.000-00" required>
                            </div>

                            <div class="form-group">
                                <label class="form-label">Parcelas <span class="form-required">*</span></label>
                                <select name="installments" class="form-select" required>
                                    ${this.generateInstallmentOptions(pkg.price)}
                                </select>
                            </div>

                            <button type="submit" class="btn btn-primary btn-block btn-lg">
                                Pagar ${pkg.priceFormatted}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('modal-container').innerHTML = modal;

        // Attach form events
        const form = document.getElementById('credit-card-form');

        // Card number formatting
        form.querySelector('[name="cardNumber"]').addEventListener('input', (e) => {
            let value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
            value = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = value;
        });

        // Expiry date formatting
        form.querySelector('[name="expiryDate"]').addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            e.target.value = value;
        });

        // CVV formatting
        form.querySelector('[name="cvv"]').addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '');
        });

        // CPF formatting
        form.querySelector('[name="holderCPF"]').addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.slice(0, 11);
            e.target.value = Utils.formatCPF(value);
        });

        // Form submission
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.submitCreditCardPayment(form, pkg);
        });
    },

    // Generate installment options
    generateInstallmentOptions(totalAmount) {
        const maxInstallments = 12;
        let options = '';

        for (let i = 1; i <= maxInstallments; i++) {
            const installmentAmount = totalAmount / i;
            const label = i === 1
                ? `1x de ${Utils.formatCurrency(totalAmount)} sem juros`
                : `${i}x de ${Utils.formatCurrency(installmentAmount)} sem juros`;

            options += `<option value="${i}">${label}</option>`;
        }

        return options;
    },

    // Submit credit card payment
    async submitCreditCardPayment(form, pkg) {
        const formData = new FormData(form);

        // Validate CPF
        const cpf = formData.get('holderCPF').replace(/\D/g, '');
        if (!Utils.validateCPF(cpf)) {
            Utils.showToast('CPF inválido', 'error');
            return;
        }

        const paymentData = {
            packageId: pkg.id,
            amount: pkg.price,
            cardNumber: formData.get('cardNumber').replace(/\s/g, ''),
            expiryMonth: formData.get('expiryDate').split('/')[0],
            expiryYear: '20' + formData.get('expiryDate').split('/')[1],
            cvv: formData.get('cvv'),
            holderName: formData.get('holderName'),
            holderCPF: cpf,
            installments: parseInt(formData.get('installments'))
        };

        try {
            Utils.showLoading();

            const response = await PaymentAPI.processCreditCard(paymentData);

            if (response.status === 'CONFIRMED') {
                await this.handlePaymentSuccess(pkg);
            } else {
                Utils.showToast('Pagamento em processamento. Você receberá uma confirmação em breve.', 'info');
                document.getElementById('modal-container').innerHTML = '';
            }
        } catch (error) {
            Utils.showToast(error.message || 'Erro ao processar pagamento', 'error');
        } finally {
            Utils.hideLoading();
        }
    },

    // Handle payment success
    async handlePaymentSuccess(pkg) {
        document.getElementById('modal-container').innerHTML = '';

        // Update balance
        await this.add(pkg.credits, `Compra do ${pkg.name}`);

        Utils.showToast(`${Utils.formatNumber(pkg.credits)} créditos adicionados à sua conta!`, 'success');

        // Redirect if needed
        if (this.redirectAfterPurchase) {
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        }
    },

    // Show credits page
    showCreditsPage() {
        const html = `
            <div class="credits-page">
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title">Meu Saldo</h2>
                    </div>
                    <div class="card-body text-center">
                        <div class="balance-display">
                            <span class="balance-icon">💎</span>
                            <div class="balance-amount">${Utils.formatNumber(this.balance)}</div>
                            <div class="balance-label">créditos disponíveis</div>
                        </div>
                        <button class="btn btn-primary btn-lg mt-3" onclick="Credits.showPurchaseModal()">
                            Adicionar Créditos
                        </button>
                    </div>
                </div>

                <div class="card mt-3">
                    <div class="card-header">
                        <h3 class="card-title">Histórico de Transações</h3>
                    </div>
                    <div class="card-body">
                        <div id="transactions-list"></div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('main-content').innerHTML = html;
        this.loadTransactions();
    },

    // Load transactions
    async loadTransactions() {
        try {
            const response = await CreditsAPI.getTransactions();
            this.renderTransactions(response.transactions || []);
        } catch (error) {
            console.error('Error loading transactions:', error);
        }
    },

    // Render transactions
    renderTransactions(transactions) {
        const container = document.getElementById('transactions-list');

        if (transactions.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📊</div>
                    <h3 class="empty-title">Nenhuma transação</h3>
                    <p class="empty-description">Suas transações aparecerão aqui</p>
                </div>
            `;
            return;
        }

        const html = transactions.map(t => `
            <div class="transaction-item">
                <div class="transaction-info">
                    <strong>${t.description}</strong>
                    <small>${Utils.formatDateTime(t.createdAt)}</small>
                </div>
                <div class="transaction-amount ${t.type === 'credit' ? 'positive' : 'negative'}">
                    ${t.type === 'credit' ? '+' : '-'}${Utils.formatNumber(t.amount)}
                </div>
            </div>
        `).join('');

        container.innerHTML = html;
    }
};
