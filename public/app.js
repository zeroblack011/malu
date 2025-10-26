// ==================== GLOBAL STATE ====================
const APP = {
    currentUser: null,
    services: [],
    creditPackages: [],
    orders: [],
    currentView: 'home'
};

// ==================== API BASE ====================
const API_BASE = window.location.origin;

// ==================== UTILITY FUNCTIONS ====================
function showLoading() {
    document.getElementById('loadingOverlay').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<div class="toast-message">${message}</div>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

function formatCredits(value) {
    return new Intl.NumberFormat('pt-BR').format(value);
}

// ==================== NAVIGATION ====================
function switchView(viewName) {
    // Hide all views
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });

    // Show selected view
    const targetView = document.getElementById(`${viewName}View`);
    if (targetView) {
        targetView.classList.add('active');
    }

    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.view === viewName) {
            btn.classList.add('active');
        }
    });

    APP.currentView = viewName;

    // Load view-specific data
    if (viewName === 'services' && APP.services.length === 0) {
        loadServices();
    } else if (viewName === 'credits' && APP.creditPackages.length === 0) {
        loadCreditPackages();
    } else if (viewName === 'orders' && APP.currentUser) {
        loadOrders();
    }
}

// Setup navigation event listeners
function setupNavigation() {
    document.querySelectorAll('[data-view]').forEach(btn => {
        btn.addEventListener('click', () => {
            const viewName = btn.dataset.view;
            switchView(viewName);
        });
    });
}

// ==================== USER MANAGEMENT ====================
function loadUserFromStorage() {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
        APP.currentUser = JSON.parse(userData);
        updateUIForLoggedInUser();
        return true;
    }
    return false;
}

function saveUserToStorage(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    APP.currentUser = user;
}

function updateUIForLoggedInUser() {
    // Hide register card, show welcome card
    document.getElementById('registerCard').style.display = 'none';
    document.getElementById('welcomeCard').style.display = 'block';

    // Show navigation
    document.getElementById('mainNav').style.display = 'flex';
    document.getElementById('userInfo').style.display = 'flex';

    // Update user info
    document.getElementById('userName').textContent = APP.currentUser.name;
    updateCreditsDisplay();
}

function updateCreditsDisplay() {
    if (!APP.currentUser) return;

    const creditsElements = [
        document.getElementById('userCredits'),
        document.getElementById('userCreditsWelcome')
    ];

    creditsElements.forEach(el => {
        if (el) el.textContent = formatCredits(APP.currentUser.credits || 0);
    });
}

async function refreshUserData() {
    if (!APP.currentUser) return;

    try {
        const response = await fetch(`${API_BASE}/api/users/${APP.currentUser.id}`);
        const data = await response.json();

        if (data.user) {
            saveUserToStorage(data.user);
            updateCreditsDisplay();
        }
    } catch (error) {
        console.error('Error refreshing user data:', error);
    }
}

// ==================== USER REGISTRATION ====================
function setupRegistration() {
    const form = document.getElementById('registerForm');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('regName').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const phone = document.getElementById('regPhone').value.trim();

        if (!name || !email || !phone) {
            showToast('Preencha todos os campos', 'error');
            return;
        }

        showLoading();

        try {
            const response = await fetch(`${API_BASE}/api/users/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, phone })
            });

            const data = await response.json();

            if (response.ok && data.user) {
                saveUserToStorage(data.user);
                updateUIForLoggedInUser();
                showToast('Conta criada com sucesso!', 'success');
            } else {
                showToast(data.error || 'Erro ao criar conta', 'error');
            }
        } catch (error) {
            showToast('Erro ao conectar com servidor', 'error');
            console.error('Registration error:', error);
        } finally {
            hideLoading();
        }
    });
}

// ==================== SERVICES ====================
async function loadServices() {
    showLoading();

    try {
        const response = await fetch(`${API_BASE}/api/services`);
        const data = await response.json();

        if (data.services) {
            APP.services = data.services;
            displayServices(APP.services);
            setupServiceFilters();
        }
    } catch (error) {
        showToast('Erro ao carregar serviços', 'error');
        console.error('Load services error:', error);
    } finally {
        hideLoading();
    }
}

function displayServices(services) {
    const container = document.getElementById('servicesList');

    if (services.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>Nenhum serviço encontrado</p></div>';
        return;
    }

    container.innerHTML = services.map(service => `
        <div class="service-card" data-service-id="${service.id}">
            <div class="service-header">
                <div class="service-icon">${service.icon || 'SVC'}</div>
                <div class="service-title-group">
                    <div class="service-category">${service.category}</div>
                    <div class="service-title">${service.name}</div>
                </div>
            </div>
            <div class="service-description">${service.description}</div>
            <div class="service-footer">
                <div class="service-price">${formatCredits(service.credits)} créditos</div>
                <div class="service-delivery">${service.deliveryTime}</div>
            </div>
        </div>
    `).join('');

    // Add click handlers
    container.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('click', () => {
            const serviceId = card.dataset.serviceId;
            const service = APP.services.find(s => s.id === serviceId);
            if (service) showServiceModal(service);
        });
    });
}

function setupServiceFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter services
            const category = btn.dataset.category;

            if (category === 'all') {
                displayServices(APP.services);
            } else {
                const filtered = APP.services.filter(s => s.category === category);
                displayServices(filtered);
            }
        });
    });
}

// ==================== SERVICE MODAL ====================
function showServiceModal(service) {
    if (!APP.currentUser) {
        showToast('Crie uma conta primeiro', 'warning');
        switchView('home');
        return;
    }

    const modal = document.getElementById('serviceModal');
    const details = document.getElementById('serviceDetails');

    // Build features list
    const featuresList = service.features
        ? service.features.map(f => `<li>${f}</li>`).join('')
        : '';

    // Build form fields
    const formFields = service.fields
        ? service.fields.map(field => {
            if (field.type === 'textarea') {
                return `
                    <div class="form-group">
                        <label>${field.label}${field.required ? ' *' : ''}</label>
                        <textarea
                            name="${field.name}"
                            ${field.required ? 'required' : ''}
                            placeholder="${field.placeholder || ''}"
                        ></textarea>
                    </div>
                `;
            } else if (field.type === 'select') {
                const options = field.options
                    ? field.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')
                    : '';
                return `
                    <div class="form-group">
                        <label>${field.label}${field.required ? ' *' : ''}</label>
                        <select name="${field.name}" ${field.required ? 'required' : ''}>
                            <option value="">Selecione...</option>
                            ${options}
                        </select>
                    </div>
                `;
            } else if (field.type === 'file') {
                return `
                    <div class="form-group">
                        <label>${field.label}${field.required ? ' *' : ''}</label>
                        <input
                            type="file"
                            name="${field.name}"
                            ${field.required ? 'required' : ''}
                            ${field.accept ? `accept="${field.accept}"` : ''}
                        />
                    </div>
                `;
            } else {
                return `
                    <div class="form-group">
                        <label>${field.label}${field.required ? ' *' : ''}</label>
                        <input
                            type="${field.type}"
                            name="${field.name}"
                            ${field.required ? 'required' : ''}
                            placeholder="${field.placeholder || ''}"
                        />
                    </div>
                `;
            }
        }).join('')
        : '';

    details.innerHTML = `
        <h2>${service.name}</h2>
        <p class="service-category">${service.category}</p>
        <p class="service-description" style="margin: 20px 0;">${service.description}</p>

        ${featuresList ? `
            <div style="margin: 20px 0;">
                <h3>Incluído neste serviço:</h3>
                <ul class="package-features">${featuresList}</ul>
            </div>
        ` : ''}

        <div style="background: var(--surface-light); padding: 20px; border-radius: var(--radius-md); margin: 20px 0;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <div style="color: var(--text-muted); font-size: 14px;">Custo do serviço</div>
                    <div style="font-size: 28px; font-weight: 800; color: var(--secondary-color);">
                        ${formatCredits(service.credits)} créditos
                    </div>
                </div>
                <div style="text-align: right;">
                    <div style="color: var(--text-muted); font-size: 14px;">Seus créditos</div>
                    <div style="font-size: 24px; font-weight: 700; color: ${APP.currentUser.credits >= service.credits ? 'var(--success-color)' : 'var(--error-color)'};">
                        ${formatCredits(APP.currentUser.credits || 0)}
                    </div>
                </div>
            </div>
        </div>

        ${APP.currentUser.credits < service.credits ? `
            <div style="background: var(--warning-color); color: white; padding: 16px; border-radius: var(--radius-md); margin: 20px 0; text-align: center;">
                <strong>Créditos insuficientes!</strong><br>
                <button class="btn-primary" style="margin-top: 12px;" onclick="switchView('credits'); closeModal('serviceModal');">
                    Comprar Créditos
                </button>
            </div>
        ` : `
            <form id="serviceOrderForm">
                <h3>Preencha os dados do serviço:</h3>
                ${formFields}
                <button type="submit" class="btn-primary btn-large" style="margin-top: 20px;">
                    Contratar Serviço - ${formatCredits(service.credits)} créditos
                </button>
            </form>
        `}
    `;

    // Setup form submission
    const form = details.querySelector('#serviceOrderForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await submitServiceOrder(service, new FormData(form));
        });
    }

    modal.classList.add('active');
}

async function submitServiceOrder(service, formData) {
    showLoading();

    try {
        // Convert FormData to JSON
        const data = {};
        const files = {};

        for (let [key, value] of formData.entries()) {
            if (value instanceof File) {
                // For files, we'll store them as base64 (simplified approach)
                const base64 = await fileToBase64(value);
                files[key] = {
                    name: value.name,
                    type: value.type,
                    data: base64
                };
            } else {
                data[key] = value;
            }
        }

        const response = await fetch(`${API_BASE}/api/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-User-ID': APP.currentUser.id
            },
            body: JSON.stringify({
                userId: APP.currentUser.id,
                serviceId: service.id,
                formData: data,
                files: files
            })
        });

        const result = await response.json();

        if (response.ok && result.order) {
            showToast('Pedido realizado com sucesso!', 'success');
            closeModal('serviceModal');

            // Update user credits
            APP.currentUser.credits = result.newBalance;
            saveUserToStorage(APP.currentUser);
            updateCreditsDisplay();

            // Switch to orders view
            setTimeout(() => switchView('orders'), 1000);
        } else {
            showToast(result.error || 'Erro ao criar pedido', 'error');
        }
    } catch (error) {
        showToast('Erro ao processar pedido', 'error');
        console.error('Order submission error:', error);
    } finally {
        hideLoading();
    }
}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// ==================== CREDIT PACKAGES ====================
async function loadCreditPackages() {
    showLoading();

    try {
        const response = await fetch(`${API_BASE}/api/credits/packages`);
        const data = await response.json();

        if (data.packages) {
            APP.creditPackages = data.packages;
            displayCreditPackages(APP.creditPackages);
        }
    } catch (error) {
        showToast('Erro ao carregar pacotes', 'error');
        console.error('Load credit packages error:', error);
    } finally {
        hideLoading();
    }
}

function displayCreditPackages(packages) {
    const container = document.getElementById('creditPackages');

    container.innerHTML = packages.map(pkg => `
        <div class="package-card ${pkg.popular ? 'popular' : ''}" data-package-id="${pkg.id}">
            ${pkg.popular ? '<div class="package-badge">Mais Popular</div>' : ''}
            <div class="package-name">${pkg.name}</div>
            <div class="package-credits">
                ${formatCredits(pkg.credits)}
                <span class="package-credits-label">créditos</span>
            </div>
            <div class="package-price">${formatCurrency(pkg.price)}</div>
            ${pkg.bonus ? `<div style="color: var(--secondary-color); font-size: 14px; margin: 10px 0;">${pkg.bonus}</div>` : ''}
            ${pkg.description ? `<p style="color: var(--text-secondary); font-size: 14px; margin: 16px 0;">${pkg.description}</p>` : ''}
            <button class="package-btn">Comprar via PIX</button>
        </div>
    `).join('');

    // Add click handlers
    container.querySelectorAll('.package-card').forEach(card => {
        const btn = card.querySelector('.package-btn');
        btn.addEventListener('click', () => {
            const packageId = card.dataset.packageId;
            const pkg = APP.creditPackages.find(p => p.id === packageId);
            if (pkg) initiatePixPayment(pkg);
        });
    });
}

// ==================== PIX PAYMENT ====================
async function initiatePixPayment(pkg) {
    if (!APP.currentUser) {
        showToast('Faça login primeiro', 'warning');
        switchView('home');
        return;
    }

    showLoading();

    try {
        const response = await fetch(`${API_BASE}/api/credits/purchase`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: APP.currentUser.id,
                packageId: pkg.id,
                customer: {
                    name: APP.currentUser.name,
                    email: APP.currentUser.email,
                    phone: APP.currentUser.phone,
                    cpf: '00000000000' // TODO: Collect CPF in registration
                }
            })
        });

        const data = await response.json();

        if (response.ok && data.pixCode) {
            showPixModal(data, pkg);
        } else {
            showToast(data.error || 'Erro ao gerar PIX', 'error');
        }
    } catch (error) {
        showToast('Erro ao processar pagamento', 'error');
        console.error('PIX payment error:', error);
    } finally {
        hideLoading();
    }
}

function showPixModal(paymentData, pkg) {
    const modal = document.getElementById('pixModal');
    const content = document.getElementById('pixPayment');

    content.innerHTML = `
        <div style="text-align: center;">
            <h2>Pagamento via PIX</h2>
            <p style="color: var(--text-secondary); margin: 12px 0;">
                Pacote ${pkg.name} - ${formatCredits(pkg.credits)} créditos
            </p>
            <div style="font-size: 32px; font-weight: 800; color: var(--secondary-color); margin: 16px 0;">
                ${formatCurrency(pkg.price)}
            </div>

            <div style="background: white; padding: 20px; border-radius: var(--radius-md); margin: 24px 0;">
                ${paymentData.pixQrCode ? `<img src="${paymentData.pixQrCode}" alt="QR Code PIX" style="max-width: 100%; height: auto;">` : '<p style="color: var(--text-muted);">QR Code será gerado em instantes...</p>'}
            </div>

            <div style="background: var(--surface-light); padding: 16px; border-radius: var(--radius-md); margin: 20px 0;">
                <p style="color: var(--text-secondary); font-size: 14px; margin-bottom: 8px;">
                    Código PIX Copia e Cola:
                </p>
                <input
                    type="text"
                    value="${paymentData.pixCode || 'Gerando...'}"
                    readonly
                    style="width: 100%; padding: 12px; background: var(--surface); border: 2px solid var(--border-color); border-radius: var(--radius-sm); color: var(--text-primary); font-size: 12px; font-family: monospace;"
                    onclick="this.select(); document.execCommand('copy'); showToast('Código copiado!', 'success');"
                />
            </div>

            <div style="background: var(--primary-color); color: white; padding: 16px; border-radius: var(--radius-md); margin: 20px 0;">
                <div style="font-size: 14px; margin-bottom: 8px;">Status do Pagamento:</div>
                <div id="paymentStatus" style="font-size: 18px; font-weight: 700;">Aguardando pagamento...</div>
            </div>

            <p style="color: var(--text-muted); font-size: 13px; margin-top: 20px;">
                Seus créditos serão adicionados automaticamente após a confirmação do pagamento
            </p>
        </div>
    `;

    modal.classList.add('active');

    // Start polling for payment status
    startPaymentStatusPolling(paymentData.paymentId);
}

let paymentPollingInterval;

function startPaymentStatusPolling(paymentId) {
    // Clear any existing interval
    if (paymentPollingInterval) {
        clearInterval(paymentPollingInterval);
    }

    // Poll every 3 seconds
    paymentPollingInterval = setInterval(async () => {
        try {
            const response = await fetch(`${API_BASE}/api/credits/payment/${paymentId}/status`);
            const data = await response.json();

            if (data.paid) {
                clearInterval(paymentPollingInterval);

                // Update status
                const statusEl = document.getElementById('paymentStatus');
                if (statusEl) {
                    statusEl.textContent = 'Pagamento confirmado!';
                    statusEl.parentElement.style.background = 'var(--success-color)';
                }

                // Refresh user data
                await refreshUserData();

                showToast('Pagamento confirmado! Créditos adicionados.', 'success');

                // Close modal after delay
                setTimeout(() => {
                    closeModal('pixModal');
                    switchView('home');
                }, 2000);
            }
        } catch (error) {
            console.error('Payment status check error:', error);
        }
    }, 3000);
}

// ==================== ORDERS ====================
async function loadOrders() {
    if (!APP.currentUser) return;

    showLoading();

    try {
        const response = await fetch(`${API_BASE}/api/orders/user/${APP.currentUser.id}`);
        const data = await response.json();

        if (data.orders) {
            APP.orders = data.orders;
            displayOrders(APP.orders);
        }
    } catch (error) {
        showToast('Erro ao carregar pedidos', 'error');
        console.error('Load orders error:', error);
    } finally {
        hideLoading();
    }
}

function displayOrders(orders) {
    const container = document.getElementById('ordersList');

    if (orders.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>Você ainda não fez nenhum pedido</p>
                <button class="btn-primary" data-view="services">Ver Serviços</button>
            </div>
        `;

        // Re-attach event listener
        container.querySelector('[data-view]').addEventListener('click', function() {
            switchView(this.dataset.view);
        });
        return;
    }

    container.innerHTML = orders.map(order => {
        const statusClass = order.status.toLowerCase();
        const statusText = {
            'PENDING': 'Pendente',
            'PROCESSING': 'Em Processamento',
            'COMPLETED': 'Concluído',
            'CANCELLED': 'Cancelado'
        }[order.status] || order.status;

        const date = new Date(order.createdAt).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        return `
            <div class="order-card">
                <div class="order-header">
                    <div>
                        <div class="order-title">${order.serviceName}</div>
                        <div style="color: var(--text-muted); font-size: 13px; margin-top: 4px;">
                            Pedido em ${date}
                        </div>
                    </div>
                    <div class="order-status ${statusClass}">${statusText}</div>
                </div>
                <div class="order-info">
                    <div>Créditos utilizados: <strong>${formatCredits(order.creditsUsed)}</strong></div>
                    ${order.updates && order.updates.length > 0 ? `
                        <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--border-color);">
                            <strong>Atualizações:</strong>
                            ${order.updates.map(update => `
                                <div style="margin-top: 8px; font-size: 13px;">
                                    <span style="color: var(--text-muted);">${new Date(update.date).toLocaleDateString('pt-BR')}</span>
                                    - ${update.message}
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
}

// ==================== MODAL CONTROLS ====================
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }

    // Stop payment polling if closing PIX modal
    if (modalId === 'pixModal' && paymentPollingInterval) {
        clearInterval(paymentPollingInterval);
    }
}

function setupModals() {
    // Close button handlers
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            if (modal) {
                closeModal(modal.id);
            }
        });
    });

    // Click outside to close
    document.querySelectorAll('.modal').forEach(modal => {
        modal.querySelector('.modal-overlay')?.addEventListener('click', () => {
            closeModal(modal.id);
        });
    });
}

// ==================== INITIALIZATION ====================
function init() {
    console.log('Initializing MALU Digital Services...');

    // Setup event listeners
    setupNavigation();
    setupRegistration();
    setupModals();

    // Check if user is logged in
    const isLoggedIn = loadUserFromStorage();

    if (isLoggedIn) {
        // Refresh user data from server
        refreshUserData();
    }

    // Start on home view
    switchView('home');

    console.log('App initialized successfully!');
}

// Start app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Expose closeModal globally for inline onclick handlers
window.closeModal = closeModal;
window.switchView = switchView;
window.showToast = showToast;
